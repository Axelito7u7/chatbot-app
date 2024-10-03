const functions = require("firebase-functions");
const { WebhookClient, Payload } = require("dialogflow-fulfillment");
const admin = require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://chatbot-d9174.firebaseio.com",
});

const db = admin.firestore();

exports.chatbot = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });

    function MostrarCategorias(agent) {
        const categoriasRef = db.collection("Categorias");
        return categoriasRef.get().then((snapshot) => {
            if (snapshot.empty) {
                agent.add("No hay categorías disponibles.");
                return;
            }

            // Mensaje de introducción
            agent.add("Nuestras categorías:");

            const arrayCategorias = [];
            const categoriasList = [];

            snapshot.forEach((doc) => {
                const nombreCategoria = doc.data().Nombre;
                const urlCategoria = doc.data().Url; 

                arrayCategorias.push({
                    text: nombreCategoria,
                    link: urlCategoria 
                });

                // Crear la lista para el mensaje con enlaces
                categoriasList.push(`- [${nombreCategoria}](${urlCategoria})`);
            });

            // Enviar mensaje con todas las categorías y enlaces
            agent.add(`Puedes acceder a las categorías a continuación:\n${categoriasList.join("\n")}`);

            // Agregar los chips
            const payload = {
                richContent: [
                    [
                        {
                            type: "chips",
                            options: arrayCategorias.map(cat => ({
                                text: cat.text,
                                link: cat.link 
                            })),
                        },
                    ],
                ],
            };

            // Agregar el payload con los chips
            agent.add(new Payload(agent.UNSPECIFIED, payload, { rawPayload: true, sendAsMessage: true }));

        }).catch(() => {
            agent.add("Ocurrió un error. Puedes intentar seleccionando otra categoría.");
        });
    }

    function languageHandler(agent) {
        const language = agent.parameters.language;
        if (language) {
            agent.add(`Tu lenguaje es: ${language}`);
        } else {
            agent.add(`Ups, no se detectó el lenguaje.`);
        }
    }

    function consultarPedido(agent) {
        const idPedido = agent.parameters.TuNumeroDePedido; 
        if (idPedido) {
            const pedidosRef = db.collection("Pedido").where("NumeroPedido", "==", idPedido);
        
            return pedidosRef.get().then((querySnapshot) => {
                const pedidosArray = [];
                querySnapshot.forEach((doc) => {
                    pedidosArray.push({ IdPedido: doc.id, ...doc.data() });
                });

                if (pedidosArray.length > 0) {
                    // Mensaje con información del pedido
                    let pedidoMessage = `Hola ${pedidosArray[0].Nombres}, el estado de tu pedido es: ${pedidosArray[0].Estado}. Compraste estos productos:`;
                    const productosArray = pedidosArray[0].Productos.map(doc => ({
                        text: doc.Nombre,
                        link: doc.UrlProducto,
                        image: { src: { rawUrl: doc.ImagenesUrl[0] } }
                    }));

                    // Enviar el mensaje total
                    agent.add(pedidoMessage);
                    
                    const payload = {
                        richContent: [
                            [
                                {
                                    type: "chips",
                                    options: productosArray,
                                },
                            ],
                        ],
                    };

                    agent.add(new Payload(agent.UNSPECIFIED, payload, { rawPayload: true, sendAsMessage: true }));
                    agent.add(`En la fecha: ${pedidosArray[0].Fecha.toDate().toLocaleDateString()}`);
                    agent.add(`Espero haberte ayudado ${pedidosArray[0].Nombres}`);
                } else {
                    agent.add("No se encontró ningún pedido con ese número.");
                }
            }).catch((error) => {
                console.error("Error al consultar pedido: ", error);
                agent.add("Ocurrió un error al consultar tu pedido. Por favor, inténtalo de nuevo.");
            });
        } else {
            agent.add("Ingresa tu número de pedido correctamente.");
        }
    }

    // Mapeo de intenciones
    let intentMap = new Map();
    intentMap.set("MostrarCategorias", MostrarCategorias);
    intentMap.set("set-language", languageHandler);
    intentMap.set("ConsultarPedido", consultarPedido);

    agent.handleRequest(intentMap);
});

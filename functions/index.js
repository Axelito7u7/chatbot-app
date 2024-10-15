const functions = require("firebase-functions");
const { WebhookClient, Payload } = require("dialogflow-fulfillment");
const admin = require("firebase-admin");

// Inicializa Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://chatbot-d9174.firebaseio.com",
});

// Obtiene la referencia de la base de datos de Firestore
const db = admin.firestore();

// Función principal que maneja las peticiones de Dialogflow
exports.chatbot = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });

    // Función para mostrar las categorías desde Firestore
    function MostrarCategorias(agent) {
        const categoriasRef = db.collection("Categorias");
        return categoriasRef.get().then((snapshot) => {
            if (snapshot.empty) {
                agent.add("No hay categorías disponibles.");
                return;
            }

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

                categoriasList.push(`- [${nombreCategoria}](${urlCategoria})`);
            });

            agent.add(`Puedes acceder a las categorías a continuación:\n${categoriasList.join("\n")}`);

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

            agent.add(new Payload(agent.UNSPECIFIED, payload, { rawPayload: true, sendAsMessage: true }));
        }).catch(() => {
            agent.add("Ocurrió un error. Puedes intentar seleccionando otra categoría.");
        });
    }

    // Función para consultar el estado de un pedido
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
                    let pedidoMessage = `Hola ${pedidosArray[0].Nombres}, el estado de tu pedido es: ${pedidosArray[0].Estado}. Compraste estos productos:`;
                    const productosArray = pedidosArray[0].Productos.map(doc => ({
                        text: doc.Nombre,
                        link: doc.UrlProducto,
                        image: { src: { rawUrl: doc.ImagenesUrl[0] } }
                    }));

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

    // Función para solicitar la información del usuario y guardarla en Firestore
    async function requestUserInfo(agent) {
        const name = agent.parameters['given-name'];
        const email = agent.parameters.email;

        // Validar si ya tenemos la información necesaria
        if (!email) {
            agent.add("Por favor, proporciona tu correo electrónico para continuar.");
            return;
        }

        if (!isValidEmail(email)) {
            agent.add("Por favor, proporciona un correo electrónico válido.");
            return;
        }

        try {
            const snapshot = await db.collection("Cliente").where("email", "==", email).get();

            if (!snapshot.empty) {
                const userData = snapshot.docs[0].data();
                agent.add(`Hola ${userData.nombre}, Bienvenido otra vez`);
            } else {
                agent.add(`Gracias ya te registre ${userData.nombre}.`);
                agent.context.set({ name: "awaiting_user_info", lifespan: 2 });
            }

        } catch (error) {
            console.error("Error al guardar o verificar datos:", error);
            agent.add("Lo siento, hubo un error al procesar tu información.");
        }
    }

    // Función para manejar el Default Welcome Intent
    function welcome(agent) {
        agent.add("¡Hola! Bienvenido al servicio. Por favor, proporciona tu correo electrónico para continuar.");
    }

    let intentMap = new Map();
    intentMap.set("PedirNombreCorreo", requestUserInfo);
    intentMap.set("Default Welcome Intent", welcome);
    intentMap.set("MostrarCategorias", MostrarCategorias);
    intentMap.set("ConsultarPedido", consultarPedido);

    agent.handleRequest(intentMap);
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

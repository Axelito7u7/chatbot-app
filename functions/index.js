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

async function requestEmail(agent) {
    const email = agent.parameters.email;
    const fechaActual = new Date(); 

    // Validar si el correo es proporcionado
    if (!email) {
        agent.add("Por favor, proporciona tu correo electrónico para continuar.");
        return;
    }

    // Validar si el correo tiene un formato válido
    if (!isValidEmail(email)) {
        agent.add("Por favor, proporciona un correo electrónico válido.");
        return;
    }

    try {
        const snapshot = await db.collection("Cliente").where("email", "==", email).get();

        if (snapshot.empty) {
            agent.add("Correo no registrado, ¿me podrías decir tu nombre?");
        } else {

            await db.collection("Cliente").doc(snapshot.docs[0].id).update({
                ultima_interaccion: fechaActual
            });
            agent.setFollowupEvent('Saludar');

        }

    } catch (error) {
        console.error("Error al verificar el correo: ", error.message);
        agent.add("Lo siento, hubo un error al procesar tu información.");
    }
}


    // Intent para capturar el nombre 
    async function requestName(agent) {
        const name = agent.parameters['given-name']; // Recoge el nombre proporcionado
        const email = agent.parameters.email; // Recoge el correo directamente del parámetro
        const fechaActual = new Date();

        // Verifica si guarda
        if (!name || name.trim() === "") {
            agent.add("No he entendido tu nombre, ¿puedes repetirlo?");
            return;
        }

        // Registrar nuevo usuario en Firestore
        const newUser = {
            nombre: name,
            email: email,
            motivo: "Pedido", 
            fecha: fechaActual,
            ultima_interaccion: fechaActual
        };

        try {
            await db.collection("Cliente").add(newUser);

            agent.add(`Gracias ${newUser.nombre}, te hemos registrado con éxito.`);
            // Dispara el evento 'Saludar'
            agent.setFollowupEvent('Saludar');
            console.log("Evento Saludar disparado después de registrar el nuevo usuario.");

        } catch (error) {
            console.error("Error al registrar usuario: ", error.message);
            agent.add("Lo siento, hubo un error al registrar tu información.");
        }
    }

    function welcome(agent) {
        agent.add("¡Hola! Bienvenido al servicio. Por favor, proporciona tu correo electrónico para continuar.");
    }

    let intentMap = new Map();
    intentMap.set("PedirCorreo", requestEmail);  
    intentMap.set("PedirNombre", requestName);  
    intentMap.set("Default Welcome Intent", welcome);
    intentMap.set("MostrarCategorias", MostrarCategorias);
    intentMap.set("ConsultarPedido", consultarPedido);

    agent.handleRequest(intentMap);
});

// Función para validar un correo electrónico
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

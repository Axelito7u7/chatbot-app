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
exports.chatbot = functions.https.onRequest(async (request, response) => {
    const agent = new WebhookClient({ request, response });

    // Función para mostrar las categorías desde Firestore
    async function MostrarCategorias(agent) {
        const categoriasRef = db.collection("Categorias");
        const snapshot = await categoriasRef.get();

        if (snapshot.empty) {
            agent.add("No hay categorías disponibles.");
            return;
        }

        const categoriasList = [];
        const arrayCategorias = [];

        snapshot.forEach(doc => {
            const { Nombre, Url } = doc.data();
            arrayCategorias.push({ text: Nombre, link: Url });
            categoriasList.push(`- [${Nombre}](${Url})`);
        });

        agent.add(`Puedes acceder a las categorías a continuación:\n${categoriasList.join("\n")}`);

        const payload = {
            richContent: [[{
                type: "chips",
                options: arrayCategorias.map(cat => ({
                    text: cat.text,
                    link: cat.link
                })),
            }]],
        };

        agent.add(new Payload(agent.UNSPECIFIED, payload, { rawPayload: true, sendAsMessage: true }));
    }

    // Función para consultar el estado de un pedido
    async function consultarPedido(agent) {
        const idPedido = agent.parameters.TuNumeroDePedido; 
        if (!idPedido) {
            agent.add("Ingresa tu número de pedido correctamente.");
            return;
        }

        const pedidosRef = db.collection("Pedido").where("NumeroPedido", "==", idPedido);
        const querySnapshot = await pedidosRef.get();
        const pedidosArray = querySnapshot.docs.map(doc => ({ IdPedido: doc.id, ...doc.data() }));

        if (pedidosArray.length > 0) {
            const { Nombres, Estado, Productos, Fecha } = pedidosArray[0];
            let pedidoMessage = `Hola ${Nombres}, el estado de tu pedido es: ${Estado}. Compraste estos productos:`;
            const productosArray = Productos.map(doc => ({
                text: doc.Nombre,
                link: doc.UrlProducto,
                image: { src: { rawUrl: doc.ImagenesUrl[0] } }
            }));

            agent.add(pedidoMessage);
            const payload = { richContent: [[{ type: "chips", options: productosArray }]] };
            agent.add(new Payload(agent.UNSPECIFIED, payload, { rawPayload: true, sendAsMessage: true }));
            agent.add(`En la fecha: ${Fecha.toDate().toLocaleDateString()}`);
            agent.add(`Espero haberte ayudado ${Nombres}`);
        } else {
            agent.add("No se encontró ningún pedido con ese número.");
        }
    }

    function requestEmail(agent) {
        const email = agent.parameters.email; // Accede al parámetro email
        console.log("Email recibido:", email); // Verifica si el email es correcto
    
        if (!email) {
            agent.add("Lo siento, parece que no recibí tu correo electrónico.");
            return;
        }
    
        // Aquí puedes buscar al usuario en Firestore
        return admin.firestore().collection('Cliente').where('email', '==', email).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    agent.add("Correo no registrado, ¿me podrías decir tu nombre?");
                    // Establecer contexto con el email
                    agent.context.set({
                        name: 'esperar_nombre',
                        lifespan: 5, // Número de interacciones permitidas antes de que el contexto expire
                        parameters: { email: email } // Pasar el email al contexto
                    });
                } else {
                    // Procesa el usuario encontrado
                    const user = snapshot.docs[0].data();
                    agent.add(`Hola ${user.nombre}, bienvenido de nuevo.`);
                }
            })
            .catch(error => {
                console.error("Error al buscar usuario:", error);
                agent.add("Hubo un error al procesar tu solicitud.");
            });
    }
    
    async function requestName(agent) {
        const name = agent.parameters['given-name'];
        const email = agent.context.get('esperar_nombre') ? agent.context.get('esperar_nombre').parameters.email : null;
        const fechaActual = admin.firestore.Timestamp.now();
    
        if (!name || name.trim() === "") {
            agent.add("No he entendido tu nombre, ¿puedes repetirlo?");
            return;
        }
    
        const newUser = { nombre: name, email: email, motivo: "Pedido", fecha: fechaActual, ultima_interaccion: fechaActual };
    
        try {
            console.log("Buscando usuario con email:", email);
            const snapshot = await db.collection("Cliente").where("email", "==", email).get();
            console.log("Snapshot de búsqueda:", snapshot.empty);
    
            if (snapshot.empty) {
                console.log("Registrando nuevo usuario:", newUser);
                await db.collection("Cliente").add(newUser);
                agent.add(`Gracias ${newUser.nombre}, te hemos registrado con éxito.`);
            } else {
                await db.collection("Cliente").doc(snapshot.docs[0].id).update({
                    ultima_interaccion: fechaActual
                });
                agent.add("Hola, bienvenido de nuevo.");
            }
            agent.setFollowupEvent({ name: 'Saludar', parameters: {} });
        } catch (error) {
            console.error("Error al registrar usuario: ", error);
            agent.add("Lo siento, hubo un error al registrar tu información.");
        }
    }    

    let intentMap = new Map();
    intentMap.set("PedirCorreo", requestEmail);  
    intentMap.set("PedirNombre", requestName);  
    intentMap.set("MostrarCategorias", MostrarCategorias);
    intentMap.set("ConsultarPedido", consultarPedido);

    agent.handleRequest(intentMap);
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

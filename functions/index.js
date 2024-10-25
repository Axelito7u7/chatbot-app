const functions = require("firebase-functions");
const { WebhookClient } = require("dialogflow-fulfillment");
const admin = require("firebase-admin");

// Inicializa Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://chatbot-d9174.firebaseio.com",
});

// Obtiene la referencia de la base de datos de Firestore
const db = admin.firestore();

// Función para guardar la interacción del usuario
async function saveInteraction(userEmail, userMessage) {
    const fechaActual = admin.firestore.Timestamp.now();
    
    // Guarda la interacción en la colección "interacciones"
    await db.collection('interacciones').add({
        email: userEmail,
        userMessage: userMessage,
        timestamp: fechaActual,
    });
}

// Función principal que maneja las peticiones de Dialogflow
exports.chatbot = functions.https.onRequest(async (request, response) => {
    const agent = new WebhookClient({ request, response });

    // Función para manejar el saludo
    async function handleGreeting(agent) {
        const email = agent.originalDetectIntentRequest.payload.data.sender.id; // Cambia esto según cómo obtengas el email del usuario
        const userMessage = agent.query; // Captura el mensaje del usuario
    
        try {
            // Busca al usuario en Firestore por su email
            const snapshot = await db.collection("Cliente").where("email", "==", email).get();
    
            if (!snapshot.empty) {
                // Si el usuario existe, actualiza el motivo con el mensaje del usuario
                const userDoc = snapshot.docs[0]; // Obtiene el documento del usuario
                await userDoc.ref.update({
                    motivo: userMessage, // Actualiza el motivo con el mensaje del usuario
                    ultima_interaccion: admin.firestore.Timestamp.now() // Actualiza la fecha de la última interacción
                });
                agent.add(`Tu motivo ha sido actualizado a '${userMessage}'.`);
            } else {
                // Si el usuario no existe, puedes manejarlo aquí (opcional)
                console.log("Usuario no encontrado.");
                agent.add("No te he encontrado en nuestra base de datos. Por favor, proporciona tu correo para registrarte.");
            }
        } catch (error) {
            console.error("Error al guardar la interacción:", error);
            agent.add("Hubo un error al guardar tu interacción.");
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
                        lifespan: 5,
                        parameters: { email: email } // Pasar el email al contexto
                    });
                } else {
                    // Procesa el usuario encontrado
                    const userDoc = snapshot.docs[0]; // Obtiene el documento
                    const user = userDoc.data();
                    agent.add(`Hola ${user.nombre}, bienvenido de nuevo.`);
                    const fechaActual = admin.firestore.Timestamp.now();
                    return userDoc.ref.update({
                        ultima_interaccion: fechaActual
                    });
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
    
        const newUser = { nombre: name, email: email, motivo: "Sin interaccion", fecha: fechaActual, ultima_interaccion: fechaActual };
    
        try {
            const snapshot = await db.collection("Cliente").where("email", "==", email).get();
            if (snapshot.empty) {
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
    intentMap.set("Saludar", handleGreeting);
    intentMap.set("PedirCorreo", requestEmail);  
    intentMap.set("PedirNombre", requestName);  

    agent.handleRequest(intentMap);
});


// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


/* async function MostrarCategorias(agent) {
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
} */
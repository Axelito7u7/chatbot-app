const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { WebhookClient } = require('dialogflow-fulfillment');

admin.initializeApp();
const db = admin.firestore();

exports.chatbot = functions.https.onRequest(async (request, response) => {
    const agent = new WebhookClient({ request, response });

    // Función para pedir y verificar el correo electrónico
    async function requestEmail(agent) {
        const email = agent.parameters.email; // Accede al parámetro de email
        if (!email) {
            agent.add("Lo siento, parece que no recibí tu correo electrónico.");
            return;
        }

        // Busca el correo en la colección 'Cliente'
        try {
            const snapshot = await db.collection('Cliente').where('email', '==', email).get();
            if (snapshot.empty) {
                agent.add("Correo no registrado, ¿me podrías decir tu nombre?");
                // Guarda el email en el contexto para uso posterior
                agent.context.set({
                    name: 'esperar_nombre',
                    lifespan: 5,
                    parameters: { email: email }
                });
            } else {
                const userDoc = snapshot.docs[0];
                const user = userDoc.data();
                agent.add(`Hola ${user.nombre}, bienvenido de nuevo.`);
                
                // Actualiza la última interacción del usuario
                await userDoc.ref.update({
                    ultima_interaccion: admin.firestore.Timestamp.now()
                });
            }
        } catch (error) {
            console.error("Error al buscar usuario:", error);
            agent.add("Hubo un error al procesar tu solicitud.");
        }
    }

    // Función para pedir el nombre y registrar el usuario si es nuevo
    async function requestName(agent) {
        const name = agent.parameters['given-name'];
        const email = agent.context.get('esperar_nombre') ? agent.context.get('esperar_nombre').parameters.email : null;
        
        if (!name) {
            agent.add("No he entendido tu nombre, ¿puedes repetirlo?");
            return;
        }

        const newUser = {
            nombre: name,
            email: email,
            motivo: "Sin interaccion",
            fecha: admin.firestore.Timestamp.now(),
            ultima_interaccion: admin.firestore.Timestamp.now()
        };

        try {
            const snapshot = await db.collection("Cliente").where("email", "==", email).get();
            if (snapshot.empty) {
                await db.collection("Cliente").add(newUser);
                agent.add(`Gracias ${newUser.nombre}, te hemos registrado con éxito.`);
            } else {
                const userDoc = snapshot.docs[0];
                await userDoc.ref.update({
                    ultima_interaccion: newUser.ultima_interaccion
                });
                agent.add("Hola, bienvenido de nuevo.");
            }
        } catch (error) {
            console.error("Error al registrar usuario: ", error);
            agent.add("Lo siento, hubo un error al registrar tu información.");
        }
    }

    // Función para Default Fallback Intent
    async function fallback(agent) {
        const emailContext = agent.context.get('esperar_nombre');
        const email = emailContext ? emailContext.parameters.email : null;
        const mensaje = agent.query; // Captura el mensaje de fallback

        if (!email) {
            agent.add("No he podido identificarte. ¿Podrías proporcionarme tu correo?");
            return;
        }

        try {
            const snapshot = await db.collection("Cliente").where("email", "==", email).get();
            if (!snapshot.empty) {
                const userDoc = snapshot.docs[0];
                // Guarda el mensaje en el registro del usuario
                await db.collection("Cliente").doc(userDoc.id).update({
                    ultima_interaccion: admin.firestore.Timestamp.now(),
                    ultimo_mensaje: mensaje
                });
                agent.add("He registrado tu mensaje para poder ayudarte en el futuro.");
            } else {
                agent.add("Aún no tengo tu registro completo. ¿Puedes confirmarme tu nombre?");
            }
        } catch (error) {
            console.error("Error en Fallback Intent:", error);
            agent.add("Lo siento, hubo un error al procesar tu solicitud.");
        }
    }

    let intentMap = new Map();
    intentMap.set("PedirCorreo", requestEmail);  
    intentMap.set("PedirNombre", requestName);  
    intentMap.set("Default Fallback Intent", fallback);

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
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { WebhookClient } = require('dialogflow-fulfillment');

admin.initializeApp();
const db = admin.firestore();

exports.chatbot = functions.https.onRequest(async (request, response) => {
    const agent = new WebhookClient({ request, response });
    //codigo para poder reconocer reconocer los mensajes de los intent
    async function guardarMotivo(email, motivo) {
        try {
            const snapshot = await db.collection("Cliente").where("email", "==", email).get();
            if (!snapshot.empty) {
                const userDoc = snapshot.docs[0];
                await db.collection("Cliente").doc(userDoc.id).update({
                    motivo: motivo // Solo guarda el motivo
                });
                console.log("Motivo guardado en el campo 'motivo'");
            } else {
                console.log("Usuario no encontrado para guardar el motivo.");
            }
        } catch (error) {
            console.error("Error al guardar motivo en Firestore:", error);
        }
    }

    async function fallback(agent) {
        const emailContext = agent.context.get('email_registrado'); // Contexto que indica que ya tenemos el correo
        const email = emailContext ? emailContext.parameters.email : null;
        const mensaje = agent.query; // Captura el mensaje de fallback
    
        if (!email) {
            // Si aún no tenemos el correo, pedimos que el usuario lo proporcione
            agent.add("Para guardar mejor tu pregunta puedes proporcionar un correo");
            
            // Guardamos el contexto para recordar la solicitud de correo
            agent.context.set({
                name: 'esperar_nombre',
                lifespan: 5
            });
            return;
        }
    
        try {
            const snapshot = await db.collection("Cliente").where("email", "==", email).get();
            if (!snapshot.empty) {
                const userDoc = snapshot.docs[0];
                // Guarda el mensaje en los campos 'motivo' y 'no_pudimos_contestar'
                await db.collection("Cliente").doc(userDoc.id).update({
                    ultima_interaccion: admin.firestore.Timestamp.now(),
                    motivo: mensaje, // Guarda el motivo en Firestore
                    no_pudimos_contestar: mensaje // Guarda el mensaje también en 'no_pudimos_contestar'
                });
                agent.add("No puedo ayudarte con eso alguna otra cosa.");
            } else {
                agent.add("Aún no tengo tu registro completo. ¿Puedes confirmarme tu nombre?");
            }
        } catch (error) {
            console.error("Error en Fallback Intent:", error);
            agent.add("Lo siento, hubo un error al procesar tu solicitud.");
        }
    }
    
    
    function requestEmail(agent) {
        const email = agent.parameters.email;
        console.log("Email recibido:", email);
    
        if (!email) {
            agent.add("Lo siento, parece que no recibí tu correo electrónico.");
            return;
        }
    
        return admin.firestore().collection('Cliente').where('email', '==', email).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    agent.add("Correo no registrado, ¿me podrías decir tu nombre?");
                    agent.context.set({
                        name: 'esperar_nombre',
                        lifespan: 5,
                        parameters: { email: email }
                    });
                } else {
                    const userDoc = snapshot.docs[0];
                    const user = userDoc.data();
                    agent.add(`Hola ${user.nombre}, bienvenido de nuevo.`);
                    
                    agent.context.set({  // Nuevo contexto indicando que ya tenemos el correo
                        name: 'email_registrado',
                        lifespan: 5,
                        parameters: { email: email }
                    });
    
                    return userDoc.ref.update({
                        ultima_interaccion: admin.firestore.Timestamp.now()
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
    //functions normales
    async function Helpregistro(agent) {
        const emailContext = agent.context.get('email_registrado');
        const email = emailContext ? emailContext.parameters.email : null;
        const motivo = "registro"; 
    
        if (!email) {
            agent.context.set({
                name: 'esperar_nombre',
                lifespan: 5
            });
            return;
        }
        await guardarMotivo(email, motivo);
    }
    async function NuestrasVentajas(agent){
        const emailContext = agent.context.get('email_registrado');
        const email = emailContext ? emailContext.parameters.email : null;
        const motivo = "Ventajas"; 
    
        if (!email) {
            agent.context.set({
                name: 'esperar_nombre',
                lifespan: 5
            });
            return;
        }
        await guardarMotivo(email, motivo);
    }
    async function OfertaEducativa(agent){
        const emailContext = agent.context.get('email_registrado');
        const email = emailContext ? emailContext.parameters.email : null;
        const motivo = "Oferta educativa"; 
    
        if (!email) {
            agent.context.set({
                name: 'esperar_nombre',
                lifespan: 5
            });
            return;
        }
        await guardarMotivo(email, motivo);
    }
    async function SobreNosotros(agent){
        const emailContext = agent.context.get('email_registrado');
        const email = emailContext ? emailContext.parameters.email : null;
        const motivo = "Sobre nosotros"; 
    
        if (!email) {
            agent.context.set({
                name: 'esperar_nombre',
                lifespan: 5
            });
            return;
        }
        await guardarMotivo(email, motivo);
    }
    
    let intentMap = new Map();
    intentMap.set("PedirCorreo", requestEmail);  
    intentMap.set("PedirNombre", requestName);  
    intentMap.set("Default Fallback Intent", fallback);
    //intents normales
    intentMap.set("Helpregistro", Helpregistro);
    intentMap.set("NuestrasVentajas", NuestrasVentajas);
    intentMap.set("OfertaEducativa", OfertaEducativa);
    intentMap.set("SobreNosotros", SobreNosotros);

    agent.handleRequest(intentMap);
});

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
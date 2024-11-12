const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { WebhookClient } = require('dialogflow-fulfillment');
const nodemailer = require('nodemailer'); // Importa Nodemailer
const cors = require('cors')({ origin: true }); // Permitir solicitudes desde cualquier origen

admin.initializeApp();
const db = admin.firestore();

// Configura Nodemailer con el servicio de Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'denedigalan@gmail.com', // Tu correo electrónico
    pass: 'aorw zyal ocfr zwis', // Usa una contraseña de aplicación
  },
});

// Función de Firebase para enviar correos electrónicos
exports.sendEmail = functions.https.onRequest((req, res) => {
  // Activar CORS antes de procesar la solicitud
  cors(req, res, async () => {
    if (req.method === 'POST') {
      const { to, subject, body } = req.body;

      // Validar que los datos requeridos estén presentes
      if (!to || !subject || !body) {
        return res.status(400).json({ message: 'Faltan datos requeridos (to, subject, body)' });
      }

      try {
        // Configura los detalles del correo usando Nodemailer
        const mailOptions = {
          from: 'denedigalan@gmail.com', // Dirección de correo del remitente
          to: to, // Dirección de correo del destinatario
          subject: subject, // Asunto del correo
          html: `<p>${body}</p>`, // Cuerpo del correo en formato HTML
        };

        // Enviar el correo
        const emailResponse = await transporter.sendMail(mailOptions);

        // Responder con éxito
        res.status(200).json({ message: 'Correo enviado correctamente', emailResponse });
      } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({ message: 'Error al enviar el correo', error: error.message });
      }
    } else {
      // Si el método no es POST, devolver un error 405
      res.status(405).json({ message: 'Método no permitido' });
    }
  });
});


exports.chatbot = functions.https.onRequest(async (request, response) => {
    const agent = new WebhookClient({ request, response });

    // Obtiene el email del contexto o regresa `null` si no está disponible
    function getEmailFromContext(agent) {
        const emailContext = agent.context.get('email_registrado');
        return emailContext ? emailContext.parameters.email : null;
    }

    // Guarda el motivo en Firestore para un usuario específico
    async function guardarMotivo(email, motivo) {
        try {
            const snapshot = await db.collection("Cliente").where("email", "==", email).get();
            if (!snapshot.empty) {
                const userDoc = snapshot.docs[0];
                await userDoc.ref.update({ motivo });
                console.log(`Motivo '${motivo}' guardado para el usuario con email ${email}`);
            } else {
                console.log("Usuario no encontrado para guardar el motivo.");
            }
        } catch (error) {
            console.error("Error al guardar motivo en Firestore:", error);
        }
    }

    // Maneja el caso donde el chatbot no tiene una respuesta
    async function fallback(agent) {
        const email = getEmailFromContext(agent);
        const mensaje = agent.query;

        if (!email) {
            agent.add("Para guardar mejor tu pregunta, puedes proporcionar un correo.");
            agent.context.set({ name: 'esperar_nombre', lifespan: 5 });
            return;
        }

        try {
            const snapshot = await db.collection("Cliente").where("email", "==", email).get();
            if (!snapshot.empty) { 
                const userDoc = snapshot.docs[0];
                await userDoc.ref.update({
                    ultima_interaccion: admin.firestore.Timestamp.now(),
                    motivo: mensaje,
                    no_pudimos_contestar: mensaje
                });
                agent.add("No puedo ayudarte con eso, ¿te gustaría preguntar algo más? escribe help");
            } else {
                agent.add("Aún no tengo tu registro completo. ¿Puedes confirmarme tu nombre?");
            }
        } catch (error) {
            console.error("Error en Fallback Intent:", error);
            agent.add("Lo siento, hubo un error al procesar tu solicitud.");
        }
    }
    
    async function requestEmail(agent) {
        const email = agent.parameters.email;
        
        if (!email) {
            agent.add("Lo siento, parece que no recibí tu correo electrónico.");
            return;
        }

        try {
            const snapshot = await db.collection('Cliente').where('email', '==', email).get();
            if (snapshot.empty) {
                agent.add("¿Me puedes proporcionar tu nombre?");
                agent.context.set({
                    name: 'esperar_nombre',
                    lifespan: 5,
                    parameters: { email }
                });
            } else {
                const userDoc = snapshot.docs[0];
                const user = userDoc.data();
                agent.add(`Hola ${user.nombre}, bienvenido de nuevo.`);
                
                agent.context.set({ 
                    name: 'email_registrado',
                    lifespan: 5,
                    parameters: { email }
                });

                await userDoc.ref.update({
                    ultima_interaccion: admin.firestore.Timestamp.now()
                });
                agent.setFollowupEvent('Saludar');
            }
        } catch (error) {
            console.error("Error al buscar usuario:", error);
            agent.add("Hubo un error al buscar tu correo electrónico.");
        }
    }
    //funcion para guardar nombre en caso de no estar registrado
    async function requestName(agent) {
        const name = agent.parameters['given-name'];
        const email = agent.context.get('esperar_nombre') ? agent.context.get('esperar_nombre').parameters.email : null;
        
        if (!name) {
            agent.add("No he entendido tu nombre, ¿puedes repetirlo?");
            return;
        }

        const newUser = {
            nombre: name,
            email,
            motivo: "Sin interacción",
            fecha: admin.firestore.Timestamp.now(),
            ultima_interaccion: admin.firestore.Timestamp.now()
        };

        try {
            const snapshot = await db.collection("Cliente").where("email", "==", email).get();
            if (snapshot.empty) {
                await db.collection("Cliente").add(newUser);
                agent.add(`Gracias ${newUser.nombre}, te hemos registrado con éxito.`);
                agent.setFollowupEvent('Saludar');
            }
        } catch (error) {
            console.error("Error al registrar usuario: ", error);
            agent.add("Lo siento, hubo un error al registrar tu información.");
        }
    }

    // funcion para que podamos guardar el motivo de los itents
    async function registrarMotivo(agent, motivo) {
        const email = getEmailFromContext(agent);
        if (!email) {
            agent.context.set({ name: 'esperar_nombre', lifespan: 5 });
            return;
        }
        await guardarMotivo(email, motivo);
    }

    // itents importnates
    let intentMap = new Map();
    intentMap.set("PedirCorreo", requestEmail);
    intentMap.set("PedirNombre", requestName);
    intentMap.set("Default Fallback Intent", fallback);
    //intents para guardar el motivo
    intentMap.set("Helpregistro", (agent) => registrarMotivo(agent, "Como se Subcribe"));
    intentMap.set("NuestrasVentajas", (agent) => registrarMotivo(agent, "Ventajas"));
    intentMap.set("OfertaEducativa", (agent) => registrarMotivo(agent, "Oferta educativa"));
    intentMap.set("SobreNosotros", (agent) => registrarMotivo(agent, "Sobre nosotros"));
    intentMap.set("acerca_mision", (agent) => registrarMotivo(agent, "Sobre nuestra mision"));
    intentMap.set("acerca_valores", (agent) => registrarMotivo(agent, "Sobre nuestros valores"));
    intentMap.set("acerca_vision", (agent) => registrarMotivo(agent, "Sobre nuestra vision"));
    intentMap.set("CursosDisponibles", (agent) => registrarMotivo(agent, "Informacion sobre los cursos"));
    intentMap.set("RedesSociales", (agent) => registrarMotivo(agent, "Informacion sobre nuestras redes"));

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
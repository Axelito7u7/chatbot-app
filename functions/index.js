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
          html: `<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

<head>
	<title></title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!-->
	<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet" type="text/css"><!--<![endif]-->
	<style>
		* {
			box-sizing: border-box;
		}

		body {
			margin: 0;
			padding: 0;
		}

		a[x-apple-data-detectors] {
			color: inherit !important;
			text-decoration: inherit !important;
		}

		#MessageViewBody a {
			color: inherit;
			text-decoration: none;
		}

		p {
			line-height: inherit
		}

		.desktop_hide,
		.desktop_hide table {
			mso-hide: all;
			display: none;
			max-height: 0px;
			overflow: hidden;
		}

		.image_block img+div {
			display: none;
		}

		sup,
		sub {
			font-size: 75%;
			line-height: 0;
		}

		@media (max-width:720px) {

			.desktop_hide table.icons-inner,
			.social_block.desktop_hide .social-table {
				display: inline-block !important;
			}

			.icons-inner {
				text-align: center;
			}

			.icons-inner td {
				margin: 0 auto;
			}

			.mobile_hide {
				display: none;
			}

			.row-content {
				width: 100% !important;
			}

			.stack .column {
				width: 100%;
				display: block;
			}

			.mobile_hide {
				min-height: 0;
				max-height: 0;
				max-width: 0;
				overflow: hidden;
				font-size: 0px;
			}

			.desktop_hide,
			.desktop_hide table {
				display: table !important;
				max-height: none !important;
			}
		}
	</style><!--[if mso ]><style>sup, sub { font-size: 100% !important; } sup { mso-text-raise:10% } sub { mso-text-raise:-10% }</style> <![endif]-->
</head>

<body class="body" style="margin: 0; background-color: #ffffff; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
	<table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
		<tbody>
			<tr>
				<td>
					<table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #7787b5;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 700px; margin: 0 auto;" width="700">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<div class="spacer_block block-1" style="height:10px;line-height:10px;font-size:1px;">&#8202;</div>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 700px; margin: 0 auto;" width="700">
										<tbody>
											<tr>
												<td class="column column-1" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="heading_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<h1 style="margin: 0; color: #000000; direction: ltr; font-family: Roboto, Tahoma, Verdana, Segoe, sans-serif; font-size: 20px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 24px;"><span class="tinyMce-placeholder" style="word-break: break-word;">MAESTRÍA EN NEGOCIOS DIGITALES</span></h1>
															</td>
														</tr>
													</table>
												</td>
												<td class="column column-2" width="66.66666666666667%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<div class="spacer_block block-1 mobile_hide" style="height:20px;line-height:20px;font-size:1px;">&#8202;</div>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #2a7ac7; background-image: url(''); background-repeat: no-repeat;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 700px; margin: 0 auto;" width="700">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="paragraph_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad">
																<div style="color:#ffffff;font-family:Roboto, Tahoma, Verdana, Segoe, sans-serif;font-size:41px;line-height:120%;text-align:center;mso-line-height-alt:49.199999999999996px;">
																	<p style="margin: 0; word-break: break-word;"><span style="word-break: break-word;"><strong>Respuesta a su cunsulta</strong></span></p>
																</div>
															</td>
														</tr>
													</table>
													<table class="image_block block-2" width="100%" border="0" cellpadding="3" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<div class="alignment" align="center" style="line-height:10px">
																	<div style="max-width: 694px;"><img src="https://www.uhipocrates.edu.mx/wp-content/uploads/2022/08/Beneficios-de-tomar-cursos-en-linea-1.jpg" style="display: block; height: auto; border: 0; width: 100%;" width="694" alt="Image" title="Image" height="auto"></div>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 700px; margin: 0 auto;" width="700">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 55px; padding-top: 30px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-bottom:10px;padding-left:30px;padding-right:30px;padding-top:20px;">
																<div style="color:#555555;font-family:Roboto, Tahoma, Verdana, Segoe, sans-serif;font-size:18px;line-height:180%;text-align:left;mso-line-height-alt:32.4px;">
																	<p style="margin: 0; word-break: break-word;"><span style="word-break: break-word;"><strong>Hola ${subject},</strong></span></p>
																</div>
															</td>
														</tr>
													</table>
													<table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-bottom:10px;padding-left:30px;padding-right:30px;padding-top:20px;">
																<div style="color:#555555;font-family:Roboto, Tahoma, Verdana, Segoe, sans-serif;font-size:18px;line-height:180%;text-align:left;mso-line-height-alt:32.4px;">
																	<p style="margin: 0; word-break: break-word;"><span style="word-break: break-word;">${body}</span></p>
																</div>
															</td>
														</tr>
													</table>
													<table class="paragraph_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-bottom:10px;padding-left:30px;padding-right:30px;padding-top:20px;">
																<div style="color:#555555;font-family:Tahoma, Verdana, Segoe, sans-serif;font-size:17px;line-height:120%;text-align:left;mso-line-height-alt:20.4px;">
																	<p style="margin: 0;"><strong>Este correo esta automatizado porfavor de no responderlo&nbsp;</strong></p>
																</div>
															</td>
														</tr>
													</table>
													<table class="button_block block-4" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<div class="alignment" align="center"><a href="https://chatbot-app-mu.vercel.app/" target="_blank" style="color:#ffffff;"><!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"  href="https://chatbot-app-mu.vercel.app/"  style="height:58px;width:243px;v-text-anchor:middle;" arcsize="61%" fillcolor="#2a7ac7">
<v:stroke dashstyle="Solid" weight="0px" color="#2a7ac7"/>
<w:anchorlock/>
<v:textbox inset="0px,0px,0px,0px">
<center dir="false" style="color:#ffffff;font-family:sans-serif;font-size:24px">
<![endif]-->
																		<div style="background-color:#2a7ac7;border-bottom:0px solid transparent;border-left:0px solid transparent;border-radius:35px;border-right:0px solid transparent;border-top:0px solid transparent;color:#ffffff;display:inline-block;font-family:Roboto, Tahoma, Verdana, Segoe, sans-serif;font-size:24px;font-weight:undefined;mso-border-alt:none;padding-bottom:5px;padding-top:5px;text-align:center;text-decoration:none;width:auto;word-break:keep-all;"><span style="word-break: break-word; padding-left: 40px; padding-right: 40px; font-size: 24px; display: inline-block; letter-spacing: normal;"><span style="word-break: break-word;"><span style="word-break: break-word; line-height: 48px;" data-mce-style><strong>Nuestra pagina</strong></span></span></span></div><!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
																	</a></div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-6" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #2a7ac7;">
						<tbody>
							<tr>
								<td>
									<table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 700px; margin: 0 auto;" width="700">
										<tbody>
											<tr>
												<td class="column column-1" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="image_block block-1" width="100%" border="0" cellpadding="15" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<div class="alignment" align="left" style="line-height:10px">
																	<div style="max-width: 46.667px;"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/1016/Logo_white.png" style="display: block; height: auto; border: 0; width: 100%;" width="46.667" alt="Image" title="Image" height="auto"></div>
																</div>
															</td>
														</tr>
													</table>
												</td>
												<td class="column column-2" width="66.66666666666667%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="paragraph_block block-1" width="100%" border="0" cellpadding="20" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad">
																<div style="color:#ffffff;font-family:Roboto, Tahoma, Verdana, Segoe, sans-serif;font-size:16px;line-height:150%;text-align:right;mso-line-height-alt:24px;">
																	<p style="margin: 0; word-break: break-word;"><span style="word-break: break-word;">MAESTRIAS EN NEGOCIOS DIGITALES</span></p>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
</body>

</html>`, // Cuerpo del correo en formato HTML
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
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
        return categoriasRef
            .get()
            .then((snapshot) => {
                if (snapshot.empty) {
                    agent.add("No hay categorías disponibles.");
                    return;
                }

                agent.add("Nuestras categorías:");

                const arrayCategorias = [];
                snapshot.forEach((doc) => {
                    const nombreCategoria = doc.data().Nombre;
                    const urlCategoria = doc.data().Url; 

                    arrayCategorias.push({
                        text: nombreCategoria,
                        link: urlCategoria 
                    });
                });
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
            })
            .catch(() => {
                agent.add("Ocurrió un error. Puedes intentar seleccionando otra categoría.");
            });
    }

    function languageHandler(agent) {
        const language = agent.parameters.language;
        if (language) {
          agent.add(`Tu lenguaje es:  ${language}`);
        } else {
          agent.add(`Ups mirada`);
        }
    }

    function consultarPedido(agent) {
        console.log("Parámetros recibidos: ", agent.parameters);
        const idPedido = agent.parameters.TuNumeroDePedido; 
        if (idPedido) {
            console.log("ID Pedido recibido: ", idPedido); 
            const pedidosRef = db.collection("Pedido").where("NumeroPedido", "==", idPedido);
        
            return pedidosRef.get().then((querySnapshot) => {
                const pedidosArray = [];
                querySnapshot.forEach((doc) => {
                    pedidosArray.push({ IdPedido: doc.id, ...doc.data() });
                });
    
                if (pedidosArray.length > 0) {
                    agent.add(`Hola ${pedidosArray[0].Nombres}`);
                    agent.add(`El estado de tu pedido es: ${pedidosArray[0].Estado}`);
                    agent.add(`Compraste estos productos:`);
    
                    const productosArray = pedidosArray[0].Productos.map(doc => ({
                        text: doc.Nombre,
                        link: doc.UrlProducto,
                        image: { src: { rawUrl: doc.ImagenesUrl[0] } }
                    }));
    
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
    
    
    
    
    let intentMap = new Map();
    intentMap.set("MostrarCategorias", MostrarCategorias);
    intentMap.set("set-language", languageHandler);
    intentMap.set("ConsultarPedido", consultarPedido);

    agent.handleRequest(intentMap);
});

//si pedido esta dentro de la colletion Cliente 
/* function consultarPedido(agent) {
    const idPedido = agent.parameters.TipoNumeroPedido;
    if (idPedido) {
      const pedidosRef = db
        .collectionGroup("Pedidos")
        .where("NumeroPedido", "==", idPedido);
      return pedidosRef
        .get()
        .then((querySnapshot) => {
          const pedidosArray = [];
          querySnapshot.forEach((doc) => {
            pedidosArray.push({ IdPedido: doc.id, ...doc.data() });
          });
          agent.add(`Hola: ${pedidosArray[0].Nombres}`);
          agent.add(`El estado de tu pedido es: ${pedidosArray[0].Estado}`);
          agent.add(`Compraste estos productos:`);

          const productosArray = pedidosArray[0].Productos.map((doc) => {
            return {
              text: doc.Nombre,
              link: doc.UrlProducto,
              image: {
                src: {
                  rawUrl: doc.ImagenesUrl[0],
                },
              },
            };
          });

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
          agent.add(
            new Payload(agent.UNSPECIFIED, payload, {
              rawPayload: true,
              sendAsMessage: true,
            })
          );
          agent.add(
            `En la fecha: ${pedidosArray[0].Fecha.toDate().toLocaleDateString()}`
          );
          agent.add(`Espero haberte ayudado: ${pedidosArray[0].Nombres}`);
        })
        .catch(() => {
          agent.add(`No existe pedido o escribe bien tu número de pedido`);
        });
    } else {
      agent.add(`Ingresa tu número de pedido correctamente`);
    }
  } */
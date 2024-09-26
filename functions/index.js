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

    let intentMap = new Map();
    intentMap.set("MostrarCategorias", MostrarCategorias);
    intentMap.set("set-language", languageHandler);

    agent.handleRequest(intentMap);
});

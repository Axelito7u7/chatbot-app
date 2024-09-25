const functions = require("firebase-functions");
const { WebhookClient} = require("dialogflow-fulfillment");
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
                agent.add("Nuestras categorías: ");
                snapshot.forEach((doc) => {
                    agent.add(doc.data().Nombre);
                });
            })
            .catch(() => {
                agent.add("Ocurrió un error. Puedes intentar seleccionando otra categoría.");
            });
    }

    let intentMap = new Map();
    intentMap.set("MostrarCategorias", MostrarCategorias);

    agent.handleRequest(intentMap);
});

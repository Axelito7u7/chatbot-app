/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const functions = require("firebase-functions");
const {WebhookClient} = require("dialogflow-fulfillment");

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.helloWorld = onRequest((request, response) => {
    logger.info("Hello logs!", {structuredData: true});
    response.send("Hello from Firebase!");
});

exports.chatbot = functions.https.onRequest((request, response) =>{
    console.log("req********************: ",request.body);
    console.log("req********************: ",request.body);
    const agent = new WebhookClient({request, response });
    console.log("Dialogflow Request header: " + JSON.stringify(request.headers));
    console.log("Dialgoflow Request body: "+ JSON.stringify(request.body));

    function Welcome(agent){
        agent.add('Hola bienvenido, Soy chatbotsito en que te puedo ayudar');
    }

    function Fallback(agent){
        agent.add('Lo siento no entendi, Lo puedes repetir?');
    }

    let intenMap = new Map();

    intenMap.set("Default Welcome Intent", Welcome);
    intenMap.set("Default Fallback Intent", Fallback);
    agent.handleRequest(intenMap);
});
//const {onRequest} = require("firebase-functions/v2/https");
//const logger = require("firebase-functions/logger");

const functions = require("firebase-functions");
const { WebhookClient} = require("dialogflow-fulfillment");

exports.chatbot = functions.https.onRequest((request, response) => {
    console.log("req*********:", request.body);
    console.log("req*********:", request.body);
    const agent = new WebhookClient({request, response});
    console.log("DialogFlow Request header:" + JSON.stringify(request.headers));
    console.log("DialogFlow Request body:" + JSON.stringify(request.body));

    function Welcome(agent){
        agent.add('Welcome to my agent Firebase Functions');
    }
    function fallback(agent){
        agent.add('I din´n undersand');
        agent.add('I´m sorry, can you try again?');
    }

    let intentMap = new Map();

    intentMap.set("Default Welcome Intent", Welcome);
    intentMap.set("Default Fallback Intent", fallback);
    agent.handleRequest(intentMap);


});
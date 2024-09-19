const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');

exports.dialogflowFulfillment = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });

    function welcomeIntent(agent) {
        agent.add('Welcome to my Dialogflow agent!');
    }

    function fallbackIntent(agent) {
        agent.add('I didn’t understand');
        agent.add('I’m sorry, can you try again?');
    }

    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcomeIntent);
    intentMap.set('Default Fallback Intent', fallbackIntent);

    agent.handleRequest(intentMap);
});

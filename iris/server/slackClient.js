'use strict';

var RtmClient = require('@slack/client').RtmClient;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
let rtm = null;
let nlp = null;
let registry = null;

function handleOnAuthenticated(rtmStartData) {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
}

function handleOnMessage(message) {

  if(message.text.toLowerCase().includes('iris')) {
    nlp.ask(message.text, (err, res) => {
      if(err) {
        console.log(err);
        return;
      }

      try {
        if(!res.intent || !res.intent[0] || !res.intent[0].value) {
          throw new Error("Could not extract intent.");
        }

        const intent = require('./intents/' + res.intent[0].value + 'Intent');

        intent.process(res, registry, function(err, res) {
          if(err) {
            console.log(err.message);
            return;
          }
          return rtm.sendMessage(res, message.channel);
        });
      } catch(err) {
        console.log(err);
        console.log(res);
        rtm.sendMessage("Sorry, I don't know what you are talking about!", message.channel);
      }
    });
  }
}

function addAuthenticatedHandler(rtm, handler) {
  rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, handler);
}

module.exports.init = function slackClient(bot_token, logLevel, nlpClient, serviceRegistry) {
  rtm = new RtmClient(bot_token, {logLevel: logLevel});
  nlp = nlpClient;
  registry = serviceRegistry;
  addAuthenticatedHandler(rtm, handleOnAuthenticated);
  rtm.on(RTM_EVENTS.MESSAGE, handleOnMessage);
  return rtm;
};

module.exports.addAuthenticatedHandler = addAuthenticatedHandler;

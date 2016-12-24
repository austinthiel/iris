'use strict';

const slackClient = require('../server/slackClient');
const service = require('../server/service');
const http = require('http');
const server = http.createServer(service);

const witToken = 'JAFRKMI3ZNFFT3I5SJSQ47WYEZAE4KAE';
const witClient = require('../server/witClient')(witToken);

const slackToken = 'xoxb-120147160854-yjAON3j9xVxSkR5DTTv6zoM2';
const slackLogLevel = 'verbose';

const serviceRegistry = service.get('serviceRegistry');
const rtm = slackClient.init(slackToken, slackLogLevel, witClient, serviceRegistry);
rtm.start();

slackClient.addAuthenticatedHandler(rtm, () => {
  server.listen(3000);
});


server.on('listening', () => {
  console.log(`IRIS is listening on ${server.address().port} in ${service.get('env')} mode.`);
});

'use strict';

const request = require('superagent');

module.exports.process = function process(intentData, registry, callback) {
  if(intentData.intent[0].value !== 'weather') {
    return callback(new Error(`Expected weather intent, got ${intentData.intent[0].value}`));
  }
  if(!intentData.location) {
    return callback(new Error('Missing location in weather intent'));
  }

  const location = intentData.location[0].value.replace(/,.?iris/i, '');

  const service = registry.get('weather');
  if(!service) {
    return callback(false, 'No service available');
  }
  request.get(`http://${service.ip}:${service.port}/service/${location}`, (err, res) => {
    if(err || res.statusCode !== 200 || !res.body.result) {
      console.log(err);
      return callback(false, `I had a problem finding out the weather in ${location}`);
    }

    return callback(false, `The current weather in ${location} is ${res.body.result}`);
  });
};

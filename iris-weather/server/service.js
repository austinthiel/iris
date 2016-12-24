'use strict';

const express = require('express');
const service = express();
const request = require('superagent');

service.get('/service/:location', (req, res, next) => {

    request.get('http://api.openweathermap.org/data/2.5/weather?q=' +
    req.params.location + '&APPID=1f4b39b96ad247a4c36d0b50465ba01c&units=metric',
    (err, response) => {

        if (err) {
            console.log(err);
            return res.sendStatus(404);
        }

        res.json({
          result: `${response.body.weather[0].description} at ${response.body.main.temp} degrees`
        });
    });
});

module.exports = service;

'use strict';

var dotenv = require('dotenv');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var server = express();

dotenv.config({ silent: true });

// log requests with morgan
server.use(morgan('dev'));

// parse the payload
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

var router = express.Router();

server.use('/api', router);

router.route('/v').get(function (req, res) {
    res.status(200).send({ message: 'Hello World.' });
}).post(function (req, res) {
    console.log(req.body);
    res.status(200).send({ message: 'Hello World.' });
});

server.listen(process.env.PORT_DEV);
console.log('server running at port: ', process.env.PORT_DEV);
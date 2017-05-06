/* eslint linebreak-style: ["error", "windows"]*/

import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';

import newIndex from './dist/inverted-index';

const server = express();
dotenv.config({ silent: true });

// log requests with morgan
server.use(morgan('dev'));

// parse the payload
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

const router = express.Router();
const newInvertedIndex = new newIndex();

server.use('/api', router);

router.route('/create')
    .post((req, res) => {
      const allfiles = req.body;
      const fileNameAneContent = newInvertedIndex.readBookData(allfiles);
      newInvertedIndex.createIndex(fileNameAneContent);
      res.status(200).json(newInvertedIndex.createdIndex);
    });

router.route('/search')
    .post((req, res) => {
      const searchQueries = req.body;
      const individualQueries = newInvertedIndex.takeInSearchQuery(searchQueries);
      newInvertedIndex.searchIndex(individualQueries);
      res.status(200).json(newInvertedIndex.searchResult);
    });


server.listen(process.env.PORT_DEV);
console.log('server running at port: ', process.env.PORT_DEV);

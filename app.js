/* eslint linebreak-style: ["error", "windows"]*/

import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import fs from 'fs';
import multer from 'multer';

import newIndex from './src/inverted-index';

const server = express();
dotenv.config({ silent: true });

// log requests with morgan
server.use(morgan('dev'));

// parse the payload
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

const router = express.Router();

const upload = multer({ dest: 'uploads/' });
const newInvertedIndex = new newIndex();

server.use('/api', router);

router.route('/create')
    .post(upload.array('allFiles'), (req, res) => {
      const allfiles = req.files;

/*      const filenameAndPath = [];
      allfiles.forEach(i => filenameAndPath.push({ [i.originalname]: i.path }));
      filenameAndPath.forEach((eachFilenameAndPath) => {
        for (const [filename, filepath] of Object.entries(eachFilenameAndPath)) {
          const fileContent = JSON.parse(fs.readFileSync(filepath, 'utf8'));
          // res.status(200).json(fileContent);
        }
      });
/*      const filenameAndPath = [];
      allfiles.forEach(i => filenameAndPath.push({ [i.originalname]: i.path }));
      for (const eachFilenameAndPath of filenameAndPath) {
        console.log(Object.entries(eachFilenameAndPath));
        for (const [filename, filepath] of Object.entries(eachFilenameAndPath)) {
          const fileContent = JSON.parse(fs.readFileSync(filepath, 'utf8'));
          res.status(200).json(filename);
        }
      }*/

      const fileNameAndContent = newInvertedIndex.readBookDataApiMulter(allfiles);
      newInvertedIndex.createIndex(fileNameAndContent);
      res.status(200).json(newInvertedIndex.createdIndex);
    });
/*
let newArr = [];
Array.from(arr).forEach(a => newArr.push({[a.originalname]: a.path}));

router.post('/create', (req, res) => {

  upload(req, res, (err) => {
    if (err) {
      console.error(err);
      return
    }

    res.status(200).send('hi you');
  });
});*/

router.route('/search')
    .post((req, res) => {
      const searchQueries = req.body;
      const individualQueries = newInvertedIndex.takeInSearchQuery(searchQueries);
      newInvertedIndex.searchIndex(individualQueries);
      res.status(200).json(newInvertedIndex.searchResult);
    });


server.listen(process.env.PORT_DEV);
console.log('server running at port: ', process.env.PORT_DEV);

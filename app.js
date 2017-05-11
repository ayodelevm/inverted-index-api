import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import multer from 'multer';

import newIndex from './src/inverted-index';

const server = express();
dotenv.config({ silent: true });


server.use(morgan('dev'));

server.use(bodyParser.json())
      .use(bodyParser.urlencoded({ extended: true }));

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

server.get('/', (req, res) => {
  res.send('Hello world');
});

const router = express.Router();
const upload = multer({ dest: 'uploads/' });
const newInvertedIndex = new newIndex();

server.use('/api', router);

router.route('/create')
    .post(upload.array('allFiles'), (req, res) => {
      const allfiles = req.files;
      const fileNameAndContent = newInvertedIndex.readBookDataApiMulter(allfiles);
      newInvertedIndex.createIndex(fileNameAndContent);
      res.status(200).json({
        processedFiles: newInvertedIndex.createdIndex,
        fileErrors: newInvertedIndex.errors
      });
    });

router.route('/search')
    .post((req, res) => {
      const searchQueries = req.body.searchTerms;
      const filename = req.body.fileName;
      const index = newInvertedIndex.createdIndex;
      if (req.body.fileName === undefined) {
        newInvertedIndex.searchIndex(index, searchQueries);
      } else {
        newInvertedIndex.searchIndex(index, filename, searchQueries);
      }
      res.status(200).json(newInvertedIndex.searchResult);
    });


server.listen(process.env.PORT_PROD);
console.log('server running at port: ', process.env.PORT_PROD);

export default server;


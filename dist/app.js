'use strict';

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _invertedIndex = require('./dist/inverted-index');

var _invertedIndex2 = _interopRequireDefault(_invertedIndex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint linebreak-style: ["error", "windows"]*/

var server = (0, _express2.default)();
_dotenv2.default.config({ silent: true });

// log requests with morgan
server.use((0, _morgan2.default)('dev'));

// parse the payload
server.use(_bodyParser2.default.urlencoded({ extended: true }));
server.use(_bodyParser2.default.json());

var router = _express2.default.Router();
var upload = (0, _multer2.default)({ dest: 'uploads/' }).array('allFiles');
var newInvertedIndex = new _invertedIndex2.default();

server.use('/api', router);

/* router.route('/create')
    .post(upload.single(), (req, res) => {
      console.log(req.files);
      res.status(200).json('hi you');
/*      const allfiles = req.body;
      const fileNameAneContent = newInvertedIndex.readBookData(allfiles);
      newInvertedIndex.createIndex(fileNameAneContent);
      res.status(200).json(newInvertedIndex.createdIndex);
    });

let newArr = [];
Array.from(arr).forEach(a => newArr.push({[a.originalname]: a.path}));
*/
router.post('/create', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(req.files);
    console.log(req.originalUrl);
    console.log(req.body);
    res.status(200).send('hi you');
  });
});

router.route('/search').post(function (req, res) {
  var searchQueries = req.body;
  var individualQueries = newInvertedIndex.takeInSearchQuery(searchQueries);
  newInvertedIndex.searchIndex(individualQueries);
  res.status(200).json(newInvertedIndex.searchResult);
});

server.listen(process.env.PORT_DEV);
console.log('server running at port: ', process.env.PORT_DEV);
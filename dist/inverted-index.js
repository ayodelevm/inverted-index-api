'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint linebreak-style: ["error", "windows"]*/


var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

require('babel-polyfill');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// const path = require('path');
// const fs = require('fs');

// const allfiles = ['book-one.json', 'book-two.json', 'book-three.json'];
// const searchQuery = [["it's first string"], ['to', 'of'], 'reminscence'];
// const searchQuery = [];
// const filename = ['book-one.json', 'book-three.json'];
// const searchQuery = ['first string', 'around', ['world', 'remincense']];

var InvertedIndex = function () {
  // Inverted index class attributes goes here
  function InvertedIndex() {
    _classCallCheck(this, InvertedIndex);

    this.fileContent = null;
    this.currentPath = null;
    this.createdIndex = null;
    this.searchResult = null;
    this.errors = [];
  }

  _createClass(InvertedIndex, [{
    key: 'readBookData',
    value: regeneratorRuntime.mark(function readBookData(_ref) {
      var _ref2 = _toArray(_ref),
          allFilenames = _ref2.slice(0);

      var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step;

      return regeneratorRuntime.wrap(function readBookData$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context.prev = 3;
              _iterator = allFilenames[Symbol.iterator]();

            case 5:
              if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                _context.next = 21;
                break;
              }

              this.filename = _step.value;

              process.chdir('./');
              this.fullpath = _path2.default.join(process.cwd(), 'fixtures', this.filename);
              _context.prev = 9;

              this.fileContent = JSON.parse(_fs2.default.readFileSync(this.fullpath, 'utf8'));
              _context.next = 13;
              return {
                filename: this.filename,
                fileContent: this.fileContent
              };

            case 13:
              _context.next = 18;
              break;

            case 15:
              _context.prev = 15;
              _context.t0 = _context['catch'](9);

              this.errors.push(new DataError('Invalid file', this.filename));

            case 18:
              _iteratorNormalCompletion = true;
              _context.next = 5;
              break;

            case 21:
              _context.next = 27;
              break;

            case 23:
              _context.prev = 23;
              _context.t1 = _context['catch'](3);
              _didIteratorError = true;
              _iteratorError = _context.t1;

            case 27:
              _context.prev = 27;
              _context.prev = 28;

              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }

            case 30:
              _context.prev = 30;

              if (!_didIteratorError) {
                _context.next = 33;
                break;
              }

              throw _iteratorError;

            case 33:
              return _context.finish(30);

            case 34:
              return _context.finish(27);

            case 35:
            case 'end':
              return _context.stop();
          }
        }
      }, readBookData, this, [[3, 23, 27, 35], [9, 15], [28,, 30, 34]]);
    })
  }, {
    key: 'createIndex',
    value: function createIndex() {
      var _this = this;

      var fileObject = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.readBookData(allfiles);

      var mappedIndex = {};
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = fileObject[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          this.currentFile = _step2.value;

          if (this.validateFileContent(this.currentFile.fileContent)) {
            (function () {
              var wordsCollection = {};
              var _iteratorNormalCompletion3 = true;
              var _didIteratorError3 = false;
              var _iteratorError3 = undefined;

              try {
                var _loop = function _loop() {
                  var _ref3 = _step3.value;
                  _ref4 = _slicedToArray(_ref3, 2);
                  var index = _ref4[0];
                  var newObject = _ref4[1];

                  var titleTextArray = [];
                  titleTextArray = titleTextArray.concat(InvertedIndex.sanitizeData(newObject.title));
                  titleTextArray = titleTextArray.concat(InvertedIndex.sanitizeData(newObject.text));
                  titleTextArray.forEach(function (word) {
                    if (wordsCollection.hasOwnProperty(word)) {
                      wordsCollection[word] = Array.from(new Set(wordsCollection[word].concat([index])));
                    } else {
                      wordsCollection[word] = [index];
                    }
                  });
                };

                for (var _iterator3 = _this.currentFile.fileContent.entries()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                  var _ref4;

                  _loop();
                }
              } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                  }
                } finally {
                  if (_didIteratorError3) {
                    throw _iteratorError3;
                  }
                }
              }

              mappedIndex[_this.currentFile.filename] = JSON.parse(JSON.stringify(wordsCollection));
            })();
          }
          this.createdIndex = mappedIndex;
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: 'takeInSearchQuery',
    value: regeneratorRuntime.mark(function takeInSearchQuery(_ref5) {
      var _ref6 = _toArray(_ref5),
          allSearchQuery = _ref6.slice(0);

      var _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, query, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, newQuery;

      return regeneratorRuntime.wrap(function takeInSearchQuery$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              allSearchQuery = allSearchQuery.reduce(function (a, b) {
                return a.concat(b);
              }, []);
              _iteratorNormalCompletion4 = true;
              _didIteratorError4 = false;
              _iteratorError4 = undefined;
              _context2.prev = 4;
              _iterator4 = allSearchQuery[Symbol.iterator]();

            case 6:
              if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                _context2.next = 37;
                break;
              }

              query = _step4.value;
              _iteratorNormalCompletion5 = true;
              _didIteratorError5 = false;
              _iteratorError5 = undefined;
              _context2.prev = 11;
              _iterator5 = InvertedIndex.sanitizeData(query)[Symbol.iterator]();

            case 13:
              if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
                _context2.next = 20;
                break;
              }

              newQuery = _step5.value;
              _context2.next = 17;
              return newQuery;

            case 17:
              _iteratorNormalCompletion5 = true;
              _context2.next = 13;
              break;

            case 20:
              _context2.next = 26;
              break;

            case 22:
              _context2.prev = 22;
              _context2.t0 = _context2['catch'](11);
              _didIteratorError5 = true;
              _iteratorError5 = _context2.t0;

            case 26:
              _context2.prev = 26;
              _context2.prev = 27;

              if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
              }

            case 29:
              _context2.prev = 29;

              if (!_didIteratorError5) {
                _context2.next = 32;
                break;
              }

              throw _iteratorError5;

            case 32:
              return _context2.finish(29);

            case 33:
              return _context2.finish(26);

            case 34:
              _iteratorNormalCompletion4 = true;
              _context2.next = 6;
              break;

            case 37:
              _context2.next = 43;
              break;

            case 39:
              _context2.prev = 39;
              _context2.t1 = _context2['catch'](4);
              _didIteratorError4 = true;
              _iteratorError4 = _context2.t1;

            case 43:
              _context2.prev = 43;
              _context2.prev = 44;

              if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
              }

            case 46:
              _context2.prev = 46;

              if (!_didIteratorError4) {
                _context2.next = 49;
                break;
              }

              throw _iteratorError4;

            case 49:
              return _context2.finish(46);

            case 50:
              return _context2.finish(43);

            case 51:
            case 'end':
              return _context2.stop();
          }
        }
      }, takeInSearchQuery, this, [[4, 39, 43, 51], [11, 22, 26, 34], [27,, 29, 33], [44,, 46, 50]]);
    })
  }, {
    key: 'searchIndex',
    value: function searchIndex(index, filename, uniqueSearchQuery) {
      var indexParams = void 0,
          filenameParams = void 0,
          uniqueSearchQueryParams = void 0;
      var matchedBookIndex = {};
      var queryResult = {};
      if (arguments['2'] === undefined) {
        matchedBookIndex = arguments['0'];filenameParams = undefined;
        uniqueSearchQueryParams = arguments['1'];
      } else {
        indexParams = index;filenameParams = filename;uniqueSearchQueryParams = uniqueSearchQuery;
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
          for (var _iterator6 = filenameParams[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var eachFilename = _step6.value;

            if (indexParams.hasOwnProperty(eachFilename)) {
              Object.assign(matchedBookIndex, _defineProperty({}, eachFilename, indexParams[eachFilename]));
            }
          }
        } catch (err) {
          _didIteratorError6 = true;
          _iteratorError6 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion6 && _iterator6.return) {
              _iterator6.return();
            }
          } finally {
            if (_didIteratorError6) {
              throw _iteratorError6;
            }
          }
        }
      }
      var allQuery = this.takeInSearchQuery(uniqueSearchQueryParams);
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        var _loop2 = function _loop2() {
          var individualQuery = _step7.value;

          var foundQuery = {};
          // console.log(foundQuery);
          Object.entries(matchedBookIndex).forEach(function (objectArray) {
            var _objectArray = _slicedToArray(objectArray, 2),
                currentFilename = _objectArray[0],
                indexedData = _objectArray[1];

            if (!indexedData.hasOwnProperty(individualQuery)) {
              return;
            }
            if (indexedData.hasOwnProperty(individualQuery)) {
              Object.assign(foundQuery, _defineProperty({}, individualQuery, indexedData[individualQuery]));
            }
            if (queryResult.hasOwnProperty(currentFilename)) {
              Object.assign(queryResult[currentFilename], foundQuery);
            } else {
              queryResult[currentFilename] = JSON.parse(JSON.stringify(foundQuery));
            }
          });
        };

        for (var _iterator7 = allQuery[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          _loop2();
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7.return) {
            _iterator7.return();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }

      if (Object.keys(queryResult).length === 0) {
        this.searchResult = "";
      }
      this.searchResult = queryResult;
    }
  }, {
    key: 'validateFileContent',
    value: function validateFileContent(data) {
      var hasErrors = false;
      if (data.length > 0 && data.some(function (i) {
        return JSON.stringify(i)[0] !== '{' && JSON.stringify(i)[JSON.stringify(i).length - 1] !== '}';
      })) {
        this.errors.push(new DataError('file is not a JSON array', data));
        // throw new Error('file content is not a JSON Array');
        hasErrors = true;
      }

      if (!hasErrors && data.some(function (i) {
        return JSON.stringify(i) === JSON.stringify({});
      }) && Object.keys(data[0]).length === 0) {
        this.errors.push(new DataError('JSON object cannot be empty or contain empty objects', data));
        hasErrors = true;
      }

      if (!hasErrors && data.some(function (i) {
        return i.title === undefined || i.text === undefined;
      })) {
        this.errors.push(new DataError('Bad JSON Array format', data));
        hasErrors = true;
      }
      return !hasErrors;
    }
  }], [{
    key: 'sanitizeData',
    value: function sanitizeData(data) {
      return data.toLowerCase().replace(/[^a-z A-Z 0-9]+/g, '').split(/[\s]\s*/);
    }
  }]);

  return InvertedIndex;
}();

exports.default = InvertedIndex;

var DataError = function DataError(message, data) {
  _classCallCheck(this, DataError);

  this.message = message;
  this.data = data;
};

// module.export = InvertedIndex;

/*
const indexOne = new InvertedIndex();
indexOne.createIndex();
// console.log(indexOne.createdIndex);
const index = indexOne.createdIndex;
// console.log(index);
// const filename = undefined;
// const allQuery = indexOne.takeInSearchQuery();
indexOne.searchIndex(index, filename, searchQuery);
console.log(indexOne.searchResult);

/* for(const error of indexOne.errors) {
  console.log(error.message);
}*/
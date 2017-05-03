'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /* eslint linebreak-style: ["error", "windows"]*/


var _invertedIndex = require('../dist/inverted-index');

var _invertedIndex2 = _interopRequireDefault(_invertedIndex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Inverted Index Tests', function () {
  describe('Validate data', function () {
    var newInvertedIndex = new _invertedIndex2.default();
    var allfiles = ['invalid-file.json', 'invalidFile.json', 'not-json-array.json', 'empty-book.json', 'bad-format.json'];
    newInvertedIndex.createIndex(newInvertedIndex.readBookData(allfiles));

    it('Should throw aapropriate error if file is not a JSON a valid file or if file is not found', function () {
      expect(newInvertedIndex.errors[0].message).toBe('Invalid file');
      expect(newInvertedIndex.errors[1].message).toBe('Invalid file');
    });

    it('Should throw aapropriate error if file is not a JSON Array', function () {
      expect(newInvertedIndex.errors[2].message).toBe('file is not a JSON array');
    });

    it('Should throw appropriate error if JSON Object is empty or contain empty objects', function () {
      expect(newInvertedIndex.errors[3].message).toBe('JSON object cannot be empty or contain empty objects');
    });

    it("Should throw aapropriate error if JSON Object is not in the format of `{title: 'a', text: 'b'}`", function () {
      expect(newInvertedIndex.errors[4].message).toBe('Bad JSON Array format');
    });
  });

  describe('Read Book Data', function () {
    var newInvertedIndex = new _invertedIndex2.default();
    var allfiles = ['book-three.json'];
    var readfile = newInvertedIndex.readBookData(allfiles);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      var _loop = function _loop() {
        var currentFile = _step.value;

        it('should ensure that the file passed in is read and yielded in the right format', function () {
          expect(currentFile.filename).toBe('book-three.json');
          expect(_typeof(currentFile.fileContent)).toBe('object');
        });
      };

      for (var _iterator = readfile[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        _loop();
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  });

  describe('Create Index', function () {
    var newInvertedIndex = new _invertedIndex2.default();
    var allfiles = ['book-one.json', 'book-two.json', 'book-three.json'];
    newInvertedIndex.createIndex(newInvertedIndex.readBookData(allfiles));

    it('should be able to create index for multiple files and map the created index to the right file', function () {
      expect(newInvertedIndex.createdIndex['book-one.json'].understand).toEqual([0, 1]);
      expect(newInvertedIndex.createdIndex['book-two.json'].world).toEqual([0, 1, 2]);
      expect(newInvertedIndex.createdIndex['book-three.json'].around).toEqual([0]);
    });
  });

  describe('take in search query', function () {
    var newInvertedIndex = new _invertedIndex2.default();
    var searchQuery = ['first string', 'around', ['world', 'remincense']];
    var allQuery = newInvertedIndex.takeInSearchQuery(searchQuery);

    var allUniqueQuery = [];
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = allQuery[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var individualQuery = _step2.value;

        allUniqueQuery.push(individualQuery);
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

    it('should take search query in varying formats and yeild one word at a time to the search index method', function () {
      expect(allUniqueQuery).toEqual(['first', 'string', 'around', 'world', 'remincense']);
    });
  });

  describe('Search Index', function () {
    var newInvertedIndex = new _invertedIndex2.default();
    var allfiles = ['book-one.json', 'book-two.json', 'book-three.json'];
    var searchQuery = ['first string', 'around', ['world', 'reminscence']];
    newInvertedIndex.createIndex(newInvertedIndex.readBookData(allfiles));
    newInvertedIndex.searchIndex(newInvertedIndex.takeInSearchQuery(searchQuery));

    it('Should be able to search through indexes for multiple files and return the word with index and the file it was found', function () {
      expect(newInvertedIndex.searchResult['book-one.json']).toEqual({ string: [0, 1] });
      expect(newInvertedIndex.searchResult['book-two.json']).toEqual({ first: [0, 1, 2], string: [0, 1, 2], world: [0, 1, 2] });
      expect(newInvertedIndex.searchResult['book-three.json']).toEqual({ around: [0], world: [0], reminscence: [0] });
    });
  });

  describe('Search Index 2', function () {
    var newInvertedIndex = new _invertedIndex2.default();
    var allfiles = ['book-one.json', 'book-two.json', 'book-three.json'];
    var searchQuery = ['first reminscence', 'around', ['world', 'around', 'remint']];
    newInvertedIndex.createIndex(newInvertedIndex.readBookData(allfiles));
    newInvertedIndex.searchIndex(newInvertedIndex.takeInSearchQuery(searchQuery));

    it('Should not return an indexed file if non of the search query is found in that file, \n      should return only one word for multiple word occurence and should ignore word not found', function () {
      expect(newInvertedIndex.searchResult['book-one.json']).toBeUndefined();
      expect(newInvertedIndex.searchResult['book-two.json']).toEqual({ first: [0, 1, 2], world: [0, 1, 2] });
      expect(newInvertedIndex.searchResult['book-three.json']).toEqual({ around: [0], world: [0], reminscence: [0] });
    });
  });

  describe('Sanitize data', function () {
    var newInvertedIndex = new _invertedIndex2.default();
    var searchQuery = ['fi%$rst str#&#ing', 'ar/+-ound', ['world', 'remincense']];
    var allQuery = newInvertedIndex.takeInSearchQuery(searchQuery);

    var allUniqueQuery = [];
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = allQuery[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var individualQuery = _step3.value;

        allUniqueQuery.push(individualQuery);
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

    it('Should split on whitespaces[single or multiple] and tabs, and filter out symbols \n    from text whenever sanitize data is called in a method', function () {
      expect(allUniqueQuery).toEqual(['first', 'string', 'around', 'world', 'remincense']);
    });
  });

  describe('Other testcases [preventing code breaking]', function () {
    var newInvertedIndex = new _invertedIndex2.default();
    var allfiles = ['book-one.json', 'invalid-file.json', 'empty-book.json', 'book-three.json'];
    newInvertedIndex.createIndex(newInvertedIndex.readBookData(allfiles));

    it('should not break the code when an invalid file or file with wrong content is mixed with valid files. \n      The valid files should run and the invalid ones should report an error', function () {
      expect(newInvertedIndex.createdIndex['book-one.json'].understand).toEqual([0, 1]);
      expect(newInvertedIndex.createdIndex['invalid-file.json']).toBeUndefined();
      expect(newInvertedIndex.createdIndex['empty-book.json']).toBeUndefined();
      expect(newInvertedIndex.createdIndex['book-three.json'].around).toEqual([0]);
    });

    it('should report the appropriate errors for the invalid files', function () {
      expect(newInvertedIndex.errors[0].message).toBe('Invalid file');
      expect(newInvertedIndex.errors[1].message).toBe('JSON object cannot be empty or contain empty objects');
    });
  });
});
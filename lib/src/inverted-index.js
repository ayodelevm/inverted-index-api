'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint linebreak-style: ["error", "windows"]*/


var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// export const path = require('path');
// export const fs = require('fs');

var InvertedIndex = function () {
  // Inverted index class attributes goes here
  function InvertedIndex() {
    _classCallCheck(this, InvertedIndex);

    this.filepath = '';
    this.fileContent = [];
  }

  _createClass(InvertedIndex, [{
    key: 'getFilePath',
    value: function getFilePath(filename) {
      process.chdir('./');
      var fullpath = _path2.default.join(process.cwd(), 'fixtures', filename);
      this.filepath = fullpath;
    }
  }, {
    key: 'readBookData',
    value: function readBookData(done) {
      var _this = this;

      // filecontent read into a variable here
      _fs2.default.readFile(this.filepath, 'utf8', function (err, fileData) {
        if (err) {
          throw new Error(err);
          // done(err, null);
        }
        _this.fileContent.push(JSON.parse(fileData));
        done(null, fileData);
      });
    }
  }, {
    key: 'checkStat',
    value: function checkStat() {
      var _this2 = this;

      this.readBookData(function (err, fileData) {
        if (err) {
          throw new Error(err);
        } else {
          console.log(fileData);
          _this2.fileContent.push(JSON.parse(fileData));
        }
      });
    }
  }, {
    key: 'createIndex',
    value: function createIndex(filename, fileContent) {
      // logic goes in here
    }
  }, {
    key: 'searchIndex',
    value: function searchIndex(index, fileName, searchTerms) {
      // logic goes in here    
    }
  }]);

  return InvertedIndex;
}();

exports.default = 'InvertedIndex';


var docOne = new InvertedIndex();

docOne.getFilePath('book_one.json');
// docOne.readBookData();
//docOne.checkStat();
docOne.createIndex();
//console.log(docOne.fileContent);
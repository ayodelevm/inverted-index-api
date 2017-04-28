/* eslint linebreak-style: ["error", "windows"]*/
const path = require('path');
const fs = require('fs');

function InvertedIndex() {
  // Inverted index class attributes goes here

  this.filepath = '';
  this.fileContent = [];
}

InvertedIndex.prototype.getFilePath = function (filename) {
  process.chdir('./');
  const fullpath = path.join(process.cwd(), 'fixtures', filename);
  this.filepath = fullpath;
};

InvertedIndex.prototype.readBookData = function (done) {
  // filecontent read into a variable here
  fs.readFile(this.filepath, 'utf8', (err, fileData) => {
    if (err) {
      throw new Error(err);
      // done(err, null);
    }
    this.fileContent.push(JSON.parse(fileData));
    done(null, fileData);
  });
};

InvertedIndex.prototype.checkStat = function() {
  const fileContent = [];
  this.readBookData((err, fileData) => {
    if (err) {
      throw new Error(err);
    } else {
      console.log(fileData);
      fileContent.push(JSON.parse(fileData));
    }
  });
  return fileContent;
};

InvertedIndex.prototype.createIndex = (fileName, fileContent) => {
  // logic goes in here
};

InvertedIndex.prototype.searchIndex = (index, fileName, searchTerms) => {
  // logic goes in here
};

const docOne = new InvertedIndex();

docOne.getFilePath('book_one.json');
// docOne.readBookData();
docOne.checkStat();
docOne.createIndex();
//console.log(docOne.fileContent);

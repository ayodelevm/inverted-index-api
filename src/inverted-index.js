/* eslint linebreak-style: ["error", "windows"]*/
import path from 'path';
import fs from 'fs';

class InvertedIndex {
  // Inverted index class attributes goes here
  constructor() {
    this.filepath = '';
    this.fileContent = null;
  }

  getFilePath(filename) {
    process.chdir('./');
    const fullpath = path.join(process.cwd(), 'fixtures', filename);
    this.filepath = fullpath;
  }
  readBookData() {
    // filecontent read into a variable here
    this.fileContent = JSON.parse(fs.readFileSync(this.filepath, 'utf8'));
  }

  checkStat() {
    this.readBookData((err, fileData) => {
      if (err) {
        throw new Error(err);
      } else {
        console.log(fileData);
        this.fileContent.push(JSON.parse(fileData));
      }
    });
  }

  createIndex(filename) {
    // logic goes in here
    this.getFilePath(filename);
    this.readBookData();
    console.log(this.fileContent[0].title);
  }

  searchIndex(index, fileName, searchTerms) {
    // logic goes in here
  }

}

export default 'InvertedIndex';

const docOne = new InvertedIndex();

/*
=====================================================
= My inverted index logic to be converted to classes
=====================================================
*/

function* getFilePath([...filename]) {
  for (let i of filename) {
    process.chdir('./');
    const fullpath = path.join(process.cwd(), 'fixtures', i);
    yield {
      filename: i,
      fullpath: fullpath
    };
  }
}

function readBookData(filePath = getFilePath(filename)) {
  let fileContent;
  const map = {};

  for (const object of filePath) {
    try {
      fileContent = JSON.parse(fs.readFileSync(object.fullpath, 'utf8'));
    } catch (e) {
      throw new Error('Invalid file');
    }
    if (fileContent.length >= 0 && fileContent.some(i =>
      (JSON.stringify(i)[0]) !== '{' && JSON.stringify(i)[JSON.stringify(i).length - 1] !== '}')) {
      throw new Error('file is not a JSON array');
    }

    if (fileContent.some(i =>
      JSON.stringify(i) === JSON.stringify({})) && Object.keys(fileContent[0]).length === 0) {
      throw new Error('JSON object cannot be empty or contain empty objects');
    }

    if (fileContent.some(i => i.title === undefined || i.text === undefined)) {
      throw new Error('Bad JSON Array format');
    }

    const wordsCollection = {};
    for (const [index, newObject] of fileContent.entries()) {
      const titleArray = newObject.title.toLowerCase().replace(/[^a-z A-Z 0-9]+/g, '').split(/[\s]\s*/);
      titleArray.forEach((word) => {
        if (wordsCollection.hasOwnProperty(word)) {
          wordsCollection[word] = Array.from(new Set(wordsCollection[word].concat([index])));
        } else {
          wordsCollection[word] = [index];
        }
      });
      const textArray = newObject.text.toLowerCase().replace(/[^a-z A-Z 0-9]+/g, '').split(/[\s]\s*/);
      textArray.forEach(word => {
        if (wordsCollection.hasOwnProperty(word)) {
          wordsCollection[word] = Array.from(new Set(wordsCollection[word].concat([index])));
        } else {
          wordsCollection[word] = [index];
        }
      });
    }
    map[object.filename] = JSON.parse(JSON.stringify(wordsCollection));
  }
  return map;
}

function* takeInSearchQuery([...searchQuery]) {
  searchQuery = searchQuery.reduce((a, b) => a.concat(b), []);
  for (const query of searchQuery) {
    for (const newQuery of query.replace(/[^a-z A-Z 0-9]+/g, '').split(/[\s]\s*/)) {
      yield newQuery.toLowerCase();
    }
  }
}

function searchIndex(allQuery = takeInSearchQuery(searchQuery)) {
  const obj = readBookData();
  const queryResult = {};
  for (const individualQuery of allQuery) {
    const foundQuery = {};
    Object.entries(obj).forEach((objectArray) => {
      const [filename, indexedData] = objectArray;
      if (!indexedData.hasOwnProperty(individualQuery)) {
        return;
      }
      if (indexedData.hasOwnProperty(individualQuery)) {
        Object.assign(foundQuery, { [individualQuery]: indexedData[individualQuery] });
      }
      if (queryResult.hasOwnProperty(filename)) {
        Object.assign(queryResult[filename], foundQuery);
      } else {
        queryResult[filename] = JSON.parse(JSON.stringify(foundQuery));
      }
    });
  }
  return queryResult;
}


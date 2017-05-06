/* eslint linebreak-style: ["error", "windows"]*/
import path from 'path';
import fs from 'fs';

import 'babel-polyfill';

// const path = require('path');
// const fs = require('fs');

// const allfiles = ['book-one.json', 'book-two.json', 'book-three.json'];
// const searchQuery = [["it's first string"], ['to', 'of'], 'reminscence'];
// const searchQuery = [];
// const filename = ['book-one.json', 'book-three.json'];
// const searchQuery = ['first string', 'around', ['world', 'remincense']];

export default class InvertedIndex {
  // Inverted index class attributes goes here
  constructor() {
    this.fileContent = null;
    this.currentPath = null;
    this.createdIndex = null;
    this.searchResult = null;
    this.errors = [];
  }

  *readBookData([...allFilenames]) {
    for (this.filename of allFilenames) {
      process.chdir('./');
      this.fullpath = path.join(process.cwd(), 'fixtures', this.filename);
      try {
        this.fileContent = JSON.parse(fs.readFileSync(this.fullpath, 'utf8'));
        yield {
          filename: this.filename,
          fileContent: this.fileContent
        };
      } catch (e) {
        this.errors.push(new DataError('Invalid file', this.filename));
      }
    }
  }

  createIndex(fileObject = this.readBookData(allfiles)) {
    const mappedIndex = {};
    for (this.currentFile of fileObject) {
      if (this.validateFileContent(this.currentFile.fileContent)) {
        const wordsCollection = {};
        for (const [index, newObject] of this.currentFile.fileContent.entries()) {
          let titleTextArray = [];
          titleTextArray = titleTextArray.concat(InvertedIndex.sanitizeData(newObject.title));
          titleTextArray = titleTextArray.concat(InvertedIndex.sanitizeData(newObject.text));
          titleTextArray.forEach((word) => {
            if (wordsCollection.hasOwnProperty(word)) {
              wordsCollection[word] = Array.from(new Set(wordsCollection[word].concat([index])));
            } else {
              wordsCollection[word] = [index];
            }
          });
        }
        mappedIndex[this.currentFile.filename] = JSON.parse(JSON.stringify(wordsCollection));
      }
      this.createdIndex = mappedIndex;
    }
  }

  *takeInSearchQuery([...allSearchQuery]) {
      allSearchQuery = allSearchQuery.reduce((a, b) => a.concat(b), []);
      for (const query of allSearchQuery) {
        for (const newQuery of InvertedIndex.sanitizeData(query)) {
          yield newQuery;
        }
      }
    //}
  }

  searchIndex(index, filename, uniqueSearchQuery) {
    let indexParams, filenameParams, uniqueSearchQueryParams;
    let matchedBookIndex = {};
    const queryResult = {};
    if (arguments['2'] === undefined) {
      matchedBookIndex = arguments['0']; filenameParams = undefined;
      uniqueSearchQueryParams = arguments['1'];
    } else {
      indexParams = index; filenameParams = filename; uniqueSearchQueryParams = uniqueSearchQuery;
      for (const eachFilename of filenameParams) {
        if (indexParams.hasOwnProperty(eachFilename)) {
          Object.assign(matchedBookIndex, { [eachFilename]: indexParams[eachFilename] });
        }
      }
    }
    const allQuery = this.takeInSearchQuery(uniqueSearchQueryParams);
    for (const individualQuery of allQuery) {
      const foundQuery = {};
      // console.log(foundQuery);
      Object.entries(matchedBookIndex).forEach((objectArray) => {
        const [currentFilename, indexedData] = objectArray;
        if (!indexedData.hasOwnProperty(individualQuery)) {
          return;
        }
        if (indexedData.hasOwnProperty(individualQuery)) {
          Object.assign(foundQuery, { [individualQuery]: indexedData[individualQuery] });
        }
        if (queryResult.hasOwnProperty(currentFilename)) {
          Object.assign(queryResult[currentFilename], foundQuery);
        } else {
          queryResult[currentFilename] = JSON.parse(JSON.stringify(foundQuery));
        }
      });
    }
    if (Object.keys(queryResult).length === 0) {
      this.searchResult = ""
    }
    this.searchResult = queryResult;
  }

  validateFileContent(data) {
    let hasErrors = false;
    if (data.length > 0 && data.some(i =>
      (JSON.stringify(i)[0]) !== '{' && JSON.stringify(i)[JSON.stringify(i).length - 1] !== '}')) {
      this.errors.push(new DataError('file is not a JSON array', data));
      // throw new Error('file content is not a JSON Array');
      hasErrors = true;
    }

    if (!hasErrors && data.some(i =>
      JSON.stringify(i) === JSON.stringify({})) && Object.keys(data[0]).length === 0) {
      this.errors.push(new DataError('JSON object cannot be empty or contain empty objects', data));
      hasErrors = true;
    }

    if (!hasErrors && data.some(i =>
      i.title === undefined || i.text === undefined)) {
      this.errors.push(new DataError('Bad JSON Array format', data));
      hasErrors = true;
    }
    return !hasErrors;
  }

  static sanitizeData(data) {
    return data.toLowerCase().replace(/[^a-z A-Z 0-9]+/g, '').split(/[\s]\s*/);
  }

}

class DataError {
  constructor(message, data) {
    this.message = message;
    this.data = data;
  }
}


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


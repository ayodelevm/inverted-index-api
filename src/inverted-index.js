import path from 'path';
import fs from 'fs';
import 'babel-polyfill';
import DataError from './dataError';

/**
 * Class representing an Inverted Index
 *
 * @class InvertedIndex
 */
export default class InvertedIndex {
  /**
   * Creates objects to hold different inverted properties
   * @param {JSONArray} fileContent - holds the read fileContent
   * @param {object} createdIndex - holds the created index
   * @param {object} searchResult - holds the search result
   * @param {Array} errors - holds an object containing the error message and filename
   */
  constructor() {
    this.fileContent = null;
    this.createdIndex = null;
    this.searchResult = null;
    this.errors = [];
  }

/**
 * Reads books fileContent directly from drive (windows tested only)
 * @param {Array} allFilename - takes in an array containing all the files to be read
 * @return {Object} - yields an object containing the filename  and filecontent, one at a time
 */
  * readBookData([...allFilenames]) {
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

/**
 * An implementation for multer npm to read book data through API endpoint
 * @param {Array} requestFileObject - array holds object which contains files' originalname and path
 * @return {Object} - yields an object containing the filename  and filecontent, one at a time
 */
  * readBookDataApiMulter([...requestFileObject]) {
    const filenameAndPath = [];
    requestFileObject.forEach(requestFile =>
      filenameAndPath.push({ [requestFile.originalname]: requestFile.path }));

    for (const eachFilenameAndPath of filenameAndPath) {
      for ([this.filename, this.filepath] of Object.entries(eachFilenameAndPath)) {
        try {
          this.fileContent = Array.from(JSON.parse(fs.readFileSync(this.filepath, 'utf8')));
          fs.unlink(this.filepath, (err) => { if (err) { throw new Error('Error while deleting filecopy'); } });
          yield {
            filename: this.filename,
            fileContent: this.fileContent
          };
        } catch (e) {
          this.errors.push(new DataError('Invalid file', this.filename));
          fs.unlink(this.filepath, (err) => { if (err) { throw new Error('Error while deleting filecopy'); } });
        }
      }
    }
  }

  /**
   * Tokenize and create index for each word in the fileContent
   * @param {Object} fileContent - takes in the fileContent JSOn Array
   * @return {Object} - returns an object containing the tokenized words and their index
   */
  static tokenizeAndIndex(fileContent) {
    const Collection = {};
    for (const [index, newObject] of fileContent.entries()) {
      let titleTextArray = [];
      titleTextArray = titleTextArray.concat(InvertedIndex.sanitizeData(newObject.title));
      titleTextArray = titleTextArray.concat(InvertedIndex.sanitizeData(newObject.text));
      titleTextArray.forEach((word) => {
        if (Collection.hasOwnProperty(word)) {
          Collection[word] = Array.from(new Set(Collection[word].concat([index])));
        } else {
          Collection[word] = [index];
        }
      });
    }
    return Collection;
  }

  /**
   * Creates index by mapping each file to it's token and index collection
   * @param {Object} fileNameAndObject - takes in yielded filename and filepath
   * @return {Object} - assigns the entire mapped indexes to the created index property
   */
  createIndex(fileNameAndObject) {
    const mappedIndex = {};
    for (this.currentFile of fileNameAndObject) {
      if (this.validateFileContent(this.currentFile.fileContent, this.currentFile.filename)) {
        const tokenIndexCollection = InvertedIndex.tokenizeAndIndex(this.currentFile.fileContent);
        mappedIndex[this.currentFile.filename] = JSON.parse(JSON.stringify(tokenIndexCollection));
      }
      this.createdIndex = mappedIndex;
    }
  }

  /**
   * A method to sort the arguments supplied to search index
   * based on whether or not the filename is given
   * @param {Object} index - takes the index stored in the class property
   * @param {Array} filename - an optional argument stored in an array and used to filter words
   * @param {Array} allSearchQuery - takes an array containing all search query
   * @return {Object} - returns the index to be searched and all search query
   */
  static sortSearchIndexArguments(index, filename, allSearchQuery) {
    let indexParams, filenameParams, allSearchQueryParams;
    let indexToBeSearched = {};
    if (arguments['2'] === undefined) {
      indexToBeSearched = arguments['0']; filenameParams = undefined;
      allSearchQueryParams = arguments['1'];
    } else {
      indexParams = index; filenameParams = filename; allSearchQueryParams = allSearchQuery;
      for (const eachFilename of filenameParams) {
        if (indexParams.hasOwnProperty(eachFilename)) {
          Object.assign(indexToBeSearched, { [eachFilename]: indexParams[eachFilename] });
        }
      }
    }
    return {
      indexToBeSearched,
      allSearchQueryParams
    };
  }

/**
   * Tokenize each word in the search query and yields them one at a time
   * @param {Array} allSearchQuery - takes in an array containg all words to be searched
   * @return {String} - returns a string yielded one at a time
   */
  * tokenizeSearchQuery([...allSearchQuery]) {
    this.allSearchQuery = allSearchQuery.reduce((a, b) => a.concat(b), []);
    for (const query of this.allSearchQuery) {
      for (const newQuery of InvertedIndex.sanitizeData(query)) {
        yield newQuery;
      }
    }
  }

  /**
   * A method to search whole indexes or those that have been filtered by filename
   * @param {Object} index - takes the index stored in the class property
   * @param {Array} filename - an optional argument stored in an array and used to filter words
   * @param {Array} allSearchQuery - takes an array containing all search query
   * @return {Object} - returns the index to be searched and all search query
   */
  searchIndex(index, filename, allSearchQuery) {
    const queryResult = {};
    const sortedArguments = InvertedIndex.sortSearchIndexArguments(index, filename, allSearchQuery);

    const tokenizedQuery = this.tokenizeSearchQuery(sortedArguments.allSearchQueryParams);
    for (const uniqueQuery of tokenizedQuery) {
      const foundQuery = {};
      Object.entries(sortedArguments.indexToBeSearched).forEach((objectArray) => {
        const [currentFilename, indexedData] = objectArray;
        if (!indexedData.hasOwnProperty(uniqueQuery)) {
          return;
        }
        if (indexedData.hasOwnProperty(uniqueQuery)) {
          Object.assign(foundQuery, { [uniqueQuery]: indexedData[uniqueQuery] });
        }
        if (queryResult.hasOwnProperty(currentFilename)) {
          Object.assign(queryResult[currentFilename], foundQuery);
        } else {
          queryResult[currentFilename] = JSON.parse(JSON.stringify(foundQuery));
        }
      });
    }
    if (Object.keys(queryResult).length === 0) {
      this.searchResult = 'Search Query Not Found';
    } else {
      this.searchResult = queryResult;
    }
  }

/**
 * A method to validate file content and the errors encountered to an array to prevent code break
 * @param {JSONArray} data - the fileContent to be validated
 * @param {String} filename - the name of the file being validated
 * @return {Boolean} - returns true or false
 */
  validateFileContent(data, filename) {
    let hasErrors = false;
    if (data.length > 0 && data.some(i =>
      (JSON.stringify(i)[0]) !== '{' && JSON.stringify(i)[JSON.stringify(i).length - 1] !== '}')) {
      this.errors.push(new DataError('file is not a JSON array', filename));
      hasErrors = true;
    }

    if (!hasErrors && data.some(i =>
      JSON.stringify(i) === JSON.stringify({})) && Object.keys(data[0]).length === 0) {
      this.errors.push(new DataError('JSON object cannot be empty or contain empty objects', filename));
      hasErrors = true;
    }

    if (!hasErrors && data.some(i =>
      i.title === undefined || i.text === undefined)) {
      this.errors.push(new DataError('Bad JSON Array format', filename));
      hasErrors = true;
    }
    return !hasErrors;
  }

/**
 * A method to sanitize words passed into it. Removes symbols and splits on space(s) or tab
 * @param {String} data - takes in string to be sanitized
 * @return {String} - returns sanitized data
 */
  static sanitizeData(data) {
    return data.toLowerCase().replace(/[^a-z A-Z 0-9]+/g, '').split(/[\s]\s*/);
  }

}

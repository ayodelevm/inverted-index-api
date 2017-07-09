# inverted-index-api

[![Build Status](https://travis-ci.org/ayodelevm/inverted-index-api.svg?branch-master)](https://travis-ci.org/ayodelevm/inverted-index-api)  [![Codacy Badge](https://api.codacy.com/project/badge/Grade/46fccf17dc7348859ffdf87837a70234)](https://www.codacy.com/app/ayodelevm/inverted-index-api?utm_source-github.com&amp;utm_medium-referral&amp;utm_content-ayodelevm/inverted-index-api&amp;utm_campaign-Badge_Grade)  [![Coverage Status](https://coveralls.io/repos/github/ayodelevm/inverted-index-api/badge.svg?branch-master)](https://coveralls.io/github/ayodelevm/inverted-index-api?branch-master)

## Introduction
*  **`Inverted-Index-Api-Module`** is an Aplication developed with JavaScript/Node for implementing efficient search functionality for softwares.
  It has the following features;
  *  Upload Json files
  *  Create Index for multiple files at the same time
  *  Add more files to initially created index without overriding existing indexes;
  *  Search created indexes for word tokens;
  *  Filter out searches by filename or leave out the file name argument to return match for all indexed files;
  *  Handle file errors properly without breaking the code;

## Dependencies

### Back End Dependencies
*  This app's functionality depends on multiple NPM packages including;
  *  **[Express](https://www.npmjs.com/package/express)** - This framework enables robust routing and building web Applications and API's with focus on high performance. 
  *  **[Multer](https://www.npmjs.com/package/multer)** - A node.js middleware for handling multipart/form-data, which is primarily used for uploading files
  *  **[Body-Parser](https://www.npmjs.com/package/body-parser)** - This package parse incoming request bodies in a middleware and makes it available under *req.body* property
  *  **[Morgan](https://www.npmjs.com/package/morgan)** - A middleware that Logs HTTP requests
  *  **[Babel-Polyfill](https://www.npmjs.com/package/babel-polyfill)** - A package that emulates a full Es6 environement with a large amount of polyfills and generator runtime.
  *  **[dotenv](https://github.com/kennethreitz/autoenv)** - Enables loading environment variables from a .env file into process.env.

## Installation and setup
*  Navigate to a directory of choice on `terminal`.
*  Clone this repository on that directory.
  *  Using SSH;

    > git clone git@github.com:ayodelevm/inverted-index-api.git

  *  Using HTTPS;

    > git clone https://github.com/ayodelevm/inverted-index-api.git

*  Navigate to the repo's folder on your computer
  *  `cd inverted-index-api/`
*  Install the app's backend dependencies. 
  *  `npm install`

    > In order to use need to have __`nodeJs`__ and **`npm`** installed on your system.
    > In other to interact effectively with endpoints, install and use __`Postman`__

* Run the app
  *  `npm start`
  *  Running the command above will run the app at localhost:3000.

## Usage

The Inverted-Index-Api-Module enables you to create index for words in a JSON Array and search the index.

### Routes

name   |     url       |      verb      |     description
------ | ------------- | -------------- | -------------------
CREATE     |  /api/create     |     POST     |     Recieves the files to be indexed processes it's and sends back a JSON object containing the index or appropriate error message (where applicable)
SEARCH     |    /api/search   |    POST      |    Recieves the search query, and an optional filename argument to restrict search to particular file(s) and returns the search result 

### Right JSON file format
File must be a JSON file, following the right JSON object format. Each object must contain title and text keys only. Below is an exmple of an imaginary 'book-one.json": 

```
[{
  "title": "In not of",
  "text": "memoirs of the night"
},
{
  "title": "Alice of wonderland",
  "text": "Alice falls, guess what follows..."
}]
```
    > NB: Other file types will be flagged as invalid...

### Creating and displaying created
Assuming a JSON file "book-one.json" contain the JSON Array in the above example, the file is uploaded and sent through a post request. The request is processed and a response is sent back. upload files using `allFiles` as key. Multiple file must have the same key. The post request will return:

```
{
  "processedFiles": {
    "book-one.json": {
      "alice": [1],
      "falls":[1],
      "in": [0, 1],
      "memoirs": [0],
      "guess": [0],
      "of": [0, 1],
      "night": [0],
      "what": [1],
      "follows": [1],
      "not": [0]
    }
  },
  "fileErrors": []
}
```
    > Uploading an invalid file, file with errors or bad formatted files will genrate an error that would be stored in the fileErrors array.
    > If while uploading multiple files, an invalid file is uploaded along, the valid ones will be processed and the invalid ones will be filtered out with their names and errors stored in the fileErrors array.
  
### Searching the Index
The search index route recieves a key/value pair containing the `searchTerms` and an optional `fileName` argument. searchTerms and fileName values must be inside an array. For example:
```
{
  searchTerms: ["follows", "not", ["night"]],
  fileName: ["book-one.json"]
}
```
and
```
{
  searchTerm: ["follows", "not", ["night"]]
}
```
    > Are both valid calls. The former will filter searches by filename for multiple files while the latter will search all files in the index.
Expected result would be:
```
{
    "book-one.json": {
      "follows": [1],
      "not":[1],
      "night": [0, 1],
    }
}
```
    > Creating and posting can be tested using postman.

    > To test using Postman:
    > Creating index is to be done using form-data. The key to be used is 'allFiles', after which, single or multiple files can be uploaded and sent through the post route, to get the created indexes for the uploaded files.
    > Searching created index can be done through the body section, after selecting the JSON(application/json) option. The searchTerm and optional fileName is sent through a post route, to get the search result.


## Tests
*  The tests have been written using Jasmine-node **[TestCase](https://github.com/mhevery/jasmine-node)** and Supertest **[TestCase](https://www.npmjs.com/package/supertest)** class.
*  They are run using the **`coverage`** tool in order to generate test coverage reports.
*  To run the tests, navigate to the project's folder and open
*  Issue the following command on terminal.
  *  `gulp run-tests`
* To view coverage, issue the following command on the terminal.
  * `gulp coverage`
*  If the tests are successful, they will complete without failures or errors.


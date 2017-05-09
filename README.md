# inverted-index-api

[![Coverage Status](https://coveralls.io/repos/github/ayodelevm/inverted-index-api/badge.svg)](https://coveralls.io/github/ayodelevm/inverted-index-api)  [![Build Status](https://travis-ci.org/ayodelevm/inverted-index-api.svg?branch=develop)](https://travis-ci.org/ayodelevm/inverted-index-api)  [![Codacy Badge](https://api.codacy.com/project/badge/Grade/46fccf17dc7348859ffdf87837a70234)](https://www.codacy.com/app/ayodelevm/inverted-index-api?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ayodelevm/inverted-index-api&amp;utm_campaign=Badge_Grade)

## Introduction
*  **`Inverted-Index-Api`** is an Aplication developed with JavaScript/Node for implementing efficient search functionality for softwares.
*  It has the following features;
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

    >`git clone git@github.com:ayodelevm/inverted-index-api.git`

  *  Using HTTPS;

    >`https://github.com/ayodelevm/inverted-index-api.git`

*  Navigate to the repo's folder on your computer
  *  `cd inverted-index-api/`
*  Install the app's backend dependencies. 
  *  `npm install`

    >In order to use need to have **nodeJs** and **npm** installed on your system.
    >In other to interact effectively with endpoints, install and use **Postman**

* Run the app
  *  `npm start`
  *  Running the command above will run the app at localhost://3000.

## Tests
*  The tests have been written using Jasmine-node **[TestCase](https://github.com/mhevery/jasmine-node)** and Supertest**[TestCase](https://www.npmjs.com/package/supertest)** class.
*  They are run using the **`coverage`** tool in order to generate test coverage reports.
*  To run the tests, navigate to the project's folder and open
*  Issue the following command on terminal.
  *  `gulp run-tests`
* To view coverage, issue the following command on the terminal.
  * `gulp coverage`
*  If the tests are successful, they will complete without failures or errors.


'use strict';

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _gulpJasmineNode = require('gulp-jasmine-node');

var _gulpJasmineNode2 = _interopRequireDefault(_gulpJasmineNode);

var _gulpCoveralls = require('gulp-coveralls');

var _gulpCoveralls2 = _interopRequireDefault(_gulpCoveralls);

var _gulpBabel = require('gulp-babel');

var _gulpBabel2 = _interopRequireDefault(_gulpBabel);

var _gulpBabelIstanbul = require('gulp-babel-istanbul');

var _gulpBabelIstanbul2 = _interopRequireDefault(_gulpBabelIstanbul);

var _gulpInjectModules = require('gulp-inject-modules');

var _gulpInjectModules2 = _interopRequireDefault(_gulpInjectModules);

var _babelPresetEs2015Node = require('babel-preset-es2015-node5');

var _babelPresetEs2015Node2 = _interopRequireDefault(_babelPresetEs2015Node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import nodemon from 'gulp-nodemon';
require('dotenv').config();
// Run app server
/* gulp.task('serve', () =>
  nodemon({
    script: 'index.js',
    ext: 'js html',
    env: { NODE_ENV: process.env.NODE_ENV }
  })
);*/

// import istanbulReport from 'gulp-istanbul-report';
/* eslint linebreak-style: ["error", "windows"]*/

_gulp2.default.task('transpile', function () {
  _gulp2.default.src(['./src/*.js', './tests/*.js', './*.js']).pipe((0, _gulpBabel2.default)({
    presets: [_babelPresetEs2015Node2.default]
  })).pipe(_gulp2.default.dest('dist/'));
});

// Run tests
_gulp2.default.task('run-test', ['transpile'], function () {
  _gulp2.default.src(['dist/inverted-index-testSpec.js']).pipe((0, _gulpJasmineNode2.default)());
});

_gulp2.default.task('cover', function () {
  _gulp2.default.src('tests/inverted-index-testSpec.js').pipe((0, _gulpBabel2.default)()).pipe((0, _gulpInjectModules2.default)()).pipe((0, _gulpJasmineNode2.default)()).pipe(_gulpBabelIstanbul2.default.writeReports());
});
// Generate coverage report
_gulp2.default.task('coverage', function () {
  _gulp2.default.src(['dist/inverted-index.js']).pipe((0, _gulpBabelIstanbul2.default)()).pipe((0, _gulpInjectModules2.default)()).on('finish', function () {
    _gulp2.default.src('tests/inverted-index-testSpec.js').pipe((0, _gulpBabel2.default)({ presets: [_babelPresetEs2015Node2.default] })).pipe((0, _gulpInjectModules2.default)()).pipe((0, _gulpJasmineNode2.default)()).pipe(_gulpBabelIstanbul2.default.writeReports()).pipe(_gulpBabelIstanbul2.default.enforceThresholds({ thresholds: { global: 50 } })).on('end', function () {
      _gulp2.default.src('coverage/lcov.info').pipe((0, _gulpCoveralls2.default)());
    });
  });
});
// Load code coverage to coveralls


_gulp2.default.task('default', ['transpile', 'run-test', 'coverage']);
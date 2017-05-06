/* eslint linebreak-style: ["error", "windows"]*/

import gulp from 'gulp';
// import nodemon from 'gulp-nodemon';
import jasmineNode from 'gulp-jasmine-node';
// import istanbulReport from 'gulp-istanbul-report';
import gulpCoveralls from 'gulp-coveralls';
import babel from 'gulp-babel';
import gulpBabelIstanbul from 'gulp-babel-istanbul';
import injectModules from 'gulp-inject-modules';
import es2015Preset from 'babel-preset-es2015-node5';

require('dotenv').config();
// Run app server
/* gulp.task('serve', () =>
  nodemon({
    script: 'index.js',
    ext: 'js html',
    env: { NODE_ENV: process.env.NODE_ENV }
  })
);*/

gulp.task('transpile', () => {
  gulp.src(['./src/*.js', './tests/*.js', './*.js'])
    .pipe(babel({
      presets: [es2015Preset]
    }))
    .pipe(gulp.dest('dist/'));
});


// Run tests
gulp.task('run-test', ['transpile'], () => {
  gulp.src(['dist/inverted-index-testSpec.js'])
    .pipe(jasmineNode());
});

gulp.task('cover', () => {
  gulp.src('tests/inverted-index-testSpec.js')
      .pipe(babel())
      .pipe(injectModules())
      .pipe(jasmineNode())
      .pipe(gulpBabelIstanbul.writeReports());
});
// Generate coverage report
gulp.task('coverage', () => {
  gulp.src(['dist/inverted-index.js'])
    .pipe(gulpBabelIstanbul())
    .pipe(injectModules())
    .on('finish', () => {
      gulp.src('tests/inverted-index-testSpec.js')
      .pipe(babel({ presets: [es2015Preset] }))
      .pipe(injectModules())
      .pipe(jasmineNode())
      .pipe(gulpBabelIstanbul.writeReports())
      .pipe(gulpBabelIstanbul.enforceThresholds({ thresholds: { global: 50 } }))
      .on('end', () => {
        gulp.src('coverage/lcov.info')
        .pipe(gulpCoveralls());
      });
    });
});
// Load code coverage to coveralls


gulp.task('default', ['transpile', 'run-test', 'coverage']);


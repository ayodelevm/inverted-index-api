/* eslint linebreak-style: ["error", "windows"]*/

import gulp from 'gulp';
import jasmineNode from 'gulp-jasmine-node';
import istanbulReport from 'gulp-istanbul-report';
import babel from 'gulp-babel';
// import nodemon from 'gulp-nodemon';
// import istanbul from 'istanbul';
// import injectModules from 'gulp-inject-modules';

const coverageFile = './coverage/coverage.json';

gulp.task('transpile', () => {
  gulp.src(['./src/*.js', './tests/*.js', './*.js'])
    .pipe(babel({ ignore: 'gulpfile.babel.js' }))
    .pipe(gulp.dest('./dist'));
});


gulp.task('watch', () => {
  gulp.watch('./dist/*.js', []);
});
/*
gulp.task('test', () => {
  gulp.src(['./dist/inverted-index-testSpec.js'])
    .pipe(jasmineNode({
      timeout: 10000,
      includeStackTrace: false,
      color: true
    }))
    .on('finish', () => {
      gulp.src(coverageFile)
        .pipe(istanbulReport());
    });
});*/

gulp.task('test', ['transpile'], () => {
  gulp.src(['./dist/inverted-index-testSpec.js'])
  .pipe(jasmineNode({
    timeout: 10
  }));
});

/*
gulp.task('start', () => {
  nodemon({
    script: 'lib/inverted-index.js',
    env: { NODE_ENV: 'DEV' }
  });
});

gulp.task('coverage', (cb) => {
  gulp.src('lib/inverted-index.js')
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', () => {
      gulp.src('tests/inverted-index-testSpec.js')
      .pipe(babel())
      .pipe(injectModules())
      .pipe(jasmineNode())
      .pipe(istanbul.writeReports())
      .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }))
      .on('end', cb);
    });
});

gulp.task('travis', ['build', 'testServerJS'], () => {
  process.exit(0);
});

gulp.task('default', ['transpile', 'watch', 'test', 'start']);
*/
gulp.task('default', ['test']);

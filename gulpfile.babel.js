import gulp from 'gulp';
import nodemon from 'gulp-nodemon';
import jasmineNode from 'gulp-jasmine-node';
import gulpCoveralls from 'gulp-coveralls';
import babel from 'gulp-babel';
import gulpBabelIstanbul from 'gulp-babel-istanbul';
import injectModules from 'gulp-inject-modules';
import es2015Preset from 'babel-preset-es2015-node5';
import dotenv from 'dotenv';
import exit from 'gulp-exit';

dotenv.config();

gulp.task('transpile', () => {
  gulp.src('./app.js')
    .pipe(babel({
      presets: [es2015Preset]
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('run-tests', () => {
  gulp.src(['tests/*.js'])
    .pipe(babel())
    .pipe(jasmineNode())
    .pipe(exit());
});

gulp.task('serve', ['transpile'], () =>
  nodemon({
    script: 'dist/app.js',
    ext: 'js',
    env: { NODE_ENV: process.env.NODE_ENV }
  })
);

gulp.task('coverage', (cb) => {
  gulp.src(['src/inverted-index.js', './app.js'])
    .pipe(gulpBabelIstanbul())
    .pipe(injectModules())
    .on('finish', () => {
      gulp.src('tests/*.js')
      .pipe(babel({ presets: [es2015Preset] }))
      .pipe(injectModules())
      .pipe(jasmineNode())
      .pipe(gulpBabelIstanbul.writeReports())
      .pipe(gulpBabelIstanbul.enforceThresholds({ thresholds: { global: 50 } }))
      .on('end', cb)
      .pipe(exit());
    });
});

gulp.task('coveralls', ['coverage'], () => {
  if (!process.env.CI) {
    return;
  }
  return gulp.src('coverage/lcov.info')
    .pipe(gulpCoveralls());
});


gulp.task('default', ['run-tests', 'coveralls']);

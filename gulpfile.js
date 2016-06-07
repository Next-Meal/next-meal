/* eslint-disable no-unused-vars */
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const livereload = require('gulp-livereload');
const protractor = require('gulp-protractor').protractor;
const html = require('html-loader');
const webpack = require('webpack-stream');
const neat = require('node-neat').includePaths;

var files = ['lib/**/*.js', 'models/**/*.js', 'routes/**/*.js',
                 '_server.js', 'gulpfile.js', 'index.js', 'server.js'];
var appFiles = 'app/**/*.js';
var testFiles = 'test/**/*.js';
var staticFiles = ['./app/**/*.html', './app/**/*.jpg', './app/**/*.svg', './app/**/*.png'];

gulp.task('lint:files', () => {
  return gulp.src(files)
    .pipe(eslint({
      useEslintrc: true
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('lint:browser', () => {
  return gulp.src(appFiles)
    .pipe(eslint({
      'env': {
        'browser': true,
        'jasmine': true,
        'protractor': true
      }
    }))
    .pipe(eslint.format());
});

gulp.task('lint:test', () => {
  return gulp.src(testFiles)
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('sass', () => {
  return gulp.src('./app/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: ['sass'].concat(neat)
    }).on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build'));
});

gulp.task('webpack:dev', () => {
  return gulp.src('app/js/entry.js')
    .pipe(webpack({
      devtool: 'source-map',
      output: {
        filename: 'bundle.js'
      }
    }))
    .pipe(gulp.dest('./build'));
});

gulp.task('webpack:test', () => {
  return gulp.src('test/unit/test_entry.js')
    .pipe(webpack({
      devtool: 'source-map',
      output: {
        filename: 'bundle.js'
      },
      module: {
        loaders: [
          {
            test: /\.html$/,
            loader: 'html'
          }
        ]
      }
    }))
    .pipe(gulp.dest('./test'));
});

gulp.task('static:dev', () => {
  return gulp.src(staticFiles)
    .pipe(gulp.dest('./build'));
});

gulp.task('test', () => {
  return gulp.src('test/**/*.js')
    .pipe(mocha({
      reporter: 'spec'
    }));
});

gulp.task('develop', () => {
  nodemon({
    script: 'server.js',
    ext: 'js',
    tasks: ['lint', 'test']
  })
  .on('restart', () => {
    process.stdout.write('Server restarted!\n');
  });
});

var nodemonOptions = {
  script: 'server.js',
  ext: 'html scss js',
  ignore: ['build/'],
  tasks: ['build', 'lint', 'webpack:dev']
};

gulp.task('watch', ['build', 'lint', 'webpack:dev'], () => {
  livereload.listen();
  nodemon(nodemonOptions).on('restart', () => {
    gulp.src('server.js')
      .pipe(livereload());
    console.log('restarted');
  });
});

gulp.task('lint', ['lint:test', 'lint:browser', 'lint:files']);
gulp.task('build', ['static:dev', 'sass']);
gulp.task('default', ['build', 'lint', 'test']);

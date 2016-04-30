
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const eslint = require('gulp-eslint');

var files = ['gulpfile.js'];
var testFiles = ['./test/**/*.js'];

gulp.task('lint', () => {
  return gulp.src(files, testFiles)
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('test', () => {
  return gulp.src(testFiles)
    .pipe(mocha({ report: 'nyan' }));
});

gulp.task('watch', () => {
  gulp.watch(files, testFiles, ['default']);
});

gulp.task('default', ['lint', 'test']);

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');

var lintFiles = ['lib/**/*.js', 'models/**/*.js', 'routes/**/*.js', 'test/**/*.js',
                 '_server.js', 'gulpfile.js', 'index.js', 'server.js'];
var testFiles = ['lib/**/*.js', 'models/**/*.js', 'routes/**/*.js', 'test/**/*.js',
                 '_server.js', 'server.js'];

gulp.task('lint', () => {
  return gulp.src(lintFiles)
    .pipe(eslint({
      useEslintrc: true
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
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

gulp.task('watch', () => {
  gulp.watch(lintFiles, ['lint']);
  gulp.watch(testFiles, ['test']);
});

gulp.task('default', ['lint', 'test']);

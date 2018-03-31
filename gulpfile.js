// npm install --save gulp
// npm install --save-dev gulp-clean-css
// npm install --save-dev gulp-minify
// npm install --save sharp
// brew install homebrew/science/vips --with-webp --with-graphicsmagick
// npm install --save-dev gulp-responsive
// npm install --save-dev gulp-watch
// npm install --save-dev del
// npm init -y

var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css');
var minify = require('gulp-minify');
var responsive = require('gulp-responsive');
var del = require('del');
var watch = require('gulp-watch');

function clean() {
  console.log('Cleaning dist directory.');
  return del([
    'dist/*.css',
    'dist/*.js'
  ]);
}

function minifyCss() {
  console.log('Minifing CSS styles.');
  return gulp.src('css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist'));
}

function compressJs() {
  console.log('Compressing JavaScript scripts.');
  gulp.src('js/*.js')
    .pipe(minify({
        ext:{
            src:'-debug.js',
            min:'.js'
        },
        exclude: ['tasks'],
        ignoreFiles: ['.combo.js', '-min.js']
    }))
    .pipe(gulp.dest('dist'))
}

function responsive() {
  console.log('Making responsive images.');
  return gulp.src('img/*.{png,jpg}')
    .pipe(responsive({
      'background-*.jpg': {
        width: 700,
        quality: 50
      },
      'logo.png': [
        {
          width: 200
        },{
          width: 200 * 2,
          rename: 'logo@2x.png'
        }
      ]
    }))
    .pipe(gulp.dest('dist'));
}

// gulp.task('watch', ...);

gulp.task('minifyCss', minifyCss);
gulp.task('compressJs', compressJs);
gulp.task('clean', clean);
gulp.task('responsive', responsive);

gulp.task('default', ['clean', 'minifyCss', 'compressJs']);

gulp.task('watch', function () {
    watch('js/*.js', function() {
      clean();
      minifyCss();
      compressJs();
    });
});

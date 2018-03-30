// npm install --save gulp
// npm install --save-dev gulp-clean-css
// npm install --save-dev gulp-minify
// npm install --save sharp
// brew install homebrew/science/vips --with-webp --with-graphicsmagick
// npm install --save-dev gulp-responsive
// npm init -y

var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css');
var minify = require('gulp-minify');
var responsive = require('gulp-responsive');

gulp.task('minify-css', () => {
  return gulp.src('css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('compress-js', function() {
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

    gulp.src('service-worker.js')
      .pipe(minify({
          ext:{
              src:'-debug.js',
              min:'.js'
          },
          exclude: ['tasks'],
          ignoreFiles: ['.combo.js', '-min.js']
      }))
    .pipe(gulp.dest('dist'))
});

gulp.task('responsive', function () {
  return gulp.src('img/*.{png,jpg}')
    .pipe(responsive({
      'background-*.jpg': {
        width: 700,
        quality: 50
      },
      // 'cover.png': {
      //   width: '50%',
      //   format: 'jpeg',
      //   rename: 'cover.jpg'
      // },
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
});

// gulp.task('watch', ...);

gulp.task('default', defaultTask);

function defaultTask(done) {
  done();
}

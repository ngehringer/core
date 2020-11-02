const del = require('del');
const gulp = require('gulp');


const DESTINATION_PATH = './dist';
const SOURCE_PATH = './src';

function clean() {
  // remove everything in the destination folder
  return del(`${DESTINATION_PATH}/**`);
}

function packageJavaScript() {
  return gulp
    // copy the JavaScript files in the source folder …
    .src(`${SOURCE_PATH}/**/*.js`)
    .pipe(
      // … and output in the destination folder
      gulp.dest(`${DESTINATION_PATH}/`)
    )
  ;
}


exports.build = gulp.series(
  clean,
  gulp.parallel(
    packageJavaScript
  )
);
// Ścieżka do aktualnie wykonywanego zadania
const entryPath = "Chimney";

const gulp = require("gulp");
const sass = require("gulp-sass");
sass.compiler = require("sass");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const del = require("del");
const sequence = require("run-sequence");

function compileSass(done) {
  gulp
    .src(entryPath + "/scss/main.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(entryPath + "/css"));

  done();
}

function watcher(done) {
  browserSync.init({
    server: "./" + entryPath,
  });

  gulp.watch(entryPath + "/scss/**/*.scss", gulp.series(compileSass, reload));
  gulp.watch(entryPath + "/*.html", gulp.series(reload));

  done();
}

function reload(done) {
  browserSync.reload();
  done();
}

gulp.task("clean", function () {
  return del(["dist"]);
});

gulp.task("build", function (callback) {
  sequence("html", "scss", "task-three", callback);
});

exports.sass = gulp.parallel(compileSass);
exports.default = gulp.parallel(compileSass, watcher);

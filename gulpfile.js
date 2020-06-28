let project_folder = "dist"; // папка с готовыми к выгрузке файлами
let sourse_folder = "_src"; // папка с исходными файлами

let path = {
  build: {
    // пути для сборки
    html: project_folder + "/",
    css: project_folder + "/css/",
    js: project_folder + "/js/",
    img: project_folder + "/img/",
    fonts: project_folder + "/fonts/",
  },
  src: {
    // пути для исходников
    html: [sourse_folder + "/*.html", "!" + sourse_folder + "/_*.html"],
    css: sourse_folder + "/scss/style.scss",
    js: sourse_folder + "/js/script.js",
    img: sourse_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
    fonts: sourse_folder + "/fonts/*.ttf",
  },
  watch: {
    // пути для отслеживания
    html: sourse_folder + "/**/*.html",
    css: sourse_folder + "/scss/**/*.scss",
    js: sourse_folder + "/js/**/*.js",
    img: sourse_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
  },
  clean: "./" + project_folder + "/", // путь для очистки сборки перед новой сборкой
};

let { src, dest } = require("gulp"),
  gulp = require("gulp"),
  browsersync = require("browser-sync").create();
(fileinclude = require("gulp-file-include")),
  (del = require("del")),
  (scss = require("gulp-sass")),
  (autoprefixer = require("gulp-autoprefixer")),
  (group_media = require("gulp-group-css-media-queries")),
  (clean_css = require("gulp-clean-css"));

function browserSync(params) {
  browsersync.init({
    server: {
      baseDir: "./" + project_folder + "/", // путь основной директории для browsersync
    },
    port: 3000,
    notify: false, // отключение сообщений об обновлении страницы
  });
}

function html() {
  return src(path.src.html)
    .pipe(fileinclude())
    .pipe(dest(path.build.html)) // собрать новый html
    .pipe(browsersync.stream()); // обновить браузер
}

function css(params) {
  return src(path.src.css)
    .pipe(
      scss({
        outputStyle: "expanded",
      })
    )
    .pipe(group_media())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 5 versions"],
        cascade: true,
      }).pipe(clean_css())
    )
    .pipe(dest(path.build.css)) // собрать новый css
    .pipe(browsersync.stream()); // обновить браузер
}

function watchFiles(params) {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
}

function clean(params) {
  return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(css, html));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;

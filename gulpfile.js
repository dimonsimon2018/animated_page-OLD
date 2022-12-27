// Импорт пакетов
const gulp = require('gulp')
const less = require('gulp-less')
const stylus = require('gulp-stylus')
const sass = require('gulp-sass')(require('sass'))
const rename = require('gulp-rename')
const cleanCSS = require('gulp-clean-css')
const ts = require('gulp-typescript')
//const coffee = require('gulp-coffee')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const imagemin = require('gulp-imagemin')
const webp = require('gulp-webp');
let webphtml = require('gulp-webp-html-nosvg');
const htmlmin = require('gulp-htmlmin')
const size = require('gulp-size')
//const gulppug = require('gulp-pug')
const newer = require('gulp-newer')
const browsersync = require('browser-sync').create()
const del = require('del')
const fileinclude = require('gulp-file-include');
const fs = require('fs'); // плагин для работы с файловой системой (уже на борту)
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');
// Пути исходных файлов src и пути к результирующим файлам dest
const paths = {
  html: {
    src: ['src/*.html', 'src/*.pug'],
    srcForWach: 'src/**/*.html',
    dest: 'dest/'
  },
  styles: {
    src: ['src/styles/**/*.sass', 'src/styles/**/*.scss', 'src/styles/**/*.styl', 'src/styles/**/*.less', 'src/styles/**/*.css'],
    dest: 'dest/css/'
  },
  scripts: {
    src: ['src/scripts/*.coffee', 'src/scripts/*.ts', 'src/scripts/modules/*.js', 'src/scripts/*.js'],
    srcForWach: ['src/scripts/**/*.coffee', 'src/scripts/**/*.ts', 'src/scripts/**/*.js'],
    dest: 'dest/js/'
  },
  images: {
    src: 'src/img/**/*.{jpg,jpeg,png,gif,webp}',
    svgSrc: 'src/img/**/*.svg',
    dest: 'dest/img/',
    srcForWatch: 'src/img/**/*.{jpg,jpeg,png,gif,webp,svg}'
  },
  fonts: {
    src: 'src/fonts/',
    scssSrc: 'src/styles/fonts.scss',
    dest: 'dest/fonts/'
  },
}

// Очистить каталог dest, удалить все кроме изображений
function clean() {
  return del(['dest/*', '!dest/img'])
}

// Обработка html и pug
function html() {
  return gulp.src(paths.html.src)
    //.pipe(gulppug())
    .pipe(fileinclude())
    .pipe(webphtml())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(size({
      showFiles: true
    }))

    .pipe(gulp.dest(paths.html.dest))
    .pipe(browsersync.stream())
}

// Обработка препроцессоров стилей
function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    //.pipe(less()) // не используется
    //.pipe(stylus()) // не используется
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false
    }))
    // раскомментировать если нужен не сжатый дубликат файлов стилей
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(rename({
      basename: 'style',
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(size({
      showFiles: true
    }))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browsersync.stream())
}

// Обработка Java Script, Type Script и Coffee Script
function scripts() {
  return gulp.src(paths.scripts.src)
    .pipe(sourcemaps.init())
    //.pipe(coffee({bare: true})) // не используется
    /*
    .pipe(ts({ // не используется
      noImplicitAny: true,
      outFile: 'main.min.js'
    }))
    */
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(size({
      showFiles: true
    }))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browsersync.stream())
}

// Сжатие изображений
function img() {
  return gulp.src(paths.images.src)
    .pipe(newer(paths.images.dest))
    .pipe(webp())
    .pipe(gulp.dest(paths.images.dest))
    .pipe(gulp.src(paths.images.src))
    .pipe(newer(paths.images.dest))
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      interlaced: true,
      optimizationlevel: 3 // 0 to 7
    }))

    .pipe(gulp.dest(paths.images.dest))
    .pipe(gulp.src(paths.images.svgSrc))
    .pipe(gulp.dest(paths.images.dest))
    .pipe(browsersync.stream())
}
// Работа со шрифтами
function otfToTtf() {
  return gulp.src(`${paths.fonts.src}/*.otf`)
    .pipe(fonter({
      formats: ['ttf'],
    }))
    .pipe(gulp.dest(paths.fonts.src))
}
function ttfToWoff() {
  return gulp.src(`${paths.fonts.src}/*.ttf`)
    .pipe(fonter({
      formats: ['woff'],
    }))
    // Выгружаем в папку с результатом
    .pipe(gulp.dest(paths.fonts.dest))
    // Ищем файлы шрифтов .ttf
    .pipe(gulp.src(`${paths.fonts.src}/*.ttf`))
    // Конвертируем в .woff2
    .pipe(ttf2woff2())
    // Выгружаем в папку с результатом
    .pipe(gulp.dest(paths.fonts.dest))
}
function fontsStyle() {
  // файл стилей для подключения шрифтов
  let fontsFile = paths.fonts.scssSrc;
  // проверяем существует ли файлы шрифтов
  fs.readdir(paths.fonts.dest, function (err, fontsFiles) {
    if (fontsFiles) {
      // Проверяем существует ли файл стилей для подключения шрифтов
      if (!fs.existsSync(fontsFile)) {
        // Если файла нет, создаем его
        fs.writeFile(fontsFile, '', (err) => {
          if (err)
            console.log(err);
          else {
            console.log("Файл scss/fonts.scss создан...");
            //  console.log("The written has the following contents:");
            //  console.log(fs.readFileSync("books.txt", "utf8"));
          }
        });
        //console.log('Создаем файл шрифтов...');
        let newFileOnly;
        for(var i = 0; i<fontsFiles.length; i++) {
          let fontFileName = fontsFiles[i].split('.')[0];
         if(newFileOnly !==fontFileName){
          let fontName = fontFileName.split('-')[0] ? fontFileName.split('-')[0] : fontFileName;
          let fontWeight = fontFileName.split('-')[1] ? fontFileName.split('-')[1] : fontFileName;
          let fontStyle;
          // Шрифты Normal
          // Формат записи должен быть в формате "Fontname-Fontweight"
          if(fontWeight.toLowerCase() === 'thin'){
            fontWeight = 100;
            fontStyle = 'normal';
          } else if(fontWeight.toLowerCase() === 'extralight'){
            fontWeight = 200;
            fontStyle = 'normal';
          }else if(fontWeight.toLowerCase() === 'light'){
            fontWeight = 300;
            fontStyle = 'normal';
          }else if(fontWeight.toLowerCase() === 'regular'){
            fontWeight = 400;
            fontStyle = 'normal';
          }else if(fontWeight.toLowerCase() === 'medium'){
            fontWeight = 500;
            fontStyle = 'normal';
          }else if(fontWeight.toLowerCase() === 'semibold'){
            fontWeight = 600;
            fontStyle = 'normal';
          }else if(fontWeight.toLowerCase() === 'bold'){
            fontWeight = 700;
            fontStyle = 'normal';
          }else if(fontWeight.toLowerCase() === 'extrabold'){
            fontWeight = 800;
            fontStyle = 'normal';
          }else if(fontWeight.toLowerCase() === 'black'){
            fontWeight = 900;
            fontStyle = 'normal';
          }
          // Шрифты Italic
           // Формат записи должен быть в формате "Fontname-FontweightItalic"
           else if(fontWeight.toLowerCase() === 'thinitalic'){
            fontWeight = 100;
            fontStyle = 'italic';
          } else if(fontWeight.toLowerCase() === 'extralightitalic'){
            fontWeight = 200;
            fontStyle = 'italic';
          }else if(fontWeight.toLowerCase() === 'lightitalic'){
            fontWeight = 300;
            fontStyle = 'italic';
          }else if(fontWeight.toLowerCase() === 'italic'){
            fontWeight = 400;
            fontStyle = 'italic';
          }else if(fontWeight.toLowerCase() === 'mediumitalic'){
            fontWeight = 500;
            fontStyle = 'italic';
          }else if(fontWeight.toLowerCase() === 'semibolditalic'){
            fontWeight = 600;
            fontStyle = 'italic';
          }else if(fontWeight.toLowerCase() === 'bolditalic'){
            fontWeight = 700;
            fontStyle = 'italic';
          }else if(fontWeight.toLowerCase() === 'extrabolditalic'){
            fontWeight = 800;
            fontStyle = 'italic';
          }else if(fontWeight.toLowerCase() === 'blackitalic'){
            fontWeight = 900;
            fontStyle = 'italic';
          }
          // иначе назначаем стандартный
          // Формат записи должен быть любым
          else{
            fontWeight = 400;
            fontStyle = 'normal';
          }
          fs.appendFile(fontsFile,
            `@font-face {
              font-family: '${fontName}';
              font-display: swap;
              src: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");
              font-weight: ${fontWeight};
              font-style: ${fontStyle};
            } \r\n`, (err) => {
          if (err)
            console.log(err);
          else {
            console.log(`Шрифт ${fontName} с fontweight ${fontWeight} fontstyle ${fontStyle} записан в файл scss/fonts.scss`);
            //  console.log("The written has the following contents:");
            //  console.log(fs.readFileSync("books.txt", "utf8"));
          }
        });
            newFileOnly = fontFileName;
         }
        }
      } else{
         console.log("Файл scss/fonts.scss уже существует. Для обновления файла нужно его удалить.");
      }
    }
  });
  return gulp.src('src/');
  // function cb() { }
}

const fonts = gulp.series(otfToTtf, ttfToWoff, fontsStyle);

// Отслеживание изменений в файлах и запуск лайв сервера
function watch() {
  browsersync.init({
    server: {
      baseDir: "./dest"
    }
  })
  gulp.watch(paths.html.dest).on('change', browsersync.reload)
  gulp.watch(paths.html.srcForWach, html)
  gulp.watch(paths.styles.src, styles)
  gulp.watch(paths.scripts.srcForWach, scripts)
  gulp.watch(paths.images.srcForWatch, img)
}

// Таски для ручного запуска с помощью gulp clean, gulp html и т.д.
exports.clean = clean

exports.html = html
exports.styles = styles
exports.scripts = scripts
exports.img = img
//exports.fonts = fontsStyle
exports.watch = watch

// Таск, который выполняется по команде gulp
exports.default = gulp.series(clean, fonts, html, gulp.parallel(styles, scripts, img), watch)
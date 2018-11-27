// Importación de los módulos de npm que queremos utilizar.
var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
// var uglify = require('gulp-uglify-es');
//var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

// Definimos un variable para las rutas.
var paths = {
  sass: ['./scss/**/*.scss']
};

// Definición de tareas.
// Gulp basa su trabajo en el módulo de "gulp".
// Este módulo trae 4 métodos:
// 1. task
//  Define una tarea. Pueden definir tantas tareas como quieran.
// 2. src
//  Lee el contenido de uno o más archivos. Todo se levanta en _memoria_.
// 3. dest
//  Guarda el stream de la memoria en disco en la ruta especificada por 
//  parámetro.
// 4. watch
//  Permite pedirle a gulp que "observe" ciertos archivos por cambios. Y que
//  cuando alguno ocurra, automágicamente ejecute alguna tarea.


gulp.task('default', ['sass']);

// Creamos nuestra tarea para unificar _todos_ los JS en uno solo.
// Para correrla, en la carpeta donde esté el gulpfile.js, ejecutamos
//  gulp <nombre-tarea>
// Ej:
//  gulp js
gulp.task('js', function(done) {
    // Leemos todos los archivos de JS.
    // Nota: "**" significan "todos los subdirectorios".
    gulp.src(['./www/js/*.js', './www/js/**/*.js'])
    // Para unirlos, vamos a llamar al módulo "concat", que tiene esa 
    // funcionalidad. Para eso, usamos la metodología de "pipes".
    // "pipe" significa 'tubería' o 'cañería'. Es algo que se utiliza mucho
    // en sistemas, por ejemplo, en líneas de comando como Unix/Linux/cmd.
    // La idea es utilizar la "salida" (output) de una instrucción como entrada
    // de la siguiente. En gulp, tenemos el método "pipe" para esto.
      .pipe(concat('bundle.js'))
      // Ya con eso tenemos todos los JS en un único archivo, en _memoria_.
      // Así que por último, lo queremos guardar en disco. Antes, lo renombramos
      // a ese "stream" usando el módulo de rename.
      // .pipe(rename())
      // Por último, lo guardamos en disco.
      .pipe(gulp.dest('./www/dist/js/'))
      .on('end', done);
});

// Creamos una tarea para "watchear" nuestros js por cambios.
gulp.task('js:watch', ['js'], function() {
  // El primer parámetro son los archivos a "observar/watchear".
  // El segundo es un array con las tareas a ejecutar cuando se detecte
  // un cambio.
  gulp.watch(['./www/js/*.js', './www/js/**/*.js'], ['js']);
}); // EZ :)


gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', ['sass'], function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

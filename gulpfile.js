const gulp = require('gulp');
const sass = require('gulp-sass');

function buildSass(done){
    gulp.src('./src/sass/*.scss')
    .pipe(sass({outputStyle:'expanded'}))
    .pipe(gulp.dest('./src/css/'));

    done();
}

// 创建编译sass任务
module.exports.buildSass = buildSass;

function watch(){
    gulp.watch('./src/sass/*.scss',gulp.series(buildSass))
}

// 创建监听sass任务
module.exports.watch = watch;
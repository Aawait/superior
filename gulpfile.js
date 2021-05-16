const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const minJs = require('gulp-uglify');
const minCss = require('gulp-clean-css');
const minHtml = require('gulp-htmlmin');

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

function buildJs(done){
    gulp.src('./src/js/*.js')
    .pipe(minJs())
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest('./dist/js'))
    done();
}

// 创建编译ES6 -> ES5并压缩任务
module.exports.buildJs = buildJs;


function buildCss(done){
    gulp.src('./src/css/*.css')
    .pipe(minCss({}))
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest('./dist/css'))
    done();
}

// 创建压缩css的任务
module.exports.buildCss = buildCss;

function buildHtml(done){
    gulp.src('./dist/html/*.html')
    .pipe(minHtml({
        removeComments : true,   //清除HTML注释
        collapseWhitespace : true,  //压缩HTML
        removeEmptyAttributes : true,  //删除所有空格作属性值 <input id="" /> ==> <input />
        minifyCSS : true,  //压缩页面CSS
        minifyJS : true    //压缩页面JS
    }))
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest('./dist/html'))
    done();
}

// 创建压缩html文件的任务
module.exports.buildHtml = buildHtml;


function buildIndex(done){
    gulp.src('./dist/index.html')
    .pipe(minHtml({
        removeComments : true,
        collapseWhitespace : true,
        removeEmptyAttributes : true,
        minifyCSS : true,
        minifyJS : true
    }))
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest('./dist'))
    done();
}

// 压缩首页
module.exports.buildIndex = buildIndex;


function indexJs(done){
    gulp.src('./src/js/index.js')
    .pipe(minJs())
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest('./dist/js'))
    done();
}

module.exports.indexJs = indexJs;

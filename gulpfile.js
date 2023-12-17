const { src, dest, watch, series } = require('gulp');
const browserSync = require('browser-sync').create();
const autoPrefixer = require('gulp-autoprefixer');
const filrInclude = require('gulp-file-include');
const del = require('del');
const gulpIf = require  ('gulp-if')
const cssMin = require('gulp-cssmin');
const sass = require('gulp-sass')(require('sass'))
const htmlMin = require('gulp-htmlmin');
const avif = require('gulp-avif');
const webp = require('gulp-webp');

let isProd = false;


const clear = () =>{
    return del(['app'])
}

const htmlInclude = () =>{
    return src('src/**/*.html')
        .pipe(filrInclude({
            prefix: '@',
            basepath: '@file'
        }))
        .pipe(gulpIf(isProd, htmlMin({
            collapseWhitespace: true
        })))
        .pipe(dest('app/'))
        .pipe(browserSync.stream())
}

const styles = () =>{
    return src('src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoPrefixer({
            cascade: false,
            grid: true,
            overrideBrowsersList: ['Last 5 versions']
        }))
        .pipe(gulpIf(isProd, cssMin()))
        .pipe(dest('app/'))
        .pipe(browserSync.stream())
}

const scripts = () =>{
    return src('src/js/**/*.js')
        .pipe(dest('app/js/'))
        .pipe(browserSync.stream())
}

const images = () =>{
    return src('src/img/**/*.{png, jpeg, jpg}')
        .pipe(dest('app/img'))
        .pipe(browserSync.stream())
}

const webpImages = () =>{
    return src('src/img/**/*.{png, jpeg, jpg}')
        .pipe(webp())
        .pipe(dest('app/img/'))
        .pipe(browserSync.stream())
}

const avifImages = () =>{
    return src('src/img/**/*.{png, gpeg, jpg}')
        .pipe(avif())
        .pipe(dest('app/img'))
        .pipe(browserSync.stream())
}

const watcher = () =>{
    browserSync.init({
        server: {
            baseDir: 'app'
        }
    })

    watch(['src/**/*.html'], htmlInclude);
    watch(['src/scss/**/*.scss'], styles);
    watch(['src/js/**/*.js'], scripts);
    watch(['src/img/**/*.{png, jpeg, jpg}'], images)
}

const toProd = (done) => {
    isProd = true;
    done()
}

exports.default = series(clear, htmlInclude, styles, scripts, images, webpImages, avifImages, watcher);
exports.build = series(toProd, clear, htmlInclude, styles, scripts, images, avifImages, webpImages)
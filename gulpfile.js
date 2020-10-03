const {
    src, dest, watch, series, parallel
} = require('gulp');
const deleteDist = require('del');
const browserSyncServer = require('browser-sync').create();

const sass = require('gulp-sass');
const autoPrefix = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

const imgMin = require('gulp-imagemin');

const srcDir = 'src';
const destDir = 'dist';

function browserSyncServerStart() {
    browserSyncServer.init({
        server: { baseDir: destDir },
        online: true,
    });
}

function stylesOptimization() {
    return src(`${srcDir}/scss/style.scss`)
        .pipe(sass())
        .pipe(autoPrefix({ overrideBrowserslist: ['last 10 versions'] }))
        .pipe(cleanCSS())
        .pipe(dest(`${destDir}/css`))
        .pipe(browserSyncServer.stream());
}
function htmlOptimization() {
    return src(`${srcDir}/index.html`)
        .pipe(dest(`${destDir}`))
        .pipe(browserSyncServer.stream());
}

function imgOptimization() {
    return src(`${srcDir}/img/**/*`)
        .pipe(imgMin())
        .pipe(dest(`${destDir}/img`));
}
function copyToDist() {
    return src([
        `${srcDir}/fonts/*`,
    ], { base: srcDir })
        .pipe(dest(destDir));
}
function watchProject() {
    watch([`${srcDir}/scss/**/*.scss`], stylesOptimization);
    watch([`${srcDir}/*.html`], htmlOptimization);
    watch([`${srcDir}/img/**/*`], imgOptimization);
}

function clearDist() {
    return deleteDist(`${destDir}/**/*`, { force: true });
}
exports.startServer = series(
    clearDist, copyToDist,
    parallel(imgOptimization, stylesOptimization,
    htmlOptimization, browserSyncServerStart, watchProject),
);
exports.buildProject = series(
    clearDist, copyToDist,
    parallel(imgOptimization, stylesOptimization, htmlOptimization),
);

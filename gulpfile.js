'use strict';

const gulp             = require('gulp');
const { series, parallel } = gulp;
const csso             = require('gulp-csso');
const uglify           = require('gulp-uglify');
const concat           = require('gulp-concat');
const gulpSass         = require('gulp-sass');
const sass             = gulpSass(require('sass'));
const plumber          = require('gulp-plumber');
const cp               = require('child_process');
const bs               = require('browser-sync').create();

const JEKYLL_IMAGE = 'benrowe-jekyll';

function jekyllBuild(done) {
	return cp.spawn('docker', [
		'run', '--rm',
		'-v', `${process.cwd()}:/site`,
		JEKYLL_IMAGE,
		'bundle', 'exec', 'jekyll', 'build',
	], { stdio: 'inherit' }).on('close', done);
}

function reload(done) {
	bs.reload();
	done();
}

function serve(done) {
	bs.init({ server: { baseDir: '_site' } });
	done();
}

function compileSass() {
	return gulp.src('src/styles/main.scss')
		.pipe(plumber())
		.pipe(sass().on('error', sass.logError))
		.pipe(csso())
		.pipe(gulp.dest('assets/css/'));
}

function fonts() {
	return gulp.src('src/fonts/**/*.{ttf,woff,woff2}')
		.pipe(plumber())
		.pipe(gulp.dest('assets/fonts/'));
}

// gulp-imagemin@9 is ESM-only with top-level await; load it dynamically
async function images() {
	const { default: imagemin, gifsicle, mozjpeg, optipng } = await import('gulp-imagemin');
	return gulp.src('src/img/**/*.{jpg,png,gif}')
		.pipe(plumber())
		.pipe(imagemin([
			mozjpeg({ progressive: true }),
			optipng({ optimizationLevel: 3 }),
			gifsicle({ interlaced: true }),
		]))
		.pipe(gulp.dest('assets/img/'));
}

function js() {
	return gulp.src('src/js/**/*.js')
		.pipe(plumber())
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(gulp.dest('assets/js/'));
}

function watch() {
	gulp.watch('src/styles/**/*.scss',             series(compileSass, jekyllBuild, reload));
	gulp.watch('src/js/**/*.js',                   series(js, reload));
	gulp.watch('src/fonts/**/*.{ttf,woff,woff2}',  series(fonts, reload));
	gulp.watch('src/img/**/*.{jpg,png,gif}',       series(images, reload));
	gulp.watch(['*.html', '_includes/*.html', '_layouts/*.html'], series(jekyllBuild, reload));
}

exports['jekyll-build'] = jekyllBuild;
exports.sass   = compileSass;
exports.fonts  = fonts;
exports.images = images;
exports.js     = js;
exports.default = series(parallel(js, compileSass, fonts), jekyllBuild, serve, watch);

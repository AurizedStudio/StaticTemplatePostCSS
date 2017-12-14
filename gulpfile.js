var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var postcss = require('gulp-postcss');
var simpleVars = require('postcss-simple-vars');
var nested = require('postcss-nested');
var mixins = require('postcss-mixins');
var easyImport = require("postcss-easy-import");
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
var plumber = require('gulp-plumber'); // エラーが起きてもwatchを終了しない
var notify = require('gulp-notify'); // エラーが起こったときの通知
var stripInlineComments = require('postcss-strip-inline-comments');
var scss = require('postcss-scss');
var calc = require('postcss-calc');
var replace = require('gulp-replace');
var csscomb = require('gulp-csscomb');
var nunjucksRender = require('gulp-nunjucks-render');

var path = {
	srcHtml: './src/html/',
	srcCss: './src/css/',
	dest: './htdocs/',
	destCss: './htdocs/css/'
};

// エラー通知が必要なタスク使用。通知が必要ない場合には通常のplumberをとるようにする
// .pipe(plumberWithNotify()) or .pipe(plumber())
function plumberWithNotify() {
	return plumber({errorHandler: notify.onError("<%= error.message %>")});
}

gulp.task('compileHtml', function () {
	return gulp.src(path.srcHtml + 'page/**/*.html')
	.pipe(nunjucksRender({
		path: [path.srcHtml] // String or Array
	}))
	.pipe(replace(/\n+/g, '\n')) // 2行以上の改行を1行にする
	.pipe(gulp.dest(path.dest));
});

gulp.task('compileCss', function() {
	var processors = [
		easyImport({ glob: true }),
		stripInlineComments,
		mixins,
		simpleVars,
		nested,
		calc,
		autoprefixer({browsers: ['last 2 versions'], grid: true})
	];
	return gulp.src(path.srcCss + 'style.css')
		.pipe(plumberWithNotify())
		.pipe(sourcemaps.init())
		.pipe(postcss(processors, {syntax: scss})) // PostCSSに渡して処理
		.pipe(sourcemaps.write('.'))
//		.pipe(csscomb()) // 納品時の整形に使用
		.pipe(gulp.dest(path.destCss))
});

gulp.task('serve', ['compileCss', 'compileHtml'], function(){
	browserSync.init({
		server: {
			baseDir: path.dest,
			directory: true
		},
		open: 'external'
	});
	gulp.watch(path.srcCss + '**/*.css', ['compileCss']);
	gulp.watch(path.srcHtml + '**/*.html', ['compileHtml']);
	gulp.watch([
		path.dest + '**/*.html',
		path.dest + '**/*.css',
		path.dest + '**/*.js'
	]).on('change', browserSync.reload);
});

gulp.task('default', ['serve']);

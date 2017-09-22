/**
 *
 * User: heliang
 * Date: 2017/8/29.
 */

var path=require('path');
var gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),
    //确保本地已安装imagemin-pngquant [cnpm install imagemin-pngquant --save-dev]
    pngquant = require('imagemin-pngquant');

gulp.task('testImagemin', function () {
    gulp.src(path.join(__dirname,'/zipImg/source/*.{png,jpg,gif,ico}'))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
            use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        }))
        .pipe(gulp.dest(path.join(__dirname,'/zipImg/dist/')));
});

// gulp.task('default',['testImagemin'])

gulp.task('default',['testImagemin']);
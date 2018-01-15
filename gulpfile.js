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

var spritesmith = require('gulp.spritesmith');


//雪碧图部分
gulp.task('sprite',function(){
    gulp.src("spriteImg/source/*.png")
        .pipe(spritesmith({
            imgName:'sprite.png', //合并后大图的名称
            cssName:'sprite.css',
            padding:15,// 每个图片之间的间距，默认为0px
            cssTemplate:(data)=>{
                // data为对象，保存合成前小图和合成打大图的信息包括小图在大图之中的信息
                let arr = [],
                    width = data.spritesheet.px.width,
                    height = data.spritesheet.px.height,
                    url =  data.spritesheet.image
                data.sprites.forEach(function(sprite) {
                    arr.push(
                        ".icon-"+sprite.name+
                        "{"+
                        "background: url('"+url+"') "+
                        "no-repeat "+
                        sprite.px.offset_x+" "+sprite.px.offset_y+";"+
                        "background-size: "+ width+" "+height+";"+
                        "width: "+sprite.px.width+";"+
                        "height: "+sprite.px.height+";"+
                        "}\n"
                    )
                })
                // return "@fs:108rem;\n"+arr.join("")
                return arr.join("")
            }
        }))
        .pipe(gulp.dest("spriteImg/dist/"))
})

gulp.task('testImagemin', function () {
    gulp.src(path.join(__dirname,'/zipImg/source/*.{png,jpg,gif,ico}'))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
            use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        }))
        .pipe(gulp.dest(path.join(__dirname,'/zipImg/dist/')));
});

gulp.task('default',['sprite']);
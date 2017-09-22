/**
 *
 * User: heliang
 * Date: 2017/9/8.
 */
var fs=require("fs");
var tinify = require("tinify");
var path=require("path");
var sourceImgPath=path.join(__dirname,"/../zipImg/source/");
var keys=['rNQufiIPg_jdO6I5teGVMhYvXPkGduTj','4scr4C-HHwqw2QJOENmWpXgX5u-TmLR6','EKq-1HZgmSGYu1P8dEcxDJbQgfN0autu'];
// var distImgPath=path.join(__dirname,"/../zipImg/dist/");
tinify.key = "rNQufiIPg_jdO6I5teGVMhYvXPkGduTj";

var counter=0;
var c=0;

function zipImg(){
    copyDir(sourceImgPath);
}

function zip(filepath,newPath,filename){
    setTimeout(function () {
        tinify.fromFile(filepath).toFile(newPath,function (err) {
            console.log("定时...."+c);
            c++;
            console.log("处理第"+c+"张图片");
            if(c%490==0){ //490的倍数
                let index=parseInt(c/490);
                tinify.key =keys[index];
                console.log("换key>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            }
            if(err){
                console.log("压缩出错%s",err.message);
                console.log("key>>>>>>>>>>>>>>>"+JSON.stringify(tinify));
            }else{
                console.log("压缩[%s]完成",filename);

            }
        });
    },counter*300)

}

function copeToTargetDir(filepath){
    fs.stat(filepath,function(err,stats){
        if(stats.isFile()){
            var filename = path.basename(filepath);
            var parentDirname = path.basename(path.dirname(filepath));
            var thisFilename = path.basename(__filename);
            if(filename!=thisFilename&&filename.indexOf(parentDirname)<0){
                var newPath =path.resolve(parentDirname,filename);
                newPath= filepath.replace('source','dist');
                if(filename.indexOf('.json')==-1){
                    counter++;
                    zip(filepath,newPath,filename);
                }else{
                   let rs= fs.createReadStream(filepath)
                   let ws= fs.createWriteStream(newPath);
                   rs.pipe(ws);
                }
            }
        }else if(stats.isDirectory()){
            let tempTarget=filepath.replace("source","dist");
            if(!fs.existsSync(tempTarget)){
                fs.mkdirSync(tempTarget);
                console.log("创建文件夹成功"+tempTarget);
            }
            copyDir(filepath);
        }else{
            console.log("unknow type of file");
        }
    });
}


function copyDir(dir){
    fs.readdir(dir,function(error,files){
        var len = files.length;
        var file = null;
        for(var i=0;i<len;i++){
            file = files[i];
            copeToTargetDir(path.join(dir,file));
        }
    });
}

zipImg();


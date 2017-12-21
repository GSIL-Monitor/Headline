/**
 * 毒药投票榜单导入
 * User: heliang
 * Date: 2017/10/27.
 */
let xlsl=require("node-xlsx");
var path = require('path');
var fs=require("fs");


let objList=xlsl.parse(path.join(__dirname,"1214投票图表.xls"));
let list=objList[0].data;
var pageSize=20;
var data=[];
var maxLength=Math.floor(list.length/pageSize);
for(var i=0;i<maxLength;i++){
    eval("var list"+(i+1)+"=[]");
}
for(var i=0;i<list.length;i++){
    let item=list[i][0];
    var listIndex=(Math.floor(i/(pageSize+1))+1);
    if(!((i%pageSize)==(Math.floor(i/pageSize)))){
        var inner={};
        inner.id=i-listIndex+1;
        inner.name=item;
        eval("list"+listIndex+".push(inner)")
    }
    if((i%pageSize)==(Math.floor(i/pageSize))){
        var json={};
        json.name=item;
        json.key="key_"+(Math.floor(i/pageSize)+1);
        json.list=eval("list"+listIndex);
        data.push(json)

    }
}

//写入data文件
var tragetPath="/Users/hotread/work/story/node-story-event/public/data.js"
var dataStr="var data="+JSON.stringify(data);
fs.writeFile(tragetPath,dataStr,function(err){
        console.log(err==null?"写入成功":err.message);
});

// console.log(JSON.stringify(data));

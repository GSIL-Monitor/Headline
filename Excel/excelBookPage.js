/**
 * 毒药投票用excel解析
 * User: heliang
 * Date: 2017/10/27.
 */
let xlsl=require("node-xlsx");
var path = require('path');

let objList=xlsl.parse(path.join(__dirname,"元尊同类书籍推荐.xlsx"));
let list=objList[0].data;
let filed=["no","name","author","channel","group","tag"];


let ary=[];
for(var i=1;i<list.length;i++){
    let item=list[i];
    let json={};
    item.forEach((it,index)=>{
        if(index<item.length){
            json[filed[index]]=it;
        }
    })
    let id=item[0];
    json["link"]=`https://www.hotread.com/story/${id}`;
    ary.push(json);
}
console.log(JSON.stringify(ary));
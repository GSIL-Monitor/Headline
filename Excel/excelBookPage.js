/**
 * 推荐书籍
 * User: heliang
 * Date: 2017/10/27.
 */
let xlsl=require("node-xlsx");
var path = require('path');

let objList=xlsl.parse(path.join(__dirname,"给春明(2).xlsx"));
let list=objList[0].data;
let filed=["no","name","author","link","bookInfo"];

// "name": "未亡日",
//     "link": "https://www.hotread.com/story/1000582",
//     "author": "藤萍",
//     "authorInfo": "言情四天后之燃情天后",
//     "bookInfo": "男主捏雍加入“复活”计划 醒来已是异兽横行的未来世界",
//     "level": "S"

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
    // json["link"]=`https://www.hotread.com/story/${id}`;
    ary.push(json);
}
console.log(JSON.stringify(ary));
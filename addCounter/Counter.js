/**
 *
 * User: heliang
 * Date: 2017/8/29.
 */


var request=require("request");

function aaa(){
    request({
        url:"https://www.wukong.com/answer/6460268358905364750/",
        headers:{
            "User-Agent":'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
        }
    },(err,res,body)=>{
        console.log(">>>");
    })
}

setInterval(aaa,50)
// aaa();
// https://www.wukong.com/question/6459294944044515598/
/**
 *
 * User: heliang
 * Date: 2017/10/11.
 */

var request=require("request");
var https = require("https");
function aaa(){

    let option = {
        json: true,
        header : {
            "User-Agent":'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
            'Content-Type' : 'application/x-www-form-urlencoded',
            'Cookie' : 'JSESSIONID=C5419DE4240B5FD144A1BFC0A45E9829;UM_distinctid=15e30b5455276-054c20092-54545367-38400-15e30b5455553;CNZZDATA1260761932=854659185-1504391714-https%253A%252F%252Fenterbj.zhongchebaolian.com%252F%7C1507363546'
        },
        body: {
            userid:'c7c182578f1a42d0957f72960182e457',
            appkey:'kkk',
            deviceid:'ddd',
            timestamp:'2017-10-11 10:25:35',
            token:'0C98630B127FAA95FEF7A87F60E56A23',
            sign:'aaNVCC0010e7b4defca32ae9e9b689dece72cd7679db83d4b4',
            platform:'02',
            appsource:''
        }
    };
    request.post({
        url:"https://enterbj.zhongchebaolian.com/enterbj/platform/enterbj/entercarlist",
        option
    },(err,res,body)=>{
        console.log(">>>"+err);
    })
}
aaa();
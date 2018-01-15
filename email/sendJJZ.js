/**
 * 检测进京证状态
 * User: heliang
 * Date: 2017/12/27.
 */

var nodeEmailer = require("nodemailer");
var schedule = require("node-schedule");
var moment = require("moment");
var request=require("request");

var emailConfig = {
    from: "heliang@duyao001.com",
    to: "heliang@duyao001.com",
    config: {
        host: "smtp.exmail.qq.com",
        port: 465,
        secure: true,
        auth: {
            user: "heliang@duyao001.com",
            pass: "bhsySg9CLWuXCtyg"
        }
    }
}


function checkJJZ(callabck){
    request("http://www.52jinjing.com/",function(err,resp){
        var html=resp.body;
        var reg=/<tr>/g;
        var regTd=/<td>((\w|[\u4e00-\u9fa5]|\d)+)<\/td>/g;
        var trs=html.split(reg);
        var infoHTML=trs[2];
        // console.log(infoHTML);
        var ary=[];
        infoHTML.replace(regTd,function(a1,key){
            // console.log(key);
            ary.push(key);
        });
        var currentState=ary[1];
        callabck(err,currentState)
    })
}


function sendFeixin(){
    console.log("sendFeixin>>>");
    request("http://sms.api.bz/fetion.php?username=15811316527&password=hl123456789&sendto=15811316527&message=123",function(err,resp){
        var html=resp.body;
        console.log(html);

    })
}



sendFeixin();

//发送邮件
function sendEmail(emailInfo) {
    let transport = nodeEmailer.createTransport(emailConfig.config);
    let {to, subject, text, attachments} = emailInfo;
    let mailOptions = {
        from: emailConfig.from,
        to,
        subject,
        text,
        attachments
    }
    transport.sendMail(mailOptions, (err, info) => {
        if (err) {
            return console.log(err);
        }
        console.log("邮件发送成功，收件人【%s】 响应信息　%s",emailConfig.to, info.response);
    })
}

function startUp() {
    //定时器(发送邮件【技术部门周报】)
    schedule.scheduleJob("*/30 * * * * *", function () {
        checkJJZ(function(err,state){
            console.log("当前进京证状态..."+state);
            if(state=="已开放申请"){
                sendEmail({
                    to: emailConfig.to,
                    subject:"进京证提醒"+moment(new Date()).format('YYYY-MM-DD hh:mm:ss')  ,
                    text:"进京证当前状态【"+state+"】"
                })
            }
        });

        console.log("定时任务 开始执行　%s", moment(new Date()).format('YYYY-MM-DD hh:mm:ss'));
    })

    console.log("任务启动....");
}
// startUp();
/**
 * 今日头条问答统计定时发送(设置周一到周五　下午18:30定时发送)
 */
var schedule = require("node-schedule");
var nodeEmailer = require("nodemailer");
var path = require("path");
var fs = require("fs");
var moment = require("moment");
var templateDir='/Users/hotread/work/火星小说日常工作/技术部周报和绩效今日头条/今日头条/';
var weeklyDir='/Users/hotread/work/火星小说日常工作/技术部周报和绩效今日头条/周报/';

 //yangyx@duyao001.com,
//邮箱配置
var emailConfig = {
    from: "heliang@duyao001.com",
    to: "yangyx@duyao001.com,598481337@qq.com",
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

//发送周报email
function sendWeeklyEmail(){
    let {nowTime} = getFormatDate();
    let filename = `${nowTime}.zip`;
    var filePath = weeklyDir + filename;


    let title=`${nowTime}(技术部)周报`;
    sendEmail({
        to: emailConfig.to,
        subject:title  ,
        text: title,
        attachments: [
            {
                filename,
                path: filePath
            }
        ]
    })
}


//发送今日头条email
function sendJinRiEmail() {
    let {nowTime} = getFormatDate();
    let filename = getFileName(nowTime);
    var filePath = templateDir + getFileName(nowTime);
    sendEmail({
        to: emailConfig.to,
        subject: filename,
        text: "今日头条问答(技术部)",
        attachments: [
            {
                filename,
                path: filePath
            }
        ]
    })
}
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
//文件拷贝
function copyFile(dir) {
    let {yesterdsayTime, nowTime} = getFormatDate();
    var source = dir + getFileName(yesterdsayTime);
    var target = dir + getFileName(nowTime);
    var rs = fs.createReadStream(source);
    var ws = fs.createWriteStream(target);
    rs.pipe(ws);
    rs.on('error', function (err) {
        console.log('文件复制出错:' + err.message);
    })
    rs.on('end', function () {
        console.log("文件生成完毕,文件名【%s】,",getFileName(nowTime));
        console.log("目标路径【%s】",target);
    })
}
//获取今日头条excel文件名称
function getFileName(name) {
    return `今日头条问答${name}(技术部).xlsx`;
}
//格式化日期获取当前天和前一天的字符串
function getFormatDate() {
    var now = new Date();
    var week = now.getDay();
    var yesterdsayTime = moment(now.getTime() - (24 * 60 * 60 * 1000)).format('YYYYMMDD');
    if (week == 1) { //周一的话向前找两天的
        yesterdsayTime = moment(now.getTime() - (72 * 60 * 60 * 1000)).format('YYYYMMDD');
    }
    var nowTime = moment(now.getTime()).format('YYYYMMDD');
    return {
        yesterdsayTime,
        nowTime
    }
}






function startUp() {
    //定时器(启动复制任务)
    schedule.scheduleJob("00 00 19 * * 1-5", function () {
        console.log("定时任务【生成新文件】开始执行　%s", moment(new Date()).format('YYYY-MM-DD hh:mm:ss'));
        // copyFile(templateDir);
    })
    //定时器(发送邮件【发送今日头条】)
    schedule.scheduleJob("00 00 19 * * 1-5", function () {
        console.log("定时任务【发送今日头条】开始执行　%s", moment(new Date()).format('YYYY-MM-DD hh:mm:ss'));
        // sendJinRiEmail();
    })

    //定时器(发送邮件【技术部门周报】)
    schedule.scheduleJob("00 10 19 * * 5", function () {
        console.log("定时任务【技术部门周报】开始执行　%s", moment(new Date()).format('YYYY-MM-DD hh:mm:ss'));
        // sendWeeklyEmail();
    })

    console.log("任务启动....");
}
// startUp();

// copyFile(templateDir);
sendJinRiEmail();
// sendWeeklyEmail();


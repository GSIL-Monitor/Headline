/**
 *
 * User: heliang
 * Date: 2017/12/21.
 */

var Imap=require("imap");
var MailParser=require("mailparser").MailParser;
var fs=require("fs");
var path=require("path");

var imap=new Imap({
    user:'heliang@duyao001.com',
    password:'bhsySg9CLWuXCtyg',
    host:'imap.exmail.qq.com',
    port:'993',
    tls:true,//使用安全传输协议
    tlsOptions:{rejectUnauthorized: false} //禁用对证书有效性的检查
})

imap.once('ready',function () {
    console.log('ready...');
    openInBoxBox(function(err,box){
        console.log("打开收件箱....");
        if(err){
            console.log("错误:"+err);
        }else{

            // var f = imap.seq.fetch('1:4', {
            //     bodies: 'HEADER',
            //     struct: true
            // });
            imap.search(['ALL'], function(err, results) {//搜寻所有邮件
                if (err) throw err;
                var f = imap.fetch(results, {bodies: ''});//抓取邮件
                console.log("连接邮箱....");
                f.on('message', function (msg, seqno) {
                    var mailparser = new MailParser();
                    msg.on('body', function (stream, info) {
                        stream.pipe(mailparser);
                        var mailTitle="";
                        mailparser.on("headers", function (headers) {
                            mailTitle=headers.get('subject');
                            // console.log("邮件头信息>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                            // console.log("邮件主题: " + headers.get('subject'));
                            // console.log("发件人: " + headers.get('from').text);
                            // console.log("收件人: " + headers.get('to').text);
                            // console.log("日期: " + headers.get('date'));
                        });
                        mailparser.on('data', function (data) {
                            if (data.type === 'text') {//邮件正文
                                // console.log("邮件内容: " + data.html);
                                var content=data.html.replace("charset=GB2312","charset=UTF-8");

                                fs.writeFile(path.join(__dirname,"/../email-files/"+mailTitle+".html"),content,{
                                    encoding: 'utf8'
                                })
                            }
                            if(data.type=="attachment"){
                                data.content.pipe(fs.createWriteStream(path.join(__dirname,"/../email-files/attachments/"+data.filename)));//保存附件到当前目录下
                                data.release();
                            }
                        })
                        mailparser.on('error', function (err) {
                            console.log("error" + err);
                        })
                        mailparser.once('end',function(){
                            console.log("邮件["+mailTitle+"]接收完毕...")
                        })

                    })

                    msg.once('attributes', function (attrs) {

                    // console.log("attributes>>>>"+JSON.stringify(attrs));
                    })
                    msg.once('end', function () {
                      // console.log("messageEnd....");
                    })

                })

                f.once('error', function (err) {
                    console.log('Fetch error: ' + err);
                });
                f.once('end', function () {
                    console.log('Done fetching all messages!');
                    imap.end();
                });

            });


        }

    })
});

//打开收件箱
function openInBoxBox(cb) {
    imap.openBox('INBOX',true,cb)
}



imap.once('error',function(error){
    console.log('error...'+error);
})
imap.once('end',function () {
    console.log('关闭邮箱...');
})

imap.connect();




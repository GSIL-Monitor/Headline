/**
 *
 * User: heliang
 * Date: 2017/12/21.
 */

var Imap=require("imap");
var MailParser=require("mailparser").MailParser;

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
            imap.search(['SEEN'], function(err, results) {//搜寻2017-05-20以后未读的邮件

                if (err) throw err;

                var f = imap.fetch(results, {bodies: ''});//抓取邮件（默认情况下邮件服务器


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
                            }
                        })
                        mailparser.on('error', function (err) {
                            console.log("error" + err);
                        })
                        mailparser.once('end',function(){
                            console.log("邮件["+mailTitle+"]接收完毕...")
                        })

                    })
                    msg.once('attributes', function () {

                    })

                    msg.once('end', function () {

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




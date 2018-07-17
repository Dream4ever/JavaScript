# 阿里云企业邮箱发送邮件

## 实现流程

最近在做的微名片业务有个小需求，就是用户在前台页面留言之后，后台将用户的留言信息通过邮件发送给当前页面所对应的领导的邮箱。

之前在开发测试这个功能的时候，发件邮箱用的是个人性质的 126 邮箱，收件邮箱用的就是自己的 QQ 邮箱，毕竟比较方便。结果 126 邮箱发了 4 封邮件之后，第 5 封邮件再往后就发不出去了。在退信信息中看到了 QQ 邮箱的退信代码，上网查了查，原来是被 QQ 邮箱判定为群发的垃圾邮件了。这该怎么办呢？

昨晚上课之后，跟徐老师咨询了一下这个问题。徐老师回复说要用企业邮箱，这样才不会被判定为垃圾邮件。今天先用自己的域名申请了一个 1 块钱 1 年的[阿里云企业邮箱](https://wanwang.aliyun.com/mail/freemail/)，设置好解析之后，用自己域名下的邮箱短时间内一连给自己的 QQ 邮箱发了 5 封测试邮件，全都成功发送了。还有点儿不放心，于是又连续发了 5 封测试邮件，依然成功发送。这下应该没问题了。

发邮件的设置参考了徐老师的文章、nodemailer 官网的文档，以及阿里云的帮助文档。发现徐老师发邮件的代码和 nodemailer 官网的文档不太一样，nodemailer 官网的文档和阿里云的帮助文档是一致的，所以就以阿里云的文档为准了。

## 业务代码

```js
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  host: 'smtp.mxhichina.com', // 企业邮箱 smtp 发信的服务器和端口，见相关链接的最后一条
  port: 465,
  secure: true,
  auth: {
      user: 'admin@abc.com.cn', // 阿里云邮箱的账号
      pass: 'xxxxxxxx' // 账号对应的密码
  }
});

// 设置邮件各字段的内容
let mailOptions = {
    from: '"admin" <admin@abc.com.cn>', // 发件人及发件邮箱
    to: 'test@abc.com.cn', // 收件人
    subject: 'Hello', // 邮件标题
    text: 'Are you OK?', // 邮件正文
};

// 发送邮件
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('邮件已成功发送: %s', info.messageId);
});
```

## 相关链接

- 企业邮箱购买链接：[1 块钱 1 年的阿里云企业邮箱](https://wanwang.aliyun.com/mail/freemail/)
- [【10.24】批量发邮件](http://xugaoyang.com/post/59eee25998dae164a86e8b8f)
- [SMTP 之 Nodejs 调用示例](https://help.aliyun.com/document_detail/29456.html)
- [企业邮箱通过smtp程序进行发信的设置方法](https://help.aliyun.com/knowledge_detail/36687.html)

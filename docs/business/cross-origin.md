# 解决跨域问题

在公司的实际业务中，跨域请求是很常见的需求。要成功实现跨域请求，需要在前端和后端都做相关的设置。

在后端部分，因为自己用的是 Express，所以直接装了一个 [CORS](https://github.com/expressjs/cors) 中间件解决了这个需求，用法也很简单，文档一看就会。

但是在前端部分，用的是 axios 这个库。因为最开始没有找到问题的症结，所以把服务端映射到和前端相同的域名下，算是临时解决了跨域的问题。

但是这个问题终究需要解决，今天在服务器上配置后端项目的时候，突发奇想，想再研究一下跨域的问题。

于是先用 `axios cross origin` 这个关键字在 Google 上搜索，之前看过搜索结果里面比较靠前的几个英文链接，没有解决问题。今天看到搜索结果第一页有一篇中文文章，于是就打开看了看：[使用Vue的axios vue-resource跨域不成功 但原生xhr就可以](https://segmentfault.com/q/1010000008292792)。在这篇文章里面，提到了解决方法：

axios 默认是将数据转换成 `JSON` 格式发送给后端，可以将数据以 `application/x-www-form-urlencoded` 来解决这个问题。

具体来说，就是要以下面这种方式，把数据放在 `params` 中，并设置 axios 所发送请求的 `headers`，这样就能成功实现跨域请求了。

```javascript
axios.post(api, {
  params: {
    'msg': this.message
  },
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
  .then()
```

## 参考文档

- [HTTP 访问控制（CORS）](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)
- [Using application/x-www-form-urlencoded format | axios](https://github.com/axios/axios#using-applicationx-www-form-urlencoded-format)

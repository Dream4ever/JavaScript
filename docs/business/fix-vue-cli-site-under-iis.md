# 解决 vue-cli 打包项目在 IIS 下无法稳定访问的问题

## 现象

用 IIS 架设的网站，某个路径下的 [静态页面](http://www.uppbook.com.cn/mingpian/xingjianhua/) 无法稳定访问，网页是用 vue-cli 打包生成的。

另外两个同样通过 URL 重写映射的路径就没问题，不过那两个路径不是用 vue-cli 打包的，一个是简单的静态页面，另一个则是 Node.js 项目。

有时候重启网站后，该静态页面又能够恢复一段时间的正常访问，有时候重启也不管用。

## 解决方案

最终是用 Nginx 来代理打包后的静态页面，在本机可以用 `localhost:9999` 进行测试访问。

```
server {
  listen 9999;
  server_name localhost;

  location / {
    root e:/upcweb/mingpian/dist/;
    try_files $uri $uri/ /index.html;
  }
}
```

然后再通过 IIS 的 URL 重写功能，将网址映射到 Nginx 所代理的地址上。

- 模式： `^(mingpian/)(.*)$`
- 条件（全部匹配）： `{REQUEST_FILENAME}` 不是文件 且 不是目录
- 操作：重写为 URL [http://localhost:9999/{R:2}](http://localhost:9999/{R:2})
- 附加选项：附加查询字符串，停止处理后续规则

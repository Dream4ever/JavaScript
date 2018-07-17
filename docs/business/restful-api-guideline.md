# RESTful API 设计及前后端使用规范

今晚闲来无事，把业务的前端和后端部分 API 相关的操作进行了一番重构，真是优化无止境啊！

标题虽说是规范，其实只是记录一下自己的用法而已，方便以后查阅。

## 后端 API 格式规范

后端 API 统一用 `名词复数 + ID 编号（可选）` 的格式。

获取 summarys 中的所有数据。

> GET: /summarys

获取 summarys 中的某条数据。

> GET: /summarys/:trid

更新 summarys 中的某条数据。

> PATCH: /summarys/:trid

删除 summarys 中的某条数据。

> DELETE: /summarys/:trid

## 后端 controller 格式规范

后端 controller 统一用 `动词 + 名词` 的格式，方法名称应当具体形象，因为直接操作数据，所以准确的方法名称在阅读和修改代码时更加方便。

获取 summarys 中的所有数据。

> getAllSummarys

获取 summarys 中的某条数据。

> getOneSummary

更新 summarys 中的某条数据。

> updateOneSummary

删除 summarys 中的某条数据。

> deleteOneSummary

## 前端调用 API 格式规范

前端统一通过 `axios` 与后端的 API 进行交互，调用规范如下：

获取 summarys 中的某条数据，Express 通过 `req.params.id` 获取数据的 ID。

```js
axios.get(/summarys/123).then().catch()
```

更新 summarys 中的某条数据，所更新的内容保存至 `data` 变量之后放在 axios 的 `params` 参数中，Express 通过 `req.params.id` 获取数据的 ID，通过 `req.body.params.data` 获取所更新的字段及内容。

```js
axios.patch(/summarys/123, {
  params: {
    data: data
  }
}).then().catch()
```

删除 summarys 中的某条数据，Express 通过 `req.params.id` 获取数据的 ID。

```js
axios.delete(/summarys/123).then().catch()
```

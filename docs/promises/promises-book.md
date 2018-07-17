# Promises 迷你书笔记

参考资料：

- [JavaScript Promise迷你书（中文版）](http://liubin.org/promises-book/)

## 入门示例

```javascript
var promise = new Promise(function(a){
    a(42);
});
promise.then(function(value){
    console.log(value);
}).catch(function(error){
    console.error(error);
});

// 42
```

像上面这样，在 Promise 实例的函数中只传入一个参数的话，那么就会执行 `promise.then()` 之中的代码；也可以传入两个参数，在实际运行时，根据情况决定具体执行哪个函数。

```javascript
var promise = new Promise(function(a, b) {
    if (true) {
        a('hello');
    } else {
        b('goodbye');
    }
});
```

```javascript
// 错误用法
var promise = new Promise(function(resolve){
    reject(37);
});
promise.then(function(value){
  console.log('resolve: ' + value);
}).catch(function(error){
  console.error('reject: ' + error);
});

// ReferenceError: reject is not defined
```

而像上面这样，Promise 实例的函数参数是 `resolve`，而在函数里用的是 `reject`，就会报错。因为传入的参数是 `resolve`，而在函数中调用的是 `reject`，那么调用的就是未定义的变量，当然会报错了。

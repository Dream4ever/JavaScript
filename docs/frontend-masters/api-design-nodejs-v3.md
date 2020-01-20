## 课程地址

[API Design in Node.js, v3](https://frontendmasters.com/courses/api-design-nodejs-v3/)

## 环境配置

### 在 macOS 上安装 MongoDB

参考 [Install MongoDB Community Edition on macOS](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)。

简而言之，就是通过 Homebrew 安装 MongoDB，并按照官方建议，用 brew 将 MongoDB 以服务的方式运行在后台。

## Express 中间件

### 适用场景

可对传入的请求进行验证、转换、追踪、错误处理等各种常用功能。

### 定义

下面的代码展示了一个中间件的定义和使用。

// TODO

为什么 app.use(log()) 这种调用格式会出错？

```js
const log = (req, res, next) => {
  console.log('logging')
  next()
}

app.use(log)
```

### next

在定义中间件的代码里，next() 的作用，就是让当前中间件处理完请求之后，将请求继续往下传下去。而不是像控制器那样，用 res.send() 或 res.end() 作出响应并结束请求。

在 Express 中，就是 next() 将中间件们串起来的，这样才能依次让各个中间件处理请求。

### 使用

下面几种都是中间件的使用方式。

```js
// 1. 处理所有请求
app.use(cors())
// 2. 只处理特定路由
app.get('/', log, (req, res) => { ... })
// 3. 只对特定路由调用若干中间件
app.get('/', [log1, log2, log3], (req, res) => { ... })
```

### 作用

对传入请求，以确定的顺序执行一系列处理函数。

```js
// 下面的中间件将严格按调用顺序执行
app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))
```

### 中间件互相通信

如何在一个中间件中，将错误，或者普通的消息传到下一个中间件，或者控制器中？

很简单，将数据附加到传入请求（request ）上即可。这样不管是在其后的中间件，或者控制器中，都可以调用所附加的数据。

```js
const log = (req, res, next) => {
  console.log('logging')
  req.myData = 'hahahaha'
  next()
}

app.get('/', log, (req, res) => {
  res.send({ message: req.myData })
})
```

### 错误处理

如果往中间件里的 next() 函数传入了参数，则参数会被当做错误进行处理。比如一个验证请求的中间件，发现请求不合法时，就可以向 next() 传入参数，然后在另一个专门处理错误的中间件中进行处理。

// TODO

如果在中间件的 next() 函数之前抛出错误，那么调用了该中间件的控制器，在满足错误抛出条件的情况下，控制器里的代码不会被执行。

但是，即使改为在 next() 函数里抛出错误，调用了该中间件的控制器，在满足错误抛出条件的情况下，控制器里的代码依然不会被执行。那两者有什么区别呢？区别只是在于，next() 中抛出的错误，能够被再之后的中间件接住并处理？

### 注意

虽然中间件可以像控制器一样对请求作出响应，但不建议这么做。

## Express 路由

### 匹配模式

下面是 Express 中的四种路由匹配模式，在编写 RESTful API 时，前两种最为常用。

```js
// 严格匹配
app.get('/data')

// 参数匹配
app.get('/:id')
// 正则匹配
app.get('^(me)')
// glob匹配
app.get('/user/*')
```

### REST API

HTTP 方法和具体的路由结合起来，就是 REST API。

```js
// CRUD
// Create → put
app.post('/data')
// Read → get
app.get('/data')
// Update → put
app.put('/data')
// Delete → delete
app.delete('/delete')
```

### 顺序

如果同一个路由路径定义了两次，那么会按照定义的先后次序执行。

```js
// 执行完第一条匹配到的路由后就返回，得到 { data: 1 }
app.get('/', (req, res) => {
  res.send({ data: 1 })
})

app.get('/', (req, res) => {
  res.send({ data: 2 })
})
// 依次执行两条路由，得到 { data: 2 }
app.get('/', (req, res) => {
  next()
})

app.get('/', (req, res) => {
  res.send({ data: 2 })
})
```

### Router 与子 router(route?)

不同的 API 路径会需要不同的路由规则，比如一类 API 路径是用于返回 JSON 信息的，另一类 API 路径是用于调用机器学习接口的，那么这两类 API 可能就需要不同的验证规则，这个时候，为两类 API 设置各自的 router，就能实现这个需求了。

```js
// Router 用法示例
const router = express.Router()

router.get('/me', (req, res) => {
  res.send({ me: 'hello' })
})

app.use('/api', router)
```

### Router Verb Methods

对于 RESTful API 来说，CRUD 可以统一抽象为以下五种操作：

```js
const routes = [
  'get /cat',
  'get /cat/:id',
  'post /cat',
  'put /cat/:id',
  'delete /cat/:id'
]
```

虽然说这五种操作的 HTTP 方法各不相同，但是在路由的路径层面，其实只有两种。那有没有方法能够简化路由代码的编写呢？当然有，下面的代码就是：

```js
router.route('/cat')
  .get()
  .post()

router.route('/cat/:id')
  .get()
  .put()
  .delete()
```

## 测试

### 测试路由

router 的测试代码如下：

```js
// src/resources/item/__tests__/item.router.spec.js

import router from '../item.router'

describe('item router', () => {
  test('has crud routes', () => {
    const routes = [
      { path: '/', method: 'get' },
      { path: '/:id', method: 'get' },
      { path: '/:id', method: 'delete' },
      { path: '/:id', method: 'put' },
      { path: '/', method: 'post' }
    ]

    routes.forEach(route => {
      const match = router.stack.find(
        s => s.route.path === route.path && s.route.methods[route.method]
      )
      expect(match).toBeTruthy()
    })
  })
})
```

router 的业务代码如下：

```js
import { Router } from 'express'

const controller = (req, res) => {
  res.send({ message: 'hello' })
}

const router = Router()

router.route('/')
  .get(controller)
  .post(controller)

router.route('/:id')
  .get(controller)
  .put(controller)
  .delete(controller)

export default router
```

测试和业务的代码分别按照上面的方式写，测试就可正常通过。

## MongoDB

### Schema 与 Modal

Schema 相当于 Modal 的蓝图，它决定了 Modal 会有哪些属性，如何对 Modal 的属性进行验证、索引、hook（这个怎么翻译？）。

# API Design in Node.js, v3 课程学习笔记

这门课程是当初在研究 Node.js API 设计时在网上找到的，当时大致看了一下 GitHub 上对应项目的代码，觉得这门课程不错，于是买了一个月的 Frontend Masters 会员，把这门课程认真学了一遍，并且把关键部分都做了笔记。

### 课程地址

[API Design in Node.js, v3](https://frontendmasters.com/courses/api-design-nodejs-v3/)

### 环境配置

#### 在 macOS 上安装 MongoDB

参考 [Install MongoDB Community Edition on macOS](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)。

简而言之，就是通过 Homebrew 安装 MongoDB，并按照官方建议，用 brew 将 MongoDB 以服务的方式运行在后台。

### 注意事项

#### Yarn 及 NPM

因为课程已经是一年多以前的了，项目中的依赖库版本也没怎么更新，所以如果遇到用 Yarn 或 NPM 安装依赖库会失败的情况，比如 `bcrypt` 这个库，那么可以先删除对应的库，然后重新安装，这样会安装最新版，通常都能成功。

### Express 中间件

#### 适用场景

可对传入的请求进行验证、转换、追踪、错误处理等各种常用功能。

#### 定义

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

#### next

在定义中间件的代码里，next() 的作用，就是让当前中间件处理完请求之后，将请求继续往下传下去。而不是像控制器那样，用 res.send() 或 res.end() 作出响应并结束请求。

在 Express 中，就是 next() 将中间件们串起来的，这样才能依次让各个中间件处理请求。

#### 使用

下面几种都是中间件的使用方式。

```js
// 1. 处理所有请求
app.use(cors())

// 2. 只处理特定路由
app.get('/', log, (req, res) => { ... })

// 3. 只对特定路由调用若干中间件
app.get('/', [log1, log2, log3], (req, res) => { ... })
```

#### 作用

对传入请求，以确定的顺序执行一系列处理函数。

```js
// 下面的中间件将严格按调用顺序执行
app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))
```

#### 中间件互相通信

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

#### 错误处理

如果往中间件里的 next() 函数传入了参数，则参数会被当做错误进行处理。比如一个验证请求的中间件，发现请求不合法时，就可以向 next() 传入参数，然后在另一个专门处理错误的中间件中进行处理。

// TODO

如果在中间件的 next() 函数之前抛出错误，那么调用了该中间件的控制器，在满足错误抛出条件的情况下，控制器里的代码不会被执行。

但是，即使改为在 next() 函数里抛出错误，调用了该中间件的控制器，在满足错误抛出条件的情况下，控制器里的代码依然不会被执行。那两者有什么区别呢？区别只是在于，next() 中抛出的错误，能够被再之后的中间件接住并处理？

#### 中间件和控制器

虽然中间件可以像控制器一样对请求作出响应，但不建议这么做。

中间件用于将数据进行处理之后，传给后续的中间件或路由进行下一步处理。而控制器则用于对数据进行处理，并将处理后的结果返回给 API 调用者。

可以将控制器理解为请求栈中，最终的那个中间件。

### Express 路由

#### 匹配模式

下面是 Express 中的四种路由匹配模式，在编写 REST API 时，前两种最为常用。

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

#### REST API

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

#### 顺序

如果同一个路由路径定义了两次，那么会按照定义的先后次序执行。

```js
// 执行完第一条匹配到的路由，返回 { data: 1 }
app.get('/', (req, res) => {
  res.send({ data: 1 })
})

app.get('/', (req, res) => {
  res.send({ data: 2 })
})

// 依次执行两条路由，返回 { data: 2 }
app.get('/', (req, res) => {
  next()
})

app.get('/', (req, res) => {
  res.send({ data: 2 })
})
```

#### Router 与子 routes

不同的 API 路径会需要不同的路由规则，比如一类 API 路径是用于返回 JSON 信息的，另一类 API 路径是用于调用机器学习接口的，那么这两类 API 可能就需要不同的验证规则，这个时候，为两类 API 设置各自的 router，就能实现这个需求了。

```js
// Router 用法示例 /api/me
const router = express.Router()

router.get('/me', (req, res) => {
  res.send({ me: 'hello' })
})

app.use('/api', router)
```

#### Router Verb Methods

对于 REST API 来说，CRUD 可以统一抽象为以下五种操作：

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

### Express 控制器

#### 与中间件的区别

前面讲过两者之间的区别，而控制器唯一表现得像中间件的时候，就是它需要将捕捉到的错误传给专门处理错误的中间件的时候，这时需要调用 next() 将错误传下去才行。

除此之外，控制器都是请求栈的终点，在控制器中完成最后的处理之后，就结束请求，返回调用端所需的内容。

#### 编码规范

通常在控制器中设置 HTTP 响应的状态码，并填入所需返回的内容，然后就向 API 的调用端发回响应。

```js
(req, res) => {
  res.status(200).send({ message: 'hello' })
}
```

不建议在响应已经发出之后再做操作。一个好的编码习惯，就是在返回响应的语句前面显示加上 `return`，这样开发者就能意识到响应已经结束，不要再做后续操作了。

当然了，也会有极其罕见的例外情况，比如 Stripe 这类支付 API，需要优先响应用户的请求，然后可能需要再做后续操作，不过这种情况遇到了再额外讨论。

另外也不建议在返回响应的语句后面再调用 `next()`，同样无法保证代码不会出问题。

#### REST API 控制器的通用化

因为 REST API 将所有内容都视为“资源”，那么对于一般的资源来说，所需进行的操作都是相同的：CRUD。比如在这门课程中所示范的 TO-DO APP，对于待办事项列表（list），及每个列表中的待办事项（item），都会有这几项操作：getMany，getOne，createOne，updateOne，removeOne。由于这几项操作对各类资源其实是相同的，那么就可以为每种操作只定义一个通用的控制器，然后在各类资源中均调用这个控制器即可，这样就提高了代码的复用性。

#### 简单示例

```js
// src/resources/item/item.controllers.js

import { Item } from './item.model'
import mongoose from 'mongoose'
import { connect } from '../../utils/db'

const run = async () => {
  await connect('mongodb://localhost:27017/api-test')
  
  const item = await Item.create({
    name: 'Clean up',
    createdBy: mongoose.Types.ObjectId(), // 创建一个 fake ObjectId
    list: mongoose.Types.ObjectId() // 创建一个 fake ObjectId
  })
  
  console.log(item)
}

run()
```

执行 `npm run build` 编译代码，然后执行 `node dist/resources/item/item.controllers.js` 运行上面的代码，就会在终端得到如下结果，说明创建文档的代码执行成功了。

```bash
{
  status: 'active',
  _id: 5e258de33d0523c9503570a0,
  name: 'Clean up',
  createdBy: 5e258de33d0523c95035709e,
  list: 5e258de33d0523c95035709f,
  createdAt: 2020-01-20T11:24:19.069Z,
  updatedAt: 2020-01-20T11:24:19.069Z,
  __v: 0
}
```

#### CRUD

Mongoose API 与 CRUD 对应关系如下：

- C - `Model.create()`, `new Model()`
- R - `Model.find()`, `Model.findOne()`, `Model.findById()`
- U - `model.update()`, `Model.findByIdAndUpdate()`, `Model.findOneAndUpdate()`
- D - `model.remove()`, `Model.findByIdAndRemove()`, `Model.findOneAndRemove()`

```js
// Create One
const item = await Item.create({ ... })

// Read One
console.log(await Item.findById(item._id).exec())

// Read Many
console.log(await Item.find().exec())

// Update One
const updated = await Item.findByIdAndUpdate( item._id, { name: 'eat' }, { new: true }).exec()
console.log(updated)

// Remove One
const removed = await Item.findByIdAndRemove(item._id).exec()
console.log(removed)
```

#### “面向测试”编写 CRUD Controllers

说明：

- CRUD Controllers 定义文件：`src/utils/crud.js`
- 测试用例文件：`src/utils/__tests__/crud.spec.js`

在测试用例 `crud.spec.js` 中，定义了上一小节五种 CRUD 所需满足的条件。

以 `getOne` 为例，在其 `describe` 函数中，定义了需测试的两种情况，一种是 `test('finds by authenticated user and id')`，另一种是 `test('404 if no doc was found')`，也就是 `getOne` 成功和失败时所应满足的不同条件。先看前一种，即 `getOne` 成功时所应满足的条件。

在 `test('finds by authenticated user and id')` 函数中，有如下代码。

```js
const req = {
  params: {
    id: list._id
  },
  user: {
    _id: user
  }
}
```

也就是说在传入请求（request）中，`params` 参数中会传入 `id` 这个字段，而 `user` 参数中会传入 `_id` 这个字段。

那么在 `src/utils/crud.js` 文件中，就需要把这两个字段用起来：

```js
export const getOne = model => async (req, res) => {
  const id = req.params.id
  const userId = req.user._id
}
```

而在 `test()` 函数的后半部分，又有如下代码。

```js
const res = {
  status(status) {
    expect(status).toBe(200)
    return this
  },
  json(result) {
    expect(result.data._id.toString()).toBe(list._id.toString())
  }
}
```

这段代码要求被测试代码所返回的请求，其状态码应当为 `200`，并且所返回的 JSON 中，文档的属性名要定义为 `data`。

那么在 `src/utils/crud.js` 文件中，就需要编写如下代码：

```js
const doc = await model.findOne({ _id: id, createdBy: userId }).exec()

return res.status(200).json({ data: doc })
```

上面代码中，第一行的查询语句不需多说，后面的 `status(200)` 用于设置 HTTP 响应状态码。这里要说明一下，如果返回数据用的是 `res.send()`，那么 HTTP 响应状态码默认就是 `200`。但这次的测试用例中，要求返回的是 JSON，没有这个默认设置，所以需要主动设置一下。

而后面的 `.json({ data: doc })`，则是将查询到的文档赋给所需返回对象的 `data` 字段值，并用 `json()` 函数处理成 JSON，然后返回。

这里有一点要注意：将数据用对象的一个字段名进行命名是一种好习惯，以便于调用端了解 API 所返回的究竟是什么内容，是数据（data）还是错误（error），或者是别的什么信息。如果直接返回查询到的数据，比如 `res.send(doc)`，前端还需要进行很多额外的判断，比如区分这是查询到的数据还是报错还是别的什么，就会增加很多工作量，也容易出错。

### Auth

#### 概念辨析

- Authentication: 身份验证/鉴权，用于判断传入的请求是否能被放行，比如用户相关的 API 要求调用端必须附带用户信息。
- Authorization: 授权，用于判断传入的请求是否有权限执行特定操作，比如用户相关的 API 禁止普通用户删除其它用户。
- Identification: 身份识别，用于判断是谁传入的请求，包括物理设备，运行环境，UserAgent 等等。

#### JWT 身份验证

- JWT 可以实现**无状态**的用户身份验证。而 session 和 cookie 实现的是**有状态**的用户身份验证，需要将 session 或 cookie 存储在服务端。
- JWT 身份验证是一种 bearer token stratagy，有了 bearer token，服务端就可以验证客户端的请求 header 中的 token。和 API Key 一样，JWT 也是诸多 bearer 验证方法中的一种。
- 要创建 JWT，需要 API secret 以及 user object 之类的 payload。服务端分别对 secret 和 payload 进行 hash，然后再将两者结合，生成 JWT？其中前端传来的 payload，最好是能够识别用户身份的，比如用户的角色、ID 之类的数据。
- JWT 是在服务端创建 token，并将其发给验证过的客户端的。之后客户端每次向服务端发送请求时，都要带上这个 token，后端就可以先 authentication，对请求进行鉴权；然后再 identification，识别用户的身份；最后再由 controller 决定是否要 authorization，即授权。
- 服务端每次接收到请求时，先判断 token 是否是用自己的 secret 生成的，如果是，那么就能够拿到其中的 payload，即用户数据，然后就可以在后端的各个环节中使用了。

### 接口测试

#### 测试路由

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

### MongoDB & Mongoose

#### Schema 与 Modal

Schema 和 Modal 的关系，是不是可以理解为 Class 和 Object 之间的关系？

Schema 决定了 Modal 有哪些字段，如何对 Modal 的字段进行验证、索引、hook（这个怎么翻译？）等等。

#### 实例

```js
import mongoose from 'mongoose'

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // 该字段不能为空
      trim: true, // 可删除首尾的空白字符
      maxlength: 50 // 设置字段最大长度
    },
    status: {
      type: String,
      enum: ['active', 'complete', 'pastdue'], // 字段值从这几个中枚举
      default: 'active' // 字段的默认值
    },
    due: Date,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user' // TODO: 从 user 这个 Modal 中查找其 ObjectId 的值？
    }
  },
  { timestamps: true }
)

// 下面的索引设置，规定了每个 list 中的 name 必须唯一
// 如果交换 list 和 name 的顺序，则要求每个 name 中的 list 必须唯一
itemSchema.index({ list: 1, name: 1 }, { unique: true })

export const Item = mongoose.model('item', itemSchema)
```

#### exec

在 Mongoose 中，查询语句之后如果不加上 `.exec()`，那么返回的是假的 Promise；加上 `.exec()` 之后，就相当于告诉 Mongoose，我的查询语句写完了，现在正式开始查询吧，这个时候得到的才是真正的 Promise。

```js
const item = await Item.create({ ... })
console.log(await Item.findById(item._id).exec())
```

参考资料：[Mongoose - What does the exec function do?](https://stackoverflow.com/questions/31549857/mongoose-what-does-the-exec-function-do)

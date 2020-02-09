# React 官方教程学习笔记

记录了学习 React 官方教程中的关键知识点。

> 教程链接：[https://reactjs.org/tutorial/tutorial.html](https://reactjs.org/tutorial/tutorial.html)

## 基础环境

用 [Starter Code](https://codepen.io/gaearon/pen/oWWQNa?editors=0010) 中的脚手架代码作为基础，开始学习。

## 组件定义

React 组件是这样定义的（基于 `React.Component` 这个子类）：

```js
class ShoppingList extends React.Component {
  render() {
    return (
      <div className="shopping-list">
        <h1>Shopping List for {this.props.name}</h1>
        <ul>
          <li>Instagram</li>
          <li>WhatsApp</li>
          <li>Oculus</li>
        </ul>
      </div>
    );
  }
}

// Example usage: <ShoppingList name="Mark" />
```

上面定义的 `ShoppingList` 是一个 **React component class**，也叫 **React component type**。

组件接收的入参，在这里有个专门的叫法：`props`（properties 的缩写）。

组件返回的是一组具有层级结构的视图，通过 `render()` 方法显示出来。这一组视图，既是一个 React 元素，也可以看做是对要显示内容的 **description**（描述）。

上面定义组件的代码中，`render()` 方法里的 HTML 代码之所以可以和正常的 HTML 一样写，是因为用到了 **JSX** 这种语法。如果不用这种语法的话，代码就得写成下面这样，那显然就麻烦多了：

```js
return React.createElement('div', {className: 'shopping-list'},
  React.createElement('h1', /* ... h1 children ... */),
  React.createElement('ul', /* ... ul children ... */)
);
```

JSX 语法可以充分发挥 JavaScript 的强大功能，你可以把任何 JS 表达式放到 JSX 的大括号中，它都能处理。

每个 React 组件都是一个 JavaScript 对象，你可以在这个对象中存储变量，也可以把这个对象传到别的地方用。

## 利用 Props 传值

在父组件 Board 中，向 `value` 这个 props 传入值：

```js
class Board extends React.Component {
  renderSquare(i) {
    // 注意这里传入的 i 用大括号括起来了
    // 这样 JSX 语法就知道这是个表达式，要对其值进行解析
    return <Square value={i} />
  }
}
```

在子组件 Square 中，就可以用 `this.props.value` 调用所传入的值了，注意，这里也是用大括号来解析表达式：

```js
class Square extends React.Component {
  render() {
    return (
      <button className="square">
        {this.props.value}
      </button>
    );
  }
}
```

上面的代码，说明了在 React 中应当如何从父组件向子组件传入数据。

## 为组件添加交互性

对子组件 Square 进一步修改，就可以使其具有交互性：

```js
class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={function() {alert('click')}}>
        {this.props.value}
      </button>
    );
  }
}
```

在 `button` 元素中，添加 `onClick={function() {alert('click')}}`，或者 `onClick={() => alert('click')}` 这么一行代码之后，每次点击 `Square` 组件时，就会触发所绑定的代码。

在这里要注意，如果用 ES6 语法，代码应当为 `onClick={() => alert('click')}`，而不是 `onClick={alert('click')}`。如果用后一种方式，那么每次组件重新渲染时，都会触发所绑定的代码，而不是在点击时才触发。

## 为组件添加状态（state）

下面的代码，能够为 Square 组件添加状态：

```js
class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      <button
        className="square"
        onClick={() => {this.setState({ value: 'X' })}}>
        {this.state.value}
      </button>
    );
  }
}
```

具体来说，通过在 React 组件的构造函数（constructor）中设置 `this.state` 的值，就可以让组件具有状态，可以把 `this.state` 看做是各 React 组件的私有属性。

另外，在 JavaScript 的类（class）中，定义子类（subclass）的构造函数时，必须调用 `super` 方法。对于 React 的组件类（component class），只要具有构造函数，那么构造函数内就必须以 `super(props)` 这行代码开头。

上面构造函数中的代码，只是用于初始化状态，而设置状态的代码，则在 `render()` 方法中。`this.setState()` 方法就是用于设置组件状态的。

这里有一点要注意，在一个组件中调用 `setState()` 方法之后，React 会自动更新其所有子组件（的状态？）。

## 状态提升（Lifting State Up）

对于一个父组件有多个子组件的情况，要管理这些子组件的状态的话，在父组件中进行统一管理比较合理。如果每个子组件都管理自己的状态，就会显著增加代码的复杂度，也更容易出 bug，后期想要重构代码也会比较麻烦。

要从多个子组件中获取数据，或者要让子组件之间进行交互，在父组件中声明一个共享状态（shared state）即可。这样一来，父组件可以利用 props 将状态传递给各个子组件，从而可以使子组件之间的状态互相同步，也能够让子组件和父组件之间的互相同步。

在重构 React 组件时，将子组件中的状态提升到父组件中，是很常见的一种方式。

在实际代码中，用于保存状态的构造函数 `constructor()` 写在父组件中：

```js
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }
}
```

并修改父组件中调用子组件的代码：

```js
renderSquare(i) {
  return (
    <Square
      value={this.state.squares[i]}
      onClick={() => this.handleClick(i)}
    />
  );
}
```

这样一来，父组件就向子组件传入了两个 props：`value` 和 `onClick`。`onClick` 这个 prop 是一个函数，供子组件使用。

然后，子组件就从之前调用状态中的变量，改为调用父组件通过 props 传来的变量。同时之前用于初始化状态构造函数，这时候也可以去掉了。

```js
class Board extends React.Component {
  render() {
    return (
      <button
        className="square"
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    )
  }
}
```

写到这里，对最新的代码流程做一遍梳理：

1. 在子组件的 `<button>` 元素上，所绑定的 `onClick` 这个 prop，建立了对点击事件的监听。
2. 当点击 button 时，React 会调用子组件 `render()` 方法中所定义的事件句柄 `onClick`。
3. 这个事件句柄会调用 `this.props.onClick()`，而子组件的 `onClick` 这个 prop 则是在父组件中定义的。
4. 因为父组件向子组件传入了 `onClick={() => this.handleClick(i)` 这么一行代码，所以点击子组件时，实际上调用的是 `this.handleClick(i)`。
5. 不过 `handleClick()` 方法父组件中还没有定义，接下来就把它定义了。

注意：子组件 `<button>` 元素的 `onClick` 属性，其实是 React 的内置组件。在 React 中，通常用 `on[Event]` 这种格式来命名表示**事件**的 props，并用 `handle[Event]` 这种格式来命名处理对应事件的函数。

接下来定义上面说到的 `handleClick()`：

```js
handleClick(i) {
  const squares = this.state.squares.slice();
  squares[i] = 'X';
  this.setState({square: square});
}
```

这种情况下，各子组件不再维护自身状态，而是统一由父组件来控制。在 React 中，这样的子组件叫做**受控组件**（controlled component），父组件全权控制这些子组件。

注意，在上面 `handleClick()` 函数的代码中，用 `slice()` 方法创建了原数组的一份拷贝，这样就不会影响原数组。

## 不可变性的重要性

- 化繁为简：像很多软件中的“撤销”、“重做/恢复”这样的功能，如果采用直接修改原始数据的方式，这类功能就很难实现；但是如果实现了数据的不可变性，那么这类功能实现起来就简单多了。
- 监测变化：对于可变对象，因为是直接对其进行修改，所以要监测变化是很困难的，要实现这样的监测，需要将其与自身之前的拷贝相对比，要遍历整个对象树才行。对于不可变对象来说，这件事就简单多了，如果所引用的不可变对象与之前不同，那肯定就是发生变化了。
- 决定渲染时机：不可变性最大的一个优点，就是可以用来建立**纯组件**。由于不可变性的上一条优点，使用了不可变数据的组件，可以很方便地决定何时该重新渲染。感兴趣的读者，可以自行查阅有关 `shouldComponentUpdate()` 方法的资料，或者阅读 [Optimizing Performance](https://reactjs.org/docs/optimizing-performance.html#examples) 这一节。

## 函数组件

对于只有一个 `render()` 方法，没有自己状态组件，把它写成**函数组件**（function component）更合适。这样就不需要再定义一个扩展了 `React.Component` 的类，只需要写一个函数，接收 `props` 作为参数，并返回所需渲染的内容即可。函数组件干净清爽，很多组件都可以写成函数组件，比如之前的子组件就可以这样写：

```js
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
```

注意：将原本的组件简化为函数组件后，绑定点击事件的代码也精简成了 `onClick={props.onClick}`，有没有注意到在这个时候，大括号里并不是一个完整的函数定义，而只是一条表达式？

## 撤销/重做

如何实现“撤销/重做”这样的功能？就拿这个官方教程中用来练手的黑白棋来说，每下一步棋，就会显示这一步的操作；点击之前的某一步棋，就会将游戏退回到之前的状态。看起来很简单的一个操作，具体是怎么实现的呢？对之前的自己来说，是完全想不到该如何实现的。

不过这次看了官方教程的代码之后，又觉得怎么会这么简单？在教程前面的部分，已经能够实时显示每下一步棋之后的棋面，进一步来说，如果能够保存每步棋的棋面，那不就可以恢复到这盘棋的任意时刻了？是的，把道理想清楚之后，之前觉得毫无头绪的问题，现在就是这么简单。

## 知识梳理

### 定义组件

```js
class ComponentName extends React.Component {
  render() {
    return (
      <div>
        <div></div>
        <div></div>
      </div>
    )
  }
}
```

1. 建议使用 JSX 语法，代码清晰、简洁；
2. `return` 语句中的 HTML，根元素只能有一个，不能有多个同级别的根元素。

### 组件传值

```js
class Father extends React.Component {
  render() {
    return (
      <Son name="Henry" height={heightOfFather * 1.12} />
    );
  }
}

class Son extends React.Component {
  render() {
    return (
      <div class="son">
        <div class="name">
          {this.props.name}
        </div>
        <div class="height">
          {this.props.height}
        </div>
      </div>
    );
  }
}
```

1. 父组件调用子组件时，在子组件名之后所写的赋值表达式，就是在利用 props 向子组件传值；
2. 父组件向子组件传值时，如果传递的是常量，则直接写在等号右侧即可，如果传递的是变量，则要用大括号 `{}` 括起来；
2. 子组件通过 `this.props.name` 这样的表达式，调用父组件传入的值。

### 组件绑定事件

```js
class Son extends React.Component {
  render() {
    return (
      <div
        class="son"
        onClick={() => alert('papa!')}
      >
      </div>
    );
  }
}
```

1. 事件所对应的函数，也就是上面 `onClick=` 右侧大括号内的代码，如果用 ES6 语法，且函数体只有一行代码，则写法为：`() => statement`，不同于 ES5 需要用大括号括起来的方式，相对来说更简洁一点；

### 组件状态

```js
class Child extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mood: 'happy',
    };
  }

  render() {
    return (
      <div
        class="child"
        onPat={() => this.setState({mood: 'unhappy'})}
      >
        {this.state.mood}
      </div>
    );
  }
}
```

1. 用构造函数 `constructor(props) {...}` 初始化状态；
2. `super(props);` 必须为构造函数体代码的第一行；
3. 构造函数中的 `this.state` 为实际初始化状态的代码；
4. `this.setState()` 可设置状态；
5. `this.setState()` 设置状态后，用到状态的所有子组件，会自动更新；
6. `this.state.mood` 可获取状态。

### 状态提升

```js
class Father extends React.Component {
  constructor(props);
  super(props);
  this.state = {
    presents: Array(4).fill(null),
  };

  selectPresent(i) {
    const presents = this.state.presents.slice();
    presents[i] = randomPickPresent();
    this.setState({presents: presents});
  }

  renderChild(i) {
    return (
      <Child
        present={this.state.presents[i]}
        onClick={this.selectPresent(i)}
      />;
    )
  }

  render() {
    return (
      <div>
        {this.renderChild(0)}
        {this.renderChild(1)}
        {this.renderChild(2)}
        {this.renderChild(3)}
      </div>
    );
  }
}

class Child extends React.Component {
  render() {
    return (
      <div
        class="child"
        onClick={() => this.props.onClick()}
      >
        {this.props.present}
      </div>
    );
  }
}
```

1. 子组件的状态，统一在父组件中管理；
2. 父组件将状态通过 props 传给子组件：`<Child present={this.state.presents[i]} onClick={this.selectPresent(i)} />`；
3. 对子组件来说，接收父组件通过 props 传入的值即可：`this.props.present`，`this.props.onClick()`。

### 函数组件

```js
function Child(props) {
  return (
    <div
      class="child"
      onClick={props.handleClick}
    >
      {props.present}
    </div>
  );
}
```

1. 只有一个 `render()` 方法，无自有状态的组件，写成函数组件就完事儿了，省心；
2. 普通的组件是通过 `this.props` 接收入参，函数组件则直接将 `props` 作为入参；
3. 因为将 `props` 作为入参，所以绑定的事件可以简写为 `onClick={props.handleClick}`，这里省略掉了函数名后的小括号 `()`。

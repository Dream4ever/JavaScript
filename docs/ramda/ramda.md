# ramda

## R.filter

```js
// 检查是否为偶数，函数名和函数实际功能不一样，可要仔细哦
var isEven = n => n % 2 === 0;
// 照猫画虎，检查是否等于4
var isFour = n => n === 4;
// 再来，检查是否为空。为什么前面加一个下划线？测试了好一会儿才注意到错误提示，才发现原来 ramda 自带 isEmpty 方法
var _isEmpty = n => n === undefined || n === null;

// 自带的两个示例，都传入了两个参数
// R.filter(isEven, [1, 2, 3, 4]);
// R.filter(isEven, {a: 1, b: 2, c: 3, d: 4});

// 测试一下传入一个参数行不行？当然行！
// 但是！第一个 filter 是 ramda 的方法，而后两个是 Array 的方法，因为它俩功能相同，所以刚好得到了预期中的结果
R.filter(isEven)([1, 2, 3, 4]).filter(isFour).filter(_isEmpty);
```

## R.uniq

```js
R.uniq([1, 2, [1], '1']); //=>[1, 2, [1], "1"]
// 会过滤掉对象，只对数组去重
R.uniq([1], {a : 1}); //=> [1]
// 只接收一个参数，如果传入多个参数，而且参数都不是数组，啊哈，返回的就是空数组了
R.uniq(1, 1, 2, 1, 1); //=> []
// 只对第一个参数且参数为数组时去重
R.uniq([1, 2, 3], [1, 2]); //=> [1, 2, 3]
R.uniq({a: 1}, [1]); //=> []
```

## R.map

```js
var double = x => x * x;
var opposite = x => -x;
var arr = [1, 2, 3];
var obj = { x: 1, y: 2, z: 3 };

R.map(double)(arr); //=> [1, 4, 9]
R.map(double)(obj); //=> {"x": 1, "y": 4, "z": 9}

var comp1 = R.compose(R.map(double), R.map(opposite));
comp1(arr); //=> [1, 4, 9]

// 文档中有这么一句
// Also treats functions as functors and will compose them together.
// 所以 comp2 和 comp1 是相同的
var comp2 = R.map(opposite)(double);
R.map(comp2)(arr); //=> [-1, -4, -9]
```

## R.curry

```js
var f = (a, b, c) => "Welcome " + a + ", this is " + b
  + " and " + c + ", have a good day!";

f('Jimmy', 'Henry', 'Jersey');
//=> "Welcome Jimmy, this is Henry and Jersey, have a good day!"

var g = R.curry(f);

g('Jimmy')('Henry', 'Jersey');
g('Jimmy')('Henry')('Jersey');
g('Jimmy', 'Henry')('Jersey');

// 占位符的用法，注意等号左边是一个下划线，右边是两个
var _ = R.__;
// 占位符是最前面的几个连续的参数，则在后续的参数中按顺序传入
g(_, 'Henry', 'Jersey')('Jimmy');
g(_, _, 'Jersey')('Jimmy', 'Henry');
// 占位符分别在前面和后面的话，就按照下面的顺序传入参数
g(_, 'Henry')('Jimmy')('Jersey');
g(_, 'Henry')(_, 'Jersey')('Jimmy');

// 以上所有代码输出结果相同
```

## R.compose

```js
var classyGreeting = (firstName, lastName) => "The name's " + lastName
  + ", " + firstName + " " + lastName;
var yellGreeting = R.compose(R.toUpper, classyGreeting);
yellGreeting('James', 'Bond'); //=> "THE NAME'S BOND, JAMES BOND"

// compose 中的函数是从右到左执行的
R.compose(Math.abs, R.add(1), R.multiply(3))(-3); //=> 8
```

## R.clone

```js
var obj = [{}, {}, {}];
var objClone = R.clone(obj);

obj === objClone; //=> false
obj[0] === objClone[0]; //=> false

obj[0] = { x: 1 };
obj; //=> [{"x": 1}, {}, {}]
objClone; //=> [{}, {}, {}]

var f1 = x => x * 2;
var f2 = R.clone(f1);

f1(5); //=> 10
f2(5); //=> 10

f1 = x => x * 2 - 1;

f1(5); //=> 9
f2(5); //=> 10
```

## R.propEq & R.whereEq

```js
var abby = {name: 'Abby', age: 7, hair: 'blond'};
var fred = {name: 'Fred', age: 12, hair: 'brown'};
var rusty = {name: 'Rusty', age: 10, hair: 'brown'};
var alois = {name: 'Alois', age: 12, hair: 'brown', disposition: 'surly'};
var kids = [abby, fred, rusty, alois];

// 检查一个属性相同的对象
var hasBrownHair = R.propEq('hair', 'brown');
R.map(R.prop('name'), (R.filter(hasBrownHair, kids))); //=> ["Fred", "Rusty", "Alois"]

// 检查多个属性相同的对象
var age12 = R.whereEq({ age: 12, hair: 'brown' });
R.map(R.prop('name'), R.filter(age12)(kids)); //=> ["Fred", "Alois"]
```
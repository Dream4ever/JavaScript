# 50 天学会数据结构

## 07. 根据条件过滤数组

### 题目

- [根据条件过滤数组](https://mp.weixin.qq.com/s/h9gi9X211SEpWUsKW1pQqA)

### 题目描述

函数接受两个参数，第一个参数 `array` 是需要被过滤的数组，第二个参数 `condition` 是根据过滤条件对数组进行过滤的函数。

看了看后面的代码，函数 `condition` 依次接受三个参数 `value`、`index` 以及 `array`。不过看函数体里面的代码只用到了第一个参数，不知道后两个参数是做什么用的。

### 整体思路

本来打算自己先想想如何实现这个功能，可发现自己完全没思路，就把老徐的代码先看了一遍。

#### 变量初始化

首先是一些变量的声明及赋值，原始数组的索引 `index` 赋值为 -1 的原因将在下面说明，结果数组的索引正常赋值为 0，结果数组也正常赋值为空数组。

#### 数组长度检查

然后照例是对数组的长度进行检查：`length = array == null ? 0 : array.length`。

1. 如果传入的实参是 `null`、`undefined`、空字符串、空数组、函数，`length` 的值就为 0。
2. 如果传入的是数字、布尔值、对象，`length` 的值就为 `undefined`。
3. 如果传入的是非空字符串、非空数组，`length` 的值就为正数。

#### 循环条件设置

因为要对整个数组进行过滤，所以就需要遍历数组。而进行循环遍历的条件，就是指代当前数组元素的索引小于数组长度；否则索引一旦大于等于数组长度，就说明数组已经遍历完毕了，这个时候就可以停止循环遍历了。

因为在 `while` 循环体中，要用索引来依次指代每个数组元素，因此索引必须从 0 开始。而为了让 `while` 循环尽量精简，所以要把索引的自增表达式写在循环的判断中。结合这两个要求，就需要在程序最开始的时候，将 `index` 赋值为 -1，这样首次的自增后值为 0，刚好指向的也是数组的第一个元素。必须要说老徐的这个思路真是太精妙了！

#### 过滤数组元素

在每遍历到一个数组元素时，检查元素是否符合函数的条件，符合的话就放到结果数组中，这里用 `if(condition(value))` 进行判断，其中 `value` 是原数组当前的元素。

对于符合条件的元素，就用 `result[resIndex++] = value` 把当前元素保存到结果数组中。这里的 `resIndex++` 既能从 0 开始遍历结果数组，同时还能让 `resIndex` 在每次执行完该语句后自增，一举两得。不知道各位同学现在有没有体会到自增运算符的妙处？

最后在过滤完成之后，将结果数组返回即可。

### 代码测试

对老徐的代码分析完了，下面还需要对代码进行测试，看看在各种特殊情况下会有什么样的表现。在实际的业务开发中，各种 edge case（特殊情况）的测试都很有必要，就是为了保证代码有足够的健壮性。

```javascript
const number = 13;
print(filter(number, num => num > 10)); // => []

const nan = NaN;
print(filter(nan, num => num > 10)); // => []

const maxNum = Number.MAX_VALUE;
print(filter(maxNum, num => num > 10)); // => []

const isTrue = true;
print(filter(isTrue, isTrue => isTrue)); // => []

const isFalse = false;
print(filter(isFalse, isFalse => !isFalse)); // => []

const emptyStr = '';
print(filter(emptyStr, emptyStr => !emptyStr)); // => []

const str = 'abc';
print(filter(str, char => char > 'a')); // => [ 'b', 'c' ]

const scores = [100, '90', '80', 70, 60];
print(filter(scores, (item) => item === +item)); // => [ 100, 70, 60 ]

const emptyObj = {};
print(filter(emptyObj, emptyObj => emptyObj)); // => []

const obj = { a: '1' };
print(filter(obj, obj => obj.a)); // => []

const func = (a, b) => a > b
print(filter(func, func => func.length)) // => 会报错 => 代码需更正
```

从上面的执行结果可以看到，这个函数不仅能对数组进行过滤，还可以对字符串进行过滤。想起来犀牛书里面说的了么？“字符串在某种情况下也可以看成是字符数组”，这个时候是不是有了更深的理解呢？

## 08. 根据数组路径查找对象属性值

### 题目

- [根据数组路径查找对象属性值](https://mp.weixin.qq.com/s/v0yQurxUaexn_XpRJYPa1w)

### 题目描述

函数 `getValue` 接受三个参数，前两个参数必选，第一个参数为对象，第二个参数为数组，第三个可选参数为默认值。

以数组的元素为对象中属性值的查找路径，比如有对象 `{ 'a': [{ 'b': { 'c': 3 }}] }`，数组 `['a', '0', 'b', 'c']`，查找方法如下：

- 先在对象中查找属性 `'a'` 的值，为 `[{ 'b': { 'c': 3 }}]`；
- 然后在该数组中查找下标为 0 的元素的值，为 `{ 'b': { 'c': 3 }}`；
- 接着在该对象中查找属性 `'b'` 的值，为 `{ 'c': 3 }`；
- 最后在对象中查找属性 `'c'` 的值，为 3；
- 此时数组元素已遍历完毕，并且找到了所需的值，返回最后找到的值：3；
- 如果按给定的数组，无法在对象中找到对应属性的值，且未传入第三个可选参数，则返回 `undefined`；
- 如果无法找到属性值，但传入了第三个可选参数，则返回第三个参数的值。

> 疑问：如果能找到属性值，但也传入了第三个可选参数，那么就用找到的属性值？还是用第三个可选参数的值？按通常的思路来说，应该是就用找到的属性值吧，第三个可选参数是处理异常情况的，那么正常情况下就用不着它，所以老徐的示例代码中也没有给出这种情况。

### 整体思路

这次又变了一下思路，先看一下最前面的题目描述，再看一下最后的示例代码，两者结合起来，就知道这次要实现什么功能了。下面就把自己最初的思路写出来：

- 如果对象为空，或者数组为空，就返回 `undefined`：
  - 对象为空的条件，就是该对象没有自有/继承属性，也就是用 `for (p in obj)` 语句枚举得到的对象属性为空；
  - 数组为空的条件，就是该数组的 `length` 属性为 0。
- 两者都不为空，那么就可以用数组来查找对象中的属性了：遍历数组每个元素，查找对应的属性值；
  - 如果属性值不是对象类型（数组也是对象类型），就认为查找已经完成，返回当前找到的值即可；
  - 如果属性值是对象类型（含数组），那么就继续查找；
  - 如果当前已遍历至数组的最后一个元素，那么也认为查找已经完成，返回当前找到的值即可，为了满足这样的判断，用 `while` 循环就比较方便了；
  - 如果找不到与当前元素相同的属性名，则结束查找，返回 `undefined`；
- 如果遍历完成后，最终返回的是 `undefined`，并且传入了第三个参数，则返回第三个参数的值。

后面开始写代码的时候，才发现上面这个思路太复杂了，嗯，需要好好精简一下。

### 代码编写

```javascript

```


### 代码测试

对老徐的代码分析完了，下面还需要对代码进行测试，看看在各种特殊情况下会有什么样的表现。在实际的业务开发中，各种 edge case（特殊情况）的测试都很有必要，就是为了保证代码有足够的健壮性。

```javascript
const number = 13;
print(filter(number, num => num > 10)); // => []

const nan = NaN;
print(filter(nan, num => num > 10)); // => []

const maxNum = Number.MAX_VALUE;
print(filter(maxNum, num => num > 10)); // => []

const isTrue = true;
print(filter(isTrue, isTrue => isTrue)); // => []

const isFalse = false;
print(filter(isFalse, isFalse => !isFalse)); // => []

const emptyStr = '';
print(filter(emptyStr, emptyStr => !emptyStr)); // => []

const str = 'abc';
print(filter(str, char => char > 'a')); // => [ 'b', 'c' ]

const scores = [100, '90', '80', 70, 60];
print(filter(scores, (item) => item === +item)); // => [ 100, 70, 60 ]

const emptyObj = {};
print(filter(emptyObj, emptyObj => emptyObj)); // => []

const obj = { a: '1' };
print(filter(obj, obj => obj.a)); // => []

const func = (a, b) => a > b
print(filter(func, func => func.length)) // => 会报错 => 代码需更正
```

从上面的执行结果可以看到，这个函数不仅能对数组进行过滤，还可以对字符串进行过滤。想起来犀牛书里面说的了么？“字符串在某种情况下也可以看成是字符数组”，这个时候是不是有了更深的理解呢？
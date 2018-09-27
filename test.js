const print = console.log

/* 01. 判断输入值为有效的数组长度 */
/* function isLegalLength(value) {
  let length = +value;
  if ((length != length)
    || (length < 0)
    || (length > Math.pow(2, 32) - 1)
    || (length % 1 != 0)) return undefined
  return length
}

print(isLegalLength(5))
// => 5
print(isLegalLength(-5))
// => undefined
print(isLegalLength(Math.pow(2, 32)))
// => undefined
print(isLegalLength(Math.pow(2, 32) - 1))
// => 4294967295
print(isLegalLength(NaN))
// => undefined
print(isLegalLength('1'))
// => 1
print(isLegalLength('Hello JS!'))
// => undefined
print(isLegalLength(false))
// => 0
print(isLegalLength(null))
// => 0
print(isLegalLength(undefined))
// => undefined
print(isLegalLength([]))
// => 0
print(isLegalLength([1, 2, 3]))
// => undefined
print(isLegalLength({}))
// => undefined
print(isLegalLength({ a: '1' }))
// => undefined
print(isLegalLength((a) => a > 0))
// => undefined */

/* 02. 将数字固定在范围内 */
/* function clamp(number, lower, upper) {
  number = +number
  lower = +lower
  upper = +upper

  if (isNaN(number)
    || isNaN(lower)
    || isNaN(upper)) return NaN
  
  if (upper < lower) lower = upper
  number = number <= lower ? lower : number
  number = number >= upper ? upper : number
  return number
}

print(clamp(undefined, 0, 10))
// => NaN
print(clamp(5, 0, NaN))
// => NaN
print(clamp(10, -1, '233'))
// => 10
print(clamp(23, 4, -5))
// => -5
print(clamp(1, '5', '6'))
// => 5 */

/* 03. 获取数组的第一个元素 */
/* function first(array) {
  return (array != null && array.length)
    ? array[0]
    : undefined;
}

print(first(1))
// => undefined
print(first(''))
// => undefined
print(first('Hello JS!'))
// => H
print(first(true))
// => undefined
print(first(null))
// => undefined
print(first(undefined))
// => undefined
print(first([]))
// => 
print(first([1, '2', 'a', 4]))
// => 1
print(first({ a: 1 }))
// => undefined
print(first((a, b) => a > b))
// => undefined */

/* 04. 拷贝数组 */
/* function copyArray(source, target) {
  if (isValidArray(source)) {
    if (!isValidArray(target)) return source;

    let index = -1;
    while (++index < source.length) {
      target[index] = source[index]
    }
    return target;
  } else {
    if (isValidArray(target)) return target;
    return [];
  }
} */

function isValidArray(array) {
  return (array != null && typeof array === 'object' && array.length);
}

function copyArray(source, target) {
  let index = -1;
  const length = isValidArray(source)
    ? source.length
    : undefined;
  
  isValidArray(target) || (target = new Array(length ? length : 0));
  while (++index < length) {
    target[index] = source[index];
  }
  return target;
}

print(copyArray([1, 2, 3]))
// => [1, 2, 3]
print(copyArray([1, 2, 3], {}))
// => [1, 2, 3]
print(copyArray([1, 2, 3], null))
// => [1, 2, 3]
print(copyArray('ab'))
// => []
print(copyArray([1, 2, 3], [0, 1]))
// => [1, 2, 3]
print(copyArray([1, 2, 3], [0, 1, 2, 3, 4]))
// => [1, 2, 3, 3, 4]
print(copyArray('abcd', [1, 2, 3, 4]))
// => [1, 2, 3, 4]
print(copyArray([], [1, 2, 3]))
// => [1, 2, 3]
print(copyArray([], 'defg'))
// => []
print(copyArray({}, []))
// => []
print(copyArray(() => {}, () => {}));
// => []
print(copyArray((a, b) => {}, () => {}));
// => []

/* 07. 根据条件过滤数组 */
/* function filter(array, condition) {
  let index = -1;
  let resIndex = 0;
  let result = [];
  let length = array == null ? 0 : array.length;

  while (++index < length) {
    const value = array[index];

    if (condition(value, index, array)) {
      result[resIndex++] = value;
    }
  }

  return result;
}

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
print(filter(func, func => func.length)) // => 会报错 => 代码需更正 */

/* 08. 根据数组路径查找对象属性值 */
/* function isEmptyObject(object) {
  for (p in object) return false;
  return true;
}

function getValue(object, path, defaultValue) {
  let result;
  if (isEmptyObject(object)) return (defaultValue !== undefined)
    ? defaultValue
    : undefined;
}

print(getValue({}, [])); // => undefined
print(getValue({}, [], null)); // => null */

/* 11. 遍历对象得到一个新的数组 */
/* function mapObject(object, iteratee) {
  const result = []

  // 排除掉数组和对象之外的所有类型
  // 这条语句最后如果不加分号，JS 解析器会认为下面的代码与这一行是相连的
  // 然后就会报错：[] is not a function，因为解析器解析成了
  // if (...) return [](iteratee ...) || ()
  if (object == null || typeof object !== 'object') return [];
  // 规范化迭代器函数
  (iteratee && (typeof iteratee === 'function')) || (iteratee = ele => ele)
  
  Object.keys(object).forEach(key => {
    result.push(iteratee(object[key], key, object))
  })

  return result
}

print(mapObject(1))
// => []
print(mapObject('hello'))
// => []
print(mapObject(true))
// => []
print(mapObject(null))
// => []
print(mapObject(undefined))
// => []
print(mapObject([1, '2', 3, '4']))
// => [1, '2', 3, '4']
print(mapObject([1, '2', 3, '4'], ele => ele * 5))
// => [ 5, 10, 15, 20 ]
print(mapObject({ a: 3, b: undefined, c: 6 }))
// => [ 3, undefined, 6 ]
print(mapObject({ a: 3, b: undefined, c: 6 }, ele => ele + 's'))
// => [ '3s', 'undefineds', '6s' ] */

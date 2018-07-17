# 网页导出数据至 Excel

## 业务需求

将一组数据导出到 Excel 中，xlsx 或者 CSV 格式均可，数据中包含数字，保证导出的结果正确即可。

因为 Excel 默认会将数字显示为科学计数法的形式，即数字 `10000000000000` 会显示为 `1E+13` ，所以要想办法解决这个问题。

## 方案探索

先 Google `js export to excel` ，在第一个链接 [JS导出excel插件总结](https://blog.csdn.net/Tianyi_liang/article/details/62893471) 中列出了三种方案，三个项目 [excellentexport](https://github.com/jmaister/excellentexport)、[exceljs](https://github.com/guyonroche/exceljs) 和 [js-xlsx](https://github.com/SheetJS/js-xlsx) 的 Star 数量级分别在 600、2000 和 10000，那就用 js-xlsx 这个库吧。

## 示例代码

接着用 `js-xlsx save array` 作为关键字 Google，第一个结果指向 js-xlsx 在 GitHub 的官网，第二个结果则是该项目在 GitHub 上的 issue：[How to simply export a Worksheet to xlsx? · Issue #817 · SheetJS/js-xlsx](https://github.com/SheetJS/js-xlsx/issues/817)，很可能会看到示例代码，点进去看看。

[第一条回复](https://github.com/SheetJS/js-xlsx/issues/817#issuecomment-331605640) 就给出了导出数组到 Excel 中的方法：

```js
/* external references:
 - https://rawgit.com/SheetJS/js-xlsx/master/dist/xlsx.full.min.js
 - https://rawgit.com/eligrey/FileSaver.js/master/FileSaver.js
*/
/* original data */
var data = [
    {"name":"John", "city": "Seattle"},
    {"name":"Mike", "city": "Los Angeles"},
    {"name":"Zach", "city": "New York"}
];

/* this line is only needed if you are not adding a script tag reference */
if(typeof XLSX == 'undefined') XLSX = require('xlsx');

/* make the worksheet */
var ws = XLSX.utils.json_to_sheet(data);

/* add to workbook */
var wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "People");

/* write workbook (use type 'binary') */
var wbout = XLSX.write(wb, {bookType:'xlsx', type:'binary'});

/* generate a download */
function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}

saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "sheetjs.xlsx");
```

## 现用代码

自己根据业务需求修改后的代码如下：

```js
import FileSaver from 'file-saver';
import XLSX from 'xlsx';

// 只取对象中指定的三个属性
const getSerial = R.map(ele => R.pick(['serial', 'user', 'valid'])(ele));
const ws = XLSX.utils.json_to_sheet(getSerial(this.detail));
const wb = XLSX.utils.book_new();

// 最后一个参数定义工作表的名称
XLSX.utils.book_append_sheet(wb, ws, '激活码');

// 写入 xlsx 文件要用 binary 类型
const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

/* generate a download */
function s2ab(s) {
  const buf = new ArrayBuffer(s.length);
  let view = new Uint8Array(buf);
  for (let i = 0; i !== s.length; i++) {
    view[i] = s.charCodeAt(i) & 0xFF;
  }
  return buf;
}

FileSaver
  .saveAs(
    new Blob([s2ab(wbout)], {
      type: 'application/octet-stream',
    }),
    '激活码.xlsx');
```

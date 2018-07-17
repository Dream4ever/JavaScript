# VSCode 应用笔记

## 自带功能

### 笔记说明

#### 快捷键

VSCode 自身的功能，都可以通过编辑设置文件来进行修改，打开该文件的编辑界面的快捷键，在 Windows 下为 `Win+,`，在 Mac 下为 `Command (⌘)+,`。

为方便起见，后文中提到 Windows/Mac 快捷键的地方，均采用下面对应关系表中，最右侧一列的简介形式：Cmd、Alt、Ctr。

| Win | Mac | Mac 下的图标 | 本文中采用的简写 |
| - | - | - | - |
| Windows | Command | ⌘ | Cmd |
| Alt | Option/Alt | ⌥ | Alt |
| Control | Control | ^ | Ctr |

![modifiers-table](https://gitee.com/samsara9527/Pics/raw/master/vscode/modifiers.png)

#### 建议选项

VSCode 中的很多设置都有多个选项可供选择，在列出各个选项的时候，会以粗体显示建议使用的选项名称。

- **选项 A**
- 选项 B
- 选项 C

#### 编辑方式

VSCode 中的自带功能均可进行修改，下图中右侧的内容为用户设置（User Settings），这里的设置会覆盖 VSCode 中的默认设置。

用户设置中的内容，需按照标准的 JSON 文件的格式进行编写，即：

```markdown
"选项名称": 选项的可选值,
// 示例
"files.autoSave": "afterDelay",
```

如果选项的可选值仅有 true/false 两项，那么在填写选项的值时，不用加双引号；选项的可选值为数字时，也不用加双引号；只有在选项的值为其它字符串时，才需加双引号。

最后一个选项之前的选项，在行末都要加上分号，这个分号必须有。

如果一个选项包含多个子选项，则必须按照原来的格式，在父选项内部写上子选项的设置：

```markdown
"[markdown]":  {
    "editor.quickSuggestions": true
},
```

![code-user-settings](https://gitee.com/samsara9527/Pics/raw/master/vscode/code-user-settings.png)

### 自动保存 - `files.autoSave`

VSCode 贴心地提供了自动保存的功能，这样写完代码之后就不用担心因为忘记自动保存，而看不到修改后的代码的执行结果了。如果要开启自动保存功能，有三个选项可供选择：

- **afterDelay**: 延迟一定时间后自动保存，这个时间由选项 `"files.autoSaveDelay": 1000,` 中的值 `1000` 决定。
- onFocusChange: 编辑器失去焦点后自动保存。
- onWindowChange: 窗口失去焦点后自动保存。

第二和第三个选项的区别是什么呢？VSCode 的窗口包含若干个部分，编辑器只是其中的一个部分，我们借用下面这张来自 VSCode 官方网站的图来说明一下：在主界面的几部分中，区域 C 为编辑器，剩下的区域则是 VSCode 窗口的其它部分。

如果应用第二个选项，即使没有切换到别的程序中，而只是点击了 VSCode 窗口编辑器以外的部分，VSCode 也会自动保存。

而应用第三个选项的话，则必须切换到别的程序中，VSCode 才会自动保存。

![code-userinterface-hero](https://gitee.com/samsara9527/Pics/raw/master/vscode/code-userinterface-hero.png)

### 自动展开文件夹 - `explorer.autoReveal`

在浏览或编辑文件时，可以选择让 VSCode 在左侧的 `Explorer`（项目管理器）中自动展开当前文件所属的文件夹。是否要开启这个功能因人而异，我自己是关闭了这个功能的，因为实在是用不上。

- true/false: 开启或关闭该功能，下同。

---

# 周五讲稿

[VS Code Tips and Tricks](https://github.com/Microsoft/vscode-tips-and-tricks): 已被微软官方收入官方文档中。

## 自带功能

### 默认快捷键

[VSCode Keyboard shortcuts for Windows](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf)

[VSCode Keyboard shortcuts for macOS](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-macos.pdf)

### 快速定位

Cmd+P，然后输入文件名。
Cmd+P，然后输入 @，即可快速定位至文件中的方法或标题。

#### 侧栏切换

<!-- 开启 KeyCastr -->

Cmd+Shift+E: Explorer
Cmd+Shift+F: Find
Cmd+Shift+W: Git
Cmd+Shift+D: Debug
Cmd+Shift+X: Extension

顺便演示一下如何修改默认快捷键：F1 -> Keyboard Shortcuts，根据功能名称/快捷键查找

#### 窗口切换

Cmd+N: 聚焦至文本编辑器中第N个窗口
Cmd+0: 聚焦至侧栏
Cmd+B: 显示（并聚焦至）/隐藏侧栏
Ctrl+`: 显示（并聚焦至）/隐藏终端
Ctrl+Shift+`: （显示并）聚焦至终端

Ctrl+Cmd+Right: 将当前文件（至少打开两个文件时）在右侧区域显示

#### 文件编辑

Cmd+K,V: 在右侧分栏预览 markdown
Cmd+Shift+V: 在当前区域预览 markdown
Cmd+K,W: 关闭所有已打开的文件
Cmd+K,F: 关闭当前打开的文件夹

#### 文本编辑

Cmd+Enter: 下方插入空行
Cmd+Shift+Enter: 上方插入空行
Cmd+Delete: 删除至行首
Alt+Delete: 删除英文单词
Cmd+Shift+K：删除整行并跳至下一行
Alt+Shift+Up: 复制当前行至上方
Alt+Shift+Down: 复制当前行至下方
Cmd+D: 选择**下一个**相同的字符串，用 EJS 文件演示

### 代码查看

<!-- 关闭 KeyCastr -->

Go to Defination: 转到定义。
Peek Defination: 查看定义（在当前文件中通过弹窗查看）。
Find All References: 查找所有引用。
Change All Occurrences: 修改所有相同的字符串：当心误操作。

### 个人常用配置

#### 自动保存

"files.autoSave": "afterDelay",
// "files.autoSaveDelay": 1000, 该参数设置延迟多久之后才保存

#### 输入时自动格式化

"editor.formatOnType": true

#### 不自动展开文件夹

// 切换至某文件时，不会在左侧自动展开该文件所属的文件夹
"explorer.autoReveal": false

用整理好的侧栏文件目录做演示。

#### markdown 自动提示

"[markdown]": {
  "editor.quickSuggestions": true
},

#### JS 自动补全括号对

"typescript.useCodeSnippetsOnMethodSuggest": true

#### User Snippets

F1，snippet，markdown。

## 插件推荐

### Code Outline

显示代码/文章大纲。

功能与 Cmd+P,@ 相似。

### Git History

F1, History: 查看当前项目历史（需已用 Git 管理，两者区别，可用 ~/Downloads/WebApp 在终端中的路径作对比）。

查看之前某次的提交：与文件当前版本对比/与文件更前一次版本对比/查看该文件的历史。

### markdownlint

现场演示。

### npm

不做演示。

### Open in GitHub

现场演示，在侧栏中右键打开，以及在文本编辑区域中用快捷键打开。

快捷键方式，先用默认设置打开，然后再演示如何查看配置项并添加到自定义配置中。

### Path Intellisense

用 JS 项目做演示，注意当前文件所在路径。

### Quick and Simple Text Selection

直接用当前 markdown 文件的 URL 语句做演示。

### VSCode Browser Sync

用 HTML 做演示。

---

## 参考资料

[为什么我选择使用 VS Code进行前端开发?](https://segmentfault.com/a/1190000010750647?utm_source=weekly&utm_medium=email&utm_campaign=email_weekly)：用到了里面介绍的 Dash、Path Intellisense 这两个扩展。

[My Visual Studio Code setup](https://medium.com/@beeblebrox3/my-visual-studio-code-setup-9b488a119e24)

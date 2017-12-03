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

![](https://gitee.com/samsara9527/Pics/raw/master/vscode/modifiers.png)

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

![](https://gitee.com/samsara9527/Pics/raw/master/vscode/code-user-settings.png)

### 自动保存 - `files.autoSave`

VSCode 贴心地提供了自动保存的功能，这样写完代码之后就不用担心因为忘记自动保存，而看不到修改后的代码的执行结果了。如果要开启自动保存功能，有三个选项可供选择：

- **afterDelay**: 延迟一定时间后自动保存，这个时间由选项 `"files.autoSaveDelay": 1000,` 中的值 `1000` 决定。
- onFocusChange: 编辑器失去焦点后自动保存。
- onWindowChange: 窗口失去焦点后自动保存。

第二和第三个选项的区别是什么呢？VSCode 的窗口包含若干个部分，编辑器只是其中的一个部分，我们借用下面这张来自 VSCode 官方网站的图来说明一下：在主界面的几部分中，区域 C 为编辑器，剩下的区域则是 VSCode 窗口的其它部分。

如果应用第二个选项，即使没有切换到别的程序中，而只是点击了 VSCode 窗口编辑器以外的部分，VSCode 也会自动保存。

而应用第三个选项的话，则必须切换到别的程序中，VSCode 才会自动保存。

![](https://gitee.com/samsara9527/Pics/raw/master/vscode/code-userinterface-hero.png)

### 自动展开文件夹 - `explorer.autoReveal`

在浏览或编辑文件时，可以选择让 VSCode 在左侧的 `Explorer`（项目管理器）中自动展开当前文件所属的文件夹。是否要开启这个功能因人而异，我自己是关闭了这个功能的，因为实在是用不上。

- true/false: 开启或关闭该功能，下同。

## 插件推荐

### Code Outline

### ESLint

### Git History

### Git Project Manager

### markdownlint

### npm

### Quick and Simple Text Selection

### Vue 2 Snippets

---

## 参考资料

[为什么我选择使用 VS Code进行前端开发?](https://segmentfault.com/a/1190000010750647?utm_source=weekly&utm_medium=email&utm_campaign=email_weekly)：用到了里面介绍的 Dash、Path Intellisense 这两个扩展。

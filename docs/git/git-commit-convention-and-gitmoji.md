# Git Commit Message 规范及 Gitmoji 使用指南

## Git Commit Message 规范

规范的 git commit message，便于之后的回顾、审查。

![Git Commit Message and Gitmoji](https://gitee.com/samsara9527/Pics/raw/master/git-commit-convention/git-commit-message-and-gitmoji.png)

每次提交（commit）时，commit message 都包括三个部分：Header、Body 和 Footer。

Header 是必须的，Body 和 Footer 则是可选的。

其中 Header 又包括三部分：`type`（必需）、`scope`（可选）和 `subject`（必需）。

`type` 用于说明 commit 的类别，只允许使用下面7个标识：

- `feat`：新功能（feature）
- `fix`：修补bug
- `docs`：文档（documentation）
- `style`： 格式（不影响代码运行的变动）
- `refactor`：重构（即不是新增功能，也不是修改bug的代码变动）
- `test`：增加测试
- `chore`：构建过程或辅助工具的变动

`scope` 用于说明 commit 影响的范围，比如数据层、控制层、视图层等等，视项目不同而不同。

`subject` 是 commit 目的的简短描述，不超过50个字符。

- 以动词开头，使用第一人称现在时，比如 change，而不是 changed 或 changes
- 第一个字母小写
- 结尾不加句号（.）

## gitmoji 使用指南

**注意**：在 Windows 下，即使按照下面这个库的教程配置好了，部分 emoji 也无法正常显示，Mac 上就没这个问题。

在执行 git commit 时，将 emoji 代码写在 commit message 最前面即可。访问 GitHub，便可看到 Emoji，如文章顶部图片所示。

如果想在终端查看 git history 时也显示 emoji，可以安装 GitHub 上的 [Terminal Emojify](https://github.com/as-cii/terminal-emojify) 这个库。

注意：Terminal Emojify 依赖于 Ruby 环境，就像 Express.js 依赖于 Node.js 环境一样。所以在安装这个库之前需要先配置好 Ruby 环境。首先安装 [Ruby](https://www.ruby-lang.org/en/downloads/)，然后安装 [RubyGems](https://rubygems.org/pages/download)。

安装好依赖之后，在终端中执行下面的命令，安装 Terminal Emojify。

```bash
$ gem install terminal-emojify
```

然后再编辑 `.gitconfig` 文件，增加下面的内容，美化 `git log` 命令的输出结果。

```bash
[alias]
  hist = !git --no-pager log --color --pretty=format:'%C(yellow)%h%C(reset)%C(bold red)%d%C(reset) %s %C(black)— %an (%ad)%C(reset)' --relative-date | emojify | less --RAW-CONTROL-CHARS
```

最后在终端中执行 `git hist`，即可看到下面的效果，说明 gitmoji 配置成功。

![Gitmoji](https://gitee.com/samsara9527/Pics/raw/master/git-commit-convention/gitmoji.png)

## 参考资料

- [Commit message 和 Change log 编写指南](http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)
- [gitmoji](https://gitmoji.carloscuesta.me/)
- [Terminal Emojify](https://github.com/as-cii/terminal-emojify)

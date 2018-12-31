# macOS 配置记录

## 系统

- 开启了系统自带的防火墙，后面把自己坑惨了。

## 软件

- 用 Safari 安装 Chrome。
- 从 Chrome 中下载并安装 VSCode 和 Bartender。
- 从 App Store 中安装 1Password 7，微信，Ulysses，Moom（不好用，之后卸载并退款了）。

## 翻墙

- 从 GitHub 下载并安装 ShadowsocksX-NG。
- 给 Chrome 安装 SwitchyOmega 扩展，用来翻墙。
- 结果发现酸酸乳不能用，上网查，有的说是缺少了 libev 这个依赖库。
- 在终端中安装 homebrew，顺带着自动地把 Xcode Command Line Tools 装上了。
- 按照 https://github.com/shadowsocks/ShadowsocksX-NG/issues/963 这个链接中的说法，执行 brew install libev 安装依赖库，但是依然不能使用酸酸乳。

## App Store

- App Store先是登录的中国区账户，结果发现搜不到微软的 Remote Desktop，切换到美区账号后才能搜到并下载。

## 开发

- 参考 https://github.com/donnemartin/dev-setup#iterm2，对 iTerm 2 进行了相关的配置。
- 参考 https://github.com/donnemartin/dev-setup#git ,对 git 进行了相关配置。

# Node.js 包管理

## 包管理器安装

安装 Node.js 时，会连同 npm 这个默认的包管理器一起安装上。

但平时使用的话，还是建议用 Yarn，安装这部分没什么好说的，下载安装包然后按照默认设置安装即可。

## 第一时间配置下载源

用如下命令给 npm 和 Yarn 配置淘宝源，加速 npm 包下载。

```shell
# npm 配置淘宝源
$ npm config set registry=https://registry.npm.taobao.org

# npm 查看源设置是否成功
$ npm config get registry

# Yarn 配置淘宝源
$ yarn config set registry https://registry.npm.taobao.org

# Yarn 查看源设置是否成功
$ yarn config get registry
```

## 理解 npm 包版本号

版本规范：对于 npm 包的版本号 `1.2.3`，第一个小数点之前数字是大版本号（major），两个小数点中间的是中版本号（minor），第二个小数点之后的是小版本号（patch）。

带波浪线的版本号 `~version` 表示只会升级小版本号，比如 `~1.2.3` 就不会升级到 `1.3.0`，只能升级到 `1.2.X` 的最新版。

而带尖号的版本号 `^version` 表示只会升级中版本号，比如 `^1.2.3` 就不会升级到 `2.0.0`，只能升级到 `1.X` 的最新版。

[What's the difference between tilde(~) and caret(^) in package.json?](https://stackoverflow.com/questions/22343224/whats-the-difference-between-tilde-and-caret-in-package-json)

## 升级 npm 包

用 npm 或者 yarn 来升级 npm 包时，默认是按照 package.json 中的包版本标识来升级到可用的最高版本的。

如果想跳过 package.json 的版本要求，npm 就要用 [raineorshine / npm-check-updates](https://github.com/raineorshine/npm-check-updates) 或者 [dylang / npm-check](https://github.com/dylang/npm-check) 这种开源库来检查。Yarn 的话就很简单了，直接用 `yarn upgrade XXX --latest` 即可。

```shell

```

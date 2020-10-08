# Node.js 包管理

## 包管理器安装

安装 Node.js 时，会连同 npm 这个默认的包管理器一起安装上。

但平时使用的话，还是建议用 Yarn，安装这部分没什么好说的，下载安装包然后按照默认设置安装即可。

注：本文凡是提到 Yarn 的部分，均指 Yarn 1.X 版本。

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

版本规范：对于 npm 包的版本号 `1.2.3`，第一个小数点之前数字是主版本号（major），两个小数点中间的是次版本号（minor），第二个小数点之后的是补丁版本号（patch）。

在 `package.json` 文件中会看到带波浪线的版本号 `~version`，其升级范围如下。用一句来概括就是：如果有次版本号，则锁定次版本号；如果没有次版本号，则锁定主版本号。

- `~1.2.3 := >=1.2.3 <1.3.0`：有次版本号，可以升级补丁版本
- `~1.2 := >=1.2.0 <1.3.0`：有次版本号，可以升级补丁版本
- `~1 := >=1.0.0 <2.0.0`：没有次版本号，可以升级次版本

对于`package.json` 文件中带尖号的版本号 `^version`，升级范围如下。用一句来概括就是：锁定非 0 版本号最左边那个。

- `^1.2.3 := >=1.2.3 <2.0.0`：`^1.2.3` 非 0 版本号最左边的是主版本号，因此锁定主版本号，可以升级次版本至最新的 `1.2.X`
- `^0.2.3 := >=0.2.3 <0.3.0`：`^0.2.3` 非 0 版本号最左边的是次版本号，因此锁定次版本号，可以升级补丁版本至最新的 `0.2.X`
- `^0.0.3 := >=0.0.3 <0.0.4`：`^0.0.3` 不能再升级，因为非 0 版本号最左边那个就是补丁版本号

参考资料：

- [What's the difference between tilde(~) and caret(^) in package.json?](https://stackoverflow.com/questions/22343224/whats-the-difference-between-tilde-and-caret-in-package-json)
- [npm-semver | The semantic versioner for npm](https://docs.npmjs.com/misc/semver)

## 升级 npm 包

用 npm 或者 yarn 来升级 npm 包时，默认是按照 package.json 中的包版本标识来升级到可用的最高版本的，具体规则见前一节。

如果想绕过 package.json 的版本要求升级依赖包的话，两者的方案如下：

- npm 要用 [raineorshine / npm-check-updates](https://github.com/raineorshine/npm-check-updates) 或者 [dylang / npm-check](https://github.com/dylang/npm-check) 检查当前项目或全局安装的包有哪些可以升级
- Yarn 自带该功能，执行 `yarn upgrade XXX --latest` 或 `yarn global upgrade XXX --latest`

---

联动文章：[用 PM2 管理 Node.js 后端项目](https://github.com/Dream4ever/blog-articles/blob/master/server-configuration/pm2-tutorial.md)

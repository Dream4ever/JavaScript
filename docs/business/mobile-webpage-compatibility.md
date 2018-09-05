# 移动端页面开发 - 兼容性研究

## 确认系统最低兼容版本

要开发移动端页面，考虑到兼容性的需求，首先要确定一下移动设备的系统最低要兼容到哪个版本。

关于国内移动设备的系统版本分布，我参考的是 [流量研究院 - 百度统计](https://mtj.baidu.com/data/mobile/device) 的数据。在左侧栏中选择“系统”，就可以看到国内目前各版本系统的分布，Android 和 iOS 的都可以看到统计数据。

另外再推荐一下 [statcounter](http://gs.statcounter.com/) 这个网站，上面有各种统计数据，包括浏览器、搜索引擎、操作系统、分辨率等等等等。关于移动设备系统版本的统计数据，对比了一下 statcounter 和百度流量研究院的数据，相差不大，说明也是有一定参考性的。

谷歌官方也公布了各版本 Android 的统计数据：[Platform versions](https://developer.android.com/about/dashboards/)，也可以参考。

除了上网找数据，还可以参考公司 Web 业务的统计数据，统计一下 UserAgent 的分布，不过这一步自己一直想做但还没做。

经过和领导讨论之后，目前定下的最低版本要求，Android 是 4.4，iOS 是 7。

Android 之所以是 4.4，是因为这个版本的设备目前还有接近十分之一的用户，对企业来说，已经是相当高的一个比例了。而且 Android 从 4.4 版本开始，浏览器版本就独立于系统版本了，也就是说 4.4 版本的系统，可以装更新版本的浏览器。

而 iOS 之所以要兼容到 7，因为部门配备的 iPad Air 装的就是 iOS 7 的系统，嗯。

相关链接：

- [流量研究院 - 百度统计](https://mtj.baidu.com/data/mobile/device)
- [Mobile & Tablet iOS Version Market Share China](http://gs.statcounter.com/ios-version-market-share/mobile-tablet/china#monthly-201808-201808-bar)
- [Mobile & Tablet Android Version Market Share China](http://gs.statcounter.com/android-version-market-share/mobile-tablet/china/#monthly-201808-201808-bar)
- [Platform versions | Android Developers](https://developer.android.com/about/dashboards/)

## 确认所用框架/库/特性的兼容性

现在做前端页面开发，都离不开各种框架和库，但是对实际业务而言，就得研究一下所用的框架和库是否满足兼容性要求了。

对于某个具体的框架、库而言，有几种方式可以了解其兼容性：

1. 首先，是访问这个框架/库的官网，查看是否有兼容性的信息；
2. 其次，可以用框架/库的名称加上 `compatibility` 或者 `support`，再加上系统及版本的名称，比如 `Android 4.4`，来查找有关兼容性的资料；
3. 最后，还可以用框架/库编写一个页面，然后用旧设备的真机访问页面，查看框架/库是否能在旧设备上正常显示;
4. 此外，还可以在页面中引入并调用 [eruda](https://github.com/liriliri/eruda) 这个库，用于移动设备的真机调试，相当于移动端的浏览器控制台，非常方便，也非常实用。

讲完了框架和库，再讲讲具体的某个 JS 特性或 CSS 特性该如何检查兼容性。

一般来说，可以先在 MDN 中查看某个具体特性的浏览器兼容性（Browser Compatibility），如果不放心，还可以在页面代码中用上该特性，然后在旧设备上访问页面，看看代码的执行结果。

对于 JS 来说，如果浏览器的确不支持，自己就会转而使用兼容性更全面的、更“低级”一些的方法。而对于 CSS 来说，自己会用 [autoprefixer](https://autoprefixer.github.io/) 处理一下，比如非常好用的 `flexobx`，用 autoprefixer 处理之后，Android 4.4 和 iOS 7 上就都可以正常使用了。

相关链接：

- [MDN](https://developer.mozilla.org/en-US/docs/Web)
- [Can I use](https://caniuse.com/#home)
- [eruda](https://github.com/liriliri/eruda) 
- [autoprefixer](https://autoprefixer.github.io/)

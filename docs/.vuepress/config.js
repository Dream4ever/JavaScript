const { readdirSync } = require('fs');

const getPath = path => {
  return readdirSync(`docs/${path}`)
    .map(dir => {
      return `${path}/${dir}`;
    });
}

module.exports = {
  title: '岁月留痕',
  description: '记录编程之路的点点滴滴',
  // dev 模式下不显示 favicon？
  head: [
    ['link', { rel: 'icon', href: `/icon.png` }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
  ],
  themeConfig: {
    repo: 'Dream4ever/JavaScript',
    editLinks: true,
    editLinkText: '在 GitHub 上编辑此页面',
    lastUpdated: '最后更新于',
    // 设置了上面的 repo 之后，顶部导航栏默认会显示 GitHub 链接
    // 无需在 nav 中再专门设置
    nav: [
      // {
      //   text: '博客',
      //   link: '/index/index',
      // },
    ],
    // 在这里设置的 sidebar 的属性
    // 适用于所有页面
    // 当打开 sidebar 中定义的页面时
    // 则还会展开显示该页面的二级标题
    // 如果定义了下面的 sidebarDepth 属性为 2，就显示三级标题
    // 所有在 sidebar 中定义的文章
    // 在页面底部都会显示上一篇/下一篇 sidebar 中文章的链接
    sidebar: [
      {
        title: '学习笔记',
        children: getPath('book'),
      },
      {
        title: 'JS学习方法论',
        children: getPath('how-to-learn-js'),
      },
      {
        title: '每周总结',
        children: getPath('weekly-review'),
      },
      {
        title: '系列课程之一 - 入门',
        children: getPath('js-elementary'),
      },
      {
        title: '系列课程之二 - 进阶',
        children: getPath('js-advanced'),
      },
      {
        title: 'WebApp 项目学习笔记',
        children: getPath('webapp'),
      },
      {
        title: '系列课程之三 - Vue.js 进阶',
        children: getPath('vue-advanced'),
      },
      {
        title: '公司业务',
        children: getPath('business'),
      },
      {
        title: '服务器配置',
        children: getPath('server-configuration'),
      },
      {
        title: 'Git',
        children: getPath('git'),
      },
    ],
    sidebarDepth: 2,
  },
  markdown: {
    lineNumbers: true
  }
}

<p align="center">
  <a href="https://tdesign.tencent.com/" target="_blank">
    <img alt="TDesign Logo" width="200" src="https://tdesign.gtimg.com/site/TDesign.png">
  </a>
</p>

<p align="center">
  <a href="https://github.com/Tencent/tdesign-vue/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/tdesign-vue.svg?sanitize=true" alt="License">
  </a>
  <a href="https://app.codecov.io/gh/Tencent/tdesign-vue">
    <img src="https://img.shields.io/codecov/c/github/Tencent/tdesign-vue/develop.svg?style=flat-square" alt="codecov">
  </a>
  <a href="https://www.npmjs.com/package/tdesign-vue">
    <img src="https://img.shields.io/npm/v/tdesign-vue.svg?sanitize=true" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/tdesign-vue">
    <img src="https://img.shields.io/npm/dm/tdesign-vue" alt="Downloads">
  </a>
</p>

简体中文 | [English](./README.md) 

TDesign 适配桌面端的组件库，适合在 Vue 2.x 技术栈项目中使用。

# 🎉 特性

- 适配桌面端交互
- 基于 Vue 2.0 (Vue2.6.x及以下)
- 与其他框架实现版本（React/Angular 等） API、UI 保持一致
- 支持暗黑模式及其他主题定制
- 支持按需加载

# 📦 安装

```shell
npm i tdesign-vue
```

# 🔨 基础使用


```js
import Vue from 'vue';
import TDesign from 'tdesign-vue';
// 引入组件库全局样式资源
import 'tdesign-vue/es/style/index.css';

Vue.use(TDesign);
```

npm package 中提供了多种构建产物，可以阅读 [这里](https://github.com/Tencent/tdesign/blob/main/docs/develop-install.md) 了解不同目录下产物的差别。

# 快速体验

可以访问官方提供的 [TDesign Starter](https://tdesign.tencent.com/starter/vue/) 项目体验使用 TDesign 组件快速搭建业务系统。

# 浏览器兼容性

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/> IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari |
| --- | --- | --- | --- |
| Edge >=91 | Firefox >=83 | Chrome >=91 | Safari >=14.1 |


详情参见[桌面端组件库浏览器兼容性说明](https://github.com/Tencent/tdesign/wiki/Browser-Compatibility)

# 其他技术栈实现

- 桌面端 Vue 3 实现：[web-vue-next](https://github.com/Tencent/tdesign-vue-next)
- 桌面端 React 实现： [web-react](https://github.com/Tencent/tdesign-react)
- 移动端小程序实现： [小程序](https://github.com/Tencent/tdesign-miniprogram)

# 参与贡献

TDesign 欢迎任何愿意参与贡献的参与者。如果需要本地运行代码或参与贡献，请先阅读[参与贡献](https://github.com/Tencent/tdesign-vue/blob/develop/CONTRIBUTING.md)。

## 贡献成员

<a href="https://github.com/tencent/tdesign-vue/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=tencent/tdesign-vue" />
</a>

# 反馈

有任何问题，建议通过 [Github issues](https://github.com/Tencent/tdesign-vue/issues) 反馈或扫码加入用户微信群。

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/doc/Vue2-IM.png" width="200" />

# 开源协议

TDesign 遵循 [MIT 协议](https://github.com/Tencent/tdesign-vue/blob/main/LICENSE)。

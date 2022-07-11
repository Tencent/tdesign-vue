---
title: Vue for Web
description: TDesign 适配桌面端的组件库，适合在 vue 2 技术栈项目中使用。
spline: explain
---

<div style="background: rgba(0, 168, 112, .1); display: flex; align-items: center; line-height: 20px; padding: 14px 24px; border-radius: 3px; color: #555a65">
  <svg fill="none" viewBox="0 0 16 16" width="16px" height="16px" style="margin-right: 5px">
    <path fill="#00a870" d="M8 15A7 7 0 108 1a7 7 0 000 14zM7.4 4h1.2v1.2H7.4V4zm.1 2.5h1V12h-1V6.5z" fillopacity="0.9"></path>
  </svg>
  由于 vue2.7 与 tdesign-vue 的其他依赖不兼容，请暂时保证您的 vue 版本在 2.7 以下，未来将支持在 vue2.7 中使用。
</div>

### 安装

#### 使用 npm 安装

推荐使用 npm 方式进行开发

```shell
npm i tdesign-vue
```

#### 浏览器引入

目前可以通过 [unpkg.com/tdesign-vue](https://unpkg.com/tdesign-vue) 获取到最新版本的资源，在页面上引入 js 和 css 文件即可开始使用。

```html
<link rel="stylesheet" href="https://unpkg.com/tdesign-vue/dist/tdesign.min.css" />
<script src="https://unpkg.com/tdesign-vue/dist/tdesign.min.js"></script>
```

### 基础使用

推荐使用 Webpack 或 Rollup 等支持 tree-shaking 特性的构建工具，无需额外配置即可实现组件按需引入：

```js
import Vue from 'vue';
import TDesign from 'tdesign-vue';
// 引入组件库全局样式资源
import 'tdesign-vue/es/style/index.css';

Vue.use(TDesign);
```

npm package 中提供了多种构建产物，可以阅读 [这里](https://github.com/Tencent/tdesign/blob/main/docs/develop-install.md) 了解不同目录下产物的差别。

#### reset 样式

`0.43.0` 版本开始我们不再引入 `reset.less`，影响最大的是移除了原先全局盒子模型的设定：

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

如果你的项目开发依赖于原先的 `reset` 样式，可以从 `dist` 目录中单独引入它：

```js
import 'tdesign-vue/dist/reset.css';
```

### 自动引入

故名思义，就是可以直接使用 TDesign 的组件，而不需要手动引入：

```html
<template>
  <t-button>按钮</t-button>
</template>

<script>
  // import { Button as TButton } from 'tdesign-vue' // 组件的引入可以省略
  export default {
    // components: { TButton }, // 对应的组件注册也可以省略
  };
</script>
```

推荐使用 `unplugin-vue-components` 和 `unplugin-auto-import` 来实现自动引入：

```
npm install -D unplugin-vue-components unplugin-auto-import
```

然后在 Webpack 或 Vite 对应的配置文件添加上述插件。

#### Vite

```js
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { TDesignResolver } from 'unplugin-vue-components/resolvers';

export default {
  plugins: [
    // ...
    AutoImport({
      resolvers: [TDesignResolver()],
    }),
    Components({
      resolvers: [TDesignResolver()],
    }),
  ],
};
```

#### Webpack

```js
const AutoImport = require('unplugin-auto-import/webpack');
const Components = require('unplugin-vue-components/webpack');
const { TDesignResolver } = require('unplugin-vue-components/resolvers');

module.exports = {
  // ...
  plugins: [
    AutoImport({
      resolvers: [TDesignResolver()],
    }),
    Components({
      resolvers: [TDesignResolver()],
    }),
  ],
};
```

> `TDesignResolver` 支持的配置，可以点击此[链接](https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/tdesign.ts#L4)。

### 快速体验

可以访问官方提供的 [TDesign Starter](https://tdesign.tencent.com/starter/vue/) 项目体验使用 TDesign 组件快速搭建业务系统。

### 浏览器兼容性

| [<img src="https://tdesign.gtimg.com/docs/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/> IE / Edge | [<img src="https://tdesign.gtimg.com/docs/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://tdesign.gtimg.com/docs/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://tdesign.gtimg.com/docs/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Edge >=84                                                                                                                                                                 | Firefox >=83                                                                                                                                                            | Chrome >=84                                                                                                                                                          | Safari >=14.1                                                                                                                                                        |

详情参见[桌面端组件库浏览器兼容性说明](https://github.com/Tencent/tdesign/wiki/%E6%A1%8C%E9%9D%A2%E7%AB%AF%E7%BB%84%E4%BB%B6%E5%BA%93%E6%B5%8F%E8%A7%88%E5%99%A8%E5%85%BC%E5%AE%B9%E6%80%A7%E8%AF%B4%E6%98%8E)

### FAQ

Q: 通过局部注册 (Local Registration) 使用时，报错 `Uncaught Error: [vue-composition-api] must call Vue.use(plugin) before using any function`

A: 组件内部使用了 `CompositionAPI`，因此要解决这个报错，需要在 `main.js` 中，优先使用 `Vue.use(CompositionAPI)`，例如：

```js
// main.js
import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';

Vue.use(VueCompositionAPI); // 必须是第一个 use
Vue.use(otherPlugin);
```

---
title: Vue for Web
description: TDesign 适配桌面端的组件库，适合在 vue 2 技术栈项目中使用。
spline: explain
---

### 安装

```shell
npm i tdesign-vue
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

npm package 中提供了多种构建产物，可以阅读 [这里](https://github.com/Tencent/tdesign-common/blob/develop/develop-install.md) 了解不同目录下产物的差别。

### 自动引入

故名思义，就是可以直接使用 TDesign 的组件，而不需要手动引入：

```html
<template>
  <t-button>按钮</t-button>
</template>

<script>
  // import { TButton } from 'tdesign-vue' // 组件的引入可以省略
  export default {
    // components: { TButton }, // 对应的组件注册也可以省略
  }
</script>
```

推荐使用 `unplugin-vue-components` 和 `unplugin-auto-import` 来实现自动引入：

```
npm install -D unplugin-vue-components unplugin-auto-import
```

然后在 Webpack 或 Vite 对应的配置文件添加上述插件。

#### Vite

```js
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { TDesignResolver } from 'unplugin-vue-components/resolvers'

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
}
```

#### Webpack

```js
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { TDesignResolver } = require('unplugin-vue-components/resolvers')

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
}
```

> `TDesignResolver` 支持的配置，可以点击此[链接](https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/tdesign.ts#L4)。

### 快速体验

可以访问官方提供的 [TDesign Starter](https://tdesign.tencent.com/starter/vue/) 项目体验使用 TDesign 组件快速搭建业务系统。

### 浏览器兼容性

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br> IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| --- | --- | --- | --- |
| Edge >=79 | Firefox >=83 | Chrome >=69 | Safari >=12 |

详情参见[桌面端组件库浏览器兼容性说明](https://github.com/Tencent/tdesign/wiki/%E6%A1%8C%E9%9D%A2%E7%AB%AF%E7%BB%84%E4%BB%B6%E5%BA%93%E6%B5%8F%E8%A7%88%E5%99%A8%E5%85%BC%E5%AE%B9%E6%80%A7%E8%AF%B4%E6%98%8E)
---
title: Vue for Web
description: TDesign 适配桌面端的组件库，适合在 vue 2 技术栈项目中使用。
spline: explain
---

<div style="background: var(--td-warning-color-2); padding: 14px 24px; border-radius: 3px; color: #555a65; line-height: 22px">
  <p>tdesign-vue 在 1.4.0 版本之后开始同步支持在 Vue 2.7 中使用</p>
  <p>如果您需要在 Vue2.7 中使用 tdesign-vue 请安装 tdesign-vue@naruto 或在具体指定版本后加-naruto的标识
  <p>如tdesign-vue@1.4.0 适用于 Vue 2.6 tdesign-vue@1.4.0-naruto 适用于 Vue 2.7</p>
</div>

## 安装

### 使用 npm 安装

推荐使用 npm 方式进行开发

```shell
npm i tdesign-vue // 在 Vue 2.6 及以下使用
npm i tdesign-vue@naruto  // 在 Vue 2.7 使用
```

### 通过 浏览器引入 安装

目前可以通过 [unpkg.com/tdesign-vue](https://unpkg.com/tdesign-vue) 获取到最新版本的资源，在页面上引入 js 和 css 文件即可开始使用。由于部分组件依赖了`@vue/composition-api`，除了像其他 Vue2 版本的组件库一样需要引入`vue`，还需要额外手动引入`@vue/composition-api`。

```html
<link rel="stylesheet" href="https://unpkg.com/tdesign-vue/dist/tdesign.min.css" />
<script src="https://unpkg.com/vue@2.6/dist/vue.js"></script>
<script src="https://unpkg.com/@vue/composition-api@1.7.0/dist/vue-composition-api.prod.js"></script>
<script src="https://unpkg.com/tdesign-vue/dist/tdesign.min.js"></script>
...
<script>
  Vue.use(TDesign);
</script>
```

npm package 中提供了多种构建产物，可以阅读 [这里](https://github.com/Tencent/tdesign/blob/main/docs/develop-install.md) 了解不同目录下产物的差别。

## 使用

TDesign 提供了三种方式使用组件，具体使用方式如下

### 基础使用

基础使用会全量注册所有组件，如果您的项目大规模使用组件，请放心使用这种方式。

```js
import Vue from 'vue';
import TDesign from 'tdesign-vue';

// 引入组件库的少量全局样式变量
import 'tdesign-vue/es/style/index.css';

Vue.use(TDesign);
```

### 按需引入使用

如果您对产物大小有严格的要求，可以通过 按需引入具体组件 的方式来使用。

借助 Webpack 或 Rollup 等支持 tree-shaking 特性的构建工具，可以达到按需引入的使用效果。

```js
import { Button as TButton } from 'tdesign-vue';

// 引入组件库的少量全局样式变量
import 'tdesign-vue/es/style/index.css';

Vue.use(TButton);
```

### 通过插件按需使用

除此之外，也可以使用 `unplugin-vue-components` 和 `unplugin-auto-import` 来实现自动导入：

如果是在 Vue 2.6 版本中使用 您仍需在项目引入组件库的少量全局样式变量及`@vue/composition-api`

如果是在 Vue 2.7 版本中使用 您不再需要在项目引入`@vue/composition-api`

```js
import VueCompositionAPI from '@vue/composition-api';
// 引入组件库的少量全局样式变量
import 'tdesign-vue/es/style/index.css';

Vue.use(VueCompositionAPI); // 必须是项目的第一个 use
```

并安装两个 unplugin 相关的第三方包

```bash
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

## 快速体验

可以访问官方提供的 [TDesign Starter](https://tdesign.tencent.com/starter/vue/) 项目体验使用 TDesign 组件快速搭建业务系统。

## 浏览器兼容性

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/> IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Edge >=91                                                                                                                                                                                                        | Firefox >=83                                                                                                                                                                                                      | Chrome >=91                                                                                                                                                                                                   | Safari >=14.1                                                                                                                                                                                                 |

详情参见[桌面端组件库浏览器兼容性说明](https://github.com/Tencent/tdesign/wiki/Browser-Compatibility)

## FAQ

Q: 通过局部注册 (Local Registration) 使用时，报错 `Uncaught Error: [vue-composition-api] must call Vue.use(plugin) before using any function`

A: 组件内部使用了 `CompositionAPI`，因此要解决这个报错，需要在 `main.js` 中，优先使用 `Vue.use(CompositionAPI)`，例如：

```js
// main.js
import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';

Vue.use(VueCompositionAPI); // 必须是第一个 use
Vue.use(otherPlugin);
```

Q: 是否内置 reset 样式统一页面元素的默认样式 ？

A: `0.43.0` 版本开始我们不再引入 `reset.less`，影响最大的是移除了原先全局盒子模型的设定：

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

Q: 如何在 Vue 2.7 中使用?

A: tdesign-vue 在 `1.4.0` 版本之后支持在 Vue2.7 中使用。如果您需要在 Vue2.7 中使用 tdesign-vue 请安装 tdesign-vue@naruto 或在具体指定版本后加-naruto 的标识 我们在 1.4.0 版本起的每个版本都同步构建了一份在 Vue2.7 中使用的版本

如`tdesign-vue@1.4.0` 适用于 `Vue 2.6` `tdesign-vue@1.4.0-naruto` 适用于 `Vue 2.7`

Q: 为什么使用有些组件的时候会出现一些奇怪的错误？

A: 使用组件的时候看到这类错误 `vue.runtime.esm.js:4605 [Vue warn]: inject() can only be used inside setup() or functional components.` 说明虽然 `package.json` 中设置的版本号为 `^2.6.14`，但实际上安装了 Vue2.7 的版本，可以在 `node_modules` 目录中检查实际安装的版本号。

由于 tdesign-vue 正常版本中使用的 `@vue/composition-api`，无法在 Vue2.7 中使用，使用 tdesign-vue 正常版本时，请确保自己安装的版本号是 Vue2.6.x。如果您确实需要使用 Vue2.7 请安装 `tdesign-vue@naruto`

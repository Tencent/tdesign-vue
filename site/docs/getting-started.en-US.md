---
title: Vue for Web
description: TDesign Vue is a UI component library for Vue 2 and desktop application.
spline: explain
---

## Installation

### npm

```shell
npm i tdesign-vue // for Vue 2.6
npm i tdesign-vue@naruto  // for Vue 2.7
```

### unpkg

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
> Please note that unpkg usage is not recommended as it cannot achieve optimization measures such as tree shaking. Production projects will be directly affected by version updates, and may also be affected by the stability of the CDN.

The package of tdesign-vue provides kinds of bundles, read [the documentation](https://github.com/Tencent/tdesign/blob/main/docs/develop-install.md) for the detail of differences between bundles.

## Usage

TDesign provides three ways to use components

### Basic Usage

Basic usage will register all components in full. If your project uses components on a large scale, feel free to use tdesign-vue in this way.

```js
import Vue from 'vue';
import TDesign from 'tdesign-vue';

// import global design variables
import 'tdesign-vue/es/style/index.css';

Vue.use(TDesign);
```

### Import on-demand

If you have strict requirements for the size of the artifact, you can use tdesign-vue in this way.

With the help of building tools such as `Webpack` or `Rollup` that support tree-shaking features, you can achieve the effect of importing on demand.

```js
import { Button as TButton } from 'tdesign-vue';

// import global design variables
import 'tdesign-vue/es/style/index.css';

Vue.use(TButton);
```

### Import on-demand with Plugin

You can also use `unplugin-vue-components` and `unplugin-auto-import` to achieve automatic on-demand import.

If you are using tdesign-vue in Vue 2.6, you still need to import a small amount of global style variables and `@vue/composition-api` in the component library into your project.

If you are using tdesign-vue in Vue 2.7, you no longer need to import `@vue/composition-api`

```js
import VueCompositionAPI from '@vue/composition-api';
// import global design variables
import 'tdesign-vue/es/style/index.css';

Vue.use(VueCompositionAPI); // must be the first one
```

install `unplugin-vue-components` and `unplugin-auto-import`

```bash
npm install -D unplugin-vue-components unplugin-auto-import
```

Then, add the above plugins to the corresponding configuration files of Webpack or Vite.

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
    AutoImport.default({
      resolvers: [TDesignResolver()],
    }),
    Components.default({
      resolvers: [TDesignResolver()],
    }),
  ],
};
```

> You can click on this [link](https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/tdesign.ts#L4) for the configuration supported by `TDesignResolver`.

## Starter Kit

Visit [TDesign Starter](https://tdesign.tencent.com/starter/vue/) to experience the system built with tdesign-vue UI Components.

## Browser Support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/> IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Edge >=91                                                                                                                                                                                                        | Firefox >=83                                                                                                                                                                                                      | Chrome >=91                                                                                                                                                                                                   | Safari >=14.1                                                                                                                                                                                                 |

Read our [browser compatibility](https://github.com/Tencent/tdesign/wiki/Browser-Compatibility) for more details.

## FAQ

Q: When using Local Registration, an error is reported: `Uncaught Error: [vue-composition-api] must call Vue.use(plugin) before using any function.`
A: The component uses Composition API internally. To resolve this error, you need to use `CompositionAPI` first in main.js. For example:

```js
// main.js
import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';

Vue.use(VueCompositionAPI);
Vue.use(otherPlugin);
```

Q: Does TDesign have a built-in reset style for unifying the default styles of page elements?

A: Since version `0.43.0`, tdesign-vue no longer imports `reset.less`. The biggest impact is the removal of the global box model setting

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

If your project development depends on the `reset` style, you can import it from the `dist` directory.

```js
import 'tdesign-vue/dist/reset.css';
```

Q: How to use tdesign-vue in Vue 2.7?

A: tdesign-vue support Vue 2.7 since version `1.4.0`. In Vue2.7, please install tdesign-vue@naruto or add the label "-naruto" after specifying a specific version.

for example, `tdesign-vue@1.4.0` is for `Vue 2.6` while `tdesign-vue@1.4.0-naruto` is for `Vue 2.7`

Q: How to resolve the error `vue.runtime.esm.js:4605 [Vue warn]: inject() can only be used inside setup() or functional components.`?

A: When using components, if you see this kind of error `vue.runtime.esm.js:4605 [Vue warn]: inject() can only be used inside setup() or functional components.`, it means that although the version number set in package.json is `^2.6.14`, the actual installed version is Vue 2.7. You can check the actual installed version in the node_modules directory.

Please make sure that the version number you installed is Vue 2.6.x. If you do need to use Vue 2.7, please install tdesign-vue@naruto.

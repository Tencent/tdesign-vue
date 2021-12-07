# 最佳实践

欢迎使用 TDesign Starter for vue2, 快速搭建你的项目!

######

<p>
<a href="https://tdesign.tencent.com/starter/vue/" target="_blank">
<img src="https://tdesign.gtimg.com/starter/brand-logo-light.png" class="__light__" style="height:44px;margin-top:0;"/>
<img src="https://tdesign.gtimg.com/starter/brand-logo-dark.png" class="__dark__" style="height:44px;margin-top:0;"/>
</a>
</p>
<p>
  <a href="https://npmjs.com/package/vite"><img src="https://img.shields.io/npm/v/vite.svg" alt="npm package"></a>&nbsp;
  <a href="https://nodejs.org/en/about/releases/"><img src="https://img.shields.io/node/v/vite.svg" alt="node compatility"></a>
</p>
<p>
  <a href="http://tdesign.tencent.com/starter/vue/">立即体验 </a>
  .
  <a href="https://github.com/TDesignOteam/tdesign-vue-starter">代码仓库</a>
  ·
  <a href="https://github.com/TDesignOteam/tdesign-vue-starter/issues/new">反馈问题</a>
</p>
<p>
  <img src="https://tdesign.gtimg.com/starter/starter.png" style="border-radius:6px;border:1px solid var(--component-border)"/>
</p>

### 项目简介

TDesign Starter 基于 TDesign UI 组件，旨在提供项目开箱即用的、配置式的并且拥有开发体验和设计感的中后台的项目。

- 设计美观

  - 基于 TDesign UI 设计规范
  - 提供 Figma、 Sketch、 Adobe XD、 Axure 等多种类型的设计资源
  - 在开源体系上打造具有自身品牌特色且好用的产品

- 完备路由

  - 同时支持配置式路由和自定义路由
  - 对于配置型路由，提供导航类组件的深度定制（“菜单 Menu”、“面包屑 Breadcrumb”），无需手动处理路由映射关系。

- 动态布局:

  - 内置“左右布局”、“上左右布局”、“上下布局”等中后台常用布局，
  - 页面内容基于 24 栅格布局设计，内置“常规型”和“紧凑型”两种间距模式

- 极速 HRM:

  - 采用 `Vite` 构建
  - 开发环境下体验浏览器 esmodule bundless, 达到极速更新，无需等待漫长的 bundle 过程

- 开发规范:
  - 统一规范会减少沟通成本，提高开发和维护的体验；
  - 代码规范采用`eslint-config-airbnb-base`,
  - 提交规范采用 `Angular commit 规范`

### 快速开始

通过 `tdesign-starter-cli` 初始化项目仓库

```bash
## 1、安装 tdesign-starter-cli
npm i tdesign-starter-cli@latest -g

## 2、创建项目
td-starter init
```

<p>
  <img src="https://tdesign.gtimg.com/starter/starter-cli.png" style="border-radius:6px;border:1px solid var(--component-border)"/>
</p>

### 项目脚本

```bash
## 安装依赖
npm install

## 启动项目
npm run dev

## 项目构建
npm run build

## 项目预览
npm run serve

## 项目lint
npm run lint

## 修复lint
npm run lint:fix

```

### 路由和菜单

菜单（侧边栏和面包屑）由路由配置自动生成，根据路由变化可自动匹配，开发者无需手动处理这些逻辑。
可在`src/config/routes.js`文件中修改。
菜单和路由的映射如下：

```json
{
  "path": "/dashboard",
  "icon": "chart-pie",
  "title": "仪表板",
  "component": "../layouts/default.vue",
  "children": [
    {
      "title": "基础仪表盘",
      "path": "base",
      "component": "../pages/demo.vue",
      "children": [
        {
          "title": "基础仪表盘",
          "path": "base",
          "component": "../pages/demo.vue"
        }
      ]
    }
  ]
}
```

### 布局

网站布局支持“空布局”， “侧边栏导航布局”， “侧边栏布局加头部导航”，“头部导航”四种；布局文件地址在`src/layouts`

其中`src/layouts/td-layout`为动态布局，可以在`src/config/style.js`中进行个性化配置以下功能

- 左侧布局，顶部布局，混合布局
- 是否展示面包屑
- 是否展示 footer
- 是否展示紧凑版页面
- 主题切换（规划中）

  <br/>

更多定制化布局，推荐使用 TDesign UI layout

- `<t-layout>`
- `<t-header>`
- `<t-footer>`
- `<t-aside>`
- `<t-content>`

### 转发配置 mock

在 vite.config.js 中 viteMockServe 中配置 localEnabled 为 ture 即可开启 mock server 的拦截。

mock 文件可在 `/mock/index.ts`文件中进行新增，支持采用 `mock.js`模拟数据。

```javascript
viteMockServe({
  mockPath: 'mock',
  localEnabled: true,
});
```

### 提交规范

整齐美观的提交规范，沟通维护更加省力, 本项目采用[ Angular Git Commit Guidelines](https://zj-git-guide.readthedocs.io/zh_CN/latest/message/Angular%E6%8F%90%E4%BA%A4%E4%BF%A1%E6%81%AF%E8%A7%84%E8%8C%83/)

### 社区插件

| 名称                                                      | 简介                |
| --------------------------------------------------------- | ------------------- |
| [qrcode.vue](https://github.com/scopewu/qrcode.vue)       | vue2 二维码预览工具 |
| [vue-clipboard2](https://github.com/Inndy/vue-clipboard2) | 剪切板功能          |
| [nprogress](https://github.com/rstacruz/nprogress)        | 应用加载进度条      |

### 兼容性

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Edge >=16                                                                                                                                                                                                       | Firefox >=60                                                                                                                                                                                                      | Chrome >=61                                                                                                                                                                                                   | Safari >=11                                                                                                                                                                                                   |

### Troubleshooting 问题排查

##### 1、Cannot find module ‘worker_threads’

Vite 运行依赖 Node `12.0.0` 以上版本, Node 10.5 版本之前不支持 Worker，请升级 Node 版本即可。

##### 2、 wasm code commit Allocation failed - process out of memory

方法一、启动项目时内存溢出，需要升级 Node 版本至 `15.3.0` [(完整问题)](https://stackoverflow.com/questions/48387040/how-do-i-determine-the-correct-max-old-space-size-for-node-js)

方法二、调整 Node 内存大小使用限制
`max_old_space_size=4096`[(完整问题)](https://segmentfault.com/a/1190000010437948)

### 参与共建

TDesign Starter 还是一个成长中项目，如遇问题或 bug，请向我们反馈，任何的建议都是对我们成长的动力。

以下项目正在规划和筹备中

- 主题换肤，暗黑模式支持
- tdesign-start-cli
- tdesign vue3 starter
- tdesign react starter

### Contributors

<td-avatar username="phyliszhang"></td-avatar>
<td-avatar username="williamliao"></td-avatar>
<td-avatar username="uyarnchen"></td-avatar>
<td-avatar username="lizhicai"></td-avatar>
<td-avatar username="hualyzheng"></td-avatar>

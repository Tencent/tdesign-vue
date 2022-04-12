# 开发指南

tdesign-vue 包含 web-vue 代码和一个子仓库，子仓库指向 [tdesign-common](https://github.com/Tencent/tdesign-common) 仓库

## 公共子仓库 tdesign-common

本项目以子仓库的形式引入 tdesign-common 公共仓库，对应 src/\_common 文件夹
公共仓库中包含

- 一些公共的工具函数
- 组件库 UI 开发内容，既 html 结构和 css 样式（React/Vue 等多技术栈共用）

### 初始化子仓库

- 初次克隆代码后需要初始化子仓库： git submodule init && git submodule update
- git submodule update 之后子仓库不指向任何分支，只是一个指向某一个提交的游离状态

### 子仓库开发

子仓库组件分支从 develop checkout 示例：feature/button，提交代码时先进入子仓库完成提交，然在回到主仓库完成提交

- 先进入 common 文件夹，正常将样式修改添加提交
- 回到主仓库，此时应该会看到 common 文件夹是修改状态，按照正常步骤添加提交即可

### 关于组件库 UI

UI 开发（html & css）是由 React/Vue 等多个实现框架共用的。各个框架组件实现应该要复用 UI 开发的 html 结构，引用其组件 css 与 demo css（本仓库已在入口处引用了），UI 开发一般可由单独的 UI 开发同学认领完成或各框架组件开发同学的其中一名同学完成

- 如果开发前已有某个组件的 UI 开发内容，直接在主仓库使用即可
- 如果没有，且你也负责 UI 开发：参考 UI 开发规范完成 UI 开发内容、然后再开发主仓库组件
- 如果没有，且 UI 开发工作已有其他同学负责或认领：可以先在主仓库开发组件功能，待 UI 开发输出之后对齐即可

如果 UI 内容和样式（其他同学负责开发）还未完成，而你开发组件功能时需要写一些样式，可以直接在组件文件夹先写一个临时的 less 文件，在 js 中引入即可，如：

```
├── button.less
├── button.tsx
```

```js
// button.tsx

// 先引入临时的样式文件用于开发功能，待 UI 开发完成之后需要与 UI 样式对齐并删除 less 文件
import './button.less';
```

## 开发规范

UI 开发规范参考子仓库 README [子仓库 README](https://github.com/Tencent/tdesign-common/tree/develop/style/web)

### API 规范

[API](https://github.com/Tencent/tdesign/wiki/%E7%BB%84%E4%BB%B6-API-%E5%88%B6%E5%AE%9A%E6%8C%87%E5%BC%95)

### 前缀

组件和 css 前缀以 t- 开头，无论 js 还是 css 都使用变量定义前缀，方便后续替换

### js

遵循 eslint-config-airbnb-base 编码规范

使用 `npm run lint:fix` 执行自动修复 eslint 错误

### css

组件样式在 common 子仓库开发，类名使用 [BEM 命名规则](http://getbem.com/)

### git

#### 分支

主仓库遵循使用 git flow 规范，新组件分支从 develop checkout：[https://nvie.com/posts/a-successful-git-branching-model/](https://nvie.com/posts/a-successful-git-branching-model/)

如果是贡献组件，则从 develop checkout 分支如：feature/button，记得如果同时要在子仓库开发 UI，子仓库也要 checkout 同名分支

#### 提交说明

项目使用基于 angular 提交规范：[https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional)

每次提交会自动触发提交验证

- 使用工具 commitizen 协助规范 git commit 信息
- fix & feat 的提交会被用来生成 changelog
- 提交会触发 git pre-commit 检查，修复提示的 eslint 错误

具体细节可参考`package.json husky 配置`

##### 提交步骤

1. 选择并确认好需要提交的代码
2. 考虑到可视化工具的差异，建议使用命令行提交，输入 `git commit`，然后根据提示逐步输入必要的信息即可

**windows 用户注意事项：** 由于 husky 中配置的 git hook 指令依赖 shell 执行环境，为了保证正常的提交，建议在 git bash 或 [windows 10 wsl 环境](https://docs.microsoft.com/en-us/windows/wsl/install-win10) 下执行提交。

## 开发

### 安装依赖

```bash
npm i
```

### 本地开发

```bash
npm run dev
```

浏览器访问 <http://127.0.0.1:16000>

### 目录结构

```javascript
├── examples // 组件文档与 demos
├── script // 构建代码
├── site // 站点代码
├── src // 组件代码
├── test // 测试文件
```

### 新增开发组件

npm run init component-name

```bash
npm run init button
```

其中，button 为组件名称。删除组件使用 `npm run init button del` 。

### 组件页路由配置

每一个组件页，都是一个 md 文件，参考 /site/config/index.js 已有定义，直接按照模板添加即可

```javascript
{
  title: '基础组件',
  type: 'component', // 组件文档
  children: [
    {
      title: 'Button 按钮',
      name: 'button',
      component: () => import(`@/examples/components/button/button.md`),
    },
    {
      title: 'Icon 图标',
      name: 'icon',
      component: () => import(`@/examples/components/icon/icon.md`),
    },
    ...
  ],
},
```

#### md 文件 demo 引用

文档 demo 排列与 common 仓库中的 UI demo 展示一致

```markdown
::: demo <demo 路径如：demos/base> [demo 标题][--dev 是否只在开发环境插入]
[demo 描述（可不填）]
:::
```

### demo 调试

当一个 md 文件插入了很多个 demo 之后，一些组件生命周期方法调试起来会变得困难，若想对某个 demo 单独调试，可以访问路由：/demos/组件名/demo 名，如想单独调试 button 组件 demos 文件夹下的 base demo，则可点击 demo 旁的箭头或直接访问：<http://127.0.0.1:16000/vue/demos/button/base>

所有 demo 路由列表页：<http://127.0.0.1:16000/vue/demos>

### 实现组件的受控与非受控用法

参考 [map-props 说明](./map-props.md)

### 单元测试 & e2e 测试文档

[组件测试文档](./TEST_GUIDE.md)

### 项目常用脚本说明

```bash
# 启动项目
npm run dev
# 更新组件库图标
npm run update:icon
# 更新网站组件单元覆盖率徽章
npm run update:coverage-badge
# 编译站点
npm run site
# 编译站点预览
npm run site:preview
# 清除 npm run build 的编译结果
npm run prebuild
# 编译组件库
npm run build
# 快速创建组件及其相关文件
npm run init
# 执行端对端测试
npm run test:e2e
# 执行端对端测试（含 UI 界面）
npm run test:e2e-gui
# 运行行单元测试用例
npm run test:unit
# 服务端渲染测试
npm run test:node
# 运行单元测试监听模式，文件发生变化时，立即执行单元测试
npm run test:watch
# 单元测试覆盖率
npm run test:coverage
# 构建产物测试
npm run test:build-files
# 自动修复 eslint 错误
npm run lint:fix
# 查看 eslint 错误
npm run lint
```

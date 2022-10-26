# 测试规范

## 1. 概览

### 1.1 主要 script 命令

```
# 运行全部测试
npm run test

# 运行单元测试
npm run test:unit

# 运行服务端渲染测试
npm run test:node

# 生成测试覆盖率报告
npm run test:coverage

# 更新 snapshot
npm run test:update
```

### 1.2 目录结构

- test 测试目录
  |-- e2e UI 测试
  |-- unit/coverage 单元测试结果报告
  |-- ssr 服务端测试
  |-- ...

  ssr 测试由 [脚本](https://github.com/Tencent/tdesign-vue/blob/develop/test/ssr/ssr.test.js) 对所有组件的 demo 做渲染测试，无需手动编写测试用例脚本。

## 2. 单元测试

```
npm run test:unit
```

- `/src/xx component/__test__/` 目录中存放测试文件
- index.test.js 用于测试组件较细粒度的属性事件方法
- demo.test.js 用于测试组件 demo 是否正常工作，通常不用手写，如有缺失请执行 `npm run test:demo` 生成

### 2.1 单元测试规范

- 每个组件至少有两个单元测试文件，一个是测试源代码的单元测试文件 index.test.js，另一个则是测试组件示例代码的单元测试文件 demo.test.js
- 用例书写请使用：[vue-test-utils](https://vue-test-utils.vuejs.org/zh/)
- 断言库请使用：[https://vitest.dev/api/#expect](https://vitest.dev/api/#expect)

#### 单元测试文件

需要对组件的 props/event/slot/methods 分别覆盖测试。具体组织方式可以参考 (Button)[https://github.com/Tencent/tdesign-vue/blob/develop/src/button/__tests__/index.test.js]，简单的渲染测试可以直接使用 snapshot

#### 测试调试

可以指定只跑特定的测试文件，例如只想看 button 的测试结果：

```
npm run test:unit button
```

如果确认是预期的修改造成的 snapshot 变化，可以更新 snapshot 并提交:
更新单元测试用例快照
```
npm run test:unit-update
```

更新 SSR 测试用例快照

```
npm run test:node-update
```
#### 检查测试覆盖

```
npm run test:coverage
```

执行命令，会生成 `/test/unit/coverage/index.html` 页面，在浏览器内打开查看测试报告，以查看 Cascader 组件测试覆盖率为例：

![image](https://user-images.githubusercontent.com/7600149/187356294-226dd845-deb1-4e90-8652-bfc650cc409c.png)

过滤后可以看到组件相关文件测试覆盖情况，`src/cascader/_usage` 目录是官网 live demo 的实现，不需要测试，其他未达到全覆盖的文件可以点击查看详情：

![image](https://user-images.githubusercontent.com/7600149/187362016-bed07ec5-ee81-46d8-be5d-823b0c2b0b6d.png)

红色标记的为还未覆盖到的语句，需要针对性的补充测试用例。

#### PR Review

当你补充了测试用例提交 PR 后，会有负责的 PMC 同学 review，并检查 Codecov Report 指标：

![image](https://user-images.githubusercontent.com/7600149/187367112-6f923092-a4a1-446c-89f1-0b2d1cfd9eb8.png)

达到组件测试覆盖指标后 PR 才会被合入。

## 3. 服务端渲染测试

服务端渲染测试主要利用 node 环境下的测试快照，与已有 jsdom 环境快照进行对比

```
npm run test:node
```

## 4. E2E 测试

cypress 可以覆盖 Puppeteer 的 E2E 测试场景，优先选择了 cypress 作为测试框架，它能实现以下功能：

- 开箱即用
- 官方 doc 很多，利于开发与维护
- gui 界面（ env：google 浏览器），可边测边调整
- 自定义 commands
- 自定义 fixture，可 mock 数据
- 支持 ci 运行测试，可上传到 bashBoard
- 关注测试覆盖率（ Chrome 的 coverage ）
- 截图功能，用例失败的场景节点会被截图保存，利于复现
- 录屏功能，每个测试用例都会记录下来（ MP4 ）
- 社区其他的插件支持

## 如何运行

### cli 运行

```
npm run cypress
```

### GUI 界面运行

```
npm run cypress-gui
```

## 测试规范

使用 BDD 模式进行开发，必须在流水线里面通过单元测试。

```
describe('测试按钮组件', () => {
  beforeEach(() => {
    // 打开某个页面
    cy.visit('/#/components/button');
  });
  // 测试用例定义
  it('case1: 测试三种按钮类型，内容，渲染正确的类型跟内容', function() {
  });
  it('case2: 测试按钮尺寸，渲染正确的大小', function() {
  });
  it('case3: 测试带图标按钮，按钮内容里的图标位置', function() {
  });
  it('case4: 测试loading状态的按钮', function() {
  });
});

```

## 测试示例

```
describe('测试按钮组件', () => {
  beforeEach(() => {
    // 打开某个页面
    cy.visit('/#/components/button');
  });
  // 测试用例定义
  it('case1: 测试三种按钮类型，内容，渲染正确的类型跟内容', function() {
    cy.get('.button')
      .should(ele => {
        expect(ele).to.have.text('按钮1');
      });
    ...
  });
  it('case2: 测试按钮尺寸，渲染正确的大小', function() {
  });
  it('case3: 测试带图标按钮，按钮内容里的图标位置', function() {
  });
  it('case4: 测试loading状态的按钮', function() {
  });
});

```

## 注意事项

e2e 测试建议放在 test/e2e/ 目录下面
common
script 配置文件（包含测试相关配置文件）
src
test 测试目录
|-- e2e // 这里面放 e2e 的测试内容
|-- unit
|-- ssr
|-- ...

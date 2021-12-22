---
title: 更新日志
spline: explain
toc: false
docClass: timeline
---

## 0.32.0 `2021-12-23`

### BREAKING CHANGES


### Bug Fixes


### Features


## 0.31.0 `2021-12-09`

### BREAKING CHANGES

- Loading: CSS 类名规范，[@chaishi](https://github.com/chaishi)
- Anchor: CSS 类名规范，[@zWingz](https://github.com/zWingz)
- Slider:
  - `inputNumberProps` 默认值改为 `false`，[@pengYYYYY](https://github.com/pengYYYYY)
  - 内置 inputNumber 组件 DOM 层级调整，[@pengYYYYY](https://github.com/pengYYYYY)

### Bug Fixes

- Table:
  - 修复第一列跨行且夸列时，单元格合并设置不生效的问题，[@realyuyanan](https://github.com/realyuyanan)
  - 修复表格二级行数据使用 $set 无法更新的问题，[@chaishi](https://github.com/chaishi)
- Swiper: 修复在 esm 引用下样式丢失的问题，[@cong-min](https://github.com/cong-min)
- Radio: 修复 `click` 事件被 emit 两次的问题，[@chaishi](https://github.com/chaishi)
- Checkbox: 修复 `click` 事件没有 emit，[@chaishi](https://github.com/chaishi)
- Dialog: 修复切换显示/隐藏动画存在闪动的问题，[@pengYYYYY](https://github.com/pengYYYYY)
- Nofication: 修复 icon 不能自定义配置的问题，[@chaishi](https://github.com/chaishi)
- Radio: 修复 Radio Group 初始化未被渲染导致滑块缺失的问题，[@HQ-Lin](https://github.com/HQ-Lin)
- Datepicker: [@xiaosansiji](https://github.com/xiaosansiji)
  - 修复 `prefixIcon` 和 `suffixIcon` 支持 slot 用法的问题
  - 修复清空操作会唤起日期选择框的问题

### Features

- Loading: `size` 支持传入 `string` 类型字体大小单位，[@chaishi](https://github.com/chaishi)
- Menu: 优化侧边导航栏滚动条样式，[@pengYYYYY](https://github.com/pengYYYYY)
- 兼容项目中使用了 [@vue/composition-api](https://www.npmjs.com/package/@vue/composition-api) 的情况：默认使用项目中引入的 `composition-api` 包，[@LeeJim](https://github.com/LeeJim)
- Dropdown: [@uyarn](https://github.com/uyarn)
  - `minColumnWidth` 和 `maxColumnWidth` 支持 `string` 类型
  - DropdownItem `value` 支持 `object` 类型
- Cascader: [@pengYYYYY](https://github.com/pengYYYYY)
  - 补充 `onChange` args
  - 空数据时下拉框宽度跟随 input 宽度设置

## 0.30.0 `2021-12-02`

### BREAKING CHANGES

- CSS 类名规范: [@chaishi](https://github.com/chaishi)
  - Dialog: `t-dialog-confirm` 更为 `t-dialog__confirm`，`t-dialog-cancel` 更为 `t-dialog__cancel`
  - Drawer: `t-drawer-confirm` 更为 `t-drawer__confirm`，`t-drawer-cancel` 更为 `t-drawer__cancel`

### Bug Fixes

- Dialog: 修复设置按钮为 null，无法隐藏按钮的问题 [@chaishi](https://github.com/chaishi)
- Drawer: 修复确认/取消按钮无法支持插槽渲染问题 [@chaishi](https://github.com/chaishi)
- Transfer: 修复全选状态展示有误的问题 [@BigLiao](https://github.com/BigLiao)
- Checkbox: 修复 `change` 事件值返回不正确的问题 [@chaishi](https://github.com/chaishi)
- Button: 修复幽灵按钮无点击动效的问题 [@xiaosansiji](https://github.com/xiaosansiji)
- Memu: 修复暗黑模式下菜单分组标题颜色使用错误的问题 [@LeeJim](https://github.com/LeeJim)
- Input: [@chaishi](https://github.com/chaishi)
  - 修复 `change` 事件无法获取到最新数据的问题
  - 修复重复触发 `onChange` 事件的问题
- Datepicker: 修复区间选择跨年情况下月份展示错误的问题 [@xiaosansiji](https://github.com/xiaosansiji)

### Features

- Upload: [@chaishi](https://github.com/chaishi)
  - 自动上传模式删除非必要上传按钮
  - 输入框模式新增删除按钮
- Popconfirm: 移除 确认/取消按钮 外层元素 `<span>` [@chaishi](https://github.com/chaishi)
- Textarea: 支持 `maxcharacter` 用于字符文本长度控制 [@zhaodanchun](https://github.com/zhaodanchun)
- Table: `expandedRow` 支持插槽写法 [@realyuyanan](https://github.com/realyuyanan)
- Cascader: 补充 `change` 事件缺失的 `context` 参数，包含触发节点和触发来源 `{ node, source }` [@chaishi](https://github.com/chaishi)
- TreeSelect: 补充 `blur` 和 `focus` 事件参数 `FocusEvent` [@chaishi](https://github.com/chaishi)
- Checkbox: 全选功能支持插槽写法 [@chaishi](https://github.com/chaishi)

## 0.29.1 `2021-11-30`

### Bug Fixes

- Popup: 修复嵌套使用 Popup 时不能正确响应 hover trigger 的问题 [@ikeq](https://github.com/ikeq)
- Datepicker: 修复 0.29.0 版本中星期显示错误的问题
- Upload: 修复图片预览框闪动的问题 [@chaishi](https://github.com/chaishi)

### Features

- Upload: 新增开关，用于控制是否显示为模拟进度 [@chaishi](https://github.com/chaishi)
- Datepicker [@xiaosansiji](https://github.com/xiaosansiji)
- `firstDayOfWeek` API 重构，官网新增设置星期开始样例
- 全局配置星期和月份文案格式修改

## 0.29.0 `2021-11-24`

### BREAKING CHANGES

- Menu: `expanded` 优化为受控属性，`defaultExpanded` 为非受控属性 [@LeeJim](https://github.com/LeeJim)
- LocalProvider 配置多语言方案已废弃，请升级为 ConfigProvider，参考 [文档](https://tdesign.tencent.com/vue/components/config)，[@chaishi](https://github.com/chaishi)
- Select: TS 类型 `Options` 更为 `SelectOption`，[@chaishi](https://github.com/chaishi)

### Bug Fixes

- TreeSelect:
  - 修复 `data` 为空时，显示异常的问题 [@Godlike-meteor](https://github.com/Godlike-meteor)
  - 修复节点选择后重新展开了子树的问题，[@LeeJim](https://github.com/LeeJim)
- Popup: 优化动画实现，修复基于 Popup 组件的相关组件收起动画未正常展示的问题 [@uyarn](https://github.com/uyarn)
- Select:
  - 修复 `options` 有相同 `value` 时不重新渲染的问题，[@geff1991](https://github.com/geff1991)
  - 修复透传 `popupProps` 属性失效的问题，[@HQ-Lin](https://github.com/HQ-Lin)
  - 修复多选情况下，选项宽度不够时 Checkbox 选择框展示不全的问题 [@uyarn](https://github.com/uyarn)
- Table: ，[@realyuyanan](https://github.com/realyuyanan)
  - 修复表格内容溢出问题，、
  - 修复只有一列时，固定表头与内容无法对齐的问题，
- Tree: 修复节点数据更新后，丢失选中状态的问题 [@TabSpace](https://github.com/TabSpace)
- Radio: 修复 `radio-group` value 不存在时渲染异常的问题 [@HQ-Lin](https://github.com/HQ-Lin)
- 修复构建后 d.ts 文件丢失的问题，[@BuptStEve](https://github.com/BuptStEve)

### Features

- Steps: 组件部分逻辑重构，`direction` 即将在下个版本废弃，请改用 `layout` API，可选项类型不变，[@LeeJim](https://github.com/LeeJim)
- Menu: 支持子菜单 `disabled` 配置，[@LeeJim](https://github.com/LeeJim)
- Cascader: `checkStrictly=true` 时，点击选项，级联选择器不会收起；`collapsedItems` 支持 function/slot 自定义配置用法，[@yc910920](https://github.com/yc910920)
- Select: ，[@chaishi](https://github.com/chaishi)
  - 优化分组选择器标签语义，
  - 加载状态新增显示右侧加载图标，
  - `options` 配置支持分组选择器，
  - `options` 新增参数 `content`，用于定义复杂的选项内容，如：`content: (h) => <div>复杂标签内容</div>`
  - `t-option` 支持 `content: TNode`，用于渲染子元素，支持 function/slot 用法，同 `default`
  - 分组选择器支持使用 `divider` 控制分隔线是否显示
- Tree: 实现 `disableCheck` 属性，优化减少使用 `watch` 特性，[@TabSpace](https://github.com/TabSpace)
- Upload: ，[@chaishi](https://github.com/chaishi)
  - 补充上传失败判定条件，`formatResponse` 返回值 `error` 为真，则表示上传失败
  - progress 事件参数新增 `type: 'real' | 'mock'`，分别表示真实进度和模拟进度
  - 如果接口和 `formatResponse` 都没有返回 url，组件会默认填充一个图片预览地址
  - progress 事件返回的进度不会超过 100
  - 上传成功后执行 `formatResponse`
- Tabs: 优化 Panel 渲染实现 [@start940315](https://github.com/start940315)

## 0.28.2 `2021-11-16`

### BREAKING CHANGES

- 从 0.28.0 版本开始，将只在外网 npm registry 上发布，请安装外网包 [tdesign-vue](https://www.npmjs.com/package/tdesign-vue)
- 有单独引入图标使用的小伙伴请改为引入外网包 `tdesign-icons-vue`

### Bug Fixes

- Select: 监听 options 中 label value 变化，修复多选模式下默认值传字符串的展示问题，[@geff1991](https://github.com/geff1991)
- Menu: ，[@LeeJim](https://github.com/LeeJim)
  - 修复顶部导航下拉菜单与双层导航激活样式效果丢失的问题，
  - 修复动态设置菜单内容时交互异常的问题，
  - 修复切换菜单收起时，`expanded` 状态不同步的问题，
- Radio: 修复 `value` 不支持 `boolean` 类型的问题 [@ikeq](https://github.com/ikeq)
- Loading: 修复 Safari 浏览器下加载中样式展示异常的问题，[@uyarn](https://github.com/uyarn)
- Popup: 修复 Popup/Popconfirm 等弹出组件 arrow 定位未跟随弹出框内容的问题，[@HQ-Lin](https://github.com/HQ-Lin)
- Upload: 修复组件 disabled 态下依然响应点击事件的问题，[@pengYYYYY](https://github.com/pengYYYYY)
- Input/InputNumber: 修复小键盘未能正常触发 Enter 事件的问题 [@mokywu](https://github.com/mokywu)
- Transfer: 修复 Tree 属性结构模式无法使用的问题，[@BigLiao](https://github.com/BigLiao)
- Table:
  - 修复 `Column.width` 传入百分比不生效的问题 [@LeeJim](https://github.com/LeeJim)
  - 修复树型结构 disabled 状态的行数据仍可被选择的问题，[@chaishi](https://github.com/chaishi)
- Form:
  - 修复配置自定义校验规则时，清空输入框以及下拉框无法触发自定义校验函数的问题 [@dellyoung](https://github.com/dellyoung)
  - Form 组件去除校验成功后的绿色边框，如果需要可以添加 `successBorder` 设置 [@dellyoung](https://github.com/dellyoung)
- TimePicker: ，[@uyarn](https://github.com/uyarn)
  - 修复 `step` 设置值大于 1 时处理逻辑，
  - 修复清空输入框图标展示逻辑，
- InputNumber:
  - 修复小键盘未能正常触发 Enter 事件的问题，[@chaishi](https://github.com/chaishi)
  - 修复过程数据未清空导致显示异常的问题 [@jchalex](https://github.com/jchalex)
- CheckBox: 修复 CheckBox Group 受控用法数据同步问题 [@uyarn](https://github.com/uyarn)

### Features

- Menu: 优化多级菜单的缩进，处理 popup 箭头旋转，[@LeeJim](https://github.com/LeeJim)
- Avatar: 新增头像组件，使用请参考 [官网文档](https://tdesign.tencent.com/vue/components/avatar)，[@gh1198843222](https://github.com/gh1198843222)
- Loading: 所有官方组件中的加载状态，统一修改为 Loading 组件实现，统一体验，[@uyarn](https://github.com/uyarn)
- Table: `rowClassName` 支持传入 `string` 类型，[@realyuyanan](https://github.com/realyuyanan)
- Calendar: 组件及 ConfigProvider 均新增 `fillWithZero` 属性，用于控制日期以 'dd' 格式展示，[@PsTiu](https://github.com/PsTiu)
- Tabs: 组件重构，修复滚动问题，[@start940315](https://github.com/start940315)

## 0.27.2 `2021-11-09`

### Bug Fixes

- Table: 修复 `size=small` 时，排序按钮被遮挡的问题 [@realyuyanan](https://github.com/realyuyanan)

### Features

- Popconfirm: 确认及取消按钮支持 slot 用法 [@zhaodanchun](https://github.com/zhaodanchun)
- Icon: 包中默认导出及注册 Icon 组件，兼容全量引入图标的用法，[@uyarn](https://github.com/uyarn)

## 0.27.0 `2021-11-08`

### BREAKING CHANGES

- Icon: 官方提供的默认 Icon 拆分为 npm 独立包发布，有单独引入图标使用的小伙伴请改为引入 `tdesign-icons-vue`。
- Table: 优化样式类名，`t-table-row--selected` 更为 `t-table__row--selected`，`t-table-row--disabled` 更为 `t-table__row--disabled`

### Bug Fixes

- Tree: 修复异步加载用法下 `checkStrictly === true` 未生效的问题 [@TabSpace](https://github.com/TabSpace)
- TreeSelect: 修复 v-model 绑定数据展示异常的问题 [@Godlike-meteor](https://github.com/Godlike-meteor)
- Tab: 修复 `destroyOnHide` 不生效的问题 [@zhaodanchun](https://github.com/zhaodanchun)
- Tag: 修复 `icon` 属性只实现了 render function, 不支持 `slot` 用法的问题，[@pengYYYYY](https://github.com/pengYYYYY)
- Pagination: 修复 `totalContent` 不支持 Function 用法的问题 [@uyarn](https://github.com/uyarn)
- Select: 修复未提供默认 `placeholder` 内容的问题，[@pengYYYYY](https://github.com/pengYYYYY)
- Radio: 修复动态修改数据时，选中渲染展示异常的问题 [@HQ-Lin](https://github.com/HQ-Lin)
- Datepicker: 修复快捷选项较多时，展示异常的问题 [@xiaosansiji](https://github.com/xiaosansiji)
- Select: 修复在 Form 表单中使用时，表单验证样式异常的问题 [@uyarn](https://github.com/uyarn)
- Table:
  - 修复切换分页配置会重复触发 pageChange 事件的问题 [@uyarn](https://github.com/uyarn)
  - 修复空数据状态下样式展示问题 [@realyuyanan](https://github.com/realyuyanan)
  - 修复 `small` 尺寸下展开按钮被遮挡的问题 [@realyuyanan](https://github.com/realyuyanan)
  - 修复设置 `maxHeight` 后固定滚动展示异常的问题 [@realyuyanan](https://github.com/realyuyanan)
  - 修复配置多级表头时，表格列排序消失的问题 [@realyuyanan](https://github.com/realyuyanan)
  - 修复 Table 类型定义问题 [@chaishi](https://github.com/chaishi)

### Features

- Upload: 支持抛出上传模拟进度，[@byq1213](https://github.com/byq1213)
- Form: FormItem 支持 `requiredMark` 属性，用于控制是否显示必填符号 [@dellyoung](https://github.com/dellyoung)
- Table: 新增 `filter.component` 属性用于自定义表格中的过滤组件，[@chaishi](https://github.com/chaishi)
- Popconfirm、Dialog: 新增主题相关的样式 `class` 配置 [@uyarn](https://github.com/uyarn)
- Grid: 优化 `gutter` 计算逻辑，[@HQ-Lin](https://github.com/HQ-Lin)
- Table: 新增 `tree` 属性，支持在表格中展示树形结构，[@chaishi](https://github.com/chaishi)
  - `tree.indent` 控制树结点缩进距离，单位：px，默认为 24px
  - `tree.treeNodeColumnIndex` 控制树结点在第几列渲染，默认为 0 ，第一列
  - `tree.childrenKey` 控制树形结构子节点字段，默认为 children
  - `tree.checkStrictly` 控制树形结构的行选中（多选），父子行选中是否独立，默认独立，值为 true
  - `selectChange` 事件回调参数新增 `type`，用以区分操作类型

## 0.26.0 `2021-11-01`

### Bug Fixes

- 全局注册：自动全局注册所有组件，防止使用 umd 资源时组件无法渲染的问题 [@BuptStEve](https://github.com/BuptStEve)
- Popup: 修复 popperjs 2.10.0 版本类型校验导致的报错 ，[@ikeq](https://github.com/ikeq)
- InputNumber: 修复增加/减少控制按钮 Icon 无法正常显示的问题 [@HQ-Lin](https://github.com/HQ-Lin)
- Table: 修复隐藏行展开控制图标时，点击仍然响应的问题 [@chaishi](https://github.com/chaishi)
- Cascader: ，[@pengYYYYY](https://github.com/pengYYYYY)
  - 修复 `filterable` 属性设置无效的问题，
  - 修复 Cascader 不支持完全受控用法的问题，
  - 修复 设置为 `check-strictly` 模式时，点击非叶子节点报错的问题，
- Datepicker: 修复 `placeholder` 属性传入数组类型报错的问题 [@xiaosansiji](https://github.com/xiaosansiji)

### Features

- 暗黑模式：组件支持暗黑模式在线切换，使用请参考 [文档](http://tdesign.tencent.com/vue/components/dark-mode)，[@xiaosansiji](https://github.com/xiaosansiji)
- Cascader: ，[@pengYYYYY](https://github.com/pengYYYYY)
  - 新增 `minCollapsedNum` 属性，用于多选情况下，控制超出该数值的选中项折叠显示
  - 新增 `collapsedItems` 属性，用于设置折叠项内容，默认为 `+N`
- Form: 优化 FormItem 提示文案展示效果，防止出现提示时出现页面闪动或滚动的效果，[@HQ-Lin](https://github.com/HQ-Lin)
- Textarea: 透传外层属性，[@zhaodanchun](https://github.com/zhaodanchun)
- Datepicker: [@xiaosansiji](https://github.com/xiaosansiji)
  - 新增 `pick` 事件，面板中选中日期时触发，
  - 选择时间段时，开始时间优化为 `00:00:00`，结束时间为 `23:59:59`，

## 0.25.0 `2021-10-21`

### BREAKING CHANGES

- Button: `shape` 默认值由 `square` 调整为 `rectangle`，支持正方形按钮展示，手动设置 `shape = square` 的小伙伴请删除设置，没有设置过 `shape` 属性的可以忽略，[@HQ-Lin](https://github.com/HQ-Lin)

### Bug Fixes

- InputNumber: 修复 `value = undefined` 时报错的问题 [@jchalex](https://github.com/jchalex)
- Radio: 修复 RadioButton `options` 为空数组时报错的问题 [@HQ-Lin](https://github.com/HQ-Lin)
- Popup/Tooltip: 修复 reference 宽度过小时箭头位置展示错位的问题 [@ikeq](https://github.com/ikeq)
- Select: 修复多选模式下，选项无法点击选中的问题 [@geff1991](https://github.com/geff1991)
- Table:
  - 修复固定列时投影样式溢出的问题 [@realyuyanan](https://github.com/realyuyanan)
  - 修复跨表格拖拽时会交换行的问题，[@cool-518](https://github.com/cool-518)

### Features

- Tooltip: `theme` 新增可选值 `light`，支持白色风格 tooltip 弹窗 [@ikeq](https://github.com/ikeq)
- Table: ，[@chaishi](https://github.com/chaishi)
  - 新增 `expandIcon` 属性，支持自定义展开图标
  - 新增 `expandOnRowClick` 属性，允许点击整行展开/收起
  - 支持 `row-mouseenter` 和 `row-mouseleave` 事件
- Dropdown: 支持 `dropdown-item` slot 用法，[@uyarn](https://github.com/uyarn)
- Popup: 优化弹出层方向判断逻辑 [@uyarn](https://github.com/uyarn)

## 0.24.0 `2021-10-14`

### BREAKING CHANGES

组件注册名称统一为大驼峰，支持在 Webstorm 中使用组件时代码提示能力 [@chaishi](https://github.com/chaishi)

### Bug Fixes

- Table: 修复固定列时表格内容不居中的问题 ，[@realyuyanan](https://github.com/realyuyanan)
- Textarea: 修复字符长度默认显示错误的问题 ，[@zhaodanchun](https://github.com/zhaodanchun)
- Popup: 移除 button disable 状态判断，修复 popup 无法正常弹出的问题 [@ikeq](https://github.com/ikeq)
- Transfer:
  - 修复被禁用选项，仍然可以被全选选中的问题，[@uyarn](https://github.com/uyarn)
  - 修复 button 存在重复 key 的问题，[@chaishi](https://github.com/chaishi)
- Button、Select、Input: 修复默认浅色模式下背景颜色异常的问题
- TreeSelect: 修复多选时使用 checkbox 报错的问题 [@Godlike-meteor](https://github.com/Godlike-meteor)
- Select: 修复 `filterable` 模式下点击输入框右侧空白处时未能正常显示 `focus` 态的问题，[@geff1991](https://github.com/geff1991)

### Features

- TreeSelect: 新增 `collapsedItems` 和 `minCollapsedNum`，用于支持选择过多时省略显示 [@Godlike-meteor](https://github.com/Godlike-meteor)
- Select: 新增 `collapsedItems` 和 `minCollapsedNum`，用于支持选择过多时省略显示；增加 `onEnter` 事件，[@geff1991](https://github.com/geff1991)

## 0.23.5 `2021-09-29`

### Bug Fixes

- Button: 修复 loading 状态下样式异常问题 [@gnauhca](https://github.com/gnauhca)
- Datepicker: 修复国际化配置时日期面板展示样式错位的问题 [@xiaosansiji](https://github.com/xiaosansiji)
- Breadcrumb: 修复内容超长时未正常显示省略样式的问题 [@yeshanshan](https://github.com/yeshanshan)
- Tooltip: 修复 `slot` 用法下，`class` 属性未能正常响应变化的问题 [@ikeq](https://github.com/ikeq)
- Menu: [@LeeJim](https://github.com/LeeJim)
  - 修复菜单项展开逻辑错误问题，
  - 修复受控用法下 `value` 值未同步的问题，
- Select: 修复受控用法下取消勾选状态同步的问题 [@geff1991](https://github.com/geff1991)
- Slider: 修复 `value` 无法更新的问题 [@byq1213](https://github.com/byq1213)
- Dropdown: 修复 `overlayClassName` 属性设置无效的问题， ，[@thinkanymore](https://github.com/thinkanymore)

### Features

- Datepicker:
  - 支持根据 `format` 属性配置，自动处理 Timepicker 时间选择器展示，[@uyarn](https://github.com/uyarn)
  - 支持区域日期时间选择模式 [@uyarn](https://github.com/uyarn)
  - `disabledData` 属性支持单独设置 after 或者 before [@xiaosansiji](https://github.com/xiaosansiji)
- Select: 支持自定义选中项的呈现方式，、，[@chaishi](https://github.com/chaishi)
- Table: 选中行增加类名 `t-table-row--selected` [@realyuyanan](https://github.com/realyuyanan)
- Swiper: 轮播组件开启 3D 加速，[@vnues](https://github.com/vnues)
- Upload: [@chaishi](https://github.com/chaishi)
  - 新增取消上传事件 `cancel-upload`
  - 新增自定义上传方法 `requestMethod`
  - 新增 `showUploadProgress` 属性，用于表示「是否显示上传进度」
  - 新增 `sizeLimit` 属性，表示文件大小限制，支持 1000 和 `{ size: 3, unit: 'MB', message: '文件过大' }` 等方式，支持单位有 'B' | 'KB' | 'MB' | 'GB'
- Form: 阻止 reset 默认事件，支持清除校验结果、，[@dellyoung](https://github.com/dellyoung)
- Popup: 优化弹出方向判断逻辑，解决小屏幕使用下适配的问题，[@uyarn](https://github.com/uyarn)

### Performance Improvements

优化点击动画实现方式，[@vnues](https://github.com/vnues)

## 0.23.4 `2021-09-22`

### Bug Fixes

- Select:
  - 修复 disabled 态下仍然展示响应态的问题 [@geff1991](https://github.com/geff1991)
  - 修复受控用法下使用异常的问题 [@geff1991](https://github.com/geff1991)

### Features

- Anchor: 支持自定义游标，详情参见官网 [demo](https://tdesign.tencent.com/vue/components/anchor#自定义游标)
- Menu: 支持超过两级的菜单展示，[@LeeJim](https://github.com/LeeJim)
- Form: FormItem 支持单独设置 `labelWidth`、`labelAlign`，优先级高于 Form 的同名属性，[@HQ-Lin](https://github.com/HQ-Lin)

## 0.23.2 `2021-09-16`

### Bug Fixes

- Tag: 修复主题配置模式下关闭按钮显示异常的问题，
- Tooltip: 修复 `overlayClassName` 不能正常向 Popup 组件传递的问题
- Datepicker: 修复 v-model 使用场景下 value 未同步的问题，、、

### Features

- Textarea: 新增 `autosize` 属性，`autosize = true` 时允许文本框高度自动撑开，同时允许手动拖动控制高度

## 0.23.1 `2021-09-14`

### BREAKING CHANGES

- Menu: 去除顶部导航菜单 operations 区域内 icon 默认样式，解决 ，升级到 0.23.0 版本的用户请手动为 icon 实现样式，或增加 `t-menu__operations-icon` class 名称。
- List: `avatar` 属性更名为 `image`，用于配置列表项图片，

### Bug Fixes

- Transfer: 修复点击操作按钮过程中，动画展示异常的问题，
- Upload: 修复服务端渲染场景下报错的问题，
- Input: 修复 `keypress` 事件未生效的问题，
- Drawer: 修复 `header=false` 时仍展示头部区域的问题，
- Tag: 修复可删除和 `maxWidth` 属性并存时，“删除” icon 未正常显示的问题，
- List: 修复 `asyncLoading` 为空时，控制台报错的问题，
- Table:
  - 修复在 Dialog 中使用 Table 组件，`ellipsis=true` 且文字过长时 tooltip 未正常展示的问题，、
  - 修复列动态变化时，固定列无效的问题，

### Features

- Slider: 新增滑块输入组件，[官网 Slider](http://tdesign.tencent.com/vue/components/slider)
- Radio:
  - 新增 `variant` 属性用于控制单选框组件按钮形式，原有 `buttonStyle` 属性已废弃
  - RadioOption 中的 `label` 和 `value` 更改为非必传，
- Transfer: 新增树形内容展示支持，使用请参考官网 [样例](https://tdesign.tencent.com/vue/components/transfer#%E4%B8%8Etree%E7%BB%93%E5%90%88%E4%BD%BF%E7%94%A8)
- Table:
  - `ellipsis` 支持自定义浮层内容，
  - 优化表格固定列时滚动阴影显示体验
  - `asyncLoading` 支持 `slot` 用法
- Checkbox:
  - 同时支持 `default` 和 `label` 以及同名插槽用法
  - 新增 `max` 属性，用于控制最多选中项
- Dropdown: dropdown-item `content` 支持 `function` 类型，
- Dialog: 插槽支持透传 `style` 和 `className`
- Form: 自定义校验支持返回 `{ result: boolean, message: string, type: string }` 对象，便于自定义实现校验逻辑，
- Divider:
  - 带文字的分割线支持虚线展示样式
  - 新增 `content` 和 `default` 属性用于定制渲染子元素
- Tooltip: 新增 `visibleChange` 事件

## 0.22.8 `2021-09-03`

### Bug Fixes

- Datepicker: 修复未设置 `disableDate` 属性时，时间选项被禁用的问题。

## 0.22.7 `2021-09-03`

### Bug Fixes

- Dropdown: 修复未设置 `onClick` 属性时，浏览器控制台中有 vue warning 的问题，
- TreeSelect:
  - 修复自定义 `Options` 时 `filterable` 功能不生效的问题，
  - 输入框中展示了已选中节点的 `value` 值，而非 label 的问题，
- Tabs: 修复 `value` 不支持 `number` 类型的问题
- Datepicker: 修复 `disableDate` 传入 `function` 时不生效的问题，
- Select:
  - 修复 `options` 不能设置为 `null` 的问题，
  - `value` 不在选项范围内的，不再显示到输入框中，
- Dialog: 修复确定按钮插槽 `slot` 方式使用无效的问题，
- Form: 修复行内布局下 `labelWidth` 属性配置无效的问题
- Popup: 修复文字过长时不能自动换行的问题，内容为文字时默认增加 `maxwidth = 480px` 样式，
- Upload: 增加对上传中发生异常时的处理，
- Calendar: 修复下拉框中年份显示不完整的问题，
- Cascader: 修复选项过长时，无法展示全部内容的问题，

### Features

- TreeSelect:
  - 支持整行节点被选中
  - 新增 `valueType` 属性，用于控制选中项选中时返回类型，可选值为 `value/object`
- Table: 支持拖拽排序，使用参见官网 [示例](http://tdesign.tencent.com/vue/components/table#%E6%8B%96%E6%8B%BD%E6%8E%92%E5%BA%8F)

## 0.22.6 `2021-08-27`

### Bug Fixes

- Select: 修复多选时 `v-model` 绑定的值不支持 `undefined` 的问题，
- Form: 修复 `inline` 模式下 `labelWidth` 失效的问题
- DatePicker:
  - 修复 `onchange` 事件触发回调两次问题，
  - `defaultValue` 支持 `Date` 类型

### Features

- Dropdown: 新组件上线，详情参见 [官网](http://tdesign.tencent.com/vue/components/dropdown)

### Performance Improvements

- Select: 改进有较多 option 时卡顿的问题

## 0.22.5 `2021-08-20`

### Bug Fixes

- Loading:
  - 修复有包裹内容用法时，`size` 属性设置不生效的问题
  - 设置 text 内容，文案未居中显示的问题
- Dialog:
  - 修复 `cancelBtn` 为 null 时，确认按钮也被隐藏的问题
  - 修复非模态框情况下，拖动结束时未移除鼠标监听时间的问题，
- Menu: 修复鼠标长按后菜单项持续显示高亮的问题
- Datepicker: 修复快捷输入区间面板关闭后日期未正常显示的问题，
- Form:
  - 修复表单项失焦未触发校验的问题，
  - 支持触发制定表单项的校验，
  - 新增 `validate` 方法用于提供表单校验结果，
- Select: 组件内不直接操作 options，增加 `realOptions` 进行状态管理，防止数据更新异常
- Timepicker: 12 小时制下滚动选择异常的问题，

### Features

- Select、Transfer 选项选中、hover 等交互统一，、
- Table:
  - 补充加载态和异步加载状态示例，
  - 排序功能：修复多字段排序初始值缺陷，新增 `onDataChange` 方法，响应本地数据排序后的数据变化，
  - 加载状态 UI 重构，详情可以参见官网异步加载示例
- Loading: 支持通过设置父级 font-size 来控制 icon 显示大小
- InputNumber:
  - 支持键盘交互，
  - 支持数值为空的情况，

## 0.22.3 `2021-08-11`

### Bug Fixes

- 整理组件声明导出顺序，修复构建产物中组件样式优先级错误的问题

## 0.22.2 `2021-08-11`

### Bug Fixes

- Anchor: ponit 在 line 范围外显示的问题
- Pagination: 修复未正确引入 Select Option 导致的控制台报错问题
- Popup: 修复 Select、Pagination 等依赖 Popup 实现的组件，弹窗方向错误的问题，、
- Table: 修复当启用合并单元格，并有除了 columns 外的数据时出现问题，表格无法正常渲染的问题
- Menu: 移除了 logo slot 的预置样式，以及修复了收起时的抖动问题

### Features

- Input: 新增 `maxcharacter` 属性，区别于现有的 `maxlength`，用于控制最多输入的字符个数
- Cascader: 增加展开动画
- Tab: TabPanel `label` 支持 Slot 方式自定义标签内容

## 0.22.1 `2021-08-05`

### Bug Fixes

- 修复 0.22.0 版本构建产物中，部分全局样式丢失问题，
- DatePicker: 修复区间时间选择时，先选择结束时间后无法选择开始时间的问题，
- Upload: 修复不能取消上传，及图片批量上传时只显示“上传中”，没有“百分比”进度的问题，[common # 19]
- Input: 修复 suffix icon 在 `clearable = true` 且有值时不展示原设置的 icon 的问题
- Tabs: 修复选项卡区域出现滚动条时，滚动交互异常的问题，

### Features

- DatePicker:
  - 有时间选择时，才显示底部操作栏区域中的确认按钮，
  - 区间日期选择时，头部按钮不再同步前进、后退面板区间，支持跨多个月份日期选择，
- DatePicker、TimePicker、TreeSelect、Select 组件统一增加展开收起动画；Select 箭头增加动画效果。

## 0.22.0 `2021-07-29`

### Bug Fixes

- Table: 使用 `minWidth` 属性时时自动设置 `width`，防止出现 `minWidth` 不生效的问题，
- Pagination: 修复页数显示错误的问题，
- Cascader: 修复渲染了额外 CSS class 类名的问题，

### Features

- 推荐引入组件方式修改，不需要手动引入样式文件；less 技术栈项目中支持自定义 design token 变量。请参考官网 [使用](https://tdesign.tencent.com/vue/components/explain#%E4%BD%BF%E7%94%A8) 章节
- Popconfirm:
  - 新增 `destroyOnClose，默认值为` true，表示 tips 消失的时候会销毁浮层
  - 新增 `showArrow` 用于控制是否显示浮层箭头
  - 新增 `placement` 用于控制浮层出现位置
- Form: help 与 error message 不再同时显示
- Table: 固定列添加阴影
- 语言文本全局配置：不再要求配置所有组件参数，可以按需配置
- Tooltip:
  - 新增 `destroyOnClose`，默认值为 `true`，表示 Tooltip 消失时会销毁浮层
  - 新增 duration，用于设置浮层消失的时间
- Popup: `visible = true` 前不再创建 DOM 元素
- 新增 Swiper 组件，见 [官网](https://tdesign.tencent.com/vue/components/swiper)

## 0.21.5 `2021-07-21`

### Bug Fixes

- Table: 修复 `rowKey` 值不为 `id` 时，`selectedRowData` 返回值为空的问题，

## 0.21.4 `2021-07-21`

### Bug Fixes

- Drawer: `footer = false` 时，不再渲染 footer，
- Select:
  - 修复数据为空时，未正常显示"暂无数据"空节点的问题，
  - 修复 `options` 被错误置空的问题，、
  - 修复远程搜索时，内容和加载中状态共存的问题，
- Popup: 修复实例销毁时报错的问题，
- Icon: 修复单独导入 icon 报错问题，
- RadioButton: 修复 `size=small` 时，高度显示异常的问题，
- Input: 修复 `type=search` 时会显示多余默认 icon 的问题，
- Breadcrumb: 修复使用 router 模式时跳转失败的问题，

### Features

- 新增 Cascader 级联选择器，详情参见 [官网](https://tdesign.tencent.com/vue/components/cascader)
- Popup: 新增 `zIndex` 用于自定义 z-index 层级，
- Messege: 插件式调用时，`duration` 不再是必传参数，
- TS 支持：导出所有组件 ts 定义，方便在 typescript 项目中使用组件
- 支持 less@4.x 环境下编译

## 0.21.0 `2021-07-14`

### BREAKING CHANGES

- Table API 规范：详情参见
  - 移除 `BaseTable` 组件非必要参数 `width`
  - PrimaryTable 中，`checkboxProps` 更名为 `checkProps`，数据类型为 `RadioProps | CheckboxProps | (({ row, rowIndex }) => RadioProps | CheckboxProps)`
  - BaseTable 中 `rowClassName` 参数由 `(rowKey, row)` 变为 `({ row: RowData; rowIndex: number })`
  - 移除 BaseTableCol 中 `scopedSlots`，转而使用 `cell/title` 自定义插槽名称。默认依旧使用 `colKey` 作为插槽名称

### Features

- Notification、Message、Loading: 支持插件方式调用、
- Table: 详情参见
  - 新增 `maxHeight` 用于控制表格最大高度
  - PrimaryTable:
    - `expandedRowRender` 更名为 `expandedRow`， 参数 `record` 更为 `row`，`record` 用法保留，将在下个 breaking change 版本中删除
    - `expandedRowKeys`、`selectedRowKeys` 增加 `.sync` 语法糖支持
    - `defaultExpandedRowKeys`、`defaultSelectedRowKeys` 支持非受控用法
  - 支持自定义单元格和表头
  - 新增支持排序功能
  - 新增支持过滤功能

## 0.20.1 `2021-07-13`

### Bug Fixes

- Transfer:
  - 修复禁用项仍可被全选的问题
  - 修复列表为空时，依然可以勾选全选的问题
- Button:
  - 修改 button theme 默认值，修复不写 theme 出现 theme-undefined 的类名问题
  - 修复 css 构建产物异常问题，

### Features

- Loading:
  - 支持 `LoadingPlugin` 方式调用，
  - 支持 loading icon 部分自定义颜色设置
- Upload: 输入框文件上传，新增上传状态显示
- TreeSelect: `filterable` 和 `filter` 可以单独使用，`filter` 用于自定义本地搜索功能，`filterable` 和 `onSearch` 配合使用用作远程搜索功能配置，

## 0.20.0 `2021-07-07`

### BREAKING CHANGES

- Anchor: 透传 Affix 组件配置能力的 API 命名调整，`affix` 更名为 `affixProps`

### Bug Fixes

- InputNumber: 修复输入进位时值未同步的问题
- Pagination: 修复 `pageCount = 1` 时意外隐藏的问题，
- Popconfirm: 修复禁用按钮点击文字区域会触发的问题，
- Table: 修复出现滚动条时列展示错位的问题

### Features

- Button: 新增支持 `success/warning` 主题配置，
- Menu: 增加动画效果
- 新增语言文本全局配置的组件：Tree、Select、TreeSelect

## 0.19.0 `2021-07-02`

### BREAKING CHANGES

- Form API 规范: submit 事件参数由 `result` 更为 `validateResult`

### Bug Fixes

- Upload: 修复上传进度条展示异常的问题，
- Menu: 修复 submenu 父级高亮显示异常的问题，
- Form:

  - 修复表单校验可能出现无法 resolve 的情况，
  - 修复 `labelWidth` 设置为 0 时，依旧显示 label 的问题，
  - 修复父级元素不是 Form 时，`labelWidth`、`labelAlign` 设置不生效的问题，、、

- Tree: 修复初始化 value 时，子节点选中态未联动父节点状态的问题
- Table:

  - 删除 DOM 节点上设置多余 columnsProps 数据，
  - 修复表格滚动问题，

- Tag: 修复 icon 未居中展示的问题，

### Features

- Form: 新增组件函数 `submit` 和 `reset`，用于处理提交和重置按钮不在 Form 表单内的场景

## 0.18.0 `2021-06-24`

### BREAKING CHANGES

- Popconfirm API 规范：详情参见
  - `cancelText` 重命名为 `cancelBtn`，并新增数据类型 `Object/Function`
  - `confirmText` 重命名为 `confirmBtn`，并新增数据类型 `Object/Function`
  - `theme` 可选值由 `default/info/warning/error` 更为 `default/warning/danger`
  - `icon` 移除数据类型 `string`
- Loading API 规范：
  - `preventScrollThrough` 默认值更为 `true`
  - props 不再支持传入 `className`

### Bug Fixes

- Menu: 修复当前菜单重复点击时报错的问题
- Popup: 修复 overlayStyle 动态更新不生效的问题
- Select:
  - 支持自适应下拉框宽度设置，修复 、
  - 修复多选选择器，删除选择项时报错的问题，
- Message、Layout: 修复文案内容超长时溢出的问题，
- Loading: loading 状态修改时包裹元素消失问题

### Features

- 新增 DatePicker，使用见 [文档](http://tdesign.tencent.com/vue/components/datepicker)
- Timepicker: 新交互样式修改，支持滑动选取时间
- Transfer: 支持全局配置 `placeholder` 属性
- Dialog、Drawer: `cancelBtn` 值为 `null/undefined` 时，不显示取消按钮
- Popconfirm: 详情参见
  - 支持自由控制展开或隐藏浮层
  - `overlayStyle` 支持 `function` 类型，用于自定义浮层宽度
  - `visible-change` 事件新增参数 `PopupVisibleChangeContext`，用于描述事件来源
- 新增语言文本全局配置的组件：Popconfirm、Pagination、Calendar、Transfer、Drawer、Dialog

## 0.17.0 `2021-06-16`

### BREAKING CHANGES

- Icon: 图标库移除及名称变更 icon，参见
- Steps 组件 API 规范 、、

### Bug Fixes

- Icon: 修复.native 修饰才能触发事件问题
- InputNumber: 修复无默认值时报错的问题
- Upload: 修复设置 `header` 属性后上传失败的问题

### Features

- Tree-shaking: 组件库增加 `sideEffects` 设置，支持业务系统打包时按需加载组件库
- Notification: `title` 新增支持插槽及 render funtion
- Upload: 新增图片预览功能
- Button 组件新增动画
- Menu: 组件重构，全新 UI，修复问题如下：
  - active 属性无法动态响应
  - active 绑定参数有误&初始化阶段多次触发 onChange
  - 传入’to‘属性后 dom 样式错乱
  - route 无反应、popup 不收起
  - 使用 router-to 导致样式异常
  - t-head-menu 子菜单无法选中
  - t-menu 不支持主题为 dark 模式
  - 无 logo 插槽时样式问题
  - MenuItem Props 里的 routes 属性不生效
  - meun 嵌套在 t-layout 中，会被 layout 影响背景色
- Calendar: 新增自定义星期标题能力，见 [官网 demo](http://tdesign.tencent.com/vue/components/calendar#46-%E8%87%AA%E5%AE%9A%E4%B9%89%E5%91%A8%E6%98%BE%E7%A4%BA)

## 0.16.0 `2021-06-08`

### Bug Fixes

- Grid: 修复 flex 布局问题
- InputNumber: 修复无默认值时报错的问题

### Features

- Dialog & Drawer: 默认 `z-index` 改为 css 控制

## 0.15.3 `2021-06-03`

### Bug Fixes

- Table: 修复表头省略显示问题
- Tree:
  - 修复更新 data 属性值后，dom 未同步更新的问题
  - 解决空数据初始化时不能插入数据的问题
  - 修复 treeItem 图标呈现时，loading 状态覆盖了自定义图标的问题

### Features

- Breadcrumb: 面包屑超长部分使用 tooltip 展示
- 📦 打包构建：使用 `typescript2` 替代 `esbuild`

## 0.15.2 `2021-05-27`

### BREAKING CHANGES

- Anchor: API 规范，`attach` 属性改为 `container`

### Bug Fixes

- Tree: 组件解决空数据初始化时不能插入数据的问题
- Button: icon only 判断修复
- Layout: 修复组件动态监听 aside 组件问题
- Checkbox: 修复 checkbox display 样式影响 Tree、Select、TreeSelect、Table 组件部分功能体验的问题

### Features

- TreeSelect: 增加 TreeSelect 新组件，支持树形选择需求，见[官网](http://tdesign.tencent.com/vue/components/treeselect)
- Popup: 支持通过接受 trigger 元素作为参数的函数定制 overlayStyle
- Select: 扩展 `Options` 类型

## 0.14.0 `2021-05-17`

- Transfer: `page-change` 事件参数和 API 文档保持一致，由 `{page: pageInfo, context: { type: listType }}` 修改为 `(pageInfo, { type: listType })`

### Bug Fixes

- Dialog: 告警和失败类确认对话框，默认 icon 不对的问题修复
- Select: 修复在 Form 表单中使用时，无默认宽度的问题
- Tree: 修复点击事件未携带节点对象的问题
- Form: 修复无法通过 `refs` 访问实例对象的问题

### Features

- Popup: 使用 jsx 重构
- Progress:
  - 使用 jsx 重构
  - 去除进度百分比信息内联样式实现
  - 优化 label 展示，进度在 10% 内时自动展示在进度条外侧
  - 支持自定义进度百分比
- Tag: 支持禁用态设置

## 0.13.0 `2021-04-30`

### BREAKING CHANGES

- Pagination: API 规范，`pageSizeOption` 更名为 `pageSizeOptions`
- Upload: API 规范，`limit` 修改为 `max` 控制最大上传数量 、
- Dialog: API 规范，`theme` 可选值 `error` 更为 `danger`
- Select: API 规范，详情见

### Bug Fixes

- Select: 修复 value 传入数字时不能正常展示的问题
- Table:
  - 修复无法按需加载的问题
  - 修复 Tips 展示内容错误的问题
- Tabs: 修复点击导航删除按钮时, 未正确 emit remove 事件的问题
- Drawer: 修复设置 `cancelBtn = ''` 时无法将取消按钮渲染为空的问题

### Features

- Upload: 新增 `formatResponse` API，用于上传成功后格式化响应数据

## 0.12.1 `2021-04-26`

### Bug Fixes

- Dialog: 修复组件按需加载场景下不支持插件方式使用的问题
- Menu: 修复因依赖路径错误，导致组件库包引入后运行报错的问题

## 0.12.0 `2021-04-22) 废弃，构建产物有问题，请直接升级到 0.12.1 版`

### BREAKING CHANGES

- Menu: API 规范，详情见 、、、、
- Upload: API 规范，详情见 、、
- Pagination & Table: 详情见
  - Pagination 当分页大小和当前页发生变化时均会触发事件 change，且参数由 `(current, pageInfo)` 调整为 `(pageInfo)`
  - Table page-change 事件参数由 `(current, pageInfo)` 调整为 `(pageInfo)`
- InputNumber: API 规范， `formatter` 修改为 `format`

### Bug Fixes

- Drawer:
  - 修复 `confirmBtn` 和 `cancelBtn` 无法正常呈现 `Function` 类型返回的内容的问题
  - 修复自定义关闭按钮无法关闭 Drawer 弹窗的问题
  - 修复在 Safari 浏览器下，使用 Drawer 组件后白屏的问题
- Upload: 修复 `auto-upload` 属性设置不生效的问题

### Features

- Form: help 与 tips 展示分离
- Pagination: 新增 current-change 事件，参数为 `(current, pageInfo)`
- Message: 支持 `zIndex` 配置

## 0.11.0 `2021-04-14`

### BREAKING CHANGES

- Drawer:
  - `footer` 不再支持 `string` 类型
  - `attach` 不再支持 `boolean` 类型，调整挂载元素实现

### Bug Fixes

- Dialog: 修复挂载元素实现错误的问题
- RadioGroup: 修复 `disabled` 设置失效的问题
- Drawer: 修复不能正常展示关闭图标的问题
- Input: 修复回车键 enter 时触发 change 事件问题 ，无法粘贴内容的问题

### Features

- 官网新增 shapan 在线 demo 能力，详情请访问[官网体验](http://tdesign.tencent.com/vue/components/button)
- Drawer
  - 新增 `showInAttachedElement` 表示抽屉在父元素打开
  - 新增：`click-close-btn` `click-cancel` `keydown-esc` `click-confirm` 等事件
  - `closeBtn` 新增支持 `string/function` 类型，用于自定义关闭按钮展示
  - 新增 `closeOnKeydownEsc`，控制是否在 ESC 键按下时触发关闭
  - 重构：`attach` 的实现和 Dialog 组件保持一致
  - `close` 事件新增参数 `{ trigger: EventSource; e: MouseEvent | KeyboardEvent }` `EventSource` 有如下枚举： `'keydownEsc' | 'clickCloseBtn' | 'clickCancel' | 'clickOverlay'`

## 0.10.0 `2021-04-08`

### BREAKING CHANGES

- Badge: API 规范，详情见
- Tree: API 规范，详情见
- Pagination: API 规范，`curr` 修改为 `current`，`prev` 修改为 `previous`
- Table: API 规范，分页器部分的定义 `curr` 修改为 `current`，`prev` 修改为 `previous`，与 Pagination 组件 API 定义保持一致

### Bug Fixes

- Form: 修复 Date 对象判断为空的逻辑
- Input: 兼容 safari 浏览器中文输入时多次触发 change 的问题，问题描述见 、，修复见 、
- Layout: 修复侧边栏宽度设置失败不生效的问题
- Radio: 修复禁用且选中状态时的样式问题
- Table: rowKey 获取 id 问题修复
- Timepicker: 去除输入框内多余背景色

### Features

- Form: 新增 API `preventSubmitDefault`，用于控制是否阻止默认 submit 事件，默认值为 true
- Table: 新增 `ellipsis` 配置，支持 hover 呈现完整的内容

## 0.9.0 `2021-03-30`

### BREAKING CHANGES

- InputNumber: API 规范，`mode` 变更为 `theme`

### Bug Fixes

- Input: 解决 input 组件中文输入过程中不断触发 change 的问题

### Features

- 新增 [Textarea 多行文本框组件](http://tdesign.tencent.com/vue/components/textarea)
- Checkbox:
  - 支持 `readonly` 属性
  - CheckboxGroup `options` 支持全选配置
  - CheckboxGroup `options` 支持传入形如 ['A', 'B', 'C'] 一类的参数
- InputNumber:
  - `theme` 新增可选值 normal ，用于表示 “没有 + - 控制的数字输入框”
  - 新增 `decimalPlaces`，支持配置小数位数
  - 其他调整详情参见

## 0.8.0 `2021-03-23`

### BREAKING CHANGES

- Tabs: API 规范，详情参见

### Bug Fixes

- Form: 手机号码校验正则修改
- map-props: 修复 JSX 调用 map-props 组件时无法解构传值的问题，详情参见

### Features

- Table: 新增鼠标事件相关 API，支持非受控属性 defaultCurrent 和 defaultPagiSize 用法，详情参见
- Pagination: 支持非受控属性 defaultCurrent 和 defaultPagiSize 用法

## 0.7.1 `2021-03-11`

### Bug Fixes

- Select: 修复构建产物 `@TdTypes/` 路径失效问题

## 0.7.0 `2021-03-11`

### BREAKING CHANGES

- List: API 规范，loading 修改为 async-loading

### Bug Fixes

- InputNumber: v-model 绑定值不生效问题修复

### Features

- Input: type 支持 Number 类型

## 0.6.0 `2021-03-10`

### BREAKING CHANGES

- Calendar: 规范 API，详情参见
- Alert: 规范 API，详情参见
- Tag: 规范 API，详情参见
- List: 规范 API，详情参见

### Bug Fixes

- Dialog: 修复 duration 为 0 时 Message 组件自动关闭的问题

### Features

- Progress: label 支持 Slot/TNode 类型，详情参见

## 0.5.0 `2021-02-24`

### BREAKING CHANGES

- InputNumber: 规范 API，详情参见
- Input: 规范 API，详情参见
- Progress: 规范 API，详情参见
- Breadcrumb: 规范 API，详情参见
- Dialog: 规范 API

### Bug Fixes

- Dropdown,Popconfirm 解决抖动问题
- Form: 解决 resetField 异步场景下失效问题，
- Select: 修复在 Dialog 场景下 select 下拉宽度判断为 0 不能正常展示的问题，

### Features

- Form: rules 支持设置对象类型，

## 0.4.0 `2021-02-07`

### BREAKING CHANGES

- Button: 规范 API，`variant` 参数默认值更改为 `base`

### Bug Fixes

- switch: 修复开关无法正常切换问题
- Table:
  - 修复无法监听 pagination.current 问题
  - 修复无法监听 pagination.pageSize 问题
  - 修复数据分页问题：当数据长度等于 pageSize 时，从第 2 页开始，无法正常渲染表格数据

### Features

- Tag: 新增 content 属性

## 0.3.0 `2021-01-26`

### BREAKING CHANGES

- Button: 规范 API
- Checkbox/CheckboxGroup: 规范 API，详情见：

### Bug Fixes

- Select: 修复多个 Select 组件，使用远程数据时，第二个选项开始弹不出来的问题
- Pagination: 官网 demo total 值改变时分页数据未响应的问题

### Features

- Select: 多选且可搜索时，输入搜索项并选择一个选项后，保持搜索框 focusing

## 0.2.5 `2021-01-20`

### BREAKING CHANGES

- Popup: 规范 API，visibleArrow 更名为 showArrow；placement 枚举值修改，不再使用小驼峰命名；
- Radio: 规范 API，size 可选值更为 small/medium/large，默认值为 medium；详情见：
- Tag: 规范 API，icon 属性不再支持 String 类型
- Notification: 规范 API，theme 默认值更为 info；icon 属性不再支持 String 类型；default 属性已更为 content

### Bug Fixes

- Select: 修复不设置宽度时，下拉选项宽度异常问题
- Anchor: 修复复制链接未成功的问题

### Features

- Popup: 增加 API 支持 onVisibleChange
- Message & Notification: 支持函数引入调用，见
- Tag: 增加 onClick & onClose 事件
- Radio/RadioGroup: value 同时支持 String 和 Number 类型；Radio/RadioGroup 新增 onChange API

## 0.2.4 `2021-01-14`

### Bug Fixes

- Message/Notification: 插件无法弹出问题修复，

## 0.2.3 `2021-01-12`

### BREAKING CHANGES

- Divider: 规范 API，详情见：
- Form: size 默认值由 default 改为 medium
- Tag: rename effect to variant
- Icon: size 去除 xs 和 xl，默认值更为 undefined，详情见：
- Notification: 规范 API，详情见：

### Bug Fixes

- Table: 修复横向滚动时左侧固定列晃动问题，
- Input: active 状态边框颜色与组件库统一，
- Select: 为 Select 组件依赖的 Popup 组件增加 z-index 样式设置，默认值为 5500

### Features

- Transfer 中使用分页组件改为迷你极简模式
- Form: 校验状态 type 去掉 success
- Table: 普通的加载状态，数据内容和加载状态互斥的，不共存,
- Tooltip: 默认增加箭头样式，

### 0.2.2 `2021-01-05`

### BREAKING CHANGES

- Pagination: 规范 API
- Select: size 默认值由 `default` 改为 `medium`
- Message: 规范 API，详情见：
- Grid: span 默认值修改为 12
- Tag: 事件名称 `change` 更为 `click，去除` `disabled` / `checked`，详情见：
- Switch: 规范 API，详情见：

### Bug Fixes

- Pagination: 样式问题修复
- timepikcer: 下拉展开后，组件选中样式修复&&展开后框选背景色加投影丢失问题
- table:
  - 修复为 Column 的设置 className 不生效的问题
  - ellipsis 失效问题
  - 处理固定宽度时文本溢出问题
  - id 为非数字类型时，expandChange 事件不响应的问题
  - 折叠状态 icon 展示错误问题
- tag: 修复在有默认 icon 值的时候，展示会多出一个 icon 元素的问题
- select: placeholder 长度被限制被限制的问题

### Features

- Checkbox: value & option.value 同时支持传入 string 和 number 类型 closes
- Dialog: 将 close 点击事件放到外层 div，避免点击区域过小的问题
- Pagination: 新增极简迷你版，适应轻量化翻页使用场景，见 [官网示例 1.7](http://tdesign.tencent.com/vue/components/pagination)
- Anchor: title 属性中增加 TNode 支持，change 支持透传
- 使用 mockdate 在 jest 运行时 mock 当前时间为固定值，防止 snapshot 失效

---

## 0.2.0 `2020-12-21`

### BREAKING CHANGES

#### 组件默认尺寸命名修改

middle 改为 medium，涉及到一期已经发布的组件：

- Button
- Icon
- Input
- Pagination
- Radio
- Select
- Switch
- Tabs
- Tag
- List
- Table

#### Button

button 不再支持 name 属性设置 icon，改为使用 slot

### Features

#### 新增组件

- **[Layout 布局](http://tdesign.tencent.com/vue/components/layout)**
- **[Grid 栅格](http://tdesign.tencent.com/vue/components/grid)**
- **[Divider 分割线](http://tdesign.tencent.com/vue/components/divider)**
- **[Form 表单](http://tdesign.tencent.com/vue/components/form)**
- **[Tree 树](http://tdesign.tencent.com/vue/components/tree)**
- **[Tooltip 文字提示](http://tdesign.tencent.com/vue/components/tooltip)**
- **[Loading 加载中](http://tdesign.tencent.com/vue/components/loading)**
- **[Badge 徽标](http://tdesign.tencent.com/vue/components/badge)**
- **[TimePicker 时间选择器](http://tdesign.tencent.com/vue/components/timepicker)**
- **[Transfer 穿梭框](http://tdesign.tencent.com/vue/components/transfer)**
- **[Drawer 模态抽屉](http://tdesign.tencent.com/vue/components/drawer)**
- **[Anchor 锚点](http://tdesign.tencent.com/vue/components/anchor)**
- **[Calendar 日历](http://tdesign.tencent.com/vue/components/calendar)**
- **[InputNumber 数字输入框](http://tdesign.tencent.com/vue/components/inputnumber)**
- **[Progress 进度条](http://tdesign.tencent.com/vue/components/progress)**

#### 新增特性

- Input size 支持 small
- Select 过滤时不区分大小写 [issue]

### Bug Fixes

#### Table

- 未透传 pagination change 事件 [issue]
- renderColgroup minWidth 失效 [issue]
- 动态修改 columns 的值，table 组件无法动态渲染 [issue]
- 固定列样式问题 [issue]
- 当存在固定列时，hover 效果无法同步到固定列 [issue]
- 表格超出时允许滚动 [issue]
- 固定表头表格时，表头和表格未对齐&滚动条问题 [issue][issue]

#### Select

- 初始箭头方向错误 [issue]
- 下拉框样式偏移 [issue][issue]

#### Icon

资源不支持 HTTPS 访问 [issue]

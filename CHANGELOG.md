---
title: 更新日志
spline: explain
toc: false
docClass: timeline
---

## 🌈 1.6.3 `2023-08-22` 
### 🚀 Features
- `Table`: @chaishi ([#2719](https://github.com/Tencent/tdesign-vue/pull/2719))
  - 支持使用名为 `ellipsis` 或者 `ellipsis-<colKey>` 的插槽自定义超出省略时的浮层内容，使用方法可参考示例代码 @chaishi ([#2717](https://github.com/Tencent/tdesign-vue/pull/2717))
  - 树形结构，新增组件实例方法 `removeChildren`，用于移除子节点
  - 树形结构，支持通过属性 `expandedTreeNodes.sync` 自由控制展开节点，非必传属性
### 🐞 Bug Fixes
- `Select`: 优化 Select 组件在过滤场景中的表现 @moonye6 @uyarn ([#2722](https://github.com/Tencent/tdesign-vue/pull/2722))
- `Table`: @chaishi ([#2719](https://github.com/Tencent/tdesign-vue/pull/2719))
  - 树形结构，修复组件实例方法 展开全部 `expandAll` 问题
  - 点击行展开/点击行选中，修复 `expandOnRowClick`和 `selectOnRowClick` 无法独立控制行点击执行交互问题 [tdesign-vue-next#3254](https://github.com/Tencent/tdesign-vue-next/issues/3254)
- `Popconfirm`: 修复因变量计算导致的 minx.css 压缩后产物样式改变的问题 @honkinglin ([common#1573](https://github.com/Tencent/tdesign-common/pull/1573))
- `Cascader`: 修复 `label` 属性自定义插槽不生效的问题 @ubloglab ([#2724](https://github.com/Tencent/tdesign-vue/pull/2724))

## 🌈 1.6.2 `2023-08-17` 
### 🚀 Features
- `TreeSelect`: 增加 `keys` 字段用于定制数据中对应的字段别名 @PengYYYYY ([#2697](https://github.com/Tencent/tdesign-vue/pull/2697))
- `Cascader`: 增加 `keys.disabled` 用于定制字段控制节点的禁用([issue #3193](https://github.com/Tencent/tdesign-vue-next/issues/3193)) @PengYYYYY ([#2697](https://github.com/Tencent/tdesign-vue/pull/2697))
- `Tree`: 增加 `keys.disabled` 用于定制字段控制节点的禁用 @PengYYYYY ([#2697](https://github.com/Tencent/tdesign-vue/pull/2697))
- `Select`: 增加 `keys.disabled` 用于定制字段控制选项的禁用 @PengYYYYY ([#2697](https://github.com/Tencent/tdesign-vue/pull/2697))
- `Transfer`: 增加 `keys.disabled` 用于定制字段控制选项的禁用 @PengYYYYY ([#2697](https://github.com/Tencent/tdesign-vue/pull/2697))
### 🐞 Bug Fixes
- `checkbox`: 
  - 修复控制台报错 @yaogengzhu ([#2702](https://github.com/Tencent/tdesign-vue/pull/2702))
  - 修复 `options` 异步获取时，`disabled` 失效问题 @chaishi ([#2706](https://github.com/Tencent/tdesign-vue/pull/2706))
  - 修复 `options` 异步获取时，`value` 失效问题 @chaishi ([#2706](https://github.com/Tencent/tdesign-vue/pull/2706))
- `Image`: 修复 1.6.x 无法动态设置 `src` 问题 @chaishi ([#2709](https://github.com/Tencent/tdesign-vue/pull/2709))
### 🚧 Others
- `Cascader`: 补充 `borderless` 文档 @PengYYYYY ([#2697](https://github.com/Tencent/tdesign-vue/pull/2697))

## 🌈 1.6.1 `2023-08-15` 
### 🚀 Features
- `Menu`: menu-item `click` 事件参数增加 value @dexterBo ([#2689](https://github.com/Tencent/tdesign-vue/pull/2689))
- `键盘操作`: @chaishi ([#2683](https://github.com/Tencent/tdesign-vue/pull/2683))
  - `Checkbox`: 支持使用空格键选中或取消选中
  - `Radio`: 支持使用空格键选中或取消选中
  - `SelectInput`: 支持键盘事件
  - `Select`: 支持键盘操作聚焦和显示下拉框，可通过上下键切换选项
### 🐞 Bug Fixes
- `SelectInput`: 修复多选情况下按下 Enter 键后触发了 focus 事件而不是 enter 事件的问题 @dexterBo ([#2694](https://github.com/Tencent/tdesign-vue/pull/2694))
- `Select`: 远程搜索场景下不再进行内部过滤 @uyarn ([#2699](https://github.com/Tencent/tdesign-vue/pull/2699))
- `Menu`: 修复激活菜单项未发生变化时也会触发 change 事件的的问题 @dexterBo ([#2693](https://github.com/Tencent/tdesign-vue/pull/2693))
- `ImageViewer`: 前后浏览及关闭浏览时重置图片状态 @sinbadmaster ([#2685](https://github.com/Tencent/tdesign-vue/pull/2685))
- `Table`: @chaishi ([#2683](https://github.com/Tencent/tdesign-vue/pull/2683))
  - 拖拽排序在使用懒加载 `lazyLoad` 时，失效问题
  - 虚拟滚动场景，修复默认滚动条长度和滚动后的长度不一致问题
  - 补充 SSR 场景，window 变量判断

## 🌈 1.6.0 `2023-08-10` 
### 🚀 Features
- `Icon`: 新增 960 个图标；调整图标命名 `photo` 为 `camera`，`books`为`bookmark`, `stop-cirle-1`为`stop-circle-stroke`；移除`money-circle`图标，具体请查看图标页面  @uyarn ([#2677](https://github.com/Tencent/tdesign-vue/pull/2677))
- `Table`: 可编辑表格，新增 `edit.keepEditMode` ，用于控制单元格始终保持为编辑态 @chaishi ([#2662](https://github.com/Tencent/tdesign-vue/pull/2662))
- `Image`: @chaishi ([#2665](https://github.com/Tencent/tdesign-vue/pull/2665))
  - 属性 `src` 支持传入 File 文件类型显示图片
  - 新增支持 `fallback` ，用于设置图片加载失败时的兜底图
  - 新增支持 `referrerpolicy` 属性
- `ImageViewer`: 属性 `images` 支持传入 File 文件类型预览图片 @chaishi ([#2665](https://github.com/Tencent/tdesign-vue/pull/2665))
- `Upload`: 文件上传列表支持显示缩略图，通过 `showThumbnail` 属性控制 @chaishi ([#2665](https://github.com/Tencent/tdesign-vue/pull/2665))
- `Link`: 新增透传 `download` 属性，支持浏览器直接下载，https://github.com/Tencent/tdesign-vue/issues/2628 @xiaosansiji ([#2659](https://github.com/Tencent/tdesign-vue/pull/2659))
### 🐞 Bug Fixes
- `InputAdornment`: 修复装饰文字折行的问题 @PengYYYYY ([common#1553](https://github.com/Tencent/tdesign-common/pull/1553))
### 🚧 Others
- `官网`: 新增分类展示全部图标的 UI  @uyarn ([#2677](https://github.com/Tencent/tdesign-vue/pull/2677))

## 🌈 1.5.2 `2023-08-01` 
### 🚀 Features
- `Table`:
  - 可筛选表格，支持透传 attrs/style/classNames 属性、样式、类名等信息到自定义组件，[issue#2627](https://github.com/Tencent/tdesign-vue/issues/2627) @chaishi ([#2629](https://github.com/Tencent/tdesign-vue/pull/2629))
  - 虚拟滚动场景，支持通过行唯一标识跳转到指定行（通过行下标跳转到指定行，以前的版本已支持） @chaishi ([#2643](https://github.com/Tencent/tdesign-vue/pull/2643))
- `Upload`: 拖拽上传场景，支持 accept 限制可上传的文件类型 @chaishi ([common#1547](https://github.com/Tencent/tdesign-common/pull/1547))
### 🐞 Bug Fixes
- `Checkbox`: 支持 `value` 传入 `undefined` @chaishi ([#2623](https://github.com/Tencent/tdesign-vue/pull/2623))
- `Table`:
  - 可筛选表格场景，filterValue 透传优化，没有显示写明 value 值的筛选项，不再透传 `undefined` 到子组件，因有些组件的默认值不允许为 undefined @chaishi ([#2623](https://github.com/Tencent/tdesign-vue/pull/2623))
  - 树形结构表格，修复选中行的值 `selectedRowKeys` 不在数据 `data` 中时，报错问题 @chaishi ([#2629](https://github.com/Tencent/tdesign-vue/pull/2629))
  - 修复 1.5.0 版本空表格没有显示占位元素问题 @chaishi ([#2641](https://github.com/Tencent/tdesign-vue/pull/2641))
  - 固定列空数据场景，元素显示错位问题 @chaishi ([#2641](https://github.com/Tencent/tdesign-vue/pull/2641))
- `Input`: form表单disabled状态下input异常显示clear @sinbadmaster ([#2634](https://github.com/Tencent/tdesign-vue/pull/2634))
- `Dialog`:
  - 修复 dialog 初始化时没有执行移动相关的初始化逻辑,导致 image-viewer 小窗口图片查看器无法移动的问题 @yusongh ([#2622](https://github.com/Tencent/tdesign-vue/pull/2622))
  - 反馈类对话框补齐body class @uyarn ([#2645](https://github.com/Tencent/tdesign-vue/pull/2645))
- `TreeSelect`: 修复自定义标签，点击关闭异常的问题 @sinbadmaster ([#2631](https://github.com/Tencent/tdesign-vue/pull/2631)) 

## 🌈 1.5.0 `2023-07-25` 
### 🚀 Features
- `Table`: 新增 `lazyLoad` 表格元素懒加载，当出现在可视区域时，再渲染表格第一屏数据 @chaishi ([#2605](https://github.com/Tencent/tdesign-vue/pull/2605))
- `Transfer`: 新增 `targetDraggable` API , 支持对目标列表拖拽排序的功能 @uyarn ([#2612](https://github.com/Tencent/tdesign-vue/pull/2612))
- `Slider`: label 支持 `${value}%` 格式配置 @uyarn ([#2613](https://github.com/Tencent/tdesign-vue/pull/2613))
- `Tree`: tree 组件改进列表渲染逻辑 @TabSpace ([#2586](https://github.com/Tencent/tdesign-vue/pull/2586))
- `Menu`:
  - 新增 API `routerLink`，可指定菜单项渲染为 Router 控制跳转的 a 标签 @boogie-ben ([#2603](https://github.com/Tencent/tdesign-vue/pull/2603))
  - 重构侧边栏导航子菜单展开/收起动画实现 @xiaosansiji ([#2561](https://github.com/Tencent/tdesign-vue/pull/2561))
- `TimePicker`:  @uyarn ([#2618](https://github.com/Tencent/tdesign-vue/pull/2618))
  - `disableTime` 回调中新增毫秒参数
  - 优化展示不可选时间选项时滚动到不可选选项的体验
### 🐞 Bug Fixes
- `Tabs`:  修复 tabs 组件放在在 dialog 中 tab-bar 不能正常显示的问题 @uyarn ([#2595](https://github.com/Tencent/tdesign-vue/pull/2595))
- `Transfer`: 修复穿梭框存在默认已选且不允许移除的值被移除的异常问题 @uyarn ([#2599](https://github.com/Tencent/tdesign-vue/pull/2599))
- `Table`: @chaishi ([#2605](https://github.com/Tencent/tdesign-vue/pull/2605))
  - 可编辑表格场景，支持设置 `colKey` 值为链式属性，如：`a.b.c`
  - 可编辑表格场景，行编辑，`edit.props` 和 `edit.on` 为函数时，新增参数 `updateEditedCellValue` 用于更新编辑状态的表格数据，[issue#2577](https://github.com/Tencent/tdesign-vue/issues/2577)
  - 修复列宽调整 + 表头吸顶 + 列配置自定义综合场景下，列宽变少时，表格宽度无法恢复原来的宽度，[issue#2363](https://github.com/Tencent/tdesign-vue/issues/2363) @chaishi ([#2606](https://github.com/Tencent/tdesign-vue/pull/2606))
- `Checkbox`: 修复版本 `v1.4.8` 中无法在 CheckboxGroup 内部自定义任意节点的问题 @chaishi ([#2604](https://github.com/Tencent/tdesign-vue/pull/2604))
- `InputNumber`: 修复 `decimalPlaces` 存在时，数值满足要求，用户未操作，就已经触发 `onChange` 事件问题，[issue#2616](https://github.com/Tencent/tdesign-vue/issues/2616) @chaishi ([#2617](https://github.com/Tencent/tdesign-vue/pull/2617))
- `Menu`: @boogie-ben ([#2603](https://github.com/Tencent/tdesign-vue/pull/2603))
  - 渲染为 a 标签时，a 标签覆盖范围扩大至整个菜单项，而不是只有文本部分
  - 修复当菜单项渲染 a 标签并且 `collapsed = true` 状态时，菜单项内区隐藏导致无法点击跳转的问题
  - 修复渲染为 a 标签，弹出展示子菜单，文本未对齐的问题
  - 修复 SubMenu 菜单项过多时无法完整展示的问题 [issue#2262](https://github.com/Tencent/tdesign-vue/issues/2262)
  - 修复 `MenuItem` click 点击事件未传递 event 参数的问题 @xiaosansiji ([#2561](https://github.com/Tencent/tdesign-vue/pull/2561))
- `Tree`: @TabSpace ([common#1535](https://github.com/Tencent/tdesign-common/pull/1535))
  - 修复 `treeNodeModel` 实例未能同步 node 属性的问题
  - 优化节点状态更新时的性能 

## 🌈 1.4.8 `2023-07-18` 
### 🚀 Features
- `DatePicker`: 优化关闭浮层后重置默认选中区域 @honkinglin ([#2585](https://github.com/Tencent/tdesign-vue/pull/2585))
- `Checkbox`: @chaishi ([#2583](https://github.com/Tencent/tdesign-vue/pull/2583)
    - 新增支持 `lazyLoad`，懒加载，用于需要渲染大量数据，或加载复杂内容/图片的场景
    - 渲染性能优化，选择或取消某一个选项时，不再重复渲染全部复选框
    - 新增支持键盘控制选项选中或取消选中
    - 新增支持 CheckboxGroup 使用 `options` 定义选项列表的同时，使用插槽 `label` 定义选项内容。可用于数据量较大的场景，不会重复渲染
### 🐞 Bug Fixes
- `Checkbox`: @chaishi ([#2583](https://github.com/Tencent/tdesign-vue/pull/2583))
  - 复选框禁用逻辑优先级顺序修复，应当为：`Form.disabled < CheckboxGroup.disabled < Checkbox.disabled`
  - 修复带禁用按钮的全选逻辑问题
- `Input`: 输入框的值类型移除 `Number` 类型 @liweijie0812 ([#2582](https://github.com/Tencent/tdesign-vue/pull/2582))
- `AutoComplete`: 修复表单内 `AutoComplete` 输入框宽度与 `Input` 组件不一致的问题 @liweijie0812 ([common#1524](https://github.com/Tencent/tdesign-common/pull/1524))
- `InputNumber`:
  - 修复大尺寸的 `padding` 样式问题 @uyarn ([common#1533](https://github.com/Tencent/tdesign-common/pull/1533))
  - 数字为空时，返回 `null`，而非 `undefined` @uyarn ([common#1533](https://github.com/Tencent/tdesign-common/pull/1533))
- `Transfer`: 优化 transfer item 类名优先级问题 @xixileng ([common#1530](https://github.com/Tencent/tdesign-common/pull/1530))
- `TagInput`: 修复 tag-input 前缀不居中且会发生抖动的问题 @xixileng ([common#1532](https://github.com/Tencent/tdesign-common/pull/1532))
- `Dialog`: 修复组件销毁后，没有正确销毁 DOM，导致的内存泄漏问题 @loganylwu ([#2581](https://github.com/Tencent/tdesign-vue/pull/2581))

### 🚧 Others
- `Grid`: 移除 `span` 默认值，`gutter` 类型补充 `lg/xl/xxl` @liweijie0812 ([#2584](https://github.com/Tencent/tdesign-vue/pull/2584)) 

## 🌈 1.4.7 `2023-07-11` 
### 🚀 Features
- `Upload`: @chaishi ([#2568](https://github.com/Tencent/tdesign-vue/pull/2568))
  - 新增组件实例方法，`uploadFilePercent` 用于更新文件上传进度
  - `theme=image`，支持使用 `fileListDisplay` 自定义 UI 内容
  - `theme=image`，支持点击名称打开新窗口访问图片，[issue#2338](https://github.com/Tencent/tdesign-vue/issues/2338) 
  - 拖拽上传场景，支持 `accept` 文件类型限制，[issue#3075](https://github.com/Tencent/tdesign-vue-next/issues/3075)
- `Dialog`: 为内容区域增加超长时滚动条样式实现 @liweijie0812 ([common#1523](https://github.com/Tencent/tdesign-common/pull/1523))
### 🐞 Bug Fixes
- `Alert`: 修复内部自定义元素透明度变化，意外导致 Alert 隐藏的问题 @xiaosansiji ([#2571](https://github.com/Tencent/tdesign-vue/pull/2571))
- `Upload`: 自定义上传方法，修复未能正确返回上传成功或失败后的文件问题 @chaishi ([#2568](https://github.com/Tencent/tdesign-vue/pull/2568))
- `Popup`: 修复 `trigger=hover` 时首次鼠标快速移动导致父级关闭的问题 @ikeq ([#2573](https://github.com/Tencent/tdesign-vue/pull/2573))

## 🌈 1.4.6 `2023-07-04` 
### 🚀 Features
- `DatePicker`: 新增 `onConfirm` 事件 @liweijie0812 ([#2545](https://github.com/Tencent/tdesign-vue/pull/2545))
- `Table`: 树形结构，添加行层级类名，方便业务设置不同层级的样式 @chaishi ([#2547](https://github.com/Tencent/tdesign-vue/pull/2547))
### 🐞 Bug Fixes
- `DatePicker`:  修复默认值为 `null` 时点击日期选择器报错的问题 @liweijie0812 ([common#1499](https://github.com/Tencent/tdesign-common/pull/1499))
- `Input`: 修复 `limitNumber` 部分在 `disabled` 状态下的样式问题 @uyarn ([#2557](https://github.com/Tencent/tdesign-vue/pull/2557))
- `Tree`: 修复单独设置 `checkable` 属性的功能 @TabSpace  @uyarn ([#2557](https://github.com/Tencent/tdesign-vue/pull/2557))
- `InputNumber`: 修复 `value = 0`时自动校正不生效的问题 @imp2002 ([#2546](https://github.com/Tencent/tdesign-vue/pull/2546))
### 🚧 Others
- `编辑器插件`: 更新 WebStorm 等编辑器的组件提示 @liweijie0812 ([#2544](https://github.com/Tencent/tdesign-vue/pull/2544))

## 🌈 1.4.5 `2023-06-27` 
### 🚀 Features
- `Dialog`: 支持full-screen模式 @Ghostdar ([#2529](https://github.com/Tencent/tdesign-vue/pull/2529))
- `Table`: 列宽调整场景，新增事件 `onColumnResizeChange`，在列宽调整后触发 @chaishi ([#2535](https://github.com/Tencent/tdesign-vue/pull/2535))
- `Menu`: 为默认侧边导航菜单滚动条增加优化样式 @liweijie0812 ([common#1421](https://github.com/Tencent/tdesign-common/pull/1421))
### 🐞 Bug Fixes
- `Table`: 列配置和列宽调整场景，修复列数量由多变少时未能更新宽度问题；[tdesign-vue-next#2951](https://github.com/Tencent/tdesign-vue-next/issues/2951) @chaishi ([#2535](https://github.com/Tencent/tdesign-vue/pull/2535))
- ### 🚧 Others
- `官网`: 官网新增英文版本，支持中英文切换 @uyarn ([#2521](https://github.com/Tencent/tdesign-vue/pull/2521))

## 🌈 1.4.4 `2023-06-20` 
### 🐞 Bug Fixes
- `Drawer`: 修复 `destroyOnClose` 不符合预期问题 @Aicmortal ([#2517](https://github.com/Tencent/tdesign-vue/pull/2517))
- `TextArea`: 修复设置 `value` 值后 autosize 自适应失效的问题 @xiaosansiji ([#2527](https://github.com/Tencent/tdesign-vue/pull/2527))
- `Swiper`: 修复 `navigation` 插槽失效的问题 @uyarn ([#2514](https://github.com/Tencent/tdesign-vue/pull/2514))
- `Table`: 减少斑马纹样式影响范围，避免自定义元素被自定义 @chaishi ([common#1415](https://github.com/Tencent/tdesign-common/pull/1415))
- `Menu`: 侧边导航超长时，不再隐藏滚动条，防止鼠标操作环境下不能拖动滚动条的问题 @xiaosansiji ([common#1416](https://github.com/Tencent/tdesign-common/pull/1416))
### 🚧 Others
- `Dropdown`: 新增带图标的下拉菜单示例 @aomnisz ([#2523](https://github.com/Tencent/tdesign-vue/pull/2523))

## 🌈 1.4.2 `2023-06-13` 
### 🚀 Features
- `Menu`:
  - Submenu 新增 popupProps 属性，允许透传设置底层 Popup 弹窗属性 @xiaosansiji ([#2504](https://github.com/Tencent/tdesign-vue/pull/2504))
  - 去除子菜单 inline 样式，改为样式类实现，方便通过全局 Design Token 方式调整尺寸和间距等 @xiaosansiji ([#2496](https://github.com/Tencent/tdesign-vue/pull/2496))
- `InputNumber`: 初始值为 `undefined/null`，且存在 decimalPlaces 时，不再进行小数点纠正 @chaishi ([#2483](https://github.com/Tencent/tdesign-vue/pull/2483))
### 🐞 Bug Fixes
- `Menu`: 
  - 修复弹出类菜单内容未对齐的问题 @xiaosansiji ([#2496](https://github.com/Tencent/tdesign-vue/pull/2496))
  - 修复侧边导航横向内容可以滚动的问题 @xiaosansiji ([common#1398](https://github.com/Tencent/tdesign-common/pull/1398))
  - 修复菜单项与展开箭头 icon 未两端对齐的问题 @xiaosansiji ([common#1390](https://github.com/Tencent/tdesign-common/pull/1390))
- `Timeline`: 修复 `timeline-item` 响应式渲染丢失的问题 @uyarn ([#2501](https://github.com/Tencent/tdesign-vue/pull/2501))
- `Table`: 修复通过 `current` 修改分页，序列号没有变化的问题 @LoopZhou ([#2506](https://github.com/Tencent/tdesign-vue/pull/2506))
- `ColorPicker`: 初始化为渐变模式时 支持空字符串作为初始值 @uyarn ([#2511](https://github.com/Tencent/tdesign-vue/pull/2511))
- `TreeSelect`: 修复 keys配合 `valueType = object` 时使用的异常问题 @uyarn ([#2511](https://github.com/Tencent/tdesign-vue/pull/2511))
- `Cascader`: 修复空数组选项展示异常的问题 @uyarn ([#2511](https://github.com/Tencent/tdesign-vue/pull/2511))
- `Upload`: 删除 Upload 中对 loading 的重复颜色设置 @sinbadmaster ([common#1399](https://github.com/Tencent/tdesign-common/pull/1399))

## 🌈 1.4.0 `2023-06-06` 
### 🚀 Features
- `Menu`: @xiaosansiji ([#2461](https://github.com/Tencent/tdesign-vue/pull/2461))
  - 设置 `href` 时使用 `<a>` 标签渲染菜单项 [#1671](https://github.com/Tencent/tdesign-vue-next/issues/1671)
  - 使用 Popup 重构 Menu 弹出菜单实现
- `Select`: 优化选项结构 移除多余的span节点 @uyarn ([#2480](https://github.com/Tencent/tdesign-vue/pull/2480))
- `InputNumber`: 支持默认格式化小数点 @chaishi ([#2478](https://github.com/Tencent/tdesign-vue/pull/2478))
### 🐞 Bug Fixes
- `Loading`: 修复多次调用关闭全屏函数时控制台报错问题 @huangpiqiao ([#2465](https://github.com/Tencent/tdesign-vue/pull/2465))
- `Menu`: @xiaosansiji ([#2461](https://github.com/Tencent/tdesign-vue/pull/2461))
  - 修复收起菜单时超出内容无法滚动的问题 [#2435](https://github.com/Tencent/tdesign-vue/issues/2435)
  - 修复侧边导航菜单，次级弹出菜单也会展示 Tooltip 的问题
- `InputNumber`: 修复部分小数点数字无法输入问题 @chaishi ([#2460](https://github.com/Tencent/tdesign-vue/pull/2460))
- `Popup`: 修复 `popupPlugin `用法的 `triggerElement` 参数的类型报错的问题 @zhangpaopao0609 ([#2477](https://github.com/Tencent/tdesign-vue/pull/2477))
- `Input`: 修复快速输入或同时输入时输入值异常的问题 @uyarn ([#2479](https://github.com/Tencent/tdesign-vue/pull/2479))
- `InputAdornment`: 修复 1.3.4 中修复空字符串导致插槽没有正常渲染的问题 @uyarn ([#2480](https://github.com/Tencent/tdesign-vue/pull/2480))
- `ImageViewer`: 修复 closeBtn `prop = false` 时渲染异常的问题 @sinbadmaster ([#2472](https://github.com/Tencent/tdesign-vue/pull/2472))
- `类型问题`: 修复`Radio Checkbox Input Tabs Popup`等组件缺少 type 的问题 @chaishi ([#2475](https://github.com/Tencent/tdesign-vue/pull/2475))

## 🌈 1.3.4 `2023-05-30` 
### 🚀 Features
- `TimePicker`: 没有选中值时不允许点击确认按钮 @uyarn ([#2448](https://github.com/Tencent/tdesign-vue/pull/2448))
- `Menu`: 侧边导航菜单收起时，支持 Tooltip 展示菜单内容 @xiaosansiji ([#2455](https://github.com/Tencent/tdesign-vue/pull/2455))
### 🐞 Bug Fixes
- `Message`: 修复通过命令调用时，attach 所在 Dom 被清空后，新的 message 无法显示问题修复 @luguokong ([#2443](https://github.com/Tencent/tdesign-vue/pull/2443))
- `Backtop`: 修复 visibleHeight 只触发一次的缺陷 @uyarn ([#2449](https://github.com/Tencent/tdesign-vue/pull/2449))
- `StickyTool`: 修复控制台告警 @uyarn ([#2450](https://github.com/Tencent/tdesign-vue/pull/2450))
- `InputAdornment`: 修复 `prepend/append` 为空字符串时仍然渲染节点的问题 @uyarn ([#2457](https://github.com/Tencent/tdesign-vue/pull/2457))
- `Badge`: 修正在部分情况下未重置`box-sizing`而导致的样式错误 @PDieE ([common#1340](https://github.com/Tencent/tdesign-common/pull/1340))

## 🌈 1.3.3 `2023-05-19` 
### 🐞 Bug Fixes
- `Tooltip`: 修复箭头偏移问题 @uyarn ([#1347](https://github.com/Tencent/tdesign-common/pull/1347))


## 🌈 1.3.2 `2023-05-19` 
### 🚀 Features
- `Cascader`: 选项支持自定义样式  @ZekunWu ([#2396](https://github.com/Tencent/tdesign-vue/pull/2396))
### 🐞 Bug Fixes
- `Tree`: 修复 Tree 组件过滤并允许折叠状态下，每次搜索条件变更都展开路径节点 @TabSpace ([#2419](https://github.com/Tencent/tdesign-vue/pull/2419))
- `TagInput`: 修复组件初始值异常的问题 @uyarn ([#2423](https://github.com/Tencent/tdesign-vue/pull/2423))
- `Textarea`: 修复 autosize 为 null 报错的问题 @uyarn ([#2423](https://github.com/Tencent/tdesign-vue/pull/2423))
- `TreeSelect`: 修复搜索多次操作后没有正确返回筛选项的问题 @uyarn ([#2424](https://github.com/Tencent/tdesign-vue/pull/2424))
- `TreeSelect`: 修复异步加载数据没有正常显示 label 的问题 @uyarn ([#2424](https://github.com/Tencent/tdesign-vue/pull/2424))
- `Upload`: 修复多图上传增加丢失的间距的样式问题 @PDieE ([common#1344](https://github.com/Tencent/tdesign-common/pull/1344))


## 🌈 1.3.1 `2023-05-11` 
### 🚀 Features
- `ColorPicker`: 新增`size` API @uyarn ([#2388](https://github.com/Tencent/tdesign-vue/pull/2388))
### 🐞 Bug Fixes
- `Table`: 修复表格右侧冻结时表头无法对齐问题 @huangpiqiao ([#2371](https://github.com/Tencent/tdesign-vue/pull/2371))
- `Form`: 修复`disabled`下部分组件未禁用的缺陷 @uyarn ([#2405](https://github.com/Tencent/tdesign-vue/pull/2405))
- `TagInput`: 修复`disabled`响应丢失导致无法切换可清空状态的缺陷 @uyarn ([#2406](https://github.com/Tencent/tdesign-vue/pull/2406))
- `Select`: @uyarn ([#2406](https://github.com/Tencent/tdesign-vue/pull/2406))
  - 修复使用布尔值导致的控制台告警
  - 修复多选时折叠项在表单中的异常
- `Popup`: 修复 `onScrollToBottom` 在部分 windows 环境下无法触发的问题 @uyarn ([#2404](https://github.com/Tencent/tdesign-vue/pull/2404))
- `DatePicker`: 修复默认时间不生效的问题，将原本漏掉的 result 对于 defaultTime 的处理补充回来 @Ericleungs ([common#1331](https://github.com/Tencent/tdesign-common/pull/1331))

## 🌈 1.3.0 `2023-04-27` 
### 🚀 Features
- `StickyTool`: 新增 `StickyTool` 侧边栏组件 @ZekunWu ([#2213](https://github.com/Tencent/tdesign-vue/pull/2213))
- `BackTop`: 新增 `BackTop` 回到顶部组件 @uyarn @shinyina ([#2368](https://github.com/Tencent/tdesign-vue/pull/2368))
- `Input`: 支持在 disabled 状态下，hover 时提示展示全部内容 @uyarn ([#2372](https://github.com/Tencent/tdesign-vue/pull/2372))
### 🐞 Bug Fixes
- `Select`: 修复多选下尺寸的样式问题 @uyarn ([#2349](https://github.com/Tencent/tdesign-vue/pull/2349))
- `Table`: 修复 SSR 服务端渲染报错问题 @chaishi ([#2357](https://github.com/Tencent/tdesign-vue/pull/2357))
- `Datepicker`:  
  - 修复单独使用 `DatePickerPanel`，且启用 enable-time-picker 时，时分秒无法双向绑定且无法滚动的问题 @Ericleungs ([#2353](https://github.com/Tencent/tdesign-vue/pull/2353))
  - 修复在时间戳模式下 panel 会显示 Invalid value 的问题 @Ericleungs ([common#1268](https://github.com/Tencent/tdesign-common/pull/1268))
  - 修复第二次点击面板关闭异常问题 @honkinglin ([#2373](https://github.com/Tencent/tdesign-vue/pull/2373))
- `Space`: 修复插槽丢失响应式的缺陷 @uyarn ([#2372](https://github.com/Tencent/tdesign-vue/pull/2372))

## 🌈 1.2.7 `2023-04-20` 
### 🚀 Features
- `Datepicker`: 新增 `onPresetClick` 事件 @honkinglin ([#2342](https://github.com/Tencent/tdesign-vue/pull/2342))
### 🐞 Bug Fixes
- `DatePicker`: 修复时间戳模式下控制台警告 props 类型错误的问题 @Ericleungs ([#2328](https://github.com/Tencent/tdesign-vue/pull/2328))
- `Table`: 修复table组件在开启固定列单列 resizable 禁用时，相邻 resizable 启用的列列宽调整范围与预期不一致的问题 @chuyueZhang ([#2335](https://github.com/Tencent/tdesign-vue/pull/2335))
- `Cascader`: 修复 `valueType = full` 模式下，设置 `minCollapsedNum` 渲染报错的问题 @xiaosansiji ([#2343](https://github.com/Tencent/tdesign-vue/pull/2343))
- `ColorPicker`: 修复渐变模式下 `hex` 和 `rgb` 模式下输入无法修改渐变点颜色的缺陷 @uyarn ([common#1289](https://github.com/Tencent/tdesign-common/pull/1289))
- Popup: 修复 nuxt 环境中报错的问题 @uyarn (https://github.com/Tencent/tdesign-vue/pull/2347)
### 🚧 Others
- `文档`: icon 调整 manifest 统一入口导出 esm 模块说明 @Layouwen ([#2341](https://github.com/Tencent/tdesign-vue/pull/2341))
- `主题生成器`: 官网主题生成器升级 1.0 版本，支持色彩智能推荐及尺寸调整，新增腾讯云皮肤 @uyarn ([#2345](https://github.com/Tencent/tdesign-vue/pull/2345))

## 🌈 1.2.6 `2023-04-13` 
### 🚀 Features
- `Loading`: 完善指令使用方式，支持 `v-loading` 配置复杂属性 @akinocccc ([#2318](https://github.com/Tencent/tdesign-vue/pull/2318))
- `Select`: 支持 `boolean` 类型的 value @uyarn ([#2325](https://github.com/Tencent/tdesign-vue/pull/2325))
### 🐞 Bug Fixes
- `Upload`: 修复 `triggerButtonProps` 在 `theme=file-input` 时失效的问题 @qqw78901 ([#2319](https://github.com/Tencent/tdesign-vue/pull/2319))
- `Transfer`: 修复筛选后全选功能 @akinocccc ([#2315](https://github.com/Tencent/tdesign-vue/pull/2315))
- `Table`: @chuyueZhang ([#2324](https://github.com/Tencent/tdesign-vue/pull/2324))
  - 列宽调整功能，修复即使 `resizable=false` 时，也会显示拖拽调整列宽图标和辅助线问题
  - 列宽调整功能，修复在拖拽任意列宽使表格横向滚动条消失之后列宽无法正常调整的问题，即支持 `resize.minWidth`
  - 列宽调整功能，修复开启多级表头时点击子表头后控制台报错的问题
- `Select`: 修复创建的选项选中时，回调参数中 `option` 与 `selectedOptions` 缺失的问题 @uyarn ([#2333](https://github.com/Tencent/tdesign-vue/pull/2333))
- `Timeline`: 修正在项目全局修改 `box-sizing` 情况下，时间点样式错误的问题 @PDieE ([common#1264](https://github.com/Tencent/tdesign-common/pull/1264))
- `Popconfirm`: 修正 title 样式字重问题 @uyarn ([common#1265](https://github.com/Tencent/tdesign-common/pull/1265))
- `Input`: 隐藏 Edge 浏览器默认的密码框样式 @wangyang0210 ([common#1261](https://github.com/Tencent/tdesign-common/pull/1261))
- `InputNumber`: 移除 autowidth 模式下多余的样式 @uyarn ([common#1258](https://github.com/Tencent/tdesign-common/pull/1258))
- `Datepicker`: 修正区域时间选择，在右输入框点击了一年的最后一周之后，左右输入框的 value 前后对调的问题 @Ericleungs ([common#1257](https://github.com/Tencent/tdesign-common/pull/1257))


## 🌈 1.2.5 `2023-04-06` 
### 🐞 Bug Fixes
- `Popup`: 修复部分构建工具无法自动注册 Popup 插件的问题 @uyarn ([#2294](https://github.com/Tencent/tdesign-vue/pull/2294))
- `InputAdornment`: 修复 slot 方式直接使用字符串时 class 类名缺失的问题 @ccccpj ([#2293](https://github.com/Tencent/tdesign-vue/pull/2293))
- `Form`: 修复重置操作后错误为 data 数据添加了 `undefined` key 的问题 @akinocccc ([#2296](https://github.com/Tencent/tdesign-vue/pull/2296))
- `DatePicker`: 修复日期输入框值不更新的问题 @akinocccc ([#2299](https://github.com/Tencent/tdesign-vue/pull/2299))
- `Tree`: 修复懒加载子节点时点击label会触发选中的问题 @uyarn ([#2298](https://github.com/Tencent/tdesign-vue/pull/2298))
- `InputNumber`: 
    - 修复当浮点数和整数相加时，因为 JS 浮点精度计算问题导致的数据错误 @Ericleungs ([common#1251](https://github.com/Tencent/tdesign-common/pull/1251))
   - 修复小数位操作以 0 结尾时部分边界场景异常的问题 @uyarn ([#2304](https://github.com/Tencent/tdesign-vue/pull/2304))

## 🌈 1.2.4 `2023-03-30` 
### 🚀 Features
- `Table`: 支持设置 `filterRow=null` 隐藏过滤结果行 @chaishi ([#2267](https://github.com/Tencent/tdesign-vue/pull/2267))
### 🐞 Bug Fixes
- `Table`: 修复 SSR 环境 document 报错问题 @chaishi ([#2267](https://github.com/Tencent/tdesign-vue/pull/2267))
- `TagInput`: 修复基于`TagInput`的组件使用筛选时删除关键词时会删除已选值的问题 @chiyu1996 ([#2270](https://github.com/Tencent/tdesign-vue/pull/2270))
- `DatePicker`: 修复 format 为12小时制时功能异常的问题 @uyarn ([#2276](https://github.com/Tencent/tdesign-vue/pull/2276))
- `Alert`: 修复关闭按钮为文字时的居中和字体大小问题 @Wen1kang ([common#1229](https://github.com/Tencent/tdesign-common/pull/1229))
- `Loading`: 兜底部分插件场景加载loading的时机问题 @uyarn ([common#1230](https://github.com/Tencent/tdesign-common/pull/1230))
- `ImageViewer`: 转义样式中的 min 函数，防止 ESM 产物中 less 产物编译失败 @scshsy ([common#1225](https://github.com/Tencent/tdesign-common/pull/1225))
- `Select/SelectInput`: 修复重复触发 `blur/clear/focus` 事件的问题 @xiaosansiji  ([#2278](https://github.com/Tencent/tdesign-vue/pull/2278))

## 🌈 1.2.3 `2023-03-23` 
### 🚀 Features
- `Table`: @chaishi ([#2251](https://github.com/Tencent/tdesign-vue/pull/2251))
  - 支持使用 `filterIcon` 支持不同列显示不同的筛选图标，[issue#2088](https://github.com/Tencent/tdesign-vue/issues/2088)
  - 支持横向滚动到固定列，[issue#1992](https://github.com/Tencent/tdesign-vue/issues/1992)
- `ColorPicker`: 新增`enableMultipleGradient`, 支持渐变色只存在起始和结束梯度 @uyarn ([#2260](https://github.com/Tencent/tdesign-vue/pull/2260))
- `TimePicker`: 新增`size` API , 用于控制时间输入框大小，`pick`事件增加`context`回调参数 @uyarn ([#2260](https://github.com/Tencent/tdesign-vue/pull/2260))
- `Dropdown`: 支持透传popupProps的`on-visible-change`的写法 @uyarn ([#2260](https://github.com/Tencent/tdesign-vue/pull/2260))
### 🐞 Bug Fixes
- `Popup`: 修复需多次点击才能关闭的问题 @ikeq ([#2247](https://github.com/Tencent/tdesign-vue/pull/2247))
- `TreeSelect`:
  - 修复树选择组件，在表格组件里面时，显示两个 Tips 的问题，[issue#2131](https://github.com/Tencent/tdesign-vue/issues/2131) @chaishi ([#2251](https://github.com/Tencent/tdesign-vue/pull/2251))
- `Tree`: 修复空初始值或不存在的初始值的问题，@uyarn ([common #1213](https://github.com/Tencent/tdesign-common/pull/1213))
- `Table`:
  - 单行选中功能，修复 `allowUncheck: false` 无效问题，[tdesign-vue-next#2561](https://github.com/Tencent/tdesign-vue-next/issues/2561) @chaishi ([#2256](https://github.com/Tencent/tdesign-vue/pull/2256))
  - 修复 lazyload 的问题 @yanxugong ([#2250](https://github.com/Tencent/tdesign-vue/pull/2250))

## 🌈 1.2.2 `2023-03-16` 
### 🚀 Features
- `Table`: @chaishi ([#2227](https://github.com/Tencent/tdesign-vue/pull/2227))
  - 可编辑单元格(行)功能，支持编辑模式下，数据变化时实时校验，`col.edit.validateTrigger`， [tdesign-vue-nex#2445](https://github.com/Tencent/tdesign-vue-next/issues/2445)
  - 只有固定列存在时，才会设置类名 `.t-table__content--scrollable-to-left` 和 `.t-table__content--scrollable-to-right`
  - 拖拽功能，支持禁用固定列不可拖拽调整顺序，[tdesign-vue-next#2333](https://github.com/Tencent/tdesign-vue-next/issues/2333)
- `Upload`:
  - `theme=file-input` 文件为空时，悬浮时不显示清除按钮 @chaishi ([#2227](https://github.com/Tencent/tdesign-vue/pull/2227))
  - 新增 `inputAttributes` 属性，用于添加属性到对应 `input` HTML 元素 @yanxugong ([#2238](https://github.com/Tencent/tdesign-vue/pull/2238))
- `InputNumber`: 支持千分位粘贴 @uyarn ([#2237](https://github.com/Tencent/tdesign-vue/pull/2237))
- `Datepicker`: 支持 `size` 属性 @honkinglin ([#2234](https://github.com/Tencent/tdesign-vue/pull/2234))
- `国际化`:
  - 新增繁体中文（台湾地区）语言包 @puppetsheep ([common#1189](https://github.com/Tencent/tdesign-common/pull/1189))
  - 新增俄语及意大利语言包 @LIjiAngChen8 ([common#1202](https://github.com/Tencent/tdesign-common/pull/1202))
### 🐞 Bug Fixes
- `Table`: @chaishi ([#2227](https://github.com/Tencent/tdesign-vue/pull/2227))
  - 修复表格宽度抖动问题
  - 修复 Dialog 中使用 Table 时列宽调整的问题，[tdesign-vue-next#2359](https://github.com/Tencent/tdesign-vue-next/issues/2359)
  - 可编辑单元格(行)功能，修复输入框回车会触发 Form 表单的 submit 事件的问题，[issue#2445](https://github.com/Tencent/tdesign-vue-next/issues/2445)
  - 可编辑单元格，修复下拉选择类组件 `abortEditOnEvent` 没有包含 `onChange` 时，依然会在数据变化时触发退出编辑态的问题
  - 修复存在表格冻结列，滚动时冻结列与表格内容未对齐的问题 @huangpiqiao ([common#1197](https://github.com/Tencent/tdesign-common/pull/1197))
- `TreeSelect`: 修复 `label` 设置未生效的问题 @ccccpj ([#2230](https://github.com/Tencent/tdesign-vue/pull/2230))
- `SelectInput`: 修复 `valueDisplay` 和 `label` 插槽实现位置错误的问题 @uyarn ([#2231](https://github.com/Tencent/tdesign-vue/pull/2231))
- `InputNumber`: 修复小数点后存在非0数字后无法再输入0的问题 @huangpiqiao ([#2236](https://github.com/Tencent/tdesign-vue/pull/2236))
- `Form`: 修复未设置 `label` 属性时，仍渲染多余对应节点的问题 @honkinglin ([#2240](https://github.com/Tencent/tdesign-vue/pull/2240))
- `Datepicker`: @honkinglin ([#2234](https://github.com/Tencent/tdesign-vue/pull/2234))
  - 修复时间格式化问题 ([common#1194](https://github.com/Tencent/tdesign-common/pull/1194))
  - 修复 `status` 数据类型报错
- `Cascader`: 修复动态加载模式下 `valueType = full` 时回显异常的问题 @huangpiqiao ([#2225](https://github.com/Tencent/tdesign-vue/pull/2225))

## 🌈 1.2.1 `2023-03-09` 
### 🚀 Features
- `DatePicker`: 支持 `defaultTime` 用于设置默认时间 @honkinglin ([#2215](https://github.com/Tencent/tdesign-vue/pull/2215))
- `Popup`: 支持通过 `this.$popup` 方法直接调用弹出层，具体使用方式请看文档示例 @uyarn ([#2219](https://github.com/Tencent/tdesign-vue/pull/2219))
- `Tag`: 修改 `maxWidth` 生效的 DOM 节点，方便控制文本内容长度 @huangpiqiao ([#2220](https://github.com/Tencent/tdesign-vue/pull/2220))
### 🐞 Bug Fixes
- `DatePicker`: 修复月份为 0 时展示当前月份问题 @honkinglin ([#2205](https://github.com/Tencent/tdesign-vue/pull/2205))
- `Tree`: @TabSpace 
  - 完善过滤样式和虚拟滚动样式 ([#2209](https://github.com/Tencent/tdesign-vue/pull/2209))
  - 修正激活态切换时，旧激活态未消失的问题 ([#2209](https://github.com/Tencent/tdesign-vue/pull/2209))
  - 解决 operations 示例中，节点插入引发死循环的问题 ([#2212](https://github.com/Tencent/tdesign-vue/pull/2212))
- `Badge`: 修复徽标错误行为 @Aicmortal ([#2206](https://github.com/Tencent/tdesign-vue/pull/2206))
- `Table`: 修复 IE 上 affix 表头和表尾出现滚动条的问题 @huangpiqiao ([#2216](https://github.com/Tencent/tdesign-vue/pull/2216))
- `Pagination`: 修复某些情况下 mouseover 触发导致按钮闪烁的问题 @KMethod ([#2214](https://github.com/Tencent/tdesign-vue/pull/2214))
### 🚧 Others
- `tree`: 完善激活态单元测试 @TabSpace ([#2209](https://github.com/Tencent/tdesign-vue/pull/2209))

## 🌈 1.2.0 `2023-03-02` 
### 🚀 Features
- `Textarea`: 为解决 Textarea 字符限制文案会遮挡文本内容的问题，内容长度限制提示位置由组件内右下角移动到组件之外的右下角，与 tips 在同一行 @duanbaosheng ([#2194](https://github.com/Tencent/tdesign-vue/pull/2194))
- `Upload`: 自定义上传方法，支持一个请求上传返回多个文件的数据回显 @chaishi ([common #1165](https://github.com/Tencent/tdesign-common/pull/1165))
- `Image`: @chaishi ([#2182](https://github.com/Tencent/tdesign-vue/pull/2182))
  - 图片组件支持特殊格式的地址 `.avif` 和 `.webp`
  - 新增图片全局配置 `globalConfig.image.replaceImageSrc`，用于统一替换图片地址
- `Tree`: 支持虚拟滚动 @TabSpace ([#2181](https://github.com/Tencent/tdesign-vue/pull/2181))
- `Dialog`: 支持插件调用形式接收来自 `ConfigProvider` 的配置 @uyarn ([#2191](https://github.com/Tencent/tdesign-vue/pull/2191))
- `全局类型`: 新增公共 types 文件的导出  @uyarn ([#2201](https://github.com/Tencent/tdesign-vue/pull/2201))
### 🐞 Bug Fixes
- `Table`: @chaishi ([#2183](https://github.com/Tencent/tdesign-vue/pull/2183))
  - 列宽调整功能，修复左右侧固定列宽度调整问题，[issue#2168](https://github.com/Tencent/tdesign-vue/issues/2168)
  - 列宽调整功能，修复吸顶表头列宽调整问题
- `Upload`: 修复表单禁用对 Upload 组件无效的问题 @yusongh ([#2190](https://github.com/Tencent/tdesign-vue/pull/2190))
- `Tree`:
  - 修复 allowFoldNodeOnFilter 属性未生效的问题 @TabSpace ([#2181](https://github.com/Tencent/tdesign-vue/pull/2181))
  - 去除 Tree 多余的滚动条样式设置 @honkinglin ([common #1168](https://github.com/Tencent/tdesign-common/pull/1168))
- `Dialog`: 修复全局配置 `confirmBtnTheme` 属性失效的问题 @uyarn ([#2191](https://github.com/Tencent/tdesign-vue/pull/2191))

## 🌈 1.1.3 `2023-02-22` 
### 🚀 Features
- `Message`: MessagePlugin 插件支持传入 `className/style`，以便自定义消息样式 @chaishi ([#2151](https://github.com/Tencent/tdesign-vue/pull/2151))
- `Dialog`: 确认按钮主题不再跟随 Dialog 主题变动 @xiaosansiji ([#2172](https://github.com/Tencent/tdesign-vue/pull/2172))
- `Guide`:  定义步骤浮层内容 @chaishi ([#2170](https://github.com/Tencent/tdesign-vue/pull/2170))
  - 支持使用插槽 `body` `title` `content` 自定义相关内容
  - 支持透传 `popupProps` 属性，以便自定义更多特性，如 `popupProps.overlayInnerClassName`
- `Select`: 支持Option自定义title属性 @uyarn ([#2176](https://github.com/Tencent/tdesign-vue/pull/2176))
- `Popup`: 新增onScrollToBottom事件，新增popperOptions API @uyarn ([#2176](https://github.com/Tencent/tdesign-vue/pull/2176))
### 🐞 Bug Fixes
- `Timeline`: 修复自定义图标未能显示在正中间的问题 @chaishi ([#2150](https://github.com/Tencent/tdesign-vue/pull/2150))
- `Table`:
  - 表格宽度向下取整，修复表格宽度出现小数时导致吸顶和吸底出现横向滚动条 @huangpiqiao ([#2159](https://github.com/Tencent/tdesign-vue/pull/2159))
  -  修复 ssr 场景下构建报错的问题 @KMethod ([#2166](https://github.com/Tencent/tdesign-vue/pull/2166))
- `Guide`: @chaishi ([#2170](https://github.com/Tencent/tdesign-vue/pull/2170))
  - 修复 `@next-step-click` `@prev-step-click` `@skip` 等事件未能触发问题
  - 修复 `上一步`、`下一步`、`跳过` 等按钮的标识类名未能正确添加问题 @chaishi ([#2170](https://github.com/Tencent/tdesign-vue/pull/2170))
- `SelectInput`: @uyarn ([#2176](https://github.com/Tencent/tdesign-vue/pull/2176))
  - 修复基于 SelectInput 的输入类组件单选可输入模式下回删无法完全清空，及其导致的一系列问题
  - 修复onBlur事件触发时机的问题 @uyarn ([#2176](https://github.com/Tencent/tdesign-vue/pull/2176))
- `Tabs`: 修复在 tabs 内容区域使用图标大小异常的问题 @uyarn ([#2176](https://github.com/Tencent/tdesign-vue/pull/2176))
- `Drawer/Dialog`: 修复滚动条检测问题 @honkinglin ([#2173](https://github.com/Tencent/tdesign-vue/pull/2173))
- `Button`: 修复按钮 block 样式优先级问题 @honkinglin ([common #1152](https://github.com/Tencent/tdesign-common/pull/1152))

## 🌈 1.1.2 `2023-02-15` 
### 🚀 Features
- `TreeSelect`: 支持使用 `keys` 定义字段别名 @chaishi ([#2128](https://github.com/Tencent/tdesign-vue/pull/2128))
- `List`: ListItem 支持 `onClick` 事件 @yaogengzhu ([#1923](https://github.com/Tencent/tdesign-vue/pull/1923))
- `Timeline`: @chaishi ([#2138](https://github.com/Tencent/tdesign-vue/pull/2138))
  - 支持使用属性函数  `props.slot: () => <dot/>` 自定义连接点
  - 支持使用插槽和属性函数 `content` 自定义内容
  - 支持使用插槽和属性函数 `label` 自定义时间文本
### 🐞 Bug Fixes
- `Table`: @chaishi ([#2130](https://github.com/Tencent/tdesign-vue/pull/2130))
  - 修复 `affixHeader` 在IE上高度异常问题 @huangpiqiao ([#2129](https://github.com/Tencent/tdesign-vue/pull/2129))
  - 修复添加 `resizable` 属性后，在 Dialog 组件中宽度计算问题，并非提前设置好的 column.width，[issue#2116](https://github.com/Tencent/tdesign-vue/issues/2116)
  - 修复 `column.resizable=false` 在某些场景下无效问题，[issue#1765](https://github.com/Tencent/tdesign-vue/issues/1765)
  - 修复在自定义列数量场景，表格宽度未能根据列数自适应，[issue#1861](https://github.com/Tencent/tdesign-vue/issues/1861)
  - 修复宽度计算的各类问题，[issue#1663](https://github.com/Tencent/tdesign-vue/issues/1663) @chaishi
  - 修复空表格在 Dialog 组件中，文本显示位置不正确问题，[issue#2082](https://github.com/Tencent/tdesign-vue/issues/2082)
  - 分页功能，修复 `pagination.onChange` 被调用两次问题，[issue#2066](https://github.com/Tencent/tdesign-vue/issues/2066)
- `Cascader`: 修复级联组件无法选中值为 0 的选项的问题 @vkm0303 ([#2144](https://github.com/Tencent/tdesign-vue/pull/2144))
- `Timeline`: 修复 `TimelineItem.labelAlign` 优先级不是最高的问题 @chaishi ([#2138](https://github.com/Tencent/tdesign-vue/pull/2138))
- `Drawer`: 修复组件销毁时未正常移除锁定样式的问题 @honkinglin ([#2133](https://github.com/Tencent/tdesign-vue/pull/2133))

## 🌈 1.1.1 `2023-02-09` 
### 🐞 Bug Fixes
- `TreeSelect`: @chaishi  
    - 修复第一次点击无法显示下拉框问题 ([#2126](https://github.com/Tencent/tdesign-vue/pull/2126))
    - 修复1.1.0版本中 `treeProps.keys` 无效问题 ([#2126](https://github.com/Tencent/tdesign-vue/pull/2126))


## 🌈 1.1.0 `2023-02-08` 
### 🚀 Features
- `Cascader`: @chaishi ([#2096](https://github.com/Tencent/tdesign-vue/pull/2096))
  - 支持自定义 `tips/label/suffix/suffixIcon` 等节点
  - 支持 `collapsedItems` 定义折叠的元素， https://github.com/Tencent/tdesign-vue/issues/2102
- `SelectInput`: 支持自定义 `tips` 节点 @chaishi ([#2096](https://github.com/Tencent/tdesign-vue/pull/2096))
- `TagInput`: `collapsedItems` 的参数 `count` 含义更为折叠的标签数量  @chaishi ([#2096](https://github.com/Tencent/tdesign-vue/pull/2096))
- `Tree`: change 事件新增参数 `{ e }` @chaishi ([#2096](https://github.com/Tencent/tdesign-vue/pull/2096))
- `Select`: 支持自定义 `tips/label/suffix/suffixIcon` 等节点 @chaishi ([#2096](https://github.com/Tencent/tdesign-vue/pull/2096))
- `TreeSelect`: @chaishi ([#2096](https://github.com/Tencent/tdesign-vue/pull/2096))
  - 支持 `defaultPopupVisible`
  - 新增事件 `onEnter`
  - 支持自定义 `tips/label/suffix/suffixIcon`
- `Dropdown`: submenu层级结构调整，增加一层`t-dropdown__submenu-wrapper` @uyarn ([#2119](https://github.com/Tencent/tdesign-vue/pull/2119))
### 🐞 Bug Fixes
- `Avatar`: 修复图片头像的 `size` 属性失效的问题 @yaogengzhu ([common#2092](https://github.com/Tencent/tdesign-common/pull/1141))
- `Loading`: 修复loading在部分windows设备中晃动的问题 @uyarn ([#2092](https://github.com/Tencent/tdesign-vue/pull/2092))
- `Table`: 修复固定列 columns数据不一致导致的报错 [issue#2089] @thinkanymore ([#2091](https://github.com/Tencent/tdesign-vue/pull/2091))
- `Dialog`:
  - 修复 `closeOnClickOverlay = false `时，`overlayClick` 事件未触发问题 @KMethod ([#2087](https://github.com/Tencent/tdesign-vue/pull/2087))
- `ImageViewer`: 支持 `errorText mirrorTipText originalSizeTipText rotateTipText` 等字段配置 @whitexie ([#2103](https://github.com/Tencent/tdesign-vue/pull/2103))
- `Image`: 支持 `errorText loadingText` 字段全局配置 @whitexie ([#2103](https://github.com/Tencent/tdesign-vue/pull/2103))
- `InputNumber`: 修复小数点后第二个数字若为 0 无法输入问题，[issue#2304](https://github.com/Tencent/tdesign-vue-next/issues/2304) @chaishi ([#2105](https://github.com/Tencent/tdesign-vue/pull/2105))
- `Form`:
  - 修复其他表单项变化，触发 `<form-item :rules="[]" />` 校验问题，[issues#2100](https://github.com/Tencent/tdesign-vue/issues/2100) @chaishi ([#2105](https://github.com/Tencent/tdesign-vue/pull/2105))
  - 修复数组类表单项会因其他项变化引起自身校验问题 @chaishi ([#2110](https://github.com/Tencent/tdesign-vue/pull/2110))
- `SelectInput`: @chaishi ([#2096](https://github.com/Tencent/tdesign-vue/pull/2096))
  - 修复点击下拉面板触发 onBlur 事件问题，期望不触发
  - 支持 @enter 和 onEnter 事件
- `Popup`: 点击浮层面板时，禁止触发 onVisibleChange(trigger=document) 事件 @chaishi ([#2096](https://github.com/Tencent/tdesign-vue/pull/2096))
- `Tag`: @chaishi ([#2096](https://github.com/Tencent/tdesign-vue/pull/2096))  
  - 修复 `maxWidth` 最大宽度限制未包含图标宽度问题
  - 修复超出省略场景，元素缺少 title 属性问题
- `TagInput`: @chaishi ([#2096](https://github.com/Tencent/tdesign-vue/pull/2096))
  - 修复 `readonly` 无效问题
  - 修复失去焦点时，没有清空 inputValue 问题
  - 修复输入文本为空时，按下无法触发 onEnter 事件问题
  - 修复 @click  @enter @mouseenter @mouseleave  @remove 等事件无效问题
  - 修复 inputProps 优先级不是最高，进而难以覆盖任意属性问题
- `Select`: 修复 `collapsedItems` 参数 `value/collapsedSelectedItems` 和文档不一致问题，缺少 label 等信息，无法正常渲染节点 @chaishi ([#2096](https://github.com/Tencent/tdesign-vue/pull/2096))
- `TreeSelect`: @chaishi ([#2096](https://github.com/Tencent/tdesign-vue/pull/2096))
  - 修复按下 Enter 键时，没有触发搜索事件 onSearch 问题
  - `remove` 事件参数新增 `{ trigger, e, node, data, index }`，并修复参数 `{ value }` 不正确问题
  - `change` 事件新增参数 `{ index }`，并修复 `trigger` 不正确问题
  - 修复 onSearch 存在时，依然无法输入过滤文本问题
  - 修复 onFocus 事件参数 `value` 不是树选择组件值的问题
  - 修复 `collapsedItems` 参数 `value/collapsedSelectedItems` 和文档不一致问题，缺少 label 等信息，无法正常渲染节点
- `Dropdown`: 修复多层超长菜单的异常问题 @uyarn ([#2119](https://github.com/Tencent/tdesign-vue/pull/2119))
- `Watermark`: 修复`unplugin`方式使用`watermark`组件报错的问题 @uyarn ([#2119](https://github.com/Tencent/tdesign-vue/pull/2119))

## 🌈 1.0.8 `2023-02-02` 
### 🚀 Features
- `TreeSelect`: 支持`tips`和`status` API @uyarn ([#2084](https://github.com/Tencent/tdesign-vue/pull/2084))
### 🐞 Bug Fixes
- `Loading`: 加载组件包裹元素时，无法显示内容问题 @chaishi ([#2083](https://github.com/Tencent/tdesign-vue/pull/2083))


## 🌈 1.0.7 `2023-02-01` 

### 🐞 Bug Fixes
- `Table`:  @chaishi
    - 修复插槽 `cell-empty-content` 无效问题 ([#2068](https://github.com/Tencent/tdesign-vue/pull/2068))
    - 修复本地数据排序，异步获取数据，修复取消排序时，清空数据问题 ([#2073](https://github.com/Tencent/tdesign-vue/pull/2073))
- `Loading`: 当属性 `loading=false` 时，不允许存在任何加载组件相关元素 @chaishi ([#2068](https://github.com/Tencent/tdesign-vue/pull/2068))
- `TreeSelect`: 修复单选下选中值后没有触发`onblur`的问题 @uyarn ([#2069](https://github.com/Tencent/tdesign-vue/pull/2069))

## 🌈 1.0.6 `2023-01-31` 
### 🚀 Features
- `ColorPicker`: 切换单色-渐变模式时触发色值及 onChange 变化 @uyarn ([#2056](https://github.com/Tencent/tdesign-vue/pull/2056))
- `Upload`: @chaishi ([#2058](https://github.com/Tencent/tdesign-vue/pull/2058))
  - 可拖拽的单图片/单文件上传，支持自定义文件信息内容
  - 一个请求上传多个文件时，去除重复参数 `file`，保留 `file[0]` `file[1]` 即可，同时新增参数 `length` 表示本次上传文件的数量
  - onError/onSuccess/onProgress` 添加关键事件参数 `XMLHttpRequest`，用于获取上传请求更详细的信息
  - `tips` 支持插槽和函数配置
  - 新增上传请求超时也会执行 `onError`
  - 支持 `onCancelUpload` 事件
  - 支持 `mockProgressDuration`，用于设置模拟上传进度间隔时间
### 🐞 Bug Fixes
- `SelectInput`: 修复下拉弹窗状态未改变时，重复触发 `onPopupVisibleChange` 事件的问题 @xiaosansiji ([#2050](https://github.com/Tencent/tdesign-vue/pull/2050))
- `Table`: 修复可编辑单元格无法退出问题 @chaishi ([#2055](https://github.com/Tencent/tdesign-vue/pull/2055))
- `TreeSelect`: @uyarn ([#2060](https://github.com/Tencent/tdesign-vue/pull/2060))
  - 修复组件未失焦时触发 blur 事件的问题
  - 修复搜索选中选项后，保留搜索关键词的问题
  - 修复搜索状态下，无命中关键词时控制台报错的问题
- `Tree`: 修复禁用节点文字颜色过淡的问题 @uyarn ([#2060](https://github.com/Tencent/tdesign-vue/pull/2060))
- `Datepicker`: 修复 dayjs 国际化设置问题 @honkinglin ([#2062](https://github.com/Tencent/tdesign-vue/pull/2062))
- `Upload`: @chaishi ([#2058](https://github.com/Tencent/tdesign-vue/pull/2058))
  - 修复 `onSelectChange` 事件第二个参数 `currentSelectedFiles` 不正确问题
  - 修复 `autoUpload=false` 场景下，即使 `beforeUpload` 函数全部返回 `false` 依然会触发 `onChange` 事件问题
  - 修复 `data` 为函数时，参数为空的问题，补充参数 `files`
  - 修复 `theme=image-flow` 时，无法使用 `fileListDisplay` 自定义图片列表的问题
  - 修复文件数量超出 `max` 时，且没有可继续上传的文件时，依然触发 `onChange` 事件问题
  - 修复 `theme=file` 或者 `theme=image-flow` 时，`abridgeName` 无效问题
  - 修复 `theme=image-flow` 且 `autoUpload=false` 时，`onChange` 事件第一个参数丢失 file.url 问题
  - 修复非自动上传场景 `onChange` 事件第二个参数 `file` 值并非当前文件问题

## 🌈 1.0.5 `2023-01-17` 
### 🚀 Features
- `Avatar`: @chaishi ([#2032](https://github.com/Tencent/tdesign-vue/pull/2032))
  - 组件内部支持使用 Image 组件渲染图片
  -  新增 `avatar.imageProps`，用于透传图片组件全部属性。插槽也和 Image 组件保持同名
  - 支持使用 `props.default/props.content` 定义内容
  - 支持 `@error` 监听事件，并新增事件参数 `{ e: Event }`
- `Image`: 支持 `@load` 和 `@error` 监听事件，并新增事件参数 `{ e: Event }` @chaishi ([#2032](https://github.com/Tencent/tdesign-vue/pull/2032))
- `Input`: @chaishi ([#2041](https://github.com/Tencent/tdesign-vue/pull/2041))
  - `change` 事件新增 `trigger` 参数，用于表示触发本次数据变化的场景
  - 去除非必要的类名 `t-is-default`
  -  新增 click 点击事件
- `Popup`: 移除多余 `div` 包裹元素 @ikeq ([#2047](https://github.com/Tencent/tdesign-vue/pull/2047))
### 🐞 Bug Fixes
- `AutoComplete`: 修复初次聚焦，键盘事件无法上下选中问题 @chaishi ([#2041](https://github.com/Tencent/tdesign-vue/pull/2041))
- `Image`: @chaishi ([#2043](https://github.com/Tencent/tdesign-vue/pull/2043))
  - 修复无法使用 `loading` 自定义加载状态节点问题
  - 修复无法使用 `error` 自定义错误状态节点问题
  - 修复无法使用 `overlayContent ` 自定义浮层问题
  - 修复无法使用 `placeholder` 自定义图片占位问题
  - 修复动态修改src值图片无法显示问题 @sechi747 ([#2036](https://github.com/Tencent/tdesign-vue/pull/2036))
- `Space`: 修复无法显示纯文本元素问题 @chaishi ([#2043](https://github.com/Tencent/tdesign-vue/pull/2043))
- `TimePicker`: 修复 TimePickerPanel 没有自动注册的问题 @uyarn ([#2049](https://github.com/Tencent/tdesign-vue/pull/2049))
- `Menu`: 修正菜单项 active 态文字颜色 @xiaosansiji ([common #1122](https://github.com/Tencent/tdesign-common/pull/1122))

## 🌈 1.0.4 `2023-01-10` 
### 🚀 Features
- `Select`:
  - 支持全选 @skytt ([#2009](https://github.com/Tencent/tdesign-vue/pull/2009))
  - `valueDisplay`回调新增`displayValue`参数，用于设置`minCollapsedNum`的场景 @uyarn ([#2013](https://github.com/Tencent/tdesign-vue/pull/2013))
- `Radio`: @chaishi ([#2010](https://github.com/Tencent/tdesign-vue/pull/2010))
  - 支持键盘事件：tab 键切换选项，enter 键选中
  - RadioGroup 支持 `allowUncheck`，[issue#1693](https://github.com/Tencent/tdesign-vue/issues/1693)
- `Table`: @chaishi ([#2016](https://github.com/Tencent/tdesign-vue/pull/2016))
  - 可编辑单元格，支持使用  `col.edit.on` 透传组件事件
  - 可编辑单元格，支持使用 `validateTableData` 校验处于编辑态的单元格
  - 可编辑单元格，单元格的值 cellValue 不再进行解构处理，[tdesign-vue-next#2236](https://github.com/Tencent/tdesign-vue-next/issues/2236)
  - 新增 `attach`，用于统一设置超出省略浮层、筛选过滤下拉框等元素的挂载元素。如：`attach={() => document.body}`
- `Dialog`: 组件实例方法从可选更为必须存在 @chaishi ([#2026](https://github.com/Tencent/tdesign-vue/pull/2026))
### 🐞 Bug Fixes
- `Dialog`: 组件销毁前立即移除当前节点，不需要 `setTimeout` 等待时间 @chaishi ([#2011](https://github.com/Tencent/tdesign-vue/pull/2011))
- `Select`: 修复子组件方式混合传入分组与单个选项时，可能导致顺序错乱、筛选结果有误的问题 @skytt ([#2009](https://github.com/Tencent/tdesign-vue/pull/2009))
- `Radio`: 修复 RadioGroup 和 Radio 组合使用时，`allowUncheck` 无效问题 @chaishi ([#2010](https://github.com/Tencent/tdesign-vue/pull/2010))
- `Table`:
  - 处理单击和双击事件冲突问题，避免双击的时候触发行选中或行展开，[tdesign-vue-next#2218](https://github.com/Tencent/tdesign-vue-next/issues/2218)
  - 修复表格列动态设置插槽名，渲染无效的问题，[issue#1982](https://github.com/Tencent/tdesign-vue/issues/1982) @chaishi ([#2016](https://github.com/Tencent/tdesign-vue/pull/2016))
  - 修复表头吸顶，鼠标选中表格内容并拖动触发横向滚动时，鼠标移出表格区域，会出现表头错位的问题 @CaptainWang98 ([#2024](https://github.com/Tencent/tdesign-vue/pull/2024))
- `Dropdown`: 修复三级及以上子菜单超出问题计算部分场景异常的问题 @uyarn ([#2023](https://github.com/Tencent/tdesign-vue/pull/2023))
- `TreeSelect`: 修复选项文案过长样式的异常 @uyarn ([#2023](https://github.com/Tencent/tdesign-vue/pull/2023))
- `Space`: 修复组件 size 类型定义问题 @chaishi ([#2026](https://github.com/Tencent/tdesign-vue/pull/2026))

## 🌈 1.0.3 `2023-01-05` 
### 🚀 Features
- `AutoComplete`: @chaishi ([#1983](https://github.com/Tencent/tdesign-vue/pull/1983))
  - 新增清空功能 `clearable`
  - 新增自动聚焦功能 `autofocus`
  - 新增 `enter/blur/compositionend/compositionstart` 等事件，及相关参数和文档保持一致
- `Input`: 优化 enter 事件判断，不区分大小写 @chaishi ([#1983](https://github.com/Tencent/tdesign-vue/pull/1983))
- `Upload`: 支持配置模拟进度间隔时间，用于设置小文件上传进度触发频次 @chaishi ([#2001](https://github.com/Tencent/tdesign-vue/pull/2001))
- `ImageViewer`: 默认 z-index 调整为 3000，支持全局 CSS Token 调整 @Ylushen ([common #1104](https://github.com/Tencent/tdesign-common/pull/1104))
- 语言包: 新增阿拉伯语的语言包 @sunshineYuanlei ([common #1097](https://github.com/Tencent/tdesign-common/pull/1097))
### 🐞 Bug Fixes
- `Select`: @skytt
  - 调整 select 标记字段位置 修复部分场景使用option子组件报错的问题 ([#1975](https://github.com/Tencent/tdesign-vue/pull/1975))
  - 修复 option slots 部分情况下异常渲染更新的问题 ([#1981](https://github.com/Tencent/tdesign-vue/pull/1981))
- `Table`:
  - 修复本地数据分页功能中，`onPageChange` 参数 `newData` 数值不正确问题 @chaishi ([#1973](https://github.com/Tencent/tdesign-vue/pull/1973))
  - 修复 colInfo 不存在导致赋值报错的问题 @wenkeming ([#1979](https://github.com/Tencent/tdesign-vue/pull/1979))
- `Form`: 修复表单校验，未监听 `name` 和 `rules` 变化的问题，[issue#1942](https://github.com/Tencent/tdesign-vue/issues/1942) @chaishi ([#1971](https://github.com/Tencent/tdesign-vue/pull/1971))
- `Tree`: 修复 data 变化时无法更新树结构问题 @TabSpace ([#1976](https://github.com/Tencent/tdesign-vue/pull/1976))
- `Tag`: 修复 disabled 状态下关闭按钮 icon 依然高亮显示的问题 @byq1213 ([#1998](https://github.com/Tencent/tdesign-vue/pull/1998))
- `Input`:
  - 修复 value 为空时在IE上无法失焦的问题 @huangpiqiao ([#1996](https://github.com/Tencent/tdesign-vue/pull/1996))
  - 处理在 clear 事件中无法获取到最新 value 问题 @chaishi ([#2000](https://github.com/Tencent/tdesign-vue/pull/2000))
- `AutoComplete`: 修复 `options` 不存在时，组件因缺少判空报错问题 @chaishi ([#1983](https://github.com/Tencent/tdesign-vue/pull/1983))
- `Upload`: 上传组件的输入框模式在 Form 表单中的宽度问题修复 @chaishi ([#1999](https://github.com/Tencent/tdesign-vue/pull/1999))
- `Checkbox`: 修复禁用的选项依然会被选中的问题 @chaishi ([#2001](https://github.com/Tencent/tdesign-vue/pull/2001))
- `Datepicker`: 修复月份切换时响应错误的问题 @honkinglin ([#2008](https://github.com/Tencent/tdesign-vue/pull/2008))
- `Menu`: 优化弹出型子菜单最大展示高度，兼容大部分情况下正常展示菜单，且不出现全局滚动条 @xiaosansiji ([common #1111](https://github.com/Tencent/tdesign-common/pull/1111))
### 🚧 Others
- `Button`: 移除没有使用到的类名 `t-size-m` @chaishi ([#1977](https://github.com/Tencent/tdesign-vue/pull/1977))
- `Link/Input`: 去掉非必要的类名 `t-size-m` @chaishi ([#1983](https://github.com/Tencent/tdesign-vue/pull/1983))

## 🌈 1.0.2 `2022-12-28` 
### 🚀 Features
- `Loading`: 新增`v-loading` 支持 @uyarn ([#1964](https://github.com/Tencent/tdesign-vue/pull/1964))
- `Tabs`: 新增初始化时选中选项溢出自动滚动到具体位置的能力 @uyarn ([#1965](https://github.com/Tencent/tdesign-vue/pull/1965))
- `TooltipLite`: mouse 模式下新增定位边界检查，保证内容在可视范围内 @moecasts ([common #1093](https://github.com/Tencent/tdesign-common/pull/1093))
### 🐞 Bug Fixes
- `DatePicker`: 修复年份选择器区间展示错误 @honkinglin ([#1963](https://github.com/Tencent/tdesign-vue/pull/1963))
- `Input`:
    - 修复input在autowidth为true时,在ie上ResizeObserver监听事件中计算宽度不正常问题 @huangpiqiao ([#1967](https://github.com/Tencent/tdesign-vue/pull/1967))
    - 光标移动至中间输入等部分场景下Input光标位置异常的问题 @uyarn ([#1968](https://github.com/Tencent/tdesign-vue/pull/1968))
- `Cascader`: empty为字符串时没有默认样式 @uyarn ([#1962](https://github.com/Tencent/tdesign-vue/pull/1962))
- `TextArea`: 修复中文输入法等 IME 情况下，`autosize` 计算失效的问题 @xiaosansiji ([#1969](https://github.com/Tencent/tdesign-vue/pull/1969))
- `Menu`: 修复 logo 区域高度样式问题 @xiaosansiji ([common #1969](https://github.com/Tencent/tdesign-common/pull/1094))
- `Tag`: 去除选中文字透明色的样式 @uyarn ([common #1095](https://github.com/Tencent/tdesign-common/pull/1095))

## 🌈 1.0.1 `2022-12-23` 
### 🐞 Bug Fixes
- `Menu`: 修复弹出模式子菜单样式展示问题 @xiaosansiji ([#1960](https://github.com/Tencent/tdesign-vue/pull/1960))

## 🌈 1.0.0 `2022-12-22` 
### 🚀 Features
- `Table`: @chaishi ([#1948](https://github.com/Tencent/tdesign-vue/pull/1948))
  - 列配置支持 `stopPropagation: true`，用于设置某一列单元格阻止事件冒泡
  - 虚拟滚动支持行高动态变化
  - 固定表头背景色始终保持为灰色底，无论内容是否溢出
- `TreeSelect`: `onVisibleChange` 事件增加回调参数 @uyarn ([#1949](https://github.com/Tencent/tdesign-vue/pull/1949))
- `Guide`: 新增`Guide`引导组件 @uyarn @zhangpaopao0609  ([#1952](https://github.com/Tencent/tdesign-vue/pull/1952))
- `Select`: 提升部分情况下组件内部 options 处理的性能 优化大量数据加载卡顿的问题 @skytt ([#1945](https://github.com/Tencent/tdesign-vue/pull/1945))

### 🐞 Bug Fixes
- `Input`: 修复 Input 文字长度省略异常的问题 @uyarn ([#1939](https://github.com/Tencent/tdesign-vue/pull/1939))
- `Table`: 修复表格宽度过小时出现抖动的问题 @chaishi ([#1948](https://github.com/Tencent/tdesign-vue/pull/1948))
- `Drawer`: 修复 visible 默认为 `true` 时内容不展示问题 @honkinglin ([#1940](https://github.com/Tencent/tdesign-vue/pull/1940))

## 🌈 0.52.2 `2022-12-14` 
### 🚀 Features
- `Table`: @chaishi 
  - 树形结构，支持点击行展开树节点，[issue#1847](https://github.com/Tencent/tdesign-vue/issues/1847) ([#1915](https://github.com/Tencent/tdesign-vue/pull/1915))
  - 树形结构，点击树节点展开图标时，不触发 `onRowClick` 行点击事件
  - 虚拟滚动支持滚动到具体的某一个元素，用于呈现选中行/选中项 ([#1914](https://github.com/Tencent/tdesign-vue/pull/1914))
  - 虚拟滚动支持数据变化时不重置，进而支持树形结构无限滚动
  - 虚拟滚动支持表格高度变化，[vue-next #1374](https://github.com/Tencent/tdesign-vue-next/issues/1374)
### 🐞 Bug Fixes
- `Table`: 修复点击展开行报错的异常 @chaishi  ([#1910](https://github.com/Tencent/tdesign-vue/pull/1910))
- `Space`: 修复`separator` slot 无效的问题 @yaogengzhu ([#1922](https://github.com/Tencent/tdesign-vue/pull/1922))
- `Datepicker`:
  - 修复右侧面板月份展示错误问题 @honkinglin ([#1924](https://github.com/Tencent/tdesign-vue/pull/1924))
  - 修复 tips 样式问题 @honkinglin ([#1927](https://github.com/Tencent/tdesign-vue/pull/1927))
  - 兼容 value 传入空字符串 @honkinglin ([#1927](https://github.com/Tencent/tdesign-vue/pull/1933))
- `Loading`: 修复 `LoadingPlugin.hide()` 多次调用后报错的问题 @Nice-PLQ ([#1930](https://github.com/Tencent/tdesign-vue/pull/1930))
- `Dropdown`: 修复超长下拉菜单子菜单位置异常的问题 @uyarn ([#1910](https://github.com/Tencent/tdesign-vue/pull/1935))
- `Select`: 修复虚拟滚动未关闭下拉框切换页面导致告警的问题 @uyarn ([#1910](https://github.com/Tencent/tdesign-vue/pull/1935))
- `SelectInput`: 修复多选空值场景下的右侧内边距问题 @chaishi ([common #1082](https://github.com/Tencent/tdesign-common/pull/1082))
- `Timepicker`: 修复清空 rangepicker 时返回值异常的问题 @uyarn ([#1936](https://github.com/Tencent/tdesign-vue/pull/1936))
### 🚧 Others
- `Calendar/Card/Collapse/Form/ImageViewer/Image`: demo 样例优化 @pengYYYYY ([#1932](https://github.com/Tencent/tdesign-vue/pull/1932))

## 🌈 0.52.1 `2022-12-09` 

### 🐞 Bug Fixes
- `SelectInput`: 修复 popup 与包裹元素导出 ref 重名 导致0.52.0 虚拟滚动失效的问题 @skytt ([#1909](https://github.com/Tencent/tdesign-vue/pull/1909))
- `TreeSelec`: 修复选中异步加载树节点时 label展示异常的问题


## 🌈 0.52.0 `2022-12-08`
### ❗ Breaking Changes
- `SelectInput`: 调整 DOM 结构和类名，同其他框架保持一致，方便全部框架复用同一份 CSS @chaishi ([#1880](https://github.com/Tencent/tdesign-vue/pull/1880))
- `Menu`: 样式优化 @xiaosansiji ([#1882](https://github.com/Tencent/tdesign-vue/pull/1882))
  - 弹出菜单中箭头不再翻转，间距等样式与 Dropdown 子菜单对齐
  - `theme=light` 时默认跟随全局浅色/暗色模式切换，`theme=dark` 保持暗色模式展示
  - 侧边导航，去除第三级自菜单弹出动画，减少操作干扰
### 🚀 Features
- `ColorPicker`: 新增 `clearable` 及 `showPrimaryColorPreview` API，控制是否展示颜色选择条右侧预览区域 @uyarn ([#1875](https://github.com/Tencent/tdesign-vue/pull/1875))
- `SelectInput`: `selectInputWrapRef ` 更名为 `selectInputRef` @chaishi ([#1880](https://github.com/Tencent/tdesign-vue/pull/1880))
- `Table`: @chaishi ([#1891](https://github.com/Tencent/tdesign-vue/pull/1891))
  - 可筛选表格，新增 `filter.popupProps` ，支持透传 Popup 组件全部属性，[tdesign-vue-next#2088](https://github.com/Tencent/tdesign-vue-next/issues/2088)
  - 选中行表格，新增 `selectOnRowClick`，支持点击行选中，[tdesign-vue-next#1954](https://github.com/Tencent/tdesign-vue-next/issues/1954)
  - 本地排序功能，支持对默认数据进行排序
- `Upload`: `onProgress/onSuccess/onFail` 等事件参数添加 `XMLHttpRequest`，用于获取 http status 等数据 @chaishi ([#1886](https://github.com/Tencent/tdesign-vue/pull/1886))
- `Radio/Checkbox`: `click` 事件更为从最外层输出，防止出现无法在外层阻止冒泡的问题 @chaishi ([#1891](https://github.com/Tencent/tdesign-vue/pull/1891))
### 🐞 Bug Fixes
- `ColorPicker`: 修复无法删除颜色值的问题 @uyarn ([#1875](https://github.com/Tencent/tdesign-vue/pull/1875))
- `SelectInput`: 宽度自适应模式，边距问题修复，[issue#1842](https://github.com/Tencent/tdesign-vue/issues/1842) @chaishi ([#1880](https://github.com/Tencent/tdesign-vue/pull/1880))
- `TagInput`: 宽度自适应模式，左右边距保持一致 @chaishi ([#1880](https://github.com/Tencent/tdesign-vue/pull/1880))
- `Textarea`: 修复多行文本autofocus失效的问题 @yaogengzhu ([#1879](https://github.com/Tencent/tdesign-vue/pull/1879))
- `InputNumber`: 无法输入小数点后面的第一位数字 `0`，[tdesign-vue-next#2103](https://github.com/Tencent/tdesign-vue-next/issues/2103) @chaishi ([#1885](https://github.com/Tencent/tdesign-vue/pull/1885))
- `InputNumber`: 修复无法使用清空按钮清除输入数字问题，[issue#1855](https://github.com/Tencent/tdesign-vue/issues/1855) @chaishi ([#1885](https://github.com/Tencent/tdesign-vue/pull/1885))
- `SelectInput`: 修复出现的异常`tips` 节点 @pengYYYYY ([#1889](https://github.com/Tencent/tdesign-vue/pull/1889))
- `Popup`: 修复初次渲染 `overlayStyle` 不生效的问题 @uyarn ([#1893](https://github.com/Tencent/tdesign-vue/pull/1893))
- `Dropdown`: 修复父节点超长无法点击子菜单的问题 @uyarn ([#1893](https://github.com/Tencent/tdesign-vue/pull/1893))
- `Dialog`: 修复滚动条判断的问题 @honkinglin ([#1897](https://github.com/Tencent/tdesign-vue/pull/1897))
- `ImageViewer`: 修复缺少移除动画的问题 @honkinglin ([#1877](https://github.com/Tencent/tdesign-vue/pull/1877))
- `RangeInput`: 修复 `status`设置无效的问题 @honkinglin ([#1878](https://github.com/Tencent/tdesign-vue/pull/1878))
- `InputAdornment`: 修复 InputAdornment 相关样式问题 @honkinglin ([#1888](https://github.com/Tencent/tdesign-vue/pull/1888))
### 🚧 Others
- `Table`: demo 样例优化 @pengYYYYY ([#1889](https://github.com/Tencent/tdesign-vue/pull/1889))
- `Menu`: demo 样例优化 @xiaosansiji ([#1882](https://github.com/Tencent/tdesign-vue/pull/1882))

## 🌈 0.51.1 `2022-11-30` 
### ❗ Breaking Changes
- `Jumper`: Jumper 更名为 PaginationMini 组件，正在使用 Jumper 组件的同学请从 Pagination 中导出替换 @honkinglin ([#1845](https://github.com/Tencent/tdesign-vue/pull/1845))
### 🚀 Features
- `Calendar`:
  - 日历组件支持多个高亮单元格； @PsTiu ([#1850](https://github.com/Tencent/tdesign-vue/pull/1850))
  - 卡片样式菜单操作栏样式调整 @uyarn ([#1863](https://github.com/Tencent/tdesign-vue/pull/1863))
- `Table`: 选中行功能，新增 `reserveSelectedRowOnPaginate`，用于支持在分页场景中，仅选中当前页数据，切换分页时清空选中结果，全选仅选中当前页数据 @chaishi ([#1849](https://github.com/Tencent/tdesign-vue/pull/1849))
- `Tree`: 使用 composition api 重构组件 @TabSpace ([#837](https://github.com/Tencent/tdesign-vue/pull/837))
### 🐞 Bug Fixes
- `Drawer`:
  - 修复 `closeOnOverlayClick` 存在默认值导致全局配置失效问题 @chaishi ([#1844](https://github.com/Tencent/tdesign-vue/pull/1844))
  - 修复 drawer 动画失效的问题 @honkinglin ([#1858](https://github.com/Tencent/tdesign-vue/pull/1858))
- `Table`: @chaishi ([#1849](https://github.com/Tencent/tdesign-vue/pull/1849))
  - 修复本地数据分页场景中，切换分页大小，`onPageChange` 事件参数返回的数据不正确问题
  - 序号列支持跨分页显示 [tdesign-vue-next#2072](https://github.com/Tencent/tdesign-vue-next/issues/2072)
  - 修复分页场景下，设置 max-height 和 bordered 之后，边框线位置不正确 [issue#2062](https://github.com/Tencent/tdesign-vue-next/issues/2062)
  - 行选中事件参数选中数据支持 `data.push`， [issue#1747](https://github.com/Tencent/tdesign-vue/issues/1747)
- `AutoComplete`: 支持使用 `triggerElement` 自定义触发元素 @chaishi ([#1848](https://github.com/Tencent/tdesign-vue/pull/1848))
- `Input`: 宽度自适应 `auto-width` 支持中文拼音输入也实时调整宽度，[issue#2079](https://github.com/Tencent/tdesign-vue-next/issues/2079) @chaishi ([#1853](https://github.com/Tencent/tdesign-vue/pull/1853))
- `Dialog`: 修复 destroyOnClose 设置后关闭弹窗无动画效果问题  @honkinglin ([#1857](https://github.com/Tencent/tdesign-vue/pull/1857))
- `TagInput`: @chaishi ([#1860](https://github.com/Tencent/tdesign-vue/pull/1860))
  - 不同尺寸的间距和高度问题修复，[issue#1843](https://github.com/Tencent/tdesign-vue/issues/1843)
  - 修复右侧图标会和标签重合问题
  - 修复 `onRemove` 事件参数未能返回最新 `value` 问题
  - 修复未能正确透传 `inputProps` 问题
- `Menu`: 修复二级菜单子菜单纵向左边距丢失的问题 @uyarn ([#1863](https://github.com/Tencent/tdesign-vue/pull/1863))
### 🚧 Others
- 支持插件 valor 代码提示 @chaishi ([#1841](https://github.com/Tencent/tdesign-vue/pull/1841))
- 优化 Form/Divider 组件 demo @pattybaby110 ([#1829](https://github.com/Tencent/tdesign-vue/pull/1829))

## 🌈 0.50.1 `2022-11-24` 
### 🚀 Features
- `InputNumber`: 支持 `allowInputOverLimit`，用于设置是否允许输入数字超过 `max` `min` 范围的值 @chaishi ([#1811](https://github.com/Tencent/tdesign-vue/pull/1811))
- `SelectInput`: 支持`multiple`和`single`模式切换，适用于动态表单或低码平台场景 @uyarn ([#1818](https://github.com/Tencent/tdesign-vue/pull/1818))
- `AutoComplete`: 新增自动填充组件 @chaishi ([#1784](https://github.com/Tencent/tdesign-vue/pull/1784))
- `TimePicker`: `TimePicker` 新增`tips`和 `status` API @uyarn ([#1830](https://github.com/Tencent/tdesign-vue/pull/1830))
- `Switch`: 优化`Switch`样式 区分打开与关闭按钮大小 @Wen1kang @uyarn ([#1834](https://github.com/Tencent/tdesign-vue/pull/1834))
- 添加 Webstorm 和 Vetur 组件代码提示 @chaishi ([#1835](https://github.com/Tencent/tdesign-vue/pull/1835))
### 🐞 Bug Fixes
- `InputNumber`: 修复删除数字时数据类型会从 number 变为 string 问题 @chaishi ([#1811](https://github.com/Tencent/tdesign-vue/pull/1811))
- `Select`: 修复限制可选条目数下禁用态不能反选的问题 (#1819) @skytt ([#1825](https://github.com/Tencent/tdesign-vue/pull/1825))
- `Tabs`: 修复 list 定义的 tabs 删除时，remove 方法循环调用的问题 (#1696) @LoopZhou ([#1832](https://github.com/Tencent/tdesign-vue/pull/1832))
- `TimePicker`: 修复面板打开时清空内容回填的问题 @uyarn ([#1830](https://github.com/Tencent/tdesign-vue/pull/1830))
- `Table`: 可编辑行，修复因没有监听数据变化，出现的校验不通过的问题，[issue#1822](https://github.com/Tencent/tdesign-vue/issues/1822) @chaishi ([#1833](https://github.com/Tencent/tdesign-vue/pull/1833))
- `Progress`: 修复percentage值为100时,会忽略 status 设置的问题 @yusongh ([#1836](https://github.com/Tencent/tdesign-vue/pull/1836))
- `ColorPicker`: 修复在渐变区域滑竿滑动时，触发 picker 关闭的问题 @S-mohan ([#1806](https://github.com/Tencent/tdesign-vue/pull/1806))
- `DatePicker`: 修复周选择器高亮错误的问题 @honkinglin ([#1814](https://github.com/Tencent/tdesign-vue/pull/1814))
### 🚧 Others
- `Test`: 完善 `Form/Steps/Space/Rate/Layout/Grid` 组件测试用例  @xiaosansiji ([#1820](https://github.com/Tencent/tdesign-vue/pull/1820))
- `Pagination`: 优化 demo 展示效果  @Ccppmmm ([#1824](https://github.com/Tencent/tdesign-vue/pull/1824))
- `Cascader`: 优化自定义 collapsed demo 展示 @xiaosansiji ([#1827](https://github.com/Tencent/tdesign-vue/pull/1827))

## 🌈 0.50.0 `2022-11-16` 
### ❗ Breaking Changes
- `Comment/Slider/ImageViewer`: 组件 DOM 结构调整，有覆盖样式的同学请关注 @HQ-Lin ([#1785](https://github.com/Tencent/tdesign-vue/pull/1785)、[#1794](https://github.com/Tencent/tdesign-vue/pull/1794)、[#1788](https://github.com/Tencent/tdesign-vue/pull/1788))
- 部分组件间距、尺寸等样式统一调整，支持使用尺寸相关Design Token调整间距、尺寸大小 @uyarn ([common #993](https://github.com/Tencent/tdesign-common/pull/993)) @Wen1kang ([common #977](https://github.com/Tencent/tdesign-common/pull/977)) 
### 🚀 Features
- `Breadcrumb`: 新增`icon` API @uyarn ([#1781](https://github.com/Tencent/tdesign-vue/pull/1781))
- `TreeSelect`: 支持`borderless`、`tagProps`、`selectInputProps`等 API @uyarn ([#1795](https://github.com/Tencent/tdesign-vue/pull/1795))
- `Button`: 新增`suffix` 插槽 适用文字后置图标场景 @uyarn ([#1799](https://github.com/Tencent/tdesign-vue/pull/1799))
- `TreeSelect`:
  - TreeSelect 底层重构为基于 SelectInput 实现，复用SelectInput样式，减少兼容样式代码 @uyarn ([#1795](https://github.com/Tencent/tdesign-vue/pull/1795))
  - 补充 readonly 只读属性，@yaogengzhu ([#1783](https://github.com/Tencent/tdesign-vue/pull/1783))
### 🐞 Bug Fixes
- `Breadcrumb`: 修复文字省略样式失效的问题 @uyarn ([#1781](https://github.com/Tencent/tdesign-vue/pull/1781))
- `Select`: 搜索修复模糊大小写 (fixed: #1786) @skytt ([#1787](https://github.com/Tencent/tdesign-vue/pull/1787))
- `TagInput`: 修复 `autoWidth = true` 时宽度跟随内容自适应失效的问题；修复标签超出滚动时，显示异常的问题。 @xiaosansiji ([#1793](https://github.com/Tencent/tdesign-vue/pull/1793))
- `TreeSelect`: 修复单选模式打开下拉框右侧图标缺失的问题 @uyarn ([#1795](https://github.com/Tencent/tdesign-vue/pull/1795))
- `Badge`: 修复 `count` 无法通过插槽方式使用的问题 @uyarn ([#1799](https://github.com/Tencent/tdesign-vue/pull/1799))
- `Form`: 修复 InputNumber `min = 0` 的边界场景校验异常的问题 @yaogengzhu ([#1772](https://github.com/Tencent/tdesign-vue/pull/1772))
- `DatePicker`: @HQ-Lin
  - 修复区间日期选择器分隔符丢失的问题 ([#1805](https://github.com/Tencent/tdesign-vue/pull/1805))
  - 修复disableDate 动态调整失效的问题 ([#1803](https://github.com/Tencent/tdesign-vue/pull/1803))

## 🌈 0.49.6 `2022-11-11` 
### 🐞 Bug Fixes
- `Form`: 修复InputNumber min为0的边界场景校验异常的问题 @yaogengzhu ([#1772](https://github.com/Tencent/tdesign-vue/pull/1772))
- `Dialog`: 修复组件在一些种场景下销毁时没有删除body上的t-dialog-lock类的问题 @huangpiqiao ([#1766](https://github.com/Tencent/tdesign-vue/pull/1766))
- `Loading`: 修复全屏实例无法全部销毁问题 @huangpiqiao ([#1774](https://github.com/Tencent/tdesign-vue/pull/1774))
- `Form`: 修复`requiredMark`默认值的问题 @uyarn ([#1776](https://github.com/Tencent/tdesign-vue/pull/1776))


## 🌈 0.49.5 `2022-11-10` 
### 🐞 Bug Fixes
- `Form`: 修复0.49.4版本表单检验异常的问题 @uyarn ([#1768](https://github.com/Tencent/tdesign-vue/pull/1768))
- `Collapse`: 修复动态设置`collapse-panel`时panel展示异常的问题 @asbstty ([#1767](https://github.com/Tencent/tdesign-vue/pull/1767))

## 🌈 0.49.4 `2022-11-09` 
### 🚀 Features
- `Tree`: 支持拖拽功能，详见示例代码 @xixileng ([#1745](https://github.com/Tencent/tdesign-vue/pull/1745))
- `Timeline`: 新增 Timeline 时间轴组件，@weijiyang @uyarn ([#1638](https://github.com/Tencent/tdesign-vue/pull/1638))

### 🐞 Bug Fixes
- `Table`: `resizable = false` 时，基础表格表头默认使用用户定义的列宽  @ZTao-z ([#1733](https://github.com/Tencent/tdesign-vue/pull/1733))
- `Transfer`: 带分页的穿梭框，修复两侧全量勾选时报错的问题 @yaogengzhu ([#1741](https://github.com/Tencent/tdesign-vue/pull/1741))
- `Input`: 修复在输入框进行预渲染处于 `display: none` 状态时，宽度计算不正确的问题，[issue#1678](https://github.com/Tencent/tdesign-vue/issues/1678) @chaishi ([#1749](https://github.com/Tencent/tdesign-vue/pull/1749))
- `Select`: @skytt ([#1755](https://github.com/Tencent/tdesign-vue/pull/1755))
  - 修复创建项目在已有选项中存在时，重复显示的问题
  - 修复多选时，待创建选项显示样式问题
  - 优化键盘事件的逻辑
- ConfigProvider: 修复 `t-config-provider` 直接包裹 router-view 标签时控制台报错的问题 @LoopZhou ([#1753](https://github.com/Tencent/tdesign-vue/pull/1753))
- `Tree`: 修复 filter 过滤后，过滤结果为空，未能显示 empty slot 的问题 @yaogengzhu ([#1748](https://github.com/Tencent/tdesign-vue/pull/1748))
- `InputNumber`: 修复`theme=column`时，`autoWidth` 无效问题，[issue#1652](https://github.com/Tencent/tdesign-react/issues/1652) @chaishi ([common #969](https://github.com/Tencent/tdesign-common/pull/969))
- `Form/Upload`: 修复 `formRule` `uploadFile` 类型未导出的问题 @uyarn ([#1762](https://github.com/Tencent/tdesign-vue/pull/1762))
- `Form`: 修复表单中使用 DateRangePicker，校验失败时样式缺少红框展示的问题 @LoopZhou ([common #965](https://github.com/Tencent/tdesign-common/pull/965))
### 🚧 Others
- `Alert`: 官网示例的宽度根据屏幕宽度自动撑开 @aomnisz ([#1658](https://github.com/Tencent/tdesign-vue/pull/1658))

## 🌈 0.49.3 `2022-11-02` 
### 🚀 Features
- `Input`:  @chaishi ([#1700](https://github.com/Tencent/tdesign-vue/pull/1700))
  - 支持在输入框实时显示数字限制
  - 支持对 `unicode` 字符长度的判定
  - `status` 为空时，不再添加无效类名 `t-is-default`
- `Upload`: 文件列表上传支持使用 `fileListDisplay` 自定义文件列表 @chaishi ([#1704](https://github.com/Tencent/tdesign-vue/pull/1704))
- `Pagination`: 透传`selectProps` 和 `selectProps.popupProps` 到组件 `Pagination`，以便实现挂载节点等复杂场景需求， [tdesign-react#1611](https://github.com/Tencent/tdesign-react/issues/1611) @chaishi ([#1702](https://github.com/Tencent/tdesign-vue/pull/1702))
- `TimePicker`: 新增`onPick` API 用于每次选中面板值进行回调处理 @uyarn ([#1728](https://github.com/Tencent/tdesign-vue/pull/1728))
- `ConfigReceiver`: `getKeepAnimationMixins` 支持读取 `defaultGlobalConfig` @qqw78901 ([#1699](https://github.com/Tencent/tdesign-vue/pull/1699))
- 支持局部注册组件时，不再需要手动引入 `Composition-API` @qqw78901 ([#1697](https://github.com/Tencent/tdesign-vue/pull/1697))
### 🐞 Bug Fixes
- `Table`: @chaishi ([#1702](https://github.com/Tencent/tdesign-vue/pull/1702))
  - EnchancedTable 支持可编辑单元格，[issue#1689](https://github.com/Tencent/tdesign-vue/issues/1689)
  - 修复吸顶表头超出省略问题，[issue#1639](https://github.com/Tencent/tdesign-vue/issues/1639)
  - 提高 `dragSortOptions` 优先级，以便父组件自定义全部参数，[tdesign-react#1556](https://github.com/Tencent/tdesign-react/issues/1556)
  - 修复表格可编辑单元格的验证错误不能被正常清除问题，[issue#1637](https://github.com/Tencent/tdesign-vue/issues/1637)
  - 本地分页表格中，使用拖拽排序，数据交换结果不正确，[issue#1342](https://github.com/Tencent/tdesign-vue/issues/1342)
- `Dialog`: 修复参数 `footer = false` 时，footer 节点仍然渲染的问题 @huangpiqiao ([#1713](https://github.com/Tencent/tdesign-vue/pull/1713))
- `Datepicker`:
  - 修复 `popupProps.onVisibleChange` 方法不能正常触发的问题 @xiaosansiji ([#1712](https://github.com/Tencent/tdesign-vue/pull/1712))
  - 修复单选日期时间无法保存的问题 @HQ-Lin ([#1716](https://github.com/Tencent/tdesign-vue/pull/1716))
- `Collapse`: 修复`ExpandIcon`的实现 @asbstty ([#1717](https://github.com/Tencent/tdesign-vue/pull/1717))
- `Calendar`: 调整日历组件单元格外层 `DOM` 样式，修复在使用 `cellAppend` 插槽后可能样式会有异常的问题 @PsTiu ([#1721](https://github.com/Tencent/tdesign-vue/pull/1721))
- `Textarea`:  修复`status`的类型问题 @yaogengzhu ([#1710](https://github.com/Tencent/tdesign-vue/pull/1710))
- `TimePicker`: 修复12小时制时分的显示异常 @uyarn ([#1728](https://github.com/Tencent/tdesign-vue/pull/1728))
- `Dropdown`: 修复下拉菜单可视无法完全受控的问题 @uyarn ([#1729](https://github.com/Tencent/tdesign-vue/pull/1729))
- `Checkbox`: 修复Checkbox的options 参数属性变化时未重新渲染的问题 @uyarn ([#1730](https://github.com/Tencent/tdesign-vue/pull/1730))
### 🚧 Others
- `Tooltip/popup`: 新增测试用例 @byq1213 ([#1688](https://github.com/Tencent/tdesign-vue/pull/1688))
- `Test`: 测试方案由 Jest 切换到 Vitest @xiaosansiji ([#1687](https://github.com/Tencent/tdesign-vue/pull/1687))

## 🌈 0.49.2 `2022-10-27` 
### 🐞 Bug Fixes
- `Select`
    - 修复单选清除失效的问题 @uyarn ([#1690](https://github.com/Tencent/tdesign-vue/pull/1690))
    - 修复分组样式问题 @uyarn ([#1690](https://github.com/Tencent/tdesign-vue/pull/1690))
- `TreeSelect`: 修复0.49.1版本样式丢失的异常 @uyarn ([common#934](https://github.com/Tencent/tdesign-common/pull/934))

## 🌈 0.49.1 `2022-10-26` 
### 🚀 Features
- `Select`:
  - `onChange` 事件增加 option 参数返回 [issue#1664](https://github.com/Tencent/tdesign-vue/issues/1664) @skytt ([#1667](https://github.com/Tencent/tdesign-vue/pull/1667))
  - 添加 options 参数监听, 优化部分场景下 option 更新逻辑 [issue#1681](https://github.com/Tencent/tdesign-vue/issues/1681) @skytt ([#1682](https://github.com/Tencent/tdesign-vue/pull/1682))
- `Upload`: 多图片上传，图片文件名支持 `abridgeName` @chaishi ([#1669](https://github.com/Tencent/tdesign-vue/pull/1669))
- `dialog`:  优化非模态对话框拖拽事件鼠标表现  @huoyuhao ([#1352](https://github.com/Tencent/tdesign-vue/pull/1352))
### 🐞 Bug Fixes
- `Select`: 空值兼容 null 的情况 [issue#1668](https://github.com/Tencent/tdesign-vue/issues/1668) @skytt ([#1667](https://github.com/Tencent/tdesign-vue/pull/1667))
- `Upload`: @chaishi ([#1669](https://github.com/Tencent/tdesign-vue/pull/1669))
  - 修复 `name` 无效的问题
  - 修复自定义上传方法不支持图片回显的问题
- `Collapse`: 修复点击标题没有触发折叠功能的问题 @huangpiqiao ([#1676](https://github.com/Tencent/tdesign-vue/pull/1676))
- `Tabs`: 修复 Tabs 切换时会导致表单初始化聚焦失效问题 @huangpiqiao ([#1676](https://github.com/Tencent/tdesign-vue/pull/1676))
- `Datepicker`: @luwuer ([#1587](https://github.com/Tencent/tdesign-vue/pull/1587))
  - 修复 `t-date-picker__cell--active-start` 和 `t-date-picker__cell--active-end` 在第二次操作时错序的问题 [issue#1580](https://github.com/Tencent/tdesign-vue/issues/1580)
  - 修复 hover 已选择日期动画导致 cell 闪烁问题 @luwuer ([#1587](https://github.com/Tencent/tdesign-vue/pull/1587))
- `Textarea`: 修复禁用状态字数限制区域的样式问题 @uyarn ([#1684](https://github.com/Tencent/tdesign-vue/pull/1684))
- `Space`: 修复子节点为空的报错 @uyarn ([#1684](https://github.com/Tencent/tdesign-vue/pull/1684))
- `Dialog`: 修复 theme 为非 default 时 body 节点类名的问题 @uyarn ([#1684](https://github.com/Tencent/tdesign-vue/pull/1684))
### 🚧 Others
- `Popconfirm`: 修复官网 demo 气泡框描述文案字体颜色 @iLunZ ([#1677](https://github.com/Tencent/tdesign-vue/pull/1677))
- 官网: 主题生成器新增阴影配置能力 @uyarn @yilaierwang ([#1655](https://github.com/Tencent/tdesign-vue/pull/1655))
- `Avatar`: demo 中删除重复头像并调整展示顺序 @tutaizi ([#1612](https://github.com/Tencent/tdesign-vue/pull/1612))

## 🌈 0.49.0 `2022-10-19` 
### ❗ Breaking Changes
- `Dropdown`: 调整`Dropdown`样式，优化多层菜单样式结构，多层菜单结构有变动 @uyarn ([#1607](https://github.com/Tencent/tdesign-vue/pull/1607))
### 🚀 Features
- `Dropdown`: @uyarn ([#1607](https://github.com/Tencent/tdesign-vue/pull/1607))
  - 支持`direction` API，支持向左展开菜单
  - 新增`theme`等API 支持自定义菜单项主题
  - 支持直接使用 `t-dropdown-menu` 作为子节点，同时继续支持 `dropdown` 的具名插槽，插槽方式支持多级菜单嵌套
- `Tag`: 样式优化，实现 `light-outline` 风格 @HelKyle ([#1617](https://github.com/Tencent/tdesign-vue/pull/1617))
- `Table`: @chaishi ([#1633](https://github.com/Tencent/tdesign-vue/pull/1633))
  - 表格列属性 `attrs` 支持自定义任意单元格属性
  - 新增列属性 `colspan`，用于设置单行表头合并
  - 超出省略功能，支持同时设置省略浮层内容 `ellipsis.content` 和属性透传 `ellipsis.props`
  - 增强型表格，支持列配置，支持不传 `displayColumns` 时默认显示全部列，[issue#1784](https://github.com/Tencent/tdesign-vue-next/issues/1784)
- `Card`: Card 样式调整 @yilaierwang ([#1631](https://github.com/Tencent/tdesign-vue/pull/1631)) ([common#901](https://github.com/Tencent/tdesign-common/pull/901))
### 🐞 Bug Fixes
- `Form`:
  - Form 可以禁用 Select/Cascader/DatePicker，及其 `clearable` 属性 @Summer-Shen ([#1351](https://github.com/Tencent/tdesign-vue/pull/1351))
  - 调整 `requiredMark` 支持独立控制星号展示 @HQ-Lin ([#1606](https://github.com/Tencent/tdesign-vue/pull/1606))
- `Table`:
  - 筛选功能，`resetValue` 无效，[issue#1611](https://github.com/Tencent/tdesign-vue/issues/1611) @chaishi ([#1633](https://github.com/Tencent/tdesign-vue/pull/1633))
  - 表头吸顶功能，数据变化更新吸顶位置，[issue#1452](https://github.com/Tencent/tdesign-vue/issues/1452)
  - 修复配置吸底滚动条时，margin-top 造成遮挡到问题，[issue#1585](https://github.com/Tencent/tdesign-vue/issues/1585) @LoopZhou ([#1633](https://github.com/Tencent/tdesign-vue/pull/1633))
- `ImageViewer`: 修复 zIndex 默认值过低的问题 @sinbadmaster ([#1634](https://github.com/Tencent/tdesign-vue/pull/1634))
- `Datepicker`:
  - 修复范围选择器面板年份异常的问题 @sinbadmaster ([#1644](https://github.com/Tencent/tdesign-vue/pull/1644))
  - 修复范围选择器数据格式化异常的问题 @HQ-Lin ([#1613](https://github.com/Tencent/tdesign-vue/pull/1613))
- `Upload`: 只有多个上传请求同时触发时才需触发 onOneFileFail 回调 @xixileng ([#1652](https://github.com/Tencent/tdesign-vue/pull/1652))
- `Input`: 修复初始化或者赋值时，format 不生效的问题 @LoopZhou ([#1650](https://github.com/Tencent/tdesign-vue/pull/1650))

## 🌈 0.48.5 `2022-10-10` 
### 🚀 Features
- `Select`: 调整下拉交互 允许输入时不关闭下拉面板 减少相关交互问题 @uyarn ([#1600](https://github.com/Tencent/tdesign-vue/pull/1600))
- `Datepicker`: 支持 `valueType` 格式化日期用法 @HQ-Lin ([#1578](https://github.com/Tencent/tdesign-vue/pull/1578))
- `ImageViewer`: 移除额外的根元素 @sinbadmaster ([#1598](https://github.com/Tencent/tdesign-vue/pull/1598))
### 🐞 Bug Fixes
- `Upload`:
  - 修复 `upload` 导出预期外的变量导致组件注册时出现告警 @pengYYYYY ([#1583](https://github.com/Tencent/tdesign-vue/pull/1583))
  - 添加参数 `response` 到事件 `onSuccess`，单文件是对象，多文件是数组，[tdesign-vue-next#1774](https://github.com/Tencent/tdesign-vue-next/issues/1774) @chaishi ([#1584](https://github.com/Tencent/tdesign-vue/pull/1584))
- `TimePicker`: 关闭面板不再滚动 避免部分场景滚动未结束关闭面板继续滚动引发的问题 @uyarn ([#1590](https://github.com/Tencent/tdesign-vue/pull/1590))
- `Select`: value 参数类型检测报错修复，增加 value 传值异常流的控制台提示 @skytt ([#1574](https://github.com/Tencent/tdesign-vue/pull/1574))

## 🌈 0.48.4 `2022-09-28` 
### 🚀 Features
- `Upload`: 支持使用 ImageViewer 预览图片 @chaishi ([#1579](https://github.com/Tencent/tdesign-vue/pull/1579))
### 🐞 Bug Fixes
- `InputNumber`: 输入中文或特殊符号时，清空数字为 `undefined` @chaishi ([#1579](https://github.com/Tencent/tdesign-vue/pull/1579))
- `Upload`:
  - 请求支持带上自定义 `headers` @chaishi ([#1579](https://github.com/Tencent/tdesign-vue/pull/1579))
  - 请求支持带上 `withCredentials` @chaishi ([#1579](https://github.com/Tencent/tdesign-vue/pull/1579))

## 🌈 0.48.3 `2022-09-28` 
### 🚀 Features
- `ImageViewer`: 新增 `ImageViewer` 图片预览组件 @sinbadmaster ([#1520](https://github.com/Tencent/tdesign-vue/pull/1520))
- `Upload`: 组件重构 @chaishi ([#1561](https://github.com/Tencent/tdesign-vue/pull/1561))
  - ⚠️ `formatResponse` 不再对 `file` 对象进行格式化，仅处理 `response` 属性进行处理。如果要扩展 `file` 对象，请在 `onChange`
  - 新增`beforeAllFilesUpload`，所有文件上传之前执行，支持一次性判定所有文件是否继续上传。已经存在的 `beforeUpload` 用于判定单个文件的是否继续上传
  - 新增事件 `onValidate`，文件校验不通过时触发，可能情况有：自定义全文件校验不通过、文件数量校验不通过、文件数量校验不通过
  - 新增事件 `onOneFileSuccess` ，多文件上传场景下，在单个文件上传成功后触发
  - `beforeUpload` 存在时，依然支持 `sizeLimit` 检测
  - `formatRequest` 用于新增或修改上传请求参数
  - 一个请求上传多个文件时，参数携带全部文件
  - 新增 `triggerButtonProps` 用于指定触发按钮风格
- `Table`: @chaishi ([#1562](https://github.com/Tencent/tdesign-vue/pull/1562))
  - 支持属性 `tree.treeNodeColumnIndex` 动态修改， [tdesign-vue-next#1487](https://github.com/Tencent/tdesign-vue-next/issues/1487)
  - `Table`: 新增 `showHeader`，支持隐藏表头 @chaishi ([#1562](https://github.com/Tencent/tdesign-vue/pull/1562))
  - `Table`: 新增 `column.colKey = serial-number`，支持序号列功能 @chaishi ([#1562](https://github.com/Tencent/tdesign-vue/pull/1562))
  - `Table`: 新增 `showSortColumnBgColor`，用于控制是否显示排序列背景色 @chaishi ([#1562](https://github.com/Tencent/tdesign-vue/pull/1562))
### 🐞 Bug Fixes
- `Select`: @skytt ([#1566](https://github.com/Tencent/tdesign-vue/pull/1566))
  - 修复可创建新条目场景下回车选择错误的问题(#1563 )
  - 修复创建条目和选中已有条目同时触发的问题
  - 完善键盘事件, 创建的新条目可通过键盘选择
- `Table`: @chaishi ([#1562](https://github.com/Tencent/tdesign-vue/pull/1562))
  - 树形结构，叶子节点缩进距离修正
  - 超出省略功能，`ellipsisTitle`优先级应当高于 `ellipsis`， [issue#1404](https://github.com/Tencent/tdesign-vue/issues/1404)
  - 行选中功能，修复 `column.type=single` 时，`column.title` 无效问题，[issue#1372](https://github.com/Tencent/tdesign-vue/issues/1372)
  - 过滤功能，`list.value` 值为 `number` 无法高亮过滤图标问题 @chaishi ([#1562](https://github.com/Tencent/tdesign-vue/pull/1562))
  - 行选中功能，数据变化时，选中的数据依旧是变化前的数据，[tdesign-vue-nex#1722](https://github.com/Tencent/tdesign-vue-next/issues/1722)
  - 不提供`expandedRowKeys`的绑定会报错 ，缺少判空，[tdesign-vue-nex#1704](https://github.com/Tencent/tdesign-vue-next/issues/1704) @chaishi ([#1562](https://github.com/Tencent/tdesign-vue/pull/1562))
  - 修复视图切换或表格变化的场景下 吸顶吸底效果没有重新渲染计算的问题 [issue#1529](https://github.com/Tencent/tdesign-vue/issues/1529) @uyarn ([#1570](https://github.com/Tencent/tdesign-vue/pull/1570))
- `DatePicker`:
  - 修复手动清空输入框关闭弹窗没有重置数据问题 @HQ-Lin ([#1565](https://github.com/Tencent/tdesign-vue/pull/1565))
  - 修复 `disableDate` 传入 lambda 函数被频繁触发的问题 @HQ-Lin ([#1569](https://github.com/Tencent/tdesign-vue/pull/1569))
- `TimePicker`: 修复部分场景 `style` 属性内的 token 缺失导致滚动异常的问题 @uyarn ([common#877](https://github.com/Tencent/tdesign-common/pull/877))
### 🚧 Others
- `Swiper`: 修复组件的 demo 显示不正确问题 @yusongH ([#1557](https://github.com/Tencent/tdesign-vue/pull/1557))
- `TimePicker`: 调整 TimePicker 底部边距及点击动画 @wanghanzhen ([#1558](https://github.com/Tencent/tdesign-vue/pull/1558))

## 🌈 0.48.2 `2022-09-23` 
### 🐞 Bug Fixes
- `Swiper`: 修复active类名问题导致的样式异常 @sechi747 ([#1552](https://github.com/Tencent/tdesign-vue/pull/1552))
- `Upload`: 修复sizeLimit计算错误的问题 @uyarn ([#1553](https://github.com/Tencent/tdesign-vue/pull/1553))
- `TreeSelect` 优化 padding 样式 @fenbitou ([#1539](https://github.com/Tencent/tdesign-vue/pull/1539))


## 🌈 0.48.1 `2022-09-22` 
### 🐞 Bug Fixes
- `Table`
    - 修复初始化获取数据，吸底滚动条位置计算不正确问题 @LoopZhou ([#1546](https://github.com/Tencent/tdesign-vue/pull/1546))
    - 处理不存在分页吸底和滚动条吸底的表格控制台报错的问题 @uyarn ([#1550](https://github.com/Tencent/tdesign-vue/pull/1550))
### 🚧 Others
- `Dropdown`: Dropdown组件添加单元测试 @james-curtis ([#1516](https://github.com/Tencent/tdesign-vue/pull/1516))
- `Collapse`: Collapse组件添加单元测试 @isanxia ([#1536](https://github.com/Tencent/tdesign-vue/pull/1536))

## 🌈 0.48.0 `2022-09-21` 
### ❗ Breaking Changes
- `DatePicker`: 移除 `valueType` api，可使用返回的 dayjs 对象自行格式化 @HQ-Lin ([#1510](https://github.com/Tencent/tdesign-vue/pull/1510))

### 🚀 Features
- `Table`: 新增 column.resizable 支持自定义任意列是否可拖拽调整宽度 @ZTao-z ([#1523](https://github.com/Tencent/tdesign-vue/pull/1523))
- `Message`: `Message` 新增 `onClose` 事件 @zhangpaopao0609 ([#1467](https://github.com/Tencent/tdesign-vue/pull/1467))
- `Rate`: 新增`Rate`评分组件 @Yilun-Sun ([#1462](https://github.com/Tencent/tdesign-vue/pull/1462))
- `DatePicker`: 交互优化，二次修改日期不规范时清空另一侧数据 @HQ-Lin ([#1521](https://github.com/Tencent/tdesign-vue/pull/1521))

### 🐞 Bug Fixes
- `Steps`: 步骤条demo错误 @Micro-sun ([#1515](https://github.com/Tencent/tdesign-vue/pull/1515))
- `jumper`: 修复 tips props 类型缺失 @HelKyle ([#1511](https://github.com/Tencent/tdesign-vue/pull/1511))
- `Demos`: 修复 `select-input` 示例展示 ([issue #1640](https://github.com/Tencent/tdesign-vue-next/issues/1640)) ([issue #1641](https://github.com/Tencent/tdesign-vue-next/issues/1641)) @pengYYYYY ([#1514](https://github.com/Tencent/tdesign-vue/pull/1514))
- `Icon`: 修复修改prefix替换组件前缀对图标的影响 [#common842](https://github.com/Tencent/tdesign-common/pull/842) @uyarn ([#1531](https://github.com/Tencent/tdesign-vue/pull/1531))
- `Table`
    - 修复数据变化时 分页吸底位置没有变化的问题 @uyarn ([#1528](https://github.com/Tencent/tdesign-vue/pull/1528))
    - 修复数据变化时,吸底滚动条位置没有变化的问题 @LoopZhou ([#1535](https://github.com/Tencent/tdesign-vue/pull/1535))
    - 修复分页操作会触发两次 onPageChange 的问题 @yusongH ([#1535](https://github.com/Tencent/tdesign-vue/pull/1535))
- `TimePicker`: 修复部分场景滚动异常无法选中23:59:59的问题 @uyarn ([#1534](https://github.com/Tencent/tdesign-vue/pull/1534))
- `InputNumber`: 处理0比较的异常 [#common850](https://github.com/Tencent/tdesign-common/pull/850) @uyarn ([#1530](https://github.com/Tencent/tdesign-vue/pull/1530))
- `Swiper`: 
   - 修复鼠标悬停移出后没有重新轮播问题 @yusongH ([#1540](https://github.com/Tencent/tdesign-vue/pull/1540))
   - 修复`trigger`属性不生效问题  @yusongH ([#1540](https://github.com/Tencent/tdesign-vue/pull/1540))
   - 修复鼠标悬停移出后没有重新轮播问题 @yusongH ([#1540](https://github.com/Tencent/tdesign-vue/pull/1540))
- `Collapse`: 增加节点和类名处理IE样式 @huangpiqiao ([#1530](https://github.com/Tencent/tdesign-vue/pull/1530))
- 修复默认导入引用文件缺失问题 @HQ-Lin ([#1519](https://github.com/Tencent/tdesign-vue/pull/1519))
- `Input`: 修复默认状态提示文字颜色错误问题 @xiaosansiji ([#1508](https://github.com/Tencent/tdesign-vue/pull/1508))

### 🚧 Others
- `Jumper`: 补充`Jumper`单元测试 @HelKyle ([#1511](https://github.com/Tencent/tdesign-vue/pull/1511))
- `Pagination`: 增加 pagination 单元测试 @HelKyle ([#1522](https://github.com/Tencent/tdesign-vue/pull/1522))

## 🌈 0.47.0 `2022-09-14` 
### ❗ Breaking Changes
- 支持 `es module` 导出不带样式产物，调整 lib 包内容，新增 `cjs` 产物支持 `commonjs` 导出不带样式产物 @HQ-Lin ([#1493](https://github.com/Tencent/tdesign-vue/pull/1493))
### 🚀 Features
- `DatePicker`: @HQ-Lin
  - 支持二次更改时间选择器时可单次变更日期 ([#1498](https://github.com/Tencent/tdesign-vue/pull/1498))
  - 默认时间调整成 00:00:00 [#1500](https://github.com/Tencent/tdesign-vue/pull/1500))
- `Image`: 新增 Image 图片组件 @insekkei ([#1503](https://github.com/Tencent/tdesign-vue/pull/1503))
### 🐞 Bug Fixes
- `Tabs`: 修复替换 `classPrefix` 时组件渲染异常的问题 @uyarn ([#1494](https://github.com/Tencent/tdesign-vue/pull/1494))
- `Upload`: 修复在 `wujie` 环境中，部分按钮会触发两次的问题 @chaishi ([#1502](https://github.com/Tencent/tdesign-vue/pull/1502))
- `TimePicker`: 修复往前点击时间时滚动异常的问题 @uyarn ([#1499](https://github.com/Tencent/tdesign-vue/pull/1499))
- `DatePicker`: 修复 `cell-click` 返回日期错误 @HQ-Lin ([#1490](https://github.com/Tencent/tdesign-vue/pull/1490))

## 🌈 0.46.4 `2022-09-07` 
### 🚀 Features
- `Popup`: 新增 `delay` 属性用于控制延时显示或隐藏浮层，修复子 Popup 销毁时父级意外关闭的问题 @ikeq ([#1436](https://github.com/Tencent/tdesign-vue/pull/1436))
- `Table`: @chaishi ([#1454](https://github.com/Tencent/tdesign-vue/pull/1454))
  - 树形结构，新增 `getTreeExpandedRow`，用于获取展开的树形节点
  - 可编辑单元格，`edit.rules` 新增数据类型 `function`，用于动态设置校验规则，[tdesign-vue-next#1472](https://github.com/Tencent/tdesign-vue-next/issues/1472)
- `DaterPicker`: 区间日期选择时，联动开始/结束时间面板月份选择，防止出现两个面板均在同一月份的情况 ([issue #1469](https://github.com/Tencent/tdesign-vue/issues/1469)) @simpleAndElegant ([#1470](https://github.com/Tencent/tdesign-vue/pull/1470))
- `TimePicker`: 支持带快捷标签 @chiyu1996 ([#1407](https://github.com/Tencent/tdesign-vue/pull/1407))
- 官网：在线主题器支持全局圆角配置 @uyarn ([#1459](https://github.com/Tencent/tdesign-vue/pull/1459))
### 🐞 Bug Fixes
- `Select`:
  - 修复 creatable 模式下的 filter 能力 @skytt ([#1427](https://github.com/Tencent/tdesign-vue/pull/1427))
  - 修复过滤掉数据后上下键仍可以选择过滤外的数据的问题 @sechi747 ([#1434](https://github.com/Tencent/tdesign-vue/pull/1434))
- `Button`: 区分 `loading` 和 `disabled` 状态，修复幽灵按钮 loading 状态背景色 @DevinXian ([#1432](https://github.com/Tencent/tdesign-vue/pull/1432))
- `Popup`: 修复overlayInnerClassName丢失的问题 @ikeq ([#1442](https://github.com/Tencent/tdesign-vue/pull/1442))
- `Table`:
  - 修复列宽调整时宽度计算错误的问题 @ZTao-z ([#1456](https://github.com/Tencent/tdesign-vue/pull/1456))
  - 修复 `onColumnControllerVisibleChange` 的 `trigger` 参数返回错误的问题 @sechi747 ([#1456](https://github.com/Tencent/tdesign-vue/pull/1480))
  - 修复列在设置 `type = multiple` 时，设置 `className` 不起作用的问题 @RainyLiao ([#1441](https://github.com/Tencent/tdesign-vue/pull/1441))
  - 修复表格部分元素无法随 Table 变化而改变的问题，如：空数据等，[tdesign-react#1319](https://github.com/Tencent/tdesign-react/issues/1319) @chaishi ([#1454](https://github.com/Tencent/tdesign-vue/pull/1454))
- `Cascader`: @pengYYYYY ([#1457](https://github.com/Tencent/tdesign-vue/pull/1457))
  - 修复 `loadingText` 无效 ([vue-next #1555](https://github.com/Tencent/tdesign-vue-next/issues/1555))
  - 修复 `value` 为 `number` 类型时有告警的问题 ([vue-next #1570](https://github.com/Tencent/tdesign-vue-next/issues/1570))
  - 修复在输入时 `entry` 键会默认全选第一个选项的全部内容 ([vue-next #1529](https://github.com/Tencent/tdesign-vue-next/issues/1529))
  - 修复通过 `SelectInputProps`  透传方法属性导致传入 `SelectInput` 的数据变成的数组 ([vue-next #1502](https://github.com/Tencent/tdesign-vue-next/issues/1502))
  - 修复 `ellipsisTitle` 配置优先级低于 `ellipsis` 的问题 @Tomaolala ([#1408](https://github.com/Tencent/tdesign-vue/pull/1408))
- `SelectInput`: 修复多选清除无效导致 `Cascader` 点击清除按钮表现异常的问题 @pengYYYYY ([#1457](https://github.com/Tencent/tdesign-vue/pull/1457))
- `Watermark`: 修复 `removable` 属性设置不生效，及 `content` 不支持动态修改变化的问题 @carolin913 ([#1473](https://github.com/Tencent/tdesign-vue/pull/1473))
- `Input/Textarea`: 修正 emoji 类字符 length 计算的问题 @HelKyle ([#1411](https://github.com/Tencent/tdesign-vue/pull/1411))
- `TimePicker`: 修复部分设备滚动边界的跳动异常 ([issue #1012](https://github.com/Tencent/tdesign-vue-next/issues/1012)) @uyarn ([#1475](https://github.com/Tencent/tdesign-vue/pull/1475))
- `Dialog`: 修复插件调用时丢失淡入动画的问题 @sechi747 ([#1423](https://github.com/Tencent/tdesign-vue/pull/1423))
- `Tree`: 父节点 `disable` 时不允许选中但允许展开 @uyarn ([#1476](https://github.com/Tencent/tdesign-vue/pull/1476)) ([#1483](https://github.com/Tencent/tdesign-vue/pull/1483))
- `TreeSelect`: 修复数字类型的value时控制台报错的异常 @uyarn ([#1476](https://github.com/Tencent/tdesign-vue/pull/1476))
- `Form`: 修复 `labelAlign = top` 时，FormItem label 为空还会占据空间的问题 @ojhaywood ([#1438](https://github.com/Tencent/tdesign-vue/pull/1438))
- `Button`: 修复幽灵按钮 loading 状态背景色 @DevinXian ([#1432](https://github.com/Tencent/tdesign-vue/pull/1432))
- `DatePicker`:
  - 修复 `cell-click` 事件 `partial` 字段错误 @HQ-Lin ([#1440](https://github.com/Tencent/tdesign-vue/pull/1440))
  - 修复 `value` 为空字符串时导致页面崩溃的问题 @HQ-Lin ([#1453](https://github.com/Tencent/tdesign-vue/pull/1453))

## 🌈 0.46.3 `2022-08-31` 
### 🚀 Features
- `Grid`: `align` 可选值新增 `start/end/center`，修复 `justify`和 `align` 同为 `center` 属性冲突问题 @Micro-sun ([#1359](https://github.com/Tencent/tdesign-vue/pull/1359))
- `Notification`: 鼠标移入时不会关闭通知 @sechi747 ([#1366](https://github.com/Tencent/tdesign-vue/pull/1366))
- `Cascader`: CascaderPanel 点击选项时派发 `click` 事件 @luwuer ([#1396](https://github.com/Tencent/tdesign-vue/pull/1396))
- `Table`: 文本超出提示由 `Popup` 更为 `Tooltip`，以便于定制各种提示文本主题色 @PDieE ([#1365](https://github.com/Tencent/tdesign-vue/pull/1365))
- `Input`: 优化 `clearable` 按钮显示逻辑，区分 `password` 输入框 @PDieE ([#1415](https://github.com/Tencent/tdesign-vue/pull/1415))
- `Popconfirm/Table` 组件样式优化 @zhangpaopao0609 ([#1388](https://github.com/Tencent/tdesign-vue/pull/1388))
- `Watermark`: 新增`Watermark` 水印组件 @samhou1988 ([#1347](https://github.com/Tencent/tdesign-vue/pull/1347))
### 🐞 Bug Fixes
- `useModel`:  兼容因 `v-model` 初始值为 `undefined` 导致 `useModel` 失效的问题 @zhangpaopao0609 ([#1363](https://github.com/Tencent/tdesign-vue/pull/1363))
- `Table`:
  - 修复 `editableCellState` 表现与预期相反的问题 @sechi747 ([#1367](https://github.com/Tencent/tdesign-vue/pull/1367))
  - 修复多级表头下不支持调整列宽的问题 @ZTao-z ([#1395](https://github.com/Tencent/tdesign-vue/pull/1395))
- `Select`: 去除组件注册时的 map props @skytt ([#1399](https://github.com/Tencent/tdesign-vue/pull/1399))
- `InputNumber`: 修复 `string/number` 类型比较错误及其导致的分页组件样式异常的问题 [common#784](https://github.com/Tencent/tdesign-common/pull/784) @uyarn ([#1413](https://github.com/Tencent/tdesign-vue/pull/1413))
- `DatePicker`: @HQ-Lin 
  - 优化不设置 valueType 场景下与 format 表现一致 ([#1398](https://github.com/Tencent/tdesign-vue/pull/1398))
  - 修复左右面板切换错位问题 ([#1400](https://github.com/Tencent/tdesign-vue/pull/1400))
  - 修复 `cell-click` 事件失效问题 ([#1420](https://github.com/Tencent/tdesign-vue/pull/1420))
  - 修复 `panel-click` 事件失效问题 ([#1421](https://github.com/Tencent/tdesign-vue/pull/1421))
- `Calendar`: 优化组件事件设置示例 @PsTiu ([#1405](https://github.com/Tencent/tdesign-vue/pull/1405))
- `Upload`:  修复`theme`为`flow-list`时 remove事件file参数丢失的问题 @uyarn ([#1430](https://github.com/Tencent/tdesign-vue/pull/1430))

## 🌈 0.46.2 `2022-08-24` 
### 🚀 Features
- `Table`: @chaishi ([#1341](https://github.com/Tencent/tdesign-vue/pull/1341))
  - 支持行拖拽排序和列拖拽排序同时存在，[issue#1290](https://github.com/Tencent/tdesign-vue/issues/1290)
  - 可编辑单元格/行功能，新增 `editableCellState` 用于控制单元格是否可编辑，[issue#1387](https://github.com/Tencent/tdesign-vue-next/issues/1387)
  - 可编辑单元格/行功能，新增 `edit.defaultEditable` 用于设置初始状态是否为编辑态
  - 行展开功能，新增事件参数 `currentRowData`，表示当前展开行
  - 多级表头的拖拽排序，表头的任意层级调整影响较大，需求面较小，完善拖拽事件参数，业务侧根据参数自由调整自己想要的表头关系，[issue#1177](https://github.com/Tencent/tdesign-vue/issues/1177)
- `Select`: @skytt ([#1318](https://github.com/Tencent/tdesign-vue/pull/1318))
  - 远程搜索场景增加 label 回显能力
  - 调整loading态显示优先于empty属性
- Dialog: @huoyuhao ([#1325](https://github.com/Tencent/tdesign-vue/pull/1325))
  - 支持回车键确认弹框，`onConfirm` 事件参数 `e` 或为键盘事件
  - 支持多个弹框同时存在时，通过 `ESC` 键盘逐个关闭
  - `confirmBtn` 支持数据类型 `null`
- `Collapse/Comment/Cascader`: 组件样式优化 [issue#155](https://github.com/Tencent/tdesign/issues/155)、[issue#152](https://github.com/Tencent/tdesign/issues/152)、[issue#145](https://github.com/Tencent/tdesign/issues/145) @zhangpaopao0609 ([#1322](https://github.com/Tencent/tdesign-vue/pull/1322))
-  `Upload`:  `locale` API 支持upload组件全部文案的配置 @uyarn ([#1362](https://github.com/Tencent/tdesign-vue/pull/1362))
### 🐞 Bug Fixes
- `Drawer`: 修复拖拽改变抽屉高度时可超出屏幕的问题 @sechi747 ([#1330](https://github.com/Tencent/tdesign-vue/pull/1330))
- `Table`:
  - 修复可编辑行，联动数据校验问题，([issue#1444](https://github.com/Tencent/tdesign-vue-next/issues/1444)) @chaishi ([#1341](https://github.com/Tencent/tdesign-vue/pull/1341))
  - 允许在表头分割线一定范围内触发列宽调整逻辑 @ZTao-z ([#1337](https://github.com/Tencent/tdesign-vue/pull/1337))
  - 修复行选中功能，多选，分页数据异步加载，`onSelectChange` 参数 `selectedRowData` 数据不完整问题 @chaishi ([#1341](https://github.com/Tencent/tdesign-vue/pull/1341))
- `Cascader`: @pengYYYYY ([#1345](https://github.com/Tencent/tdesign-vue/pull/1345))
  - 修复异步获取 `options` 后的懒加载无效 ([issue #1448](https://github.com/Tencent/tdesign-vue-next/issues/1448)) ([issue #1223](https://github.com/Tencent/tdesign-vue/issues/1223))
  - 修复 `value` 不是 options 的健值会报错的问题 ([issue #1293](https://github.com/Tencent/tdesign-react/issues/1293))
- `Menu`: 修复侧边栏弹出子菜单宽度计算错误的问题 @xiaosansiji ([#1357](https://github.com/Tencent/tdesign-vue/pull/1357))
- `Drawer`: 修复拖拽改变抽屉高度时可超出屏幕的问题 @sechi747 ([#1330](https://github.com/Tencent/tdesign-vue/pull/1330))
- `upload`: @uyarn ([#1362](https://github.com/Tencent/tdesign-vue/pull/1362))
   -  修复`displayFileList` slot失效的问题
   - 修复`theme`为`file`时，onRemove回调没有返回file的问题
   - 修复`theme`为`file`，删除文案不可配置的问题


## 🌈 0.46.1 `2022-08-18` 
### 🚀 Features
- `ConfigProvider`: 支持自定义全局 `icon` @zhangpaopao0609 
- `Button`: 支持 href 和 tag 属性 @zhangpaopao0609 
### 🐞 Bug Fixes
- `Table`
    - 修复吸顶表头末尾有 1px 未对齐的问题 @chaishi 
    - 固定列阴影样式不能随窗口放大缩小而变化 @chaishi 
- `Select`: 优化部分样式 @guoaihua
- `Tree`: 修复expandOnClickNode下点击tree的label会触发checkbox选中的问题 @uyarn 
- `Dropdown`: 修复控制台告警 @uyarn 


## 🌈 0.46.0 `2022-08-16` 

### ❗️ BREAKING CHANGES
- `Popup`: `overlayStyle` 调整为控制 `t-popup` 层级，新增 `overlayInnerStyle` 控制 `t-popup__content` 层级与原先 `overlayStyle` 效果一致 @HQ-Lin ([#1270](https://github.com/Tencent/tdesign-vue/pull/1270))
- `Input/InputNumber`: 错误文本提示，不再占普通用文档流；内置的 input 组件 ref 名称由 `refInputElem` 更为 `inputRef` @chaishi ([#1302](https://github.com/Tencent/tdesign-vue/pull/1302))
### 🚀 Features
- `Table`: @chaishi
  - `footerSummary` 支持通过 Props 属性传入 ([#1265](https://github.com/Tencent/tdesign-vue/pull/1265))
  - 可编辑行功能，校验函数 validateRowData 和 validateTableData 返回值支持 Promise 对象 ([#1275](https://github.com/Tencent/tdesign-vue/pull/1275))
- `Datepicker`: @HQ-Lin 
  - 区间选择器结束时间调整为默认展示当天最后一秒([#1288](https://github.com/Tencent/tdesign-vue/pull/1288))
  - 支持季度国际化配置 ([#1267](https://github.com/Tencent/tdesign-vue/pull/1267))
- `ConfigProvider`: 支持通过ConfigProvider修改全部组件的classPrefix @uyarn ([#1287](https://github.com/Tencent/tdesign-vue/pull/1287))
- `Selectinput`: disabled 状态下自动禁止 clearable 功能 @LoopZhou ([#1291](https://github.com/Tencent/tdesign-vue/pull/1291))
- `InputNumber`: @chaishi ([#1302](https://github.com/Tencent/tdesign-vue/pull/1302))
  - 支持超过 16 位的大数
  - 支持 `decimal` 和 `format` 组合使用，即 `format` 新增第二个参数小数点格式化之后的值，方便大数场景应用
  - 新增事件 `onValidate`，当数值超过最大值或小于最小值时触发，可用于显示错误提示文本
  - 错误提示文本区域支持左侧对齐和输入框对齐两种方式， [issue#1229](https://github.com/Tencent/tdesign-vue/issues/1229)
  - 修复在输入数值不满足条件时，没有触发 onChange 事件问题；修复计算过程中的精度问题
- `Link`: 新增 Link 链接组件 @huoyuhao ([#1282](https://github.com/Tencent/tdesign-vue/pull/1282))
- `Icon`: 新增 qq、wechat、wecom、relativity 和 pin-filled 等图标 @uyarn ([#1303](https://github.com/Tencent/tdesign-vue/pull/1303))
### 🐞 Bug Fixes
- `Table`:
  - 可编辑单元格，多选和日期选择，点击下拉浮层中的内容会导致退出编辑，[issue#1384](https://github.com/Tencent/tdesign-vue-next/issues/1384) @chaishi ([#1275](https://github.com/Tencent/tdesign-vue/pull/1275))
  - 宽度计算函数添加注释 @ZTao-z ([#1286](https://github.com/Tencent/tdesign-vue/pull/1286))
- `Popup`: 修复嵌套使用点击 trigger 元素时异常关闭 @ikeq ([#1285](https://github.com/Tencent/tdesign-vue/pull/1285))
- `Datepicker`: 修复时间面板展示错误 @HQ-Lin ([#1288](https://github.com/Tencent/tdesign-vue/pull/1288))
- `umd`: 修复 umd 版本的使用问题，具体使用方式请参考`浏览器引入`相关文档说明 @uyarn ([#1292](https://github.com/Tencent/tdesign-vue/pull/1292))
- `Tree`: 修复`expandOnClickNode`点击展开与checkbox点击选中的冲突问题 @uyarn ([#1299](https://github.com/Tencent/tdesign-vue/pull/1299))
- `ColorPicker`: 修复切换模式卡死问题; 修复 panel 下模式 `change` 事件无法触发的问题 @S-mohan ([#1274](https://github.com/Tencent/tdesign-vue/pull/1274))
- `DatePicker`: @HQ-Lin
  - 修复输入框有值时面板切换失效问题 ([#1293](https://github.com/Tencent/tdesign-vue/pull/1293))
  - 修复 suffixIcon slot 写法失效问题 ([#1280](https://github.com/Tencent/tdesign-vue/pull/1280))

## 🌈 0.45.2 `2022-08-09` 
### 🚀 Features
- `Pagination`: 极简模式下合并快速跳转与页码跳转控制器 @HQ-Lin ([#1256](https://github.com/Tencent/tdesign-vue/pull/1256))
- `DatePicker`: 支持周、季度选择器 @HQ-Lin ([#1245](https://github.com/Tencent/tdesign-vue/pull/1245))
- `Table`
   - 新增 `cellEmptyContent`，当列数据为空时显示指定值  @chaishi ([#1254](https://github.com/Tencent/tdesign-vue/pull/1254))
   - 可编辑行功能，新增实例方法 `validate`，支持校验表格内的全部数据 @chaishi ([#1254](https://github.com/Tencent/tdesign-vue/pull/1254))
- 主题生成器新增字体配置面板 @uyarn ([#1259](https://github.com/Tencent/tdesign-vue/pull/1259))
- 新增字体相关CSS Token，支持通过CSS Token修改字体相关配置 具体请参考 [font tokens](https://github.com/Tencent/tdesign-common/blob/develop/style/web/theme/_font.less) @uyarn ([#1259](https://github.com/Tencent/tdesign-vue/pull/1259))
### 🐞 Bug Fixes
- `ColorPicker`: 优化组件样式 @S-mohan ([#1250](https://github.com/Tencent/tdesign-vue/pull/1250))
- `Select`
  - 修复开启虚拟滚动配合自定义面板使用卡顿的问题 @skytt ([#1247](https://github.com/Tencent/tdesign-vue/pull/1247))
  - 修复使用 `t-option` 自定义选项无法动态筛选问题 @skytt ([#1247](https://github.com/Tencent/tdesign-vue/pull/1247))
  - 修复 `t-option` 配合远程搜索使用异常的问题 @skytt ([#1247](https://github.com/Tencent/tdesign-vue/pull/1247))
  - 修复 `empty` 与 `loadingText` 在传参为 `string` 类型时，包裹元素消失的问题 @skytt ([#1247](https://github.com/Tencent/tdesign-vue/pull/1247))
  - 修复 `loadingText` slot 失效的问题 @skytt ([#1247](https://github.com/Tencent/tdesign-vue/pull/1247))
  - 处理 group-option 下 style 和 class 的透传 @skytt ([#1258](https://github.com/Tencent/tdesign-vue/pull/1258))
- `Table`
  - 可编辑行功能，提交校验时只校验了第一列 @chaishi ([#1254](https://github.com/Tencent/tdesign-vue/pull/1254))
  - 可编辑单元格功能，`abortEditOnEvent` 中的事件无法触发`onEdited`，[issue#1188](https://github.com/Tencent/tdesign-vue/issues/1188) @chaishi ([#1254](https://github.com/Tencent/tdesign-vue/pull/1254))
  - 列配置功能，带边框模式，移除分页组件边框下方多余的边框 @chaishi ([#1254](https://github.com/Tencent/tdesign-vue/pull/1254))
  - 修复深色模式下垂直和水平方向滚动条交汇处出现白点的样式问题 by @RayJason ([#1259](https://github.com/Tencent/tdesign-vue/pull/1259))


## 🌈 0.45.1 `2022-08-03` 

### ❗️ BREAKING CHANGES
- 调整全局 `border-radius` 样式 token，`@border-radius` 改名为 `@border-radius-default`，支持更多圆角 token。 使用 esm 包修改 less token 的业务需要注意 @mingrutough1 [common #666](https://github.com/Tencent/tdesign-common/pull/666)，组件库中各组件实现圆角也做了统一调整，详情参见 https://github.com/Tencent/tdesign/discussions/158

### 🚀 Features
- `SelectInput`: SelectInput 及相关的 Select/Cascader/TreeSelect 组件交互调整，再次点击输入框时也可以收起下拉框 @xiaosansiji ([#1215](https://github.com/Tencent/tdesign-vue/pull/1215))
- `Table`: @chaishi ([#1217](https://github.com/Tencent/tdesign-vue/pull/1217))
  - 支持使用插槽 `footer-summary` 定义通栏表尾，同时支持同名属性 Props `footer-summary` 渲染通栏表尾
  - 支持使用 `rowspanAndColspanInFooter` 定义表尾行数据合并单元格，使用方法同 `rowspanAndColspan`
  - 支持 `min-width` 透传到元素 `<col>`，[issues#708]
### 🐞 Bug Fixes
- `Select`: 修复 `empty` slot 用法不生效的问题 @xiaosansiji ([#1214](https://github.com/Tencent/tdesign-vue/pull/1214))
- `Table`: @chaishi ([#1216](https://github.com/Tencent/tdesign-vue/pull/1216))
  - 树形结构，修复无法更新或重置数据问题 `resetData`
  - 树形结构，修复懒加载节点重置时（即调用 setData）没有清空子节点信息问题
  - 树形结构，展开全部功能，不应该展开懒加载节点
  - 修复吸顶的多级表头左侧边线缺失问题
  - 修复多级表头时，表尾显示不同步的问题，[issue#1149](https://github.com/Tencent/tdesign-vue/issues/1149)
  - 列拖动后，选择行导致拖动后的距离被重置 @LoopZhou ([#1224](https://github.com/Tencent/tdesign-vue/pull/1224))
- `Datepicker`: 修复单独配置 clearable 失效问题 @HQ-Lin ([#1209](https://github.com/Tencent/tdesign-vue/pull/1209))
- `TreeSelect`: 修复输入项过长时，操作区域图标被遮挡的问题 @Godlike-meteor ([#1211](https://github.com/Tencent/tdesign-vue/pull/1211))
- `Cascader`: 修复在异步获取 option 的情况下，参数校验导致用户行为异常的问题 @pengYYYYY ([#1228](https://github.com/Tencent/tdesign-vue/pull/1228))

## 🌈 0.44.1 `2022-07-25` 
### 🚀 Features
- 支持通过CSS Token配置组件圆角 @mingrutough1 ([common#648](https://github.com/Tencent/tdesign-common/pull/648))

### 🐞 Bug Fixes
- `DatePicker`:
  - 修复重置日期后面板月份未重置问题 @HQ-Lin ([#1190](https://github.com/Tencent/tdesign-vue/pull/1190))
  - 修复时间选择器滚动错误@HQ-Lin ([#1194](https://github.com/Tencent/tdesign-vue/pull/1194))
- `Dialog`:
  - 修复 `preventScrollThrough` 未实现的问题 @huoyuhao ([#1150](https://github.com/Tencent/tdesign-vue/pull/1150))
  - 修复出现对于滚动条的问题 @huoyuhao ([#1199](https://github.com/Tencent/tdesign-vue/pull/1199))

## 🌈 0.44.0 `2022-07-18` 
### ❗️ BREAKING CHANGES
- `DatePicker`: 部分样式类命名调整，更符合 BEM 规范，如有覆盖日期选择器样式的小伙伴请注意调整，其他同学可以忽略 @HQ-Lin ([#1180](https://github.com/Tencent/tdesign-vue/pull/1180/files)
### 🚀 Features
- `Jumper`: 新增 jumper 组件 @HQ-Lin ([#1086](https://github.com/Tencent/tdesign-vue/pull/1086))
- `Icon`: 新增`mirror`和`rotation`图标 @uyarn ([#1164](https://github.com/Tencent/tdesign-vue/pull/1164))
- `DatePicker`: 支持面板年月动态响应 value 变化 @HQ-Lin ([#1166](https://github.com/Tencent/tdesign-vue/pull/1166))
- `Table`:
  - 树形结构支持同时添加多个根节点 @chaishi ([#1176](https://github.com/Tencent/tdesign-vue/pull/1176))
  - 新增可编辑行的表格；新增 showEditIcon，用于控制是否显示编辑图标 @chaishi ([#1182](https://github.com/Tencent/tdesign-vue/pull/1182))
### 🐞 Bug Fixes
- `SelectInput`: 修复透传 disabled 失效问题 @HQ-Lin ([#1159](https://github.com/Tencent/tdesign-vue/pull/1159))
- `Icon`: 修复 iconfont 高级用法由于 `t-icon的` 干扰导致渲染异常的情况 @uyarn ([#1164](https://github.com/Tencent/tdesign-vue/pull/1164))
- `Select`:
  - 修复 `panelTopContent`、`panelBottomContent` 透传失效的问题 @HQ-Lin ([#1165](https://github.com/Tencent/tdesign-vue/pull/1165))
  - 修复监听事件未正常移除的问题（issue#1170） @skytt ([#1187](https://github.com/Tencent/tdesign-vue/pull/1187))
  - 修复 keys 透传失效导致 multiple 场景下 keys 无效的问题 @skytt ([#1184](https://github.com/Tencent/tdesign-vue/pull/1184))
- `Table`: 
  - 修复多级表头表格中，列配置全选功能选不全的问题 @LoopZhou ([#1167](https://github.com/Tencent/tdesign-vue/pull/1167))
  - 修复可选中行 `table` 组件，`data` 为空数据时，默认全选按钮会选中的问题 @qdzhaoxiaodao ([#1172](https://github.com/Tencent/tdesign-vue/pull/1172))
  - 兼容IE滚动条高度计算覆盖不全问题 @brianzhang ([#1171](https://github.com/Tencent/tdesign-vue/pull/1171))
  - 修复树形结构懒加载顺序问题，[issue#1122](https://github.com/Tencent/tdesign-vue-next/issues/1122) @chaishi ([#1176](https://github.com/Tencent/tdesign-vue/pull/1176))
  - 可编辑单元格，修复 `onEnter` 无法触发 `onEdited` 问题；修复校验不通过时，无法退出编辑态的问题 @chaishi ([#1182](https://github.com/Tencent/tdesign-vue/pull/1182))
  - 修复表格列宽拖拽到最大或最小时，有可能无法二次拖拽的问题 @tinna3445 ([#1157](https://github.com/Tencent/tdesign-vue/pull/1157))

## 🌈 0.43.3 `2022-07-11` 
### 🚀 Features
- `Cascader`: @pengYYYYY ([#1074](https://github.com/Tencent/tdesign-vue/pull/1074))
  - 基于 `select-input` 重构, 文本过长省略使用原生 title 展示全文本，不再使用 `tooltip` 组件
  - 增加 `popupVisible`， `readonly`， `selectInputProps`， `onPopupVisibleChange` 属性
- `CheckBox`: 增加 `title` 属性透传  @pengYYYYY ([#1074](https://github.com/Tencent/tdesign-vue/pull/1074))
- `DatePicker`:
  - 新增 `panelPreselection api` by @HQ-Lin ([#1134](https://github.com/Tencent/tdesign-vue/pull/1134))
  - 优化面板月份展示 @HQ-Lin ([#1140](https://github.com/Tencent/tdesign-vue/pull/1140))
- `Drawer`: 优化抽屉拖拽体验([#793](https://github.com/Tencent/tdesign-vue/issues/793)) @uyarn ([#1135](https://github.com/Tencent/tdesign-vue/pull/1135))
### 🐞 Bug Fixes
- `Space`:  过滤无效的节点 @pengYYYYY ([#1124](https://github.com/Tencent/tdesign-vue/pull/1124))
- `Cascader`: @pengYYYYY ([#1074](https://github.com/Tencent/tdesign-vue/pull/1074))
  - 修复多选时，文本过长未处理的问题 ([issue #907](https://github.com/Tencent/tdesign-vue/issues/907))
  - 修复选中内容过多时，再点击选择器后的闪动问题 ([issue #949](https://github.com/Tencent/tdesign-vue/issues/949))
- `SelectInput`: 修复 `overlayStyle ` 响应式无法更新的问题 @pengYYYYY ([#1074](https://github.com/Tencent/tdesign-vue/pull/1074))
- `TagInput`: 修复 `inputProps ` 属性透传无效 @pengYYYYY ([#1074](https://github.com/Tencent/tdesign-vue/pull/1074))
- `Transfer`: 修复穿梭框进行穿梭时报错的问题 @BigLiao ([#1132](https://github.com/Tencent/tdesign-vue/pull/1132))
- `Table`: 树形结构支持懒加载 @chaishi ([#1128](https://github.com/Tencent/tdesign-vue/pull/1128))
- `Dialog`: 修复打开对话框时出现滚动条的问题 ([#1163](https://github.com/Tencent/tdesign-vue-next/issues/1163)) @pengYYYYY ([#1074](https://github.com/Tencent/tdesign-vue/pull/1074))
- `DatePicker`: 修复日期格式化问题 by @HQ-Lin ([#1134](https://github.com/Tencent/tdesign-vue/pull/1134))
- `TimePicker`: by @uyarn ([#1134](https://github.com/Tencent/tdesign-vue/pull/1134))
  - 优化允许输入滚动的使用体验
  - `TimeRangePicker` 修复允许输入的缺陷
- `Select`:
  - 修复远程搜索动态生成选项失败的缺陷 by @uyarn ([#1134](https://github.com/Tencent/tdesign-vue/pull/1134))
  - 虚拟滚动支持远程搜索场景 @skytt ([#1133](https://github.com/Tencent/tdesign-vue/pull/1133))
- `Dialog`: 修复阻止冒泡导致 popup 无法正常关闭 @HQ-Lin ([#1139](https://github.com/Tencent/tdesign-vue/pull/1139))
- `Drawer`: 修复头部渲染异常问题 @HQ-Lin ([#1144](https://github.com/Tencent/tdesign-vue/pull/1144))
- `Input`: 修复Input 组件 切换 type 后不生效的问题 @qdzhaoxiaodao ([#1148](https://github.com/Tencent/tdesign-vue/pull/1148))
- 全局配置: 修复 useConfig computed 属性计算导致列表渲染卡顿问题 @brianzhang ([#1122](https://github.com/Tencent/tdesign-vue/pull/1122))

## 🌈 0.43.2 `2022-07-04` 
### 🚀 Features
- `Form`:
  - 添加内置校验方法 whitespace @pengYYYYY ([#1095](https://github.com/Tencent/tdesign-vue/pull/1095))
  - 新增校验触发方式 `trigger: 'blur'` @k1nz ([#1051](https://github.com/Tencent/tdesign-vue/pull/1051))
  - 现在 `FormItem.label` 为 `string` 类型时， `Form.errorMessage` 模板中的 `${name}` 会被替换为 `FormItem.label` 属性；当 `label` 属性为 `slot/function` 时，`${name}` 会被替换为 `FormItem.name` 属性 @k1nz ([#1051](https://github.com/Tencent/tdesign-vue/pull/1051))
- `Table`: @chaishi ([#1115](https://github.com/Tencent/tdesign-vue/pull/1115))
  - 可编辑单元格，支持编辑组件联动， [issue#995](https://github.com/Tencent/tdesign-react/issues/995)
  - 树形结构行选中支持半选状态，[#1004](https://github.com/Tencent/tdesign-react/issues/1004)
  - 树形结构，缩进 `indent` 支持 `0`

### 🐞 Bug Fixes
- `Dialog/Drawer`: 修复 `closeOnOverlayClick` `closeOnEscKeydown` 默认值导致的无法设置的问题 ([#1096 ](https://github.com/Tencent/tdesign-vue-next/issues/1100)) @pengYYYYY ([#1095](https://github.com/Tencent/tdesign-vue/pull/1095))
- `Drawer`: 修复 `header`  默认值为 `undefined` 的问题 @pengYYYYY ([#1095](https://github.com/Tencent/tdesign-vue/pull/1095))
- `Dialog`: 修复 dialog 滚动失效问题 @HQ-Lin ([#1101](https://github.com/Tencent/tdesign-vue/pull/1101))
- `Form`: 修复 `number` 规则校验不生效的问题 @k1nz ([#1051](https://github.com/Tencent/tdesign-vue/pull/1051))
- `Table`: @chaishi ([#1110](https://github.com/Tencent/tdesign-vue/pull/1110))
  - 动态数据合并单元格，删除行数据时，未更新合并单元格状态，[issue#1045](https://github.com/Tencent/tdesign-vue/issues/1045)，[issue#992](https://github.com/Tencent/tdesign-vue/issues/992)，[#bb9e6656](https://github.com/Tencent/tdesign-vue/pull/1110/commits/bb9e66562471c9d016c2f32e976fbe4054bb2955)
  - 修复自定义筛选组件不显示问题，[issue#1114](https://github.com/Tencent/tdesign-vue/issues/1114) @chaishi ([#1110](https://github.com/Tencent/tdesign-vue/pull/1110))
- `ColorPicker`: 修复颜色选择器样式异常，[issue#1044](https://github.com/Tencent/tdesign-vue/issues/1044) @S-mohan ([#1083](https://github.com/Tencent/tdesign-vue/pull/1083))
- `ConfigProvider`: 修复 config-provider 同时存在 provide 和 setup#provide 导致卡顿的性能问题 @Ryqsky ([#1113](https://github.com/Tencent/tdesign-vue/pull/1113))
- `DatePicker`: 修复suffixIcon、clear事件问题 @HQ-Lin ([#1094](https://github.com/Tencent/tdesign-vue/pull/1094))

## 🌈 0.43.1 `2022-06-29` 
### 🚀 Features
- `Select`: 列表展开时定位置选中项 @huoyuhao ([#1072](https://github.com/Tencent/tdesign-vue/pull/1072))
### 🐞 Bug Fixes
- `Select`:
    - 修复多选模式下展示placeholder的异常 @uyarn ([#1091](https://github.com/Tencent/tdesign-vue/pull/1091))
    - 修复可筛选换行高度异常的问题 @uyarn ([#1091](https://github.com/Tencent/tdesign-vue/pull/1091))

## 🌈 0.43.0 `2022-06-28` 
### ❗️ BREAKING CHANGES
- 默认移除全局 reset 样式引入，可从 `tdesign-vue/dist/reset.css` 中单独引入 @xiaosansiji ([#1079](https://github.com/Tencent/tdesign-vue/pull/1079))
- `DatePicker`: 重构`DatePicker`为composition API，全新的UI样式及交互，新增DateRangePicker组件，替换此前的`range`写法 @HQ-Lin ([#1018](https://github.com/Tencent/tdesign-vue/pull/1018))
- `TimePicker`: 重构`TimePicker`为composition API，全新的UI样式及交互，`disableTime` API有所调整 @uyarn ([#1018](https://github.com/Tencent/tdesign-vue/pull/1018))

### 🚀 Features
- `Space`: 新增 space 组件 @HQ-Lin ([#1047](https://github.com/Tencent/tdesign-vue/pull/1047))
- `ConfigProvider`: 增加 `input` 组件 `autocomplete` 配置，增加 `dialog` 组件  `closeOnEscKeydown`, `closeOnOverlayClick` 配置,  增加 `select` 组件 `filterable`  配置，增加 `drawer` 组件  `closeOnEscKeydown`, `closeOnOverlayClick` 配置 ([issue #848](https://github.com/Tencent/tdesign-vue-next/issues/848)) @pengYYYYY ([#1073](https://github.com/Tencent/tdesign-vue/pull/1073))
- `Local`: 增加日语和韩语语言包 @pengYYYYY ([#1073](https://github.com/Tencent/tdesign-vue/pull/1073))
- `Table`: fullRow不参与排序 @uyarn ([#1056](https://github.com/Tencent/tdesign-vue/pull/1056))

### 🐞 Bug Fixes
- `Table`: 
  - 吸顶表头支持自定义滚动容器 @chaishi ([#1052](https://github.com/Tencent/tdesign-vue/pull/1052))
  - 处理table在部分SSR场景渲染失败的问题 @uyarn ([#1056](https://github.com/Tencent/tdesign-vue/pull/1056))
  - 修复仅有`firstFullRow`不渲染的问题 @uyarn ([#1056](https://github.com/Tencent/tdesign-vue/pull/1056))
  - 修复paginationAffixedBottom 透传Affix 参数不生效 @LoopZhou ([#1055](https://github.com/Tencent/tdesign-vue/pull/1055))
  - 修复0.41.7版本后过滤功能构建后异常的问题 @chaishi ([#1081](https://github.com/Tencent/tdesign-vue/pull/1081))
- `Select`: 
  - `option`数量小于`threshold`时不开启虚拟滚动 @uyarn ([#1063](https://github.com/Tencent/tdesign-vue/pull/1063))
  - 单选下 valueType 为 object 时, onChange返回值类型修复 @skytt ([#1076](https://github.com/Tencent/tdesign-vue/pull/1076))
  - 修复 useDefaultValue、useVModel 初值为 undefined 时, 组件初始化为非受控的问题 @skytt ([#1077](https://github.com/Tencent/tdesign-vue/pull/1077))
  - 修复多选下换行提取占满一行的问题 @uyarn ([#1081](https://github.com/Tencent/tdesign-vue/pull/1081))

- `SelectInput`: 修复展开下拉时失去焦点不高亮的问题 @uyarn ([#1056](https://github.com/Tencent/tdesign-vue/pull/1056))
- `TagInput`: 修复中文输入按下 Enter 时不触发新标签 @chiyu1996 ([#1040](https://github.com/Tencent/tdesign-vue/pull/1040))
- `InputNumber`: 修复`enter`事件不触发的问题 @jchalex ([#1075](https://github.com/Tencent/tdesign-vue/pull/1075))
- `Affix`: 节点挂载后吸顶没有执行的问题 @ontheroad1992 ([#1054](https://github.com/Tencent/tdesign-vue/pull/1054))


## 🌈 0.42.2 `2022-06-20` 
### 🚀 Features
- `Skeleton`: 增加 `delay` 属性防止抖动 @Wonder233 ([#1003](https://github.com/Tencent/tdesign-vue/pull/1003))
- `Table`:
  - 支持底部滚动条吸底和分页器吸底能力 @chaishi ([#1023](https://github.com/Tencent/tdesign-vue/pull/1023))
  - 支持通过吸顶表头进行列拖拽排序，[issue#1014](https://github.com/Tencent/tdesign-vue/issues/1014) @chaishi ([#1029](https://github.com/Tencent/tdesign-vue/pull/1029))
  - 吸顶表头支持拖拽调整列宽
  - 自定义列配置场景支持列拖拽排序，[issue#1015](https://github.com/Tencent/tdesign-vue/issues/1015) @chaishi ([#1029](https://github.com/Tencent/tdesign-vue/pull/1029))
### 🐞 Bug Fixes
- `Form`: 实例方法 `submit` 和 `reset` 恢复事件（0.42.1 中去除的） @chaishi ([#1013](https://github.com/Tencent/tdesign-vue/pull/1013))
- `Input`: 修复 `type = password` 时 `clearable` 不生效的问题 @uyarn ([#1017](https://github.com/Tencent/tdesign-vue/pull/1017))
- `Select`:
  - 修复多选情况下 `clearable` 失效的问题 @uyarn ([#1016](https://github.com/Tencent/tdesign-vue/pull/1016))
  - 修复 t-option 方式渲染时，内部数组的清除逻辑 @skytt ([#1028](https://github.com/Tencent/tdesign-vue/pull/1028))
- `TagInput`:
  - 修复 `inputProps`` 未透传的问题 @uyarn ([#1016](https://github.com/Tencent/tdesign-vue/pull/1016))
  - 修复事件透传失效的问题 @skytt ([#1007](https://github.com/Tencent/tdesign-vue/pull/1007))
- `ConfigProvider`: @pengYYYYY ([#1024](https://github.com/Tencent/tdesign-vue/pull/1024))
  - 修复 `useConfig` 意外注册的问题
  - 修复因为深拷贝配置文件导致的性能问题
- `Table`:
  - 修复虚拟滚动表头会在滚动到中间一定程度时消失的问题 @chaishi ([#1023](https://github.com/Tencent/tdesign-vue/pull/1023))
  - 修复合并单元格不支持动态数据的问题，[issue#992](https://github.com/Tencent/tdesign-vue/issues/992) @chaishi ([#1029](https://github.com/Tencent/tdesign-vue/pull/1029))
  - 修复 `firstFullRow` 存在时，拖拽排序的顺序不正确问题 @chaishi ([#1029](https://github.com/Tencent/tdesign-vue/pull/1029))
  - 修复加载更多的加载组件尺寸异常问题 @uyarn ([#1035](https://github.com/Tencent/tdesign-vue/pull/1035))
- `TreeSelect`: 修复过滤后无法选中的问题 @chiyu1996 ([#1027](https://github.com/Tencent/tdesign-vue/pull/1027))
- `Calendar/ColorPicker`: 修复组件内部 Select 选择框宽度不能自适应的问题 @xiaosansiji ([#1006](https://github.com/Tencent/tdesign-vue/pull/1006))
- `Dialog`:
  - 修复 mask 点击事件失效的问题 @HQ-Lin ([#1019](https://github.com/Tencent/tdesign-vue/pull/1019))
  - 修复 `placement = top` 场景下弹出框位置偏移的问题 @huoyuhao ([common#544](https://github.com/Tencent/tdesign-common/pull/544))

## 🌈 0.42.1 `2022-06-14` 
### 🚀 Features
- `Form`: @chaishi ([#983](https://github.com/Tencent/tdesign-vue/pull/983))
  - 实例方法 `reset` 支持重置指定字段，新增参数 `{ type: 'initial' | 'empty', fields: number[] }`
  - 实例方法 `validate` 支持值校验而不显示每个组件的错误信息文本，新增参数 `{ showErrorMessage }`
  - FormItem 支持自定义 `help` 内容，插槽和渲染函数均可
  - 新增纯净的校验方法 `validateOnly`，专门用作校验，不带任何副作用，[issue#981](https://github.com/Tencent/tdesign-vue/issues/981)
  - 修复`TagInput` 组件按下 Enter 时触发 `submit` 事件，不再触发，[issue#963](https://github.com/Tencent/tdesign-vue/issues/963)
- `Dialog`: 优化动画初始位置 @huoyuhao ([#1000](https://github.com/Tencent/tdesign-vue/pull/1000))
### 🐞 Bug Fixes
- `Table`:
  - 修复table透传loading size为枚举无效的问题 @uyarn ([#979](https://github.com/Tencent/tdesign-vue/pull/979))
  - 优化吸顶和吸底的位置，支持带有 `offsetBottom` 和 `offsetTop` 特性的位置定位，[issue#987](https://github.com/Tencent/tdesign-vue/issues/987) @chaishi ([#985](https://github.com/Tencent/tdesign-vue/pull/985))
- `Select`: @skytt @uyarn ([#991](https://github.com/Tencent/tdesign-vue/pull/991))
  - 修复t-option异步加载问题
  - 修复分组为空未展示分组名称的问题
  - 优化虚拟滚动示例、修复pagination分页数量宽度问题
- `Dialog`: @huoyuhao ([#994](https://github.com/Tencent/tdesign-vue/pull/994))
  - 修复普通对话框不脱离文档流的问题
  - 修复点击对话框后对话框会隐藏问题，[issue#993](https://github.com/Tencent/tdesign-vue/issues/993)
  - 修复 `modeless` 模式下背景样式点击透传的问题
  - 修复 attach 挂载 showInAttachedElement 定位问题

## 🌈 0.42.0 `2022-06-10` 
### ❗️ BREAKING CHANGES
- `Dialog`: 移除 transform 定位实现方案，如有覆盖 Dialog 组件样式的情况请注意 DOM 结构有变动 @huoyuhao ([#970](https://github.com/Tencent/tdesign-vue/pull/970))
### 🚀 Features
- `Table`: 
  - 筛选对话框输入筛选内容之后按回触发筛选过滤，[issue#802](https://github.com/Tencent/tdesign-vue/issues/802) @chaishi ([#952](https://github.com/Tencent/tdesign-vue/pull/952))
  - 筛选功能支持自定义组件方式，示例：`columns: [{ filter: { component: DatePicker, props: {} } }]` @chaishi ([#952](https://github.com/Tencent/tdesign-vue/pull/952))
  - 拖拽调整宽度，支持设置最小宽度和最大宽度 `column.resize`， [issue#929](https://github.com/Tencent/tdesign-vue/issues/929) @chaishi ([#952](https://github.com/Tencent/tdesign-vue/pull/952))
  - 拖拽排序事件，新增参数 `data` 和 `newData`，分别表示变更前后的数据 @chaishi ([#955](https://github.com/Tencent/tdesign-vue/pull/955))
- `Popup`: 支持动态设置 trigger & placement @ikeq ([#950](https://github.com/Tencent/tdesign-vue/pull/950))
- `Select`:
  - select组件支持虚拟滚动 @uyarn ([#972](https://github.com/Tencent/tdesign-vue/pull/972))
  - 重构为 composition API 实现，组件底层基于 SelectInput 实现 @skytt ([#905](https://github.com/Tencent/tdesign-vue/pull/905))
- `Upload`: 图片上传文案支持自定义 @Isabella327 ([#971](https://github.com/Tencent/tdesign-vue/pull/971))
- 新增 InputAdornment 组件 @HQ-Lin ([#962](https://github.com/Tencent/tdesign-vue/pull/962))
### 🐞 Bug Fixes
- `Popup`: 修复初始化 visible 为 true 时的定位抖动问题 @ikeq ([#950](https://github.com/Tencent/tdesign-vue/pull/950))
- `Table`:
  - 修复树形结构拖拽排序引起展开收起异常问题 @chaishi ([#955](https://github.com/Tencent/tdesign-vue/pull/955))
  - 修复动态数据场景下合并单元格支持，[issue#973](https://github.com/Tencent/tdesign-vue/issues/973) @chaishi ([#975](https://github.com/Tencent/tdesign-vue/pull/975))
- `Select`:
  - 修复 `inputProps` 透传无效的问题 @skytt ([#905](https://github.com/Tencent/tdesign-vue/pull/905))
  - 修复 `placeholder` 无法设置空字符串的问题 @skytt ([#905](https://github.com/Tencent/tdesign-vue/pull/905))
  - 修复单选场景无法使用 `valueDisplay` 能力的问题 @skytt ([#905](https://github.com/Tencent/tdesign-vue/pull/905))
- `Datepicker`: 修复 `popupProps` 传入无效的问题 @chiyu1996 ([#974](https://github.com/Tencent/tdesign-vue/pull/974))

## 🌈 0.41.7 `2022-06-02` 
### 🚀 Features
- `Table`: 
  - `appendTo` 支持添加新节点到根节点，[tdesign-vue-next issue#849](https://github.com/Tencent/tdesign-vue-next/issues/849) @chaishi ([#931](https://github.com/Tencent/tdesign-vue/pull/931))
  - 新增 `getTreeNode`，用于获取整个树形结构，[tdesign-vue-next issue#849](https://github.com/Tencent/tdesign-vue-next/issues/849) @chaishi ([#931](https://github.com/Tencent/tdesign-vue/pull/931))
  - EnhancedTable 支持事件 `@drag-sort` @chaishi ([#931](https://github.com/Tencent/tdesign-vue/pull/931))
  - 表格支持编辑单元格，[issue#853](https://github.com/Tencent/tdesign-vue/issues/853) @chaishi ([#932](https://github.com/Tencent/tdesign-vue/pull/932))
- `InputNumber`: 通过 `inputProps` 透传 Input 组件全部特性，@jchalex ([#930](https://github.com/Tencent/tdesign-vue/pull/930))
### 🐞 Bug Fixes
- `Progress`: theme 由 circle 切换至 plump 后样式错乱 @Isabella327 ([#936](https://github.com/Tencent/tdesign-vue/pull/936))
- `InputNumber`: 修复 `theme = column` 时设置 align 失效的问题 @jchalex ([common #481](https://github.com/Tencent/tdesign-common/pull/481))
- `Table`: 修复表头多选框无法居中和居右展示的问题，[issue#912](https://github.com/Tencent/tdesign-vue/issues/912) @chaishi ([common #932](https://github.com/Tencent/tdesign-common/pull/485))
- 修复无法在 SSR 场景下使用的问题 @uyarn ([#928](https://github.com/Tencent/tdesign-vue/pull/928))
### 🚧 Others
- 官网: 支持在线配置组件库主题 @uyarn ([#775](https://github.com/Tencent/tdesign-vue/pull/775))

## 🌈 0.41.6 `2022-05-27` 

### 🚀 Features
- ColorPicker: 新增颜色选择器，使用请参照 [官网](https://tdesign.tencent.com/react/components/color-picker) @S-mohan ([#867](https://github.com/Tencent/tdesign-vue/pull/867))
### 🐞 Bug Fixes
- `Table`: 
  - EnhancedTable，树形结构中，修复可选中表格禁用行勾选问题：动态设置选中列时，禁用失效 [issue#822](https://github.com/Tencent/tdesign-vue-next/issues/822) @chaishi ([#902](https://github.com/Tencent/tdesign-vue/pull/902))
  - EnhancedTable，树形结构中，toggleExpandData 和 expandAll/FoldAll 混合使用时，树形结构展开有误 [issue#839](https://github.com/Tencent/tdesign-vue-next/issues/839) @chaishi ([#902](https://github.com/Tencent/tdesign-vue/pull/902))
  - table初始化时，fixed的阴影效果没有出现 @LoopZhou ([#922](https://github.com/Tencent/tdesign-vue/pull/922))
- `Tabs`: 修复选项卡新增和删除在normal风格下无效 ([issue #865](https://github.com/Tencent/tdesign-vue/issues/865)) @pengYYYYY ([#921](https://github.com/Tencent/tdesign-vue/pull/921))
- Drawer: 修复 `Drawer` 使用按键关闭时 `contenteditable` 出现的边框 @pengYYYYY ([common #474](https://github.com/Tencent/tdesign-common/pull/474))
- Layout: 去除 `Header` 额外高度设置 @pengYYYYY ([common #478](https://github.com/Tencent/tdesign-common/pull/478))
### 🚧 Others
- 【官网】文档支持国际化 @HQ-Lin ([#896](https://github.com/Tencent/tdesign-vue/pull/896))

## 🌈 0.41.5 `2022-05-20` 
### 🚀 Features
- `Form`:  支持 `help` 配置的表单项说明内容与错误提示同时展示，未配置 `help` 时不再默认占位 @HQ-Lin ([#884](https://github.com/Tencent/tdesign-vue/pull/884))
- `Table`:  @chaishi (https://github.com/Tencent/tdesign-vue/pull/879))
    - 树形结构，支持默认展开全部，`tree.defaultExpandAll`，[issue#852](https://github.com/Tencent/tdesign-vue/issues/852)
    - 树形结构，支持自由控制展开全部，或收起全部 `expandAll()` `foldAll()` 
    - 树形结构，支持拖拽排序，调整同层级顺序
    - 树形结构，支持在当前节点之前插入新节点 `insertBefore`
    - 树形结构，支持在当后节点之后插入新节点 `insertAfter`
- `Tree`: label 支持多行文本展示，[issue# common 444](https://github.com/Tencent/tdesign-common/issues/444) @ccccpj ([#460](https://github.com/Tencent/tdesign-common/pull/460))
### 🐞 Bug Fixes
- `Table`: 列拖动优化；修复选中行后列拖动距离被重置问题 @LoopZhou ([#870](https://github.com/Tencent/tdesign-vue/pull/870))
- `Table`: 修复 多级表头 + 列配置 综合示例中，列数量超出一定限制时报错，[issue#713](https://github.com/Tencent/tdesign-vue-next/issues/713) @chaishi ([#875](https://github.com/Tencent/tdesign-vue/pull/875))
- `Transfer`: 修复列表数量变化时的页码展示问题 @BigLiao ([#893](https://github.com/Tencent/tdesign-vue/pull/893))
- `Input`: 修复 `clear` 触发后的 `focus`, 修复外部传入`onMouseenter`, `onMouseleave`, `onwheel` 事件导致组件内对应`方法`未执行的问题 @pengYYYYY ([#894](https://github.com/Tencent/tdesign-vue/pull/894))
- `TreeSelect`: 修复未支持 treeProps.keys.children 字段配置的问题 @LoopZhou ([#890](https://github.com/Tencent/tdesign-vue/pull/890))
- `Menu`: 修复 `expandType=popup` 时箭头方向展示错误的问题，@fengxianqi ([#806](https://github.com/Tencent/tdesign-vue/pull/806))
- `Menu`: 修复 width 不支持数组类型的问题，@LeeJim ([#897](https://github.com/Tencent/tdesign-vue/pull/897))

## 🌈 0.41.3 `2022-05-13` 
### 🚀 Features
- `Icon`: 更新图标 新增`file-icon`图标 调整`file-excel`、`file-pdf`、`file-powerpoint`、`file-unknown`、`file-word`和`star-filled`图标的绘制路径 @uyarn ([#854](https://github.com/Tencent/tdesign-vue/pull/854))
- `Dialog`: 支持`preventScrollThrough` API @uyarn ([#861](https://github.com/Tencent/tdesign-vue/pull/861))
- `Table`: 支持自定义树形结构图标 `treeExpandAndFoldIcon`，同时支持全局配置此图标，[issue#717](https://github.com/Tencent/tdesign-vue-next/issues/717) @chaishi ([#863](https://github.com/Tencent/tdesign-vue/pull/863))
- `Table`: 支持隐藏排序文本提示 `hideSortTips`，同时支持全局配置是否隐藏排序文本提示，[issue#736](https://github.com/Tencent/tdesign-vue-next/issues/736) @chaishi ([#863](https://github.com/Tencent/tdesign-vue/pull/863))
- `Steps`: 新增 `separator` 属性，用于控制步骤条分隔符类型 @HQ-Lin ([#863](https://github.com/Tencent/tdesign-vue/pull/868))
### 🐞 Bug Fixes
- `Select`: 修复 `textarea` 作为 `panelContent` 时无法使用键盘事件的问题 @uyarn ([#851](https://github.com/Tencent/tdesign-vue/pull/851))
- `Slider`: 修复`InputProps`属性传递布尔值时ts错误的问题 @uyarn ([#851](https://github.com/Tencent/tdesign-vue/pull/851))
- `Table`: 固定列滚动阴影修复 [issue#858](https://github.com/Tencent/tdesign-vue/issues/858) @chaishi ([#860](https://github.com/Tencent/tdesign-vue/pull/860))
- `Dropdown`: 插槽模式下 `maxHeight` 失效的问题 @uyarn ([#857](https://github.com/Tencent/tdesign-vue/pull/857))
- `Dropdown`: 透传 popup 事件问题 @uyarn ([#857](https://github.com/Tencent/tdesign-vue/pull/857))
- `Dialog`: 修复`normal`下加入lock导致页面无法滚动的问题 @uyarn ([#861](https://github.com/Tencent/tdesign-vue/pull/861))
- `Table`: 修正拖拽列款的边界条件判断 @tinna3445 ([#866](https://github.com/Tencent/tdesign-vue/pull/866))
- `Progress`: 修复环形进度条显示比例不准确 @LoopZhou ([#866](https://github.com/Tencent/tdesign-vue/pull/874))

## 🌈 0.41.2 `2022-05-07` 
### 🚀 Features
- `Table`: 新增 API `ellipsisTitle` 用于单独控制表头的超出省略 [@chaishi](https://github.com/chaishi) ([#832](https://github.com/Tencent/tdesign-vue/pull/832))
- `Tooltip`: `placement` 新增 `mouse` 枚举值，用于支持基于鼠标位置定位 [@Hoofoo-WHU](https://github.com/Hoofoo-WHU) ([#843](https://github.com/Tencent/tdesign-vue/pull/843))
### 🐞 Bug Fixes
- `Table`: [@chaishi](https://github.com/chaishi) ([#832](https://github.com/Tencent/tdesign-vue/pull/832))
  - 修复默认情况，表尾吸底显示与否计算遗漏的问题  [issue#833](https://github.com/Tencent/tdesign-vue/issues/833)，[commit#8323ea](https://github.com/Tencent/tdesign-vue/pull/832/commits/8323eaca98bf759555d7c90b60099ae82370e224)
  - 修复加载状态会导致拖拽排序失效的问题，[tdesign-vue-next#648](https://github.com/Tencent/tdesign-vue-next/issues/648)，[commit#770d40](https://github.com/Tencent/tdesign-vue/pull/832/commits/770d406969da29ebf0e94aa81477aa41be984108)
  - 修复表格 `sorter:true` 且 `ellipsis: true` 时样式冲突问题 [issue#778](https://github.com/Tencent/tdesign-vue/issues/778)，[commit#c92168](https://github.com/Tencent/tdesign-vue/pull/832/commits/c92168c9aaf51ac2a27b73dfc3867878ab7a8a48)
  - TS 类型 TableColumns[0] 在严格模式下的使用问题
- `Table`: `renderExpandedRow`改为非必填 [@uyarn](https://github.com/uyarn) ([#844](https://github.com/Tencent/tdesign-vue/pull/844))
- 全局配置：修复`animation`属性`exclude`和`include`在 TS 中都必填的问题
- `Datepicker`: 修复 weekday 英文翻译的顺序问题 [@keifergu](https://github.com/keifergu) ([common #447](https://github.com/Tencent/tdesign-common/pull/447))
### 🚧 Others
- `Table`: TS 类型全部移入 interface.ts 文件中，并导出 [@chaishi](https://github.com/chaishi) ([#832](https://github.com/Tencent/tdesign-vue/pull/832))
- `Calendar`: 对 `value` 属性功能进行修正，新增 `month` 和 `year` 属性，用于控制日历面板展示所属年/月。 [@PsTiu](https://github.com/PsTiu) ([#813](https://github.com/Tencent/tdesign-vue/pull/813))
- 官网: 上线组件 live demo 能力，请访问 [Button 组件文档](https://tdesign.tencent.com/vue/components/button) 体验，[@HQ-Lin](https://github.com/HQ-Lin) ([#695](https://github.com/Tencent/tdesign-vue/pull/695))

## 🌈 0.41.1 `2022-04-29`
### 🚀 Features
- `Message`: 增加全局配置默认值能力 [@sommouns](https://github.com/sommouns) ([#795](https://github.com/Tencent/tdesign-vue/pull/795))
- `Pagination`: 新增 `showFirstAndLastPageBtn`、`showPreviousAndNextBtn`、`showPageSize`、`showPageNumber` 属性 [@HQ-Lin](https://github.com/HQ-Lin) ([#808](https://github.com/Tencent/tdesign-vue/pull/808))
- `Table`: 
    - 支持表尾吸底及表尾滚动条吸底 [@chaishi](https://github.com/chaishi) ([#810](https://github.com/Tencent/tdesign-vue/pull/810))
    - 支持表格列可以拖拽宽度 [@tinna3445](https://github.com/tinna3445) ([#757](https://github.com/Tencent/tdesign-vue/pull/757))
### 🐞 Bug Fixes
- `Form`: 修复 help 文本样式问题 [@HQ-Lin](https://github.com/HQ-Lin) ([#803](https://github.com/Tencent/tdesign-vue/pull/803))
- `Dialog`: 修复 dialog 初始化时滚动穿透问题 [@mxj0808](https://github.com/mxj0808) ([#788](https://github.com/Tencent/tdesign-vue/pull/788))
- `Table`:  表头吸顶时，`table` 元素宽度修正，之前为直接等于外层宽度，不合理 [@chaishi](https://github.com/chaishi) ([#810](https://github.com/Tencent/tdesign-vue/pull/810))
- `Table`: 修复斑马纹 stripe 和固定表头同时存在时，样式问题，[issue#804](https://github.com/Tencent/tdesign-vue/issues/804) [@chaishi](https://github.com/chaishi) ([#810](https://github.com/Tencent/tdesign-vue/pull/810))
- `DatePicker`:  修复DatePicker 点击快捷选择日期按钮左边面板日期时间不联动 [@yilaierwang](https://github.com/yilaierwang) ([#811](https://github.com/Tencent/tdesign-vue/pull/811))
- 防止 `VueCompositionAPI` 重复注册 [@cong-min](https://github.com/cong-min) ([#809](https://github.com/Tencent/tdesign-vue/pull/809))

## 🌈 0.41.0 `2022-04-24`

### ❗️ BREAKING CHANGES
* Table: 拖拽排序修改为`drag=sort` 表示列拖拽排序，`drag=row` 表示行拖拽排序，`drag=row-handler` 表示行手柄列拖拽排序。如果您使用了 `drag="col"` 来实现行拖拽排序，请更为使用 `drag="row-handler"`，[pr #755](https://github.com/Tencent/tdesign-vue/pull/755)，[@chaishi](https://github.com/chaishi)

### 🐞 Bug Fixes
* Table: 
  - 修复 SSR 场景下使用报错的问题，[pr #744](https://github.com/Tencent/tdesign-vue/pull/744)，[@codenotkey](https://github.com/codenotkey)
  - 修复表头吸顶时不对齐的问题
  - 按需引入 Button 组件，避免业务按需引入 Table 组件时出现组件不存在报错的问题
  - 修复无法使用插槽自定义过滤图标的问题
  - 解决 `TdBaseTableProps ` 和 `TdPrimaryTableProps` 关于 `onCellClick` 的 TS 类型冲突
* Alert: 修复 ts 类型错误，[pr #796](https://github.com/Tencent/tdesign-vue/pull/796)，[@pengYYYYY](https://github.com/pengYYYYY)
* Cascader: [pr #751](https://github.com/Tencent/tdesign-vue/pull/751)，[@pengYYYYY](https://github.com/pengYYYYY) 
  - 修复可过滤状态下的下拉面板拉起闪烁的问题
  - 修复可过滤状态下的输入内容未被正常销毁的问题
* Transfer: 修复 `Transfer` 设置 `targetSort` 后未按预期展示的问题，[#758](https://github.com/Tencent/tdesign-vue/pull/758)，[@BigLiao](https://github.com/BigLiao)
* ConfigProvider: 修复 `ConfigProvider` 组件导出错误的问题，[pr #773](https://github.com/Tencent/tdesign-vue/pull/773)，[@xiaosansiji](https://github.com/xiaosansiji)
* TreeSelect: [pr #781](https://github.com/Tencent/tdesign-vue/pull/781)，[@Godlike-meteor](https://github.com/Godlike-meteor)
  - 修复 `value` 为数字0时，不渲染 `label` 的问题，[issue #722](https://github.com/Tencent/tdesign-vue/issues/722)
  - 修复 `onBlur` 和 `onClear` 触发时，不会清除 filter function 的问题，[issue #635](https://github.com/Tencent/tdesign-vue/issues/635)
### 🚀 Features
* Select: 去掉选中和下拉项中的 title 属性，[pr #777](https://github.com/Tencent/tdesign-vue/pull/777)，[@LoopZhou](https://github.com/LoopZhou) 
* Table: 支持树形结构展示，行展开或收起时触发 `onTreeExpandChange` 事件
* Collapse: 新增 Collapse 折叠面板组件，使用请参照 [官网](https://tdesign.tencent.com/vue/components/collapse)，[@asbstty](https://github.com/asbstty)
* Tree: [pr #740](https://github.com/Tencent/tdesign-vue/pull/740)，[@TabSpace](https://github.com/TabSpace)
  - Tree 组件实现嵌套结构渲染能力
  - 部分属性改为不让 Vue 监听，一定程度上提升组件性能，减少对外部组件交互性能的影响

## 🌈 0.40.3 `2022-04-15`

### 🐞 Bug Fixes

* Timepicker: 修复手动清空 value 时异常的问题，[pr #731](https://github.com/Tencent/tdesign-vue/pull/731)，[@uyarn](https://github.com/uyarn)
* Textarea: 修复输入数字零时显示异常的问题，[issue #727](https://github.com/Tencent/tdesign-vue/issues/727)，[@mokywu](https://github.com/mokywu)
* Menu: 修复局部注册组件时报错的问题，[issue #696](https://github.com/Tencent/tdesign-vue/issues/696)，[@LeeJim](https://github.com/LeeJim)
* Select: 修复可过滤的选择器提前换行的问题，[issue #726](https://github.com/Tencent/tdesign-vue/issues/726)，[@uyarn](https://github.com/uyarn)
### 🚀 Features

* Form: 默认渲染 extra DOM 节点，[pr #730](https://github.com/Tencent/tdesign-vue/pull/730)，[@HQ-Lin](https://github.com/HQ-Lin)
* Dialog: 新增 `showInAttachedElement` API 用于控制是否仅在挂载元素中显示弹窗，[pr #711](https://github.com/Tencent/tdesign-vue/pull/711)，[@zhaodanchun](https://github.com/zhaodanchun)
* Card: 新增卡片组件，[pr #739](https://github.com/Tencent/tdesign-vue/pull/739)，[@uyarn](https://github.com/uyarn)，[@zhwachen](https://github.com/zhwachen)
* Swiper: 新增轮播框组件，[pr #668](https://github.com/Tencent/tdesign-vue/pull/668)，[@start940315](https://github.com/start940315)

## 🌈 0.40.2 `2022-04-08`

### 🐞 Bug Fixes

* Form: 修复 FormItem slot label 未正常占位的问题，[pr #699](https://github.com/Tencent/tdesign-vue/pull/699)，[@HQ-Lin](https://github.com/HQ-Lin)
* Slider: 修复设置 `inputnumberProps` 属性无效的问题，[issue #544](https://github.com/Tencent/tdesign-vue-next/issues/544)，[@uyarn](https://github.com/uyarn)
* Upload: [pr #698](https://github.com/Tencent/tdesign-vue/pull/698)，[@uyarn](https://github.com/uyarn)
  - 修复 `remove`、`selectChange` 事件回调异常的问题
  - 修复取消上传逻辑异常
### 🚀 Features

* Popup: content 尺寸变化后自动更新位置，[pr #694](https://github.com/Tencent/tdesign-vue/pull/694)，[@ikeq](https://github.com/ikeq)
* Slider: `label` 为 function 时新增 `value` 和 `position` 参数，[pr #714](https://github.com/Tencent/tdesign-vue/pull/714)，[@uyarn](https://github.com/uyarn)
* Upload: [pr #698](https://github.com/Tencent/tdesign-vue/pull/698)，[@uyarn](https://github.com/uyarn)
  - 支持自定义上传文件列表
  - 列表型上传支持展示 `errorMessage`
* Checkbox: [pr #706](https://github.com/Tencent/tdesign-vue/pull/706)，[@chaishi](https://github.com/chaishi)
  - onChange 事件新增参数 `option` 表示当前操作对象，`current` 表示当前操作对象的 value
  - `type.ts` 新增 `modelValue`
* Table: [pr #706](https://github.com/Tencent/tdesign-vue/pull/706)，[@chaishi](https://github.com/chaishi)
  - 表格拖拽排序支持完全受控用法，[pr #694](https://github.com/Tencent/tdesign-vue/pull/694)，[@wangmerry](https://github.com/wangmerry)
  - 列配置功能，`onColumnChange` 事件新增参数 e 和 currentColumn
  - 列配置功能，新增 `buttonProps` ，用于支持完全自定义「列配置按钮」风格和内容
  - 列配置功能，新增 `placement`，用于控制「列配置按钮 」相对于表格组件的位置，可选值：左上角、右上角、左下角、右下角
  - 列配置功能，新增控制列配置弹窗显示或隐藏属性 `columnControllerVisible` 和 `onColumnControllerVisibleChange`，将主要应用于完全需要自定义列配置按钮的业务场景
  - BaseTable/Primary/Table/EnhancedTable `新增 bottomContent`，用于设置表格底部内容
  - 修复当数据量过少时，过滤浮层被隐藏的问题，修复 Safari 浏览器无法显示省略浮层问题
  - 树形结构中，新增 `toggleExpandData` ，用于控制行展开，[issue#607](https://github.com/Tencent/tdesign-vue/issues/607)
  - 树形结构中，无法获取到正确的 rowKey 时，抛出错误，提醒用户修改，[issue#682](https://github.com/Tencent/tdesign-vue/issues/682)
  - `table-layout: fixed` 模式，且内容超出时，设置默认列宽为 `100`，避免出现列宽为 `0` 消失的情况
  - 即使没有行选中列，依然支持 selectedRowKeys 添加类名，[issue#700](https://github.com/Tencent/tdesign-vue/issues/700)
  - 行选中和行类名透传，同时存在时，自定义行类名透传失效问题
  - 修复 tfoot>tr 类名透传失效问题

## 🌈 0.40.1 `2022-03-31`

### 🐞 Bug Fixes

* Table: 修复本地数据排序，异步加载数据时分页失效的问题，[pr #689](https://github.com/Tencent/tdesign-vue/pull/689)，[@chaishi](https://github.com/chaishi)

## 🌈 0.40.0 `2022-03-31`
### ❗️ BREAKING CHANGES
* Table: 表格行列拖拽排序功能重构，新用法请参考[官网 demo](https://tdesign.tencent.com/vue/components/table#%E5%8F%AF%E6%8B%96%E6%8B%BD%E6%8E%92%E5%BA%8F%E7%9A%84%E8%A1%A8%E6%A0%BC)，[pr #657](https://github.com/Tencent/tdesign-vue/pull/657)，[@wangmerry](https://github.com/wangmerry)
* Form: label 为空时不再默认渲染宽度占位，需要手动设置样式保持表单对齐[pr #687](https://github.com/Tencent/tdesign-vue/pull/687)，[@HQ-Lin](https://github.com/HQ-Lin)
### 🐞 Bug Fixes

* Popconfirm: 修复确认框中按钮默认大小，[pr #673](https://github.com/Tencent/tdesign-vue/pull/673)，[@pengYYYYY](https://github.com/pengYYYYY)
* Upload:
  - 修复上传中状态文案，[pr #678](https://github.com/Tencent/tdesign-vue/pull/678)，[@pengYYYYY](https://github.com/pengYYYYY)
  - 修复上传模版问题，[issue #675](https://github.com/Tencent/tdesign-vue/issues/675)，[@YikaJ](https://github.com/YikaJ)
* Popup: 修复 `hideEmptyPopup` 在动态改变内容时不生效的问题，[@LoopZhou](https://github.com/LoopZhou)
* Table: 修复合并单元格边框样式问题，[issue #671](https://github.com/Tencent/tdesign-vue/issues/671)，[@chaishi](https://github.com/chaishi)
* Datepicker: 修复区间时间选择时，月份/年份选择面板样式异常的问题，[issue #588](https://github.com/Tencent/tdesign-vue/issues/588)，[@HQ-Lin](https://github.com/HQ-Lin)
* 修复 Table/SelectInput/TagInput 按需引入时出现 composition-api 相关报错的问题，[pr #688](https://github.com/Tencent/tdesign-vue/pull/688)，[@xiaosansiji](https://github.com/xiaosansiji)

### 🚀 Features

* Table: 支持外部设置当前显示列，新增 API `displayColumns` `defaultDisplayColumns` `onDisplayColumnsChange` 和事件 `display-columns-change`，[pr #672](https://github.com/Tencent/tdesign-vue/pull/672)，[@chaishi](https://github.com/chaishi)

## 🌈 0.39.1 `2022-03-29`

### 🐞 Bug Fixes

* Upload: [pr #640](https://github.com/Tencent/tdesign-vue/pull/640)，[@brianzhang](https://github.com/brianzhang)
  - 修复 `success` 事件先于 `progress` 事件触发时，上传文件 `loadingFile` 值不正确的问题
  - 修复最大数量限制 max 在多次文件选择中判断不正确的问题
* Pagination: 修复跳转页输入框展示了额外 placeholder 默认内容的问题，[pr #667](https://github.com/Tencent/tdesign-vue/pull/667)，[@xiaosansiji](https://github.com/xiaosansiji)
* TreeSelect:
  - 修复 `treeProps` 中同时传入 key、load 时选中项显示的问题，[issue #622](https://github.com/Tencent/tdesign-vue/issues/622)，[@Zwow](https://github.com/Zwow)
  - 修正 TreeSelect 的交互行为，与 Select 保持一致，[issue #617](https://github.com/Tencent/tdesign-vue/issues/617)，[@YikaJ](https://github.com/YikaJ)
  - 修复 filter 状态下，树无法折叠的问题；修复 lazy 状态下，无法正确展示 label 的问题，[issue #550](https://github.com/Tencent/tdesign-vue/issues/550)，[@Godlike-meteor](https://github.com/Godlike-meteor)
* Table: [pr #660](https://github.com/Tencent/tdesign-vue/pull/660)，[@chaishi](https://github.com/chaishi)
  - 修复虚拟滚动 `threshold` 引起的报错，[issue#661](https://github.com/Tencent/tdesign-vue/issues/661)
* 修复 TS 定义报错问题，非 Typescript 或 SSR 项目请尽快由 0.39.0 版本升级，[pr #664](https://github.com/Tencent/tdesign-vue/pull/664)，[@uyarn](https://github.com/uyarn)
### 🚀 Features

* ConfigProvider: 完善语言配置能力，使用 common 仓库中的配置数据，[pr #643](https://github.com/Tencent/tdesign-vue/pull/643)，[@pengYYYYY](https://github.com/pengYYYYY)
* Table: [pr #660](https://github.com/Tencent/tdesign-vue/pull/660)，[@chaishi](https://github.com/chaishi)
  - 表格超出省略浮层父元素更为表头 `thead`，避免挂载到全局 `body`
  - 过滤功能浮层元素默认挂载到 `t-table`，不再挂载到全局 `body`，[issue#658](https://github.com/Tencent/tdesign-vue/issues/658)

## 🌈 0.39.0 `2022-03-28`
### ❗️ BREAKING CHANGES
Table 组件使用 `Composition API` 重构，[pr #365](https://github.com/Tencent/tdesign-vue/pull/365)，[@chaishi](https://github.com/chaishi)
- BaseTable HTML 结构变更，写过 CSS 样式覆盖的同学需注意更新样式
- 表头更为使用 `th` 标签，之前为 `td`，不符合语义
- 事件 `row-db-click` 更为`row-dblclick` ，`onRowDbClick` 更为`onRowDblclick`
- 事件 `row-hover` 更为 `row-mouseover`, `onRowHover` 更为 `onRowMouseover`（本没有 rowHover 事件）
- CSS 类名 `t-table__row-first-full-row` 更为 `t-table__first-full-row`，`t-table__row-last-full-row` 更为 `t-table__last-full-row`

### 🐞 Bug Fixes
* Affix: 修复 `onFixedChange` 触发时机，在固定状态发生变化时才会触发该事件（改动之前为：滚动一直触发）
* Table:
  - 自定义列配置功能：多级表头和列显示配置同时存在时，无法进行正确的列配置的问题，列配置仅显示了第一层表头
  - 多级表头和固定列同时存在时，固定列有问题，[issue #465](https://github.com/Tencent/tdesign-vue/issues/465)
  - `verticalAlign` 不生效问题，[issue #372](https://github.com/Tencent/tdesign-vue/issues/372)
  -  右上角出现文字穿透问题，[issue #383](https://github.com/Tencent/tdesign-vue/issues/383)
  - 固定表头和固定列，全部使用 CSS sticky 输出样式，组件仅渲染一个表格，表头和表内容不再分开渲染输出。不仅支持 `table-layout: fixed`模式，同时也支持 `table-layout: auto` 模式
  - 设置 `tableLayout: auto` ，固定表头异常，[issue #278](https://github.com/Tencent/tdesign-vue/issues/278)
  - 设置 `tableLayout: auto` ，`maxHeight` 显示异常，[issue #371](https://github.com/Tencent/tdesign-vue/issues/371)
  - [#issue 432](https://github.com/Tencent/tdesign-vue/issues/432)
  - Table组件 BaseTableCol 配置项 fixed 和 ellipsis(true) 属性共存导致fix阴影无法显示， [issue #392](https://github.com/Tencent/tdesign-vue/issues/392)
  - 多级表头的表格 改变children的宽度无效 [issue #367](https://github.com/Tencent/tdesign-vue/issues/367)
  -  table 组件使用 PrimaryTable 控制台报错 t-primary-table 未注册[issue #373](https://github.com/Tencent/tdesign-vue/issues/373)
  - 表格组件设置 height 或 maxHeight 后未出现滚动条的时候竖线不对齐，[issue #378](https://github.com/Tencent/tdesign-vue/issues/378)
  - 修复，排序图标和过滤图标同时存在时，样式异常问题
### 🚀 Features

* Table:
  - 排序交互变更：排序方式支持点击直接排序[issue #480](https://github.com/Tencent/tdesign-vue/issues/480)
  - 优化表格最后一列 `ellipsis` 浮层位置底部右对齐
  - 新增超出省略功能， `ellipsis` 支持透传 Popup 组件全部属性
  - 新增表尾合计行，支持固定在底部，支持多行合计，支持完全自定义内容 [issue #116](https://github.com/Tencent/tdesign-vue/issues/116)
  - 新增`loadingProps` 透传加载组件全部特性
  - 新增固定行（冻结行）
  - 虚拟滚动，[issue #74](https://github.com/Tencent/tdesign-vue/issues/74)，[@Louiszhai](https://github.com/Louiszhai)
  - 新增排序图标自定义，插槽(slot='filterIcon')和渲染函数(props.filterIcon) 均可
  - 新增全局配置：过滤图标、空元素、异步加载文本配置、排序按钮文本配置
  - 新增 `scroll` 滚动事件
  - 新增表头吸顶功能，[issue #216](https://github.com/Tencent/tdesign-vue/issues/216)
  - 新增综合功能：多级表头 + 固定表头 + 固定列 + 表头吸顶 + 虚拟滚动 + 自定义列配置
  - 过滤功能，条件为真时，高亮筛选图标


## 🌈 0.38.1 `2022-03-26`
### 🚀 Features
* SelectInput: 实现 `enter` 事件 [pr #642](https://github.com/Tencent/tdesign-vue/pull/642)，[@pengYYYYY](https://github.com/pengYYYYY)

## Bug Fixes
* SelectInput: 修复单选可输入状态下的 focus 时 input value 的错误 [pr #642](https://github.com/Tencent/tdesign-vue/pull/642)，[@pengYYYYY](https://github.com/pengYYYYY)

## 🌈 0.38.0 `2022-03-25`
### ❗️ BREAKING CHANGES
* Input/Textarea: Input 外部传入样式挂载至 `t-input__wrap` 层级的 DOM 节点，不再传入到 `t-input` 层级；Textarea 去除 `t-textarea__wrap`，[pr #276](https://github.com/Tencent/tdesign-vue/pull/627)，[@pengYYYYY](https://github.com/pengYYYYY)

### 🐞 Bug Fixes

* Form: 修复不能在表单项内换行输入的问题，[pr #624](https://github.com/Tencent/tdesign-vue/pull/624)，[@chaishi](https://github.com/chaishi)
* Select: 修复未选值时，键盘事件不生效的问题，[pr #603](https://github.com/Tencent/tdesign-vue/pull/603)，[@geff1991](https://github.com/geff1991)
* Menu: 修复无 overflow 状态时，仍出现滚动条的问题，[pr #597](https://github.com/Tencent/tdesign-vue/pull/597)，[@LeeJim](https://github.com/LeeJim)
* Popup: 修复 document click 多次触发导致异常关闭的问题，[issue #558](https://github.com/Tencent/tdesign-vue/issues/558)，[@ikeq](https://github.com/ikeq)
* Progress: 修复 `theme = plump` 且 `percent = 10` 时没有展示文案的问题，[issue #569](https://github.com/Tencent/tdesign-vue/issues/569)，[@uyarn](https://github.com/uyarn)
* TreeSelect: 修复 `placehodler` 告警，[pr #624](https://github.com/Tencent/tdesign-vue/pull/624)，[@chaishi](https://github.com/chaishi)
* InputNumber: 默认尺寸下输入框宽度调整，修复默认内容展示不全的问题，[issue #623](https://github.com/Tencent/tdesign-vue/issues/623)，[@xiaosansiji](https://github.com/xiaosansiji)
* Upload: 修复 `handleSuccess` 回调并发导致 v-model 设置数据失效的问题，[pr #628](https://github.com/Tencent/tdesign-vue/pull/628)，[@brianzhang](https://github.com/brianzhang)
* Datepicker/Timepicker: focused 态样式修复
* SelectInput:
  - 修复在非输入状态下无 focused 态
  - 修复在非输入状态下不显示清除按钮
  - 修复在 single 模式下 inputValue 的受控表现
* Cascader: [@pengYYYYY](https://github.com/pengYYYYY)
  - 修复 `value` 为 number 类型时无法回显的问题，[issue #619](https://github.com/Tencent/tdesign-vue/issues/619)
  - 修复动态修改 `options` 为空数组时不生效的问题，[issue #467](https://github.com/Tencent/tdesign-vue/issues/467)

### 🚀 Features

* Table: 支持自定义 columns，[pr #423](https://github.com/Tencent/tdesign-vue/pull/423)，[@LeeJim](https://github.com/LeeJim)
* Message: 将 `placement = center` 的 fadeIn 动画改为从上往下出现，[pr #611](https://github.com/Tencent/tdesign-vue/pull/611)，[@Zack921](https://github.com/Zack921)
* Input: 增加 `inputClass` 属性，用于透传 class 到 `t-input` 同级，[pr #276](https://github.com/Tencent/tdesign-vue/pull/627)，[@pengYYYYY](https://github.com/pengYYYYY)
* Upload: 新增 `allowUploadDuplicateFile` 属性，支持重复文件名的文件上传，[pr #636](https://github.com/Tencent/tdesign-vue/pull/636)，[@brianzhang](https://github.com/brianzhang)

## 🌈 0.37.2 `2022-03-18`
### 🐞 Bug Fixes

* Button: 修复 `disabled` 不生效的问题，[pr #584](https://github.com/Tencent/tdesign-vue/pull/584)，[@lanniuniu](https://github.com/lanniuniu)
* Cascader: 修复文字过长时不显示 `tooltip` 的问题，[pr #560](https://github.com/Tencent/tdesign-vue/pull/560)，[@pengYYYYY](https://github.com/pengYYYYY)
* Datepicker: 修复 Form 中使用时，触发校验时机错误的问题，[pr #551](https://github.com/Tencent/tdesign-vue/pull/551)，[@zeosun](https://github.com/zeosun)
* InputNumber: 修复小数计算错误的问题，[issue #559](https://github.com/Tencent/tdesign-vue/issues/559)，[@uyarn](https://github.com/uyarn)
* Input: 修复 `readonly` 状态下未响应 focus 事件的问题，[issue #580](https://github.com/Tencent/tdesign-vue/issues/580)，[@YikaJ](https://github.com/YikaJ)
* Popup: trigger 为 hover 时点击引用元素保持开启状态，防止菜单消失，[issue #565](https://github.com/Tencent/tdesign-vue/issues/565)，[@ikeq](https://github.com/ikeq)
* TagInput: [pr #548](https://github.com/Tencent/tdesign-vue/pull/548)，[@pengYYYYY](https://github.com/pengYYYYY)
  - 修复 `breakline` 模式下的 clearIcon 样式重叠的问题
  - 修复 `autowidth` 模式下的 padding 不对称
  - 修复超出滚动失效
  - 修复 `paste` 事件未生效
* TreeSelect: 修复异步加载数据的情况下，`label` 展示错误的问题，[issue #537](https://github.com/Tencent/tdesign-vue/issues/537)，[@YikaJ](https://github.com/YikaJ)
* InputNumber: 修复 `value` 为 null 时组件报错的问题，[pr #598](https://github.com/Tencent/tdesign-vue/pull/598)，[@xiaosansiji](https://github.com/xiaosansiji)

### 🚀 Features

* Timepicker: `close`、`open` 事件回调增加参数，[pr #587](https://github.com/Tencent/tdesign-vue/pull/587)，[@uyarn](https://github.com/uyarn)

## 🌈 0.37.0 `2022-03-14`

### ❗️ BREAKING CHANGES
* Input: `DOM` 结构调整，最外层调整为 `t-input-wrap`，有覆盖过 Input 相关组件样式的同学请注意，[common pr #276](https://github.com/Tencent/tdesign-common/pull/276)，[@pengYYYYY](https://github.com/pengYYYYY)
### 🐞 Bug Fixes

* Select:
  - 修复已选值不在可选时不显示的问题，[issue #526](https://github.com/Tencent/tdesign-vue/issues/526)，[@geff1991](https://github.com/geff1991)
  - 增加 `icon`的兼容 `class`，解决样式问题，[pr #529](https://github.com/Tencent/tdesign-vue/pull/529)，[@pengYYYYY](https://github.com/pengYYYYY)
* Form: 修复当 `rule message` 为空时，不显示具体文案的问题，[issue #520](https://github.com/Tencent/tdesign-vue/issues/520)，[@YikaJ](https://github.com/YikaJ)
* Cascader: 修复 Cascade 组件可选任意一级时缺少高亮状态的问题，[pr #531](https://github.com/Tencent/tdesign-vue/pull/531)，[@pengYYYYY](https://github.com/pengYYYYY)
* Input/TagInput: [pr #522](https://github.com/Tencent/tdesign-vue/pull/522)，[@pengYYYYY](https://github.com/pengYYYYY)
  - Input 修复前后置标签输入框同时存在时，左侧样式异常的问题
  - TagInput 修复不同状态的标签输入框，样式异常的问题

### 🚀 Features

* Form: `FormItem` 提供控件级别的 `showErrorMessage` 配置，优先级高于 `Form.showErrorMessage`，[pr #514](https://github.com/Tencent/tdesign-vue/pull/514)，[@YikaJ](https://github.com/YikaJ)
* Message: 新增组件出现和消失有线性渐入渐出动画，[pr #405](https://github.com/Tencent/tdesign-vue/pull/405)，[@Zack921](https://github.com/Zack921)
* InputNumber:
  - 支持 `autoWidth` 属性，[pr #541](https://github.com/Tencent/tdesign-vue/pull/541)，[@uyarn](https://github.com/uyarn)
  - 增加状态设置与提示设置功能，[pr #519](https://github.com/Tencent/tdesign-vue/pull/519)，[@jchalex](https://github.com/jchalex)

## 🌈 0.36.0 `2022-03-07`

### ❗️ BREAKING CHANGES
* Input: input 元素 `ref` 名称由 `refInputElem` 更为 `inputRef，`[pr #428](https://github.com/Tencent/tdesign-vue/pull/433)，[@pengYYYYY](https://github.com/pengYYYYY)

### 🐞 Bug Fixes

* Select:
  - 修复选项无法跟随 options slot 改变而变化的问题，[issue #495](https://github.com/Tencent/tdesign-vue/issues/495)，[@YikaJ](https://github.com/YikaJ)
  - 可创建新条目的选择器在输入框中没有值时，依然显示 `createOption` 的问题，[issue #482](https://github.com/Tencent/tdesign-vue/issues/482)，[@xiecz123](https://github.com/xiecz123)
* Drawer: 修复 `destroyOnClose` 为 `true` 时报错的问题，[issue #504](https://github.com/Tencent/tdesign-vue/issues/504)，[@uyarn](https://github.com/uyarn)
* Breadcrumb: 修复 breadcrumb-item 设置 `disabled` 样式失效的问题，[issue #461](https://github.com/Tencent/tdesign-vue/issues/461)，[@Zwow](https://github.com/Zwow)
* Cascader: 修复大数据量下卡顿的问题，[issue #477](https://github.com/Tencent/tdesign-vue/issues/477)，[@delenzhang](https://github.com/delenzhang)
* Dialog: 修复传入 `closeBtn = false` 时，依旧渲染关闭按钮元素的问题，[pr #451](https://github.com/Tencent/tdesign-vue/pull/451)，[@gh-mrhuang](https://github.com/gh-mrhuang)
* Timepicker: 修复禁用态时仍可打开弹窗的问题，[pr #494](https://github.com/Tencent/tdesign-vue/pull/494)，[@uyarn](https://github.com/uyarn)
* Datepicker: [@xiaosansiji](https://github.com/xiaosansiji)
  - 修复点击选择日期面板的顶部年份、月份按钮导致面板隐藏的问题，[issue #443](https://github.com/Tencent/tdesign-vue/issues/443)
  - 修复传入 `onChange` 事件未能正常触发的问题，[issue #449](https://github.com/Tencent/tdesign-vue/issues/449)
  - 修复无法清除面板中已选值的问题，[issue #448](https://github.com/Tencent/tdesign-vue/issues/448)

### 🚀 Features

* Upload: 支持单请求上传批量文件，[pr #486](https://github.com/Tencent/tdesign-vue/pull/486)，[@YikaJ](https://github.com/YikaJ)
* Checkbox: [pr #433](https://github.com/Tencent/tdesign-vue/pull/433)，[@pengYYYYY](https://github.com/pengYYYYY)
  - `change` 事件新增参数 `context.current` 表示当前变化的数据项， `context.type` 表示引起选中数据变化的是选中或是取消选中操作
  - CheckboxGroup: 渲染 `key` 换为 index+vale，增加点击事件
* Input:
  - 同时支持驼峰命名和中划线命名的 `suffix` 和 `prefix`
  - 增加 `autoWith` 属性
* 新增 SelectInput 和 TagInput 组件，[pr #433](https://github.com/Tencent/tdesign-vue/pull/433)，[@pengYYYYY](https://github.com/pengYYYYY)
* 全局配置：支持全局关闭斜八度波纹动画，[pr #488](https://github.com/Tencent/tdesign-vue/pull/488)，[@uyarn](https://github.com/uyarn)
* Form: 支持通过 `setValidateMessage` 设置自定义校验结果，`[pr #479](https://github.com/Tencent/tdesign-vue/pull/479)，[@dellyoung](https://github.com/dellyoung)

## 🌈 0.35.1 `2022-02-25`

### 🐞 Bug Fixes

* Slider:
  - 修复拖动过程中 Tooltip 不展示的问题，[pr #440](https://github.com/Tencent/tdesign-vue/pull/440)，[@LuckyWinty](https://github.com/LuckyWinty)
  - 修复游标定位问题，[pr #248](https://github.com/Tencent/tdesign-common/pull/248)，[@pengYYYYY](https://github.com/pengYYYYY)
* Popup/Select: [pr #445](https://github.com/Tencent/tdesign-vue/pull/445)，[@ikeq](https://github.com/ikeq)
  - 修复 Select 多选时 options 初始化解析失败的问题，[issue #458](https://github.com/Tencent/tdesign-vue/issues/458)
  - 优化 Select 空状态样式
  - 修复 Popup content 事件导致的可能需多次点击进行关闭的问题
  - 修复 Popup 触发元素尺寸变化后位置不更新的问题
* TreeSelect: 限制多选 Tag 展示宽度，默认为 `300px`，[pr #450](https://github.com/Tencent/tdesign-vue/pull/450)，[@Godlike-meteor](https://github.com/Godlike-meteor)
* Button: 修复 `primary outline` 模式下边框展示异常的问题，[pr #238](https://github.com/Tencent/tdesign-common/pull/238)，[@pengYYYYY](https://github.com/pengYYYYY)

### 🚀 Features

* Input: 新增 `format` 属性用于格式化数据，[pr #447](https://github.com/Tencent/tdesign-vue/pull/447)，[@mokywu](https://github.com/mokywu)
* Drawer: 新增 `sizeDraggable` 属性用于支持用户拖动改变 Drawer 大小，[pr #463](https://github.com/Tencent/tdesign-vue/pull/463)，[@uyarn](https://github.com/uyarn)


## 🌈 0.35.0 `2022-02-18`
### ❗️ BREAKING CHANGES
* Menu: 移除冗余事件 `onCollapsed`，[pr #428](https://github.com/Tencent/tdesign-vue/pull/428)，[@LeeJim](https://github.com/LeeJim)

### 🐞 Bug Fixes

* Progress:
  - 修复环状进度条小于 5% 时渲染错误的问题，[issue #412](https://github.com/Tencent/tdesign-vue/issues/412)，[@uyarn](https://github.com/uyarn)，[@huanyue2019](https://github.com/huanyue2019)
  - 修复环形进度条不可更改未完成轨道颜色的问题，[issue #368](https://github.com/Tencent/tdesign-vue/issues/368)，[@byq1213](https://github.com/byq1213)
* Drawer: 修复 `keydown`相关事未触发的问题，[issue #381](https://github.com/Tencent/tdesign-vue/pull/381)，[@uyarn](https://github.com/uyarn)
* Form: 修复 `preventSubmitDefault` 无法阻止表单默认提交行为的问题，[issue #400](https://github.com/Tencent/tdesign-vue/issues/400)，[@dellyoung](https://github.com/dellyoung)
* Menu: [@LeeJim](https://github.com/LeeJim)
  - 修复 `expandType` 没有动态变化的问题，[issue #396](https://github.com/Tencent/tdesign-vue/pull/396)
  - 修复浅色模式下 Menu 文件颜色异常的问题，[issue #394](https://github.com/Tencent/tdesign-vue/pull/394)
* Skeleton: 修复 `rowCol` 设置列数失效的问题，
* Table: 修复固定列宽值为 `string` 时展示偏移的问题 [pr #421](https://github.com/Tencent/tdesign-vue/pull/421)，[@Yilun-Sun](https://github.com/Yilun-Sun)
* Textarea: 修复 `value` 未定义时字数统计展示异常的问题，[issue #387](https://github.com/Tencent/tdesign-vue/issues/387)，[@huangpiqiao](https://github.com/huangpiqiao)
* TimePicker: 修复部分鼠标滚动选择出现偏差的问题，[issue #107](https://github.com/Tencent/tdesign-vue/issues/107)，[@uyarn](https://github.com/uyarn)

### 🚀 Features
* Form: 表单项值类型为数组时，FormRule 的 `max` 和 `min` 可以校验数组长度，[issue #301](https://github.com/Tencent/tdesign-react/issues/301)，[@dellyoung](https://github.com/dellyoung)
* Popup: [pr #358](https://github.com/Tencent/tdesign-vue/pull/358)，[@ikeq](https://github.com/ikeq)
  - 支持嵌套使用
  - 去除额外 reference 包裹元素
  - 弹窗展开动画优化
  - `overlayStyle` 类型为 Function 时，增加 `popupElement` 作为第二个参数，表示浮层元素 DOM 节点
  - 新增 `onScroll` 属性，响应下拉选项滚动事件
* Slider: 默认提示主题更改为暗色，[pr #424](https://github.com/Tencent/tdesign-vue/pull/424)，[@LuckyWinty](https://github.com/LuckyWinty)
* Table: 支持使用 `columnController` 属性自定义设置需要展示的列，[pr #423](https://github.com/Tencent/tdesign-vue/pull/423)，[@LeeJim](https://github.com/LeeJim)

## 🌈 0.34.0 `2022-01-27`

### ❗️ BREAKING CHANGES
* Tag: `variant` 可选值修改为 `dark/light/outline/light-outline`，`plain` 已废弃，[pr #369](https://github.com/Tencent/tdesign-vue/pull/369)，[@xiaosansiji](https://github.com/xiaosansiji)

### 🐞 Bug Fixes

* Calendar: [@PsTiu](https://github.com/PsTiu)
  - 修复全局配置 `calendar.controllerConfig` 不生效的问题，[issue #272](https://github.com/Tencent/tdesign-vue/issues/272)
  - 修复 `monthChange` 事件只能通过月份下拉框触发的问题，[pr #350](https://github.com/Tencent/tdesign-vue/pull/350)
  - 修复日历控制区按钮 hover 样式，[pr #169](https://github.com/Tencent/tdesign-common/pull/169)
* Comment: 修复因 textarea 组件样式变更导致示例回复按钮间距消失的问题，[pr #328](https://github.com/Tencent/tdesign-vue/pull/328)，[@dreamsqin](https://github.com/dreamsqin)
* Select: [pr #329](https://github.com/Tencent/tdesign-vue/pull/329)，[@geff1991](https://github.com/geff1991)
  - TreeSelect/Select 修复 `filterable` 模式下，`input focusing` 时，关闭弹出层需要点击空白处两次的问题，[issue #128](https://github.com/Tencent/tdesign-vue/issues/128)，[issue #209](https://github.com/Tencent/tdesign-vue/issues/209)
  - 修复远程搜索时，输入搜索选中后，会再执行一次 `search` 的问题
  - 分组情况下，无子选项时不展示该分组，搜索过滤无子选项时也不展示该分组
  - 修复键盘交互样式导致初次弹出下拉框选项样式不同的问题，[pr #260](https://github.com/Tencent/tdesign-vue/issues/260)
  - 优化 `stopPropagation` 判断防止偶现报错，[pr #246](https://github.com/Tencent/tdesign-vue/issues/246)
* Input: 修复输入框相关样式重复引入的问题，[pr #182](https://github.com/Tencent/tdesign-common/pull/182)，[@xiaosansiji](https://github.com/xiaosansiji)
* Form: [pr #310](https://github.com/Tencent/tdesign-vue/pull/310)，[@chaishi](https://github.com/chaishi)
  - 支持对象和数组嵌套的复杂数据校验，同时可以判断是数组的第几项校验不通过，[issue #185](https://github.com/Tencent/tdesign-vue/issues/185)
  - 修复 `FormItem.statusIcon` 优先级没有大于 `Form.statusIcon` 的问题
  - 修复 `FormItem.rules` 优先级没有大于 `Form.rules` 的问题
* Alert: 修复未正常展示关闭按钮的问题，[issue #360](https://github.com/Tencent/tdesign-vue/issues/360)，[@uyarn](https://github.com/uyarn)
* Select/Input/InputNumber/Switch: 背景色、边框样式等与设计不一致的，统一修复，[pr #194](https://github.com/Tencent/tdesign-common/pull/194)，[@uyarn](https://github.com/uyarn)
* Breadcrumb: 修复面包屑 item disabled 状态样式，[pr #190](https://github.com/Tencent/tdesign-common/pull/190)，[@samhou1988](https://github.com/samhou1988)
### 🚀 Features

* Select:
  - 优化加载中元素样式，[pr #356](https://github.com/Tencent/tdesign-vue/pull/356)，[@geff1991](https://github.com/geff1991)
  - 优化 `options` 的初始化解析，[pr #344](https://github.com/Tencent/tdesign-vue/pull/344)，[@ikeq](https://github.com/ikeq)
* Datepicker: 支持全局配置 `format`，[pr #355](https://github.com/Tencent/tdesign-vue/pull/355)，[@xiaosansiji](https://github.com/xiaosansiji)
* Form: 支持统一配置校验信息，无需每个字段的每个规则都单独配置 `message`，[pr #313](https://github.com/Tencent/tdesign-vue/issues/313)，[@chaishi](https://github.com/chaishi)
* Button: 统一各类型按钮边框宽度，[pr #176](https://github.com/Tencent/tdesign-common/pull/176)，[@BigLiao](https://github.com/BigLiao)
* InputNumber: 优化交互，点击 +/- 按钮时，自动设置值为最小值或最大值，[issue #319](https://github.com/Tencent/tdesign-vue/issues/319)，[@jchalex](https://github.com/jchalex)
* TimePicker: 优化 panel 定位时机，[pr #344](https://github.com/Tencent/tdesign-vue/pull/344)，[@ikeq](https://github.com/ikeq)
* Tooltip: 优化官网 demo 实现，[issue #353](https://github.com/Tencent/tdesign-vue/issues/353)，[@ccccpj](https://github.com/ccccpj)

## 🌈 0.33.2 `2022-01-21`


### 🐞 Bug Fixes

* Form:
  - 修复无法重置自定义校验消息的问题，[issue #89](https://github.com/Tencent/tdesign-vue/issues/89)，[pr #254](https://github.com/Tencent/tdesign-vue/pull/254)，[@dellyoung](https://github.com/dellyoung)
  - FormRule 的 `min` 和 `len` 根据一个中文等于两个字符的计算规则进行，和 `max` 保持一致；`min` 和 `len` 在值为 Number 时，进行数字大小的校验而非数字长度校验，[issue #249](https://github.com/Tencent/tdesign-vue/issues/249)，[pr #249](https://github.com/Tencent/tdesign-vue/pull/249)，[@chaishi](https://github.com/chaishi)
* Grid: 修复 ssr 渲染报错的问题，[issue #284](https://github.com/Tencent/tdesign-vue/issues/284)，[pr #286](https://github.com/Tencent/tdesign-vue/pull/286)，[@HQ-Lin](https://github.com/HQ-Lin)
* Table:
  - 修复首列数据跨行合并时会导致同行数据前移的问题，[issue #242](https://github.com/Tencent/tdesign-vue/issues/242)，[pr #253](https://github.com/Tencent/tdesign-vue/pull/253)，[@realyuyanan](https://github.com/realyuyanan)
  - 修复展开行功能中，图标列无法固定在左侧的问题；修复展开行 colspan 不正确问题，[issue #255](https://github.com/Tencent/tdesign-vue/issues/255)，[pr #255](https://github.com/Tencent/tdesign-vue/pull/255)，[@chaishi](https://github.com/chaishi)
* 修复 umd 产物中未包括 reset 及 css variables 声明的问题，[issue #222](https://github.com/Tencent/tdesign-vue/issues/222)，[@xiaosansiji](https://github.com/xiaosansiji)
* Select: 修复 `visible-change` 事件触发异常的问题，[issue #274](https://github.com/Tencent/tdesign-vue/issues/274)，[pr #281](https://github.com/Tencent/tdesign-vue/pull/281)，[@xiewenxia](https://github.com/xiewenxia)
* Icon: 修复 ssr 渲染问题，[pr #262](https://github.com/Tencent/tdesign-vue/pull/262)，[@uyarn](https://github.com/uyarn)

### 🚀 Features

* Table: 新增 `onCellClick` 事件，[issue #240](https://github.com/Tencent/tdesign-vue/issues/240)，[pr #297](https://github.com/Tencent/tdesign-vue/pull/297)，[@chaishi](https://github.com/chaishi)
* Skeleton: 新增骨架屏组件，请参照[官网](https://tdesign.tencent.com/vue/components/skeleton)使用，[@Wonder233](https://github.com/Wonder233)
* Textarea: 新增属性 `status` 用于控制状态，`tips` 用于控制信息提示，[pr 299](https://github.com/Tencent/tdesign-vue/pull/299)，[@chaishi](https://github.com/chaishi)
* Input: 新增 `tips` 用于控制信息提示， 新增 `mousenter`、`mouseleavt` 、`paste` 事件，[pr #305](https://github.com/Tencent/tdesign-vue/pull/305)，[@chaishi](https://github.com/chaishi)
* Input/InputNumber: 新增 `align` 用于控制输入文本对齐方向，[issue #293](https://github.com/Tencent/tdesign-vue/issues/293)，[pr #320](https://github.com/Tencent/tdesign-vue/pull/320)，[@chaishi](https://github.com/chaishi)

## 🌈 0.33.1 `2022-01-13`

### 🐞 Bug Fixes

* Calendar: 修复月份下拉框组件参数透传错误的问题，[pr 196](https://github.com/Tencent/tdesign-vue/pull/196)，[@PsTiu](https://github.com/PsTiu)
* Cascader: 修复可过滤状态的样式异常 [pr 228](https://github.com/Tencent/tdesign-vue/pull/228)，[@pengYYYYY](https://github.com/pengYYYYY)
* Table: [@realyuyanan](https://github.com/realyuyanan)，[@chaishi](https://github.com/chaishi)
  - 修复固定表头没有对齐的问题，[#206](https://github.com/Tencent/tdesign-vue/issues/206)，[pr 195](https://github.com/Tencent/tdesign-vue/pull/195)
  - 修复无数据时，表格展示高度与 `height` 设置不一致的问题，[#194](https://github.com/Tencent/tdesign-vue/issues/194)
  - 修复异步拉取数据 `maxHeight` 设置不生效的问题，[#134](https://github.com/Tencent/tdesign-vue/issues/134)，[pr 191](https://github.com/Tencent/tdesign-vue/pull/191)
  - 修复表格筛选结果为空时，未显示“暂无数据”的问题，[#178](https://github.com/Tencent/tdesign-vue/issues/178)
* Tag: 修复自定义图标时，点击关闭事件失效的问题，[#198](https://github.com/Tencent/tdesign-vue/issues/198)，[@chaishi](https://github.com/chaishi)
* Datepicker: 修复周起始为月最后一天时，周显示错误的问题，[pr 117](https://github.com/Tencent/tdesign-common/pull/117)，[@xiaosansiji](https://github.com/xiaosansiji)
* Pagination: 去除切换分页时的背景变化动效，减少跨多页切换时的闪烁影响，[#167](https://github.com/Tencent/tdesign-vue/issues/167)，[@xiaosansiji](https://github.com/xiaosansiji)
* Select: 修复禁用状态下下拉 icon 展示问题，[pr 113](https://github.com/Tencent/tdesign-common/pull/113)，[@pengYYYYY](https://github.com/pengYYYYY)

### 🚀 Features

* Table: 为了保证每次展开的数据最新，展开行不再进行预渲染；异步加载功能重构，[pr 197](https://github.com/Tencent/tdesign-vue/pull/197)，[@chaishi](https://github.com/chaishi)
* Alert: 增加内容区折行展开和收起动效，[pr 123](https://github.com/Tencent/tdesign-common/pull/123)，[@pengYYYYY](https://github.com/pengYYYYY)

## 🌈 0.33.0 `2022-01-06`

### ❗️ BREAKING CHANGES

Input 样式调整: 边框等样式由 `t-input__inner` 调整到上层父级 `t-input` class，[pr 98](https://github.com/Tencent/tdesign-common/pull/98)，[@mokywu](https://github.com/mokywu)，有覆盖过 Input 组件默认样式的同学请检查后升级。

### 🐞 Bug Fixes

* Calendar: 修复"年/月"模式切换时展示异常的问题，[pr 109](https://github.com/Tencent/tdesign-vue/pull/109)，[#106](https://github.com/Tencent/tdesign-vue/issues/106)，[@PsTiu](https://github.com/PsTiu)
* Comment: 修复 `avatar` 属性不支持 slot 使用的问题，[pr 165](https://github.com/Tencent/tdesign-vue/pull/165)，[@dreamsqin](https://github.com/dreamsqin)
* Input: 修复清除操作后没有默认 focus input 的问题，[pr 91](https://github.com/Tencent/tdesign-vue/pull/91)，[#90](https://github.com/Tencent/tdesign-vue/issues/90)，[@clark-cui](https://github.com/clark-cui)
* Menu: 修正菜单选项的图标判断逻辑，[pr 154](https://github.com/Tencent/tdesign-vue/pull/154)，[@LeeJim](https://github.com/LeeJim)
* Steps: 修复 `extra` 未正常渲染的问题，[pr 105](https://github.com/Tencent/tdesign-vue/pull/105)，[#36](https://github.com/Tencent/tdesign-vue/issues/36)，[@LuckyWinty](https://github.com/LuckyWinty)
* Table:
  - 修复合并单元格后内容丢失的问题，[pr 125](https://github.com/Tencent/tdesign-vue/pull/131)，[#125](https://github.com/Tencent/tdesign-vue/issues/125)，[@realyuyanan](https://github.com/realyuyanan)
  - 修复固定表头与内容没有对齐的问题，[pr 82](https://github.com/Tencent/tdesign-vue/pull/82)，[#31](https://github.com/Tencent/tdesign-vue/issues/31)，[@realyuyanan](https://github.com/realyuyanan)
  - 修复 `firstFullRow` 和 `lastFullRow` 属性无效的问题，[pr 124](https://github.com/Tencent/tdesign-vue/pull/124)，[#113](https://github.com/Tencent/tdesign-vue/issues/113)，[@xiecz123](https://github.com/xiecz123)
  - 修复 DOM 结构上存在多余属性的问题，[#77](https://github.com/Tencent/tdesign-vue/issues/77)，[@realyuyanan](https://github.com/realyuyanan)
  - 修复 EnhancedTable 第一列 ellipsis 失效的问题，修复分页功能展开异常问题；修复 BaseTable scrollContainer 判空报错的问题，[pr 94](https://github.com/Tencent/tdesign-vue/pull/94)，[#86](https://github.com/Tencent/tdesign-vue/issues/86)，[@chaishi](https://github.com/chaishi)
  - 修复 Loading 遮罩层不能遮挡固定列的问题，[pr 57](https://github.com/Tencent/tdesign-common/pull/57)，[@chaishi](https://github.com/chaishi)
* Textarea: 修正 `change` 事件参数，[pr 132](https://github.com/Tencent/tdesign-vue/pull/132)，[@pengYYYYY](https://github.com/pengYYYYY)
* TreeSelect: 修复组件data异步加载展示异常的问题，[pr 103](https://github.com/Tencent/tdesign-vue/pull/103)，[#96](https://github.com/Tencent/tdesign-vue/issues/96)，[@Godlike-meteor](https://github.com/Godlike-meteor)
* 修复构建产物中 css 变量文件重复引入的问题，[pr 78](https://github.com/Tencent/tdesign-common/pull/78)，[pr 141](https://github.com/Tencent/tdesign-vue/pull/141)，[@xiaosansiji](https://github.com/xiaosansiji)
* Radio: 修复边框及填充型 RadioButton 颜色 token 使用错误的问题，[pr 100](https://github.com/Tencent/tdesign-common/pull/100)，[@xiaosansiji](https://github.com/xiaosansiji)
* Popup: 修复鼠标移到弹出层外松开后弹出层不消失的问题，[pr 65](https://github.com/Tencent/tdesign-vue/pull/65)，[@geff1991](https://github.com/geff1991)
* Upload: 修复自定义样式按钮样式问题，[#78](https://github.com/Tencent/tdesign-vue/issues/78)，[@byq1213](https://github.com/byq1213)
* Button: 修复 `small/large` 尺寸下圆形按钮样式问题，[#127](https://github.com/Tencent/tdesign-vue/issues/127)，[@clark-cui](https://github.com/clark-cui)
### 🚀 Features

* Drawer: 增加 `preventScrollThrough` 属性用于控制是否防止滚动穿透，[pr 98](https://github.com/Tencent/tdesign-vue/pull/98)，[#73](https://github.com/Tencent/tdesign-vue/issues/73)，[@caoML](https://github.com/caoML)
* Tabs: [@start940315](https://github.com/start940315)
  - 窗口 resize 时重新触发计算 navbar 样式，[pr 112](https://github.com/Tencent/tdesign-vue/pull/112)
  - Tab Panel 更新时联动更新 Tab 父组件，[pr 158](https://github.com/Tencent/tdesign-vue/pull/158)
  - inject parent，防止 tabs 和 tab_panel 不是直接父子关系，[pr 159](https://github.com/Tencent/tdesign-vue/pull/159)
* Input:
  - 新增 `label` 和 `suffix` 用于支持左侧、右侧文本配置能力，[pr 88](https://github.com/Tencent/tdesign-vue/pull/88)，[#81](https://github.com/Tencent/tdesign-vue/issues/81)，[@mokywu](https://github.com/mokywu)
  - 支持文本全局配置，[pr 85](https://github.com/Tencent/tdesign-vue/pull/85)，[@pengYYYYY](https://github.com/pengYYYYY)
* Radio: 新增 `allowUncheck` 属性，用于控制是否允许取消选中状态，[pr 123](https://github.com/Tencent/tdesign-vue/pull/123)，[@start940315](https://github.com/start940315)
* Select: 新增 `showArrow/panelTopContent/panelBottomContent` 属性用于自定义 Select 相关内容区域，[pr 137](https://github.com/Tencent/tdesign-vue/pull/137)，[#137](https://github.com/Tencent/tdesign-vue/issues/137)，[@chaishi](https://github.com/chaishi)
* Steps: 新增 `readonly` 属性，[pr 93](https://github.com/Tencent/tdesign-vue/pull/93)，[@chaishi](https://github.com/chaishi)
* Table:
  - 去除滚动条宽度的计算逻辑，[pr 122](https://github.com/Tencent/tdesign-vue/pull/122)，[@realyuyanan](https://github.com/realyuyanan)
  - 新增 `disableDataSort` 是否禁用本地数据排序，[pr 94](https://github.com/Tencent/tdesign-vue/pull/94)，[@chaishi](https://github.com/chaishi)
* Cascader: 新增 `valueType` 用于控制选中值的类型，可选值：`single/full`，[pr 170](https://github.com/Tencent/tdesign-vue/pull/170)，[@pengYYYYY](https://github.com/pengYYYYY)
- Popup: 优化 Popup 及相关的 Dialog/Tooltip 等相关弹窗组件动画实现效果，[pr 106](https://github.com/Tencent/tdesign-common/pull/106)，[@uyarn](https://github.com/uyarn)

## 🌈 0.32.0 `2021-12-23`

### ❗️ BREAKING CHANGES

CSS 类名规范: 
  组件相关类名根据 [BEM](https://github.com/Tencent/tdesign-common/blob/develop/css-naming.md) 规范重新整理，有覆盖过组件库默认样式的同学请务必参照 [#59](https://github.com/Tencent/tdesign-vue/issues/59) 检查后升级。

### 🐞 Bug Fixes

- Input: 修复 Input 无默认 placeholder 的问题，[pr 43](https://github.com/Tencent/tdesign-vue/pull/43)，[@pengYYYYY](https://github.com/pengYYYYY)
- Pagination: 修复未限制跳转边界的问题，[pr 40](https://github.com/Tencent/tdesign-vue/pull/40)，[@pengYYYYY](https://github.com/pengYYYYY)
- Select:
  - 修复 `options` 中的选项 `value` 为空时不能选中的问题，[commit](https://github.com/Tencent/tdesign-vue/commit/25fea9d042964dedf5d7c468464b7acfddbe007f)，[@geff1991](https://github.com/geff1991)
  - 修复下拉框有滚动条时，会挤占弹出层宽度，导致部分选项出现省略号的问题，[pr 18](https://github.com/Tencent/tdesign-vue/pull/18)，[@geff1991](https://github.com/geff1991)
- TreeSelect: 修复空数据时报错的问题，[pr 47](https://github.com/Tencent/tdesign-vue/pull/47)，[@Godlike-meteor](https://github.com/Godlike-meteor)
- Timepicker: 修复 `HH:mm:ss A` 格式下上下午列没有展示的问题，[pr 12](https://github.com/Tencent/tdesign-vue/pull/12)，[@uyarn](https://github.com/uyarn)
- Checkbox: 修复受控用法下 `change` 重复触发的问题，[pr 43](https://github.com/TDesignOteam/tdesign-vue/pull/43)，[@chaishi](https://github.com/chaishi)
- Table: 固定表头与内容没有对齐的问题，[pr 82](https://github.com/Tencent/tdesign-vue/pull/82)，[@realxiaoyu](https://github.com/realyuyanan)
- Slider: 修复在inputNumber 使用 theme: row 时样式错误问题，[common pr 48](https://github.com/Tencent/tdesign-common/pull/48)，[@southorange1228](https://github.com/southorange1228)
- InputNumber: 修复内容过长时输入框不能自适应宽度的问题，[pr 46](https://github.com/Tencent/tdesign-common/pull/46)，[# 47](https://github.com/Tencent/tdesign-vue-next/issues/47)，[@clark-cui](https://github.com/clark-cui)
- Menu: 删除无效 content，[pr 47](https://github.com/Tencent/tdesign-common/pull/47)，[@southorange1228](https://github.com/southorange1228)
- Upload: 修复触发元素宽度过大问题，[pr 50](https://github.com/Tencent/tdesign-common/pull/50)，[@byq1213](https://github.com/byq1213)

### 🚀 Features

- Icon: 官网图标示例支持选中复制代码能力，详情请访问 [官网](https://tdesign.tencent.com/vue/components/icon) 体验
- Select: 支持键盘交互能力，[pr 18](https://github.com/Tencent/tdesign-vue/pull/18)，[@geff1991](https://github.com/geff1991)
- Tree: treeNodeModel 添加 `setData`, `remove` 方法；优化动画性能。[pr 58](https://github.com/TDesignOteam/tdesign-vue/pull/58)，[@TabSpace](https://github.com/TabSpace)
- Form: 过滤 validate 结果，当字段校验不通过时，只返回校验失败的结果，[pr 55](https://github.com/TDesignOteam/tdesign-vue/pull/55)，[@dellyoung](https://github.com/dellyoung)
- Pagination: 支持受控用法，[pr 42](https://github.com/TDesignOteam/tdesign-vue/pull/42)，[@chaishi](https://github.com/chaishi)
- Tabs: 没有选项卡时依然可以显示新增选项卡按钮，[pr 10](https://github.com/Tencent/tdesign-vue/pull/10)，[@start940315](https://github.com/start940315)


## 🌈 0.31.0 `2021-12-09`

### ❗️ BREAKING CHANGES

- Loading: CSS 类名规范，[@chaishi](https://github.com/chaishi)
- Anchor: CSS 类名规范，[@zWingz](https://github.com/zWingz)
- Slider:
  - `inputNumberProps` 默认值改为 `false`，[@pengYYYYY](https://github.com/pengYYYYY)
  - 内置 inputNumber 组件 DOM 层级调整，[@pengYYYYY](https://github.com/pengYYYYY)

### 🐞 Bug Fixes

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

### 🚀 Features

- Loading: `size` 支持传入 `string` 类型字体大小单位，[@chaishi](https://github.com/chaishi)
- Menu: 优化侧边导航栏滚动条样式，[@pengYYYYY](https://github.com/pengYYYYY)
- 兼容项目中使用了 [@vue/composition-api](https://www.npmjs.com/package/@vue/composition-api) 的情况：默认使用项目中引入的 `composition-api` 包，[@LeeJim](https://github.com/LeeJim)
- Dropdown: [@uyarn](https://github.com/uyarn)
  - `minColumnWidth` 和 `maxColumnWidth` 支持 `string` 类型
  - DropdownItem `value` 支持 `object` 类型
- Cascader: [@pengYYYYY](https://github.com/pengYYYYY)
  - 补充 `onChange` args
  - 空数据时下拉框宽度跟随 input 宽度设置

## 🌈 0.30.0 `2021-12-02`

### ❗️ BREAKING CHANGES

- CSS 类名规范: [@chaishi](https://github.com/chaishi)
  - Dialog: `t-dialog-confirm` 更为 `t-dialog__confirm`，`t-dialog-cancel` 更为 `t-dialog__cancel`
  - Drawer: `t-drawer-confirm` 更为 `t-drawer__confirm`，`t-drawer-cancel` 更为 `t-drawer__cancel`

### 🐞 Bug Fixes

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

### 🚀 Features

- Upload: [@chaishi](https://github.com/chaishi)
  - 自动上传模式删除非必要上传按钮
  - 输入框模式新增删除按钮
- Popconfirm: 移除 确认/取消按钮 外层元素 `<span>` [@chaishi](https://github.com/chaishi)
- Textarea: 支持 `maxcharacter` 用于字符文本长度控制 [@zhaodanchun](https://github.com/zhaodanchun)
- Table: `expandedRow` 支持插槽写法 [@realyuyanan](https://github.com/realyuyanan)
- Cascader: 补充 `change` 事件缺失的 `context` 参数，包含触发节点和触发来源 `{ node, source }` [@chaishi](https://github.com/chaishi)
- TreeSelect: 补充 `blur` 和 `focus` 事件参数 `FocusEvent` [@chaishi](https://github.com/chaishi)
- Checkbox: 全选功能支持插槽写法 [@chaishi](https://github.com/chaishi)

## 🌈 0.29.1 `2021-11-30`

### 🐞 Bug Fixes

- Popup: 修复嵌套使用 Popup 时不能正确响应 hover trigger 的问题 [@ikeq](https://github.com/ikeq)
- Datepicker: 修复 0.29.0 版本中星期显示错误的问题
- Upload: 修复图片预览框闪动的问题 [@chaishi](https://github.com/chaishi)

### 🚀 Features

- Upload: 新增开关，用于控制是否显示为模拟进度 [@chaishi](https://github.com/chaishi)
- Datepicker [@xiaosansiji](https://github.com/xiaosansiji)
- `firstDayOfWeek` API 重构，官网新增设置星期开始样例
- 全局配置星期和月份文案格式修改

## 🌈 0.29.0 `2021-11-24`

### ❗️ BREAKING CHANGES

- Menu: `expanded` 优化为受控属性，`defaultExpanded` 为非受控属性 [@LeeJim](https://github.com/LeeJim)
- LocalProvider 配置多语言方案已废弃，请升级为 ConfigProvider，参考 [文档](https://tdesign.tencent.com/vue/components/config)，[@chaishi](https://github.com/chaishi)
- Select: TS 类型 `Options` 更为 `SelectOption`，[@chaishi](https://github.com/chaishi)

### 🐞 Bug Fixes

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

### 🚀 Features

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

## 🌈 0.28.2 `2021-11-16`

### ❗️ BREAKING CHANGES

- 从 0.28.0 版本开始，将只在外网 npm registry 上发布，请安装外网包 [tdesign-vue](https://www.npmjs.com/package/tdesign-vue)
- 有单独引入图标使用的小伙伴请改为引入外网包 `tdesign-icons-vue`

### 🐞 Bug Fixes

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

### 🚀 Features

- Menu: 优化多级菜单的缩进，处理 popup 箭头旋转，[@LeeJim](https://github.com/LeeJim)
- Avatar: 新增头像组件，使用请参考 [官网文档](https://tdesign.tencent.com/vue/components/avatar)，[@gh1198843222](https://github.com/gh1198843222)
- Loading: 所有官方组件中的加载状态，统一修改为 Loading 组件实现，统一体验，[@uyarn](https://github.com/uyarn)
- Table: `rowClassName` 支持传入 `string` 类型，[@realyuyanan](https://github.com/realyuyanan)
- Calendar: 组件及 ConfigProvider 均新增 `fillWithZero` 属性，用于控制日期以 'dd' 格式展示，[@PsTiu](https://github.com/PsTiu)
- Tabs: 组件重构，修复滚动问题，[@start940315](https://github.com/start940315)

## 🌈 0.27.2 `2021-11-09`

### 🐞 Bug Fixes

- Table: 修复 `size=small` 时，排序按钮被遮挡的问题 [@realyuyanan](https://github.com/realyuyanan)

### 🚀 Features

- Popconfirm: 确认及取消按钮支持 slot 用法 [@zhaodanchun](https://github.com/zhaodanchun)
- Icon: 包中默认导出及注册 Icon 组件，兼容全量引入图标的用法，[@uyarn](https://github.com/uyarn)

## 🌈 0.27.0 `2021-11-08`

### ❗️ BREAKING CHANGES

- Icon: 官方提供的默认 Icon 拆分为 npm 独立包发布，有单独引入图标使用的小伙伴请改为引入 `tdesign-icons-vue`。
- Table: 优化样式类名，`t-table-row--selected` 更为 `t-table__row--selected`，`t-table-row--disabled` 更为 `t-table__row--disabled`

### 🐞 Bug Fixes

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

### 🚀 Features

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

## 🌈 0.26.0 `2021-11-01`

### 🐞 Bug Fixes

- 全局注册：自动全局注册所有组件，防止使用 umd 资源时组件无法渲染的问题 [@BuptStEve](https://github.com/BuptStEve)
- Popup: 修复 popperjs 2.10.0 版本类型校验导致的报错 ，[@ikeq](https://github.com/ikeq)
- InputNumber: 修复增加/减少控制按钮 Icon 无法正常显示的问题 [@HQ-Lin](https://github.com/HQ-Lin)
- Table: 修复隐藏行展开控制图标时，点击仍然响应的问题 [@chaishi](https://github.com/chaishi)
- Cascader: ，[@pengYYYYY](https://github.com/pengYYYYY)
  - 修复 `filterable` 属性设置无效的问题，
  - 修复 Cascader 不支持完全受控用法的问题，
  - 修复 设置为 `check-strictly` 模式时，点击非叶子节点报错的问题，
- Datepicker: 修复 `placeholder` 属性传入数组类型报错的问题 [@xiaosansiji](https://github.com/xiaosansiji)

### 🚀 Features

- 暗黑模式：组件支持暗黑模式在线切换，使用请参考 [文档](http://tdesign.tencent.com/vue/components/dark-mode)，[@xiaosansiji](https://github.com/xiaosansiji)
- Cascader: ，[@pengYYYYY](https://github.com/pengYYYYY)
  - 新增 `minCollapsedNum` 属性，用于多选情况下，控制超出该数值的选中项折叠显示
  - 新增 `collapsedItems` 属性，用于设置折叠项内容，默认为 `+N`
- Form: 优化 FormItem 提示文案展示效果，防止出现提示时出现页面闪动或滚动的效果，[@HQ-Lin](https://github.com/HQ-Lin)
- Textarea: 透传外层属性，[@zhaodanchun](https://github.com/zhaodanchun)
- Datepicker: [@xiaosansiji](https://github.com/xiaosansiji)
  - 新增 `pick` 事件，面板中选中日期时触发，
  - 选择时间段时，开始时间优化为 `00:00:00`，结束时间为 `23:59:59`，

## 🌈 0.25.0 `2021-10-21`

### ❗️ BREAKING CHANGES

- Button: `shape` 默认值由 `square` 调整为 `rectangle`，支持正方形按钮展示，手动设置 `shape = square` 的小伙伴请删除设置，没有设置过 `shape` 属性的可以忽略，[@HQ-Lin](https://github.com/HQ-Lin)

### 🐞 Bug Fixes

- InputNumber: 修复 `value = undefined` 时报错的问题 [@jchalex](https://github.com/jchalex)
- Radio: 修复 RadioButton `options` 为空数组时报错的问题 [@HQ-Lin](https://github.com/HQ-Lin)
- Popup/Tooltip: 修复 reference 宽度过小时箭头位置展示错位的问题 [@ikeq](https://github.com/ikeq)
- Select: 修复多选模式下，选项无法点击选中的问题 [@geff1991](https://github.com/geff1991)
- Table:
  - 修复固定列时投影样式溢出的问题 [@realyuyanan](https://github.com/realyuyanan)
  - 修复跨表格拖拽时会交换行的问题，[@cool-518](https://github.com/cool-518)

### 🚀 Features

- Tooltip: `theme` 新增可选值 `light`，支持白色风格 tooltip 弹窗 [@ikeq](https://github.com/ikeq)
- Table: ，[@chaishi](https://github.com/chaishi)
  - 新增 `expandIcon` 属性，支持自定义展开图标
  - 新增 `expandOnRowClick` 属性，允许点击整行展开/收起
  - 支持 `row-mouseenter` 和 `row-mouseleave` 事件
- Dropdown: 支持 `dropdown-item` slot 用法，[@uyarn](https://github.com/uyarn)
- Popup: 优化弹出层方向判断逻辑 [@uyarn](https://github.com/uyarn)

## 🌈 0.24.0 `2021-10-14`

### ❗️ BREAKING CHANGES

组件注册名称统一为大驼峰，支持在 Webstorm 中使用组件时代码提示能力 [@chaishi](https://github.com/chaishi)

### 🐞 Bug Fixes

- Table: 修复固定列时表格内容不居中的问题 ，[@realyuyanan](https://github.com/realyuyanan)
- Textarea: 修复字符长度默认显示错误的问题 ，[@zhaodanchun](https://github.com/zhaodanchun)
- Popup: 移除 button disable 状态判断，修复 popup 无法正常弹出的问题 [@ikeq](https://github.com/ikeq)
- Transfer:
  - 修复被禁用选项，仍然可以被全选选中的问题，[@uyarn](https://github.com/uyarn)
  - 修复 button 存在重复 key 的问题，[@chaishi](https://github.com/chaishi)
- Button、Select、Input: 修复默认浅色模式下背景颜色异常的问题
- TreeSelect: 修复多选时使用 checkbox 报错的问题 [@Godlike-meteor](https://github.com/Godlike-meteor)
- Select: 修复 `filterable` 模式下点击输入框右侧空白处时未能正常显示 `focus` 态的问题，[@geff1991](https://github.com/geff1991)

### 🚀 Features

- TreeSelect: 新增 `collapsedItems` 和 `minCollapsedNum`，用于支持选择过多时省略显示 [@Godlike-meteor](https://github.com/Godlike-meteor)
- Select: 新增 `collapsedItems` 和 `minCollapsedNum`，用于支持选择过多时省略显示；增加 `onEnter` 事件，[@geff1991](https://github.com/geff1991)

## 🌈 0.23.5 `2021-09-29`

### 🐞 Bug Fixes

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

### 🚀 Features

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

## 🌈 0.23.4 `2021-09-22`

### 🐞 Bug Fixes

- Select:
  - 修复 disabled 态下仍然展示响应态的问题 [@geff1991](https://github.com/geff1991)
  - 修复受控用法下使用异常的问题 [@geff1991](https://github.com/geff1991)

### 🚀 Features

- Anchor: 支持自定义游标，详情参见官网 [demo](https://tdesign.tencent.com/vue/components/anchor#自定义游标)
- Menu: 支持超过两级的菜单展示，[@LeeJim](https://github.com/LeeJim)
- Form: FormItem 支持单独设置 `labelWidth`、`labelAlign`，优先级高于 Form 的同名属性，[@HQ-Lin](https://github.com/HQ-Lin)

## 🌈 0.23.2 `2021-09-16`

### 🐞 Bug Fixes

- Tag: 修复主题配置模式下关闭按钮显示异常的问题，
- Tooltip: 修复 `overlayClassName` 不能正常向 Popup 组件传递的问题
- Datepicker: 修复 v-model 使用场景下 value 未同步的问题，、、

### 🚀 Features

- Textarea: 新增 `autosize` 属性，`autosize = true` 时允许文本框高度自动撑开，同时允许手动拖动控制高度

## 🌈 0.23.1 `2021-09-14`

### ❗️ BREAKING CHANGES

- Menu: 去除顶部导航菜单 operations 区域内 icon 默认样式，解决 ，升级到 0.23.0 版本的用户请手动为 icon 实现样式，或增加 `t-menu__operations-icon` class 名称。
- List: `avatar` 属性更名为 `image`，用于配置列表项图片，

### 🐞 Bug Fixes

- Transfer: 修复点击操作按钮过程中，动画展示异常的问题，
- Upload: 修复服务端渲染场景下报错的问题，
- Input: 修复 `keypress` 事件未生效的问题，
- Drawer: 修复 `header=false` 时仍展示头部区域的问题，
- Tag: 修复可删除和 `maxWidth` 属性并存时，“删除” icon 未正常显示的问题，
- List: 修复 `asyncLoading` 为空时，控制台报错的问题，
- Table:
  - 修复在 Dialog 中使用 Table 组件，`ellipsis=true` 且文字过长时 tooltip 未正常展示的问题，、
  - 修复列动态变化时，固定列无效的问题，

### 🚀 Features

- Slider: 新增滑块输入组件，[官网 Slider](http://tdesign.tencent.com/vue/components/slider)
- Radio:
  - 新增 `variant` 属性用于控制单选框组件按钮形式
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

## 🌈 0.22.8 `2021-09-03`

### 🐞 Bug Fixes

- Datepicker: 修复未设置 `disableDate` 属性时，时间选项被禁用的问题。

## 🌈 0.22.7 `2021-09-03`

### 🐞 Bug Fixes

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

### 🚀 Features

- TreeSelect:
  - 支持整行节点被选中
  - 新增 `valueType` 属性，用于控制选中项选中时返回类型，可选值为 `value/object`
- Table: 支持拖拽排序，使用参见官网 [示例](http://tdesign.tencent.com/vue/components/table#%E6%8B%96%E6%8B%BD%E6%8E%92%E5%BA%8F)

## 🌈 0.22.6 `2021-08-27`

### 🐞 Bug Fixes

- Select: 修复多选时 `v-model` 绑定的值不支持 `undefined` 的问题，
- Form: 修复 `inline` 模式下 `labelWidth` 失效的问题
- DatePicker:
  - 修复 `onchange` 事件触发回调两次问题，
  - `defaultValue` 支持 `Date` 类型

### 🚀 Features

- Dropdown: 新组件上线，详情参见 [官网](http://tdesign.tencent.com/vue/components/dropdown)

### Performance Improvements

- Select: 改进有较多 option 时卡顿的问题

## 🌈 0.22.5 `2021-08-20`

### 🐞 Bug Fixes

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

### 🚀 Features

- Select、Transfer 选项选中、hover 等交互统一，、
- Table:
  - 补充加载态和异步加载状态示例，
  - 排序功能：修复多字段排序初始值缺陷，新增 `onDataChange` 方法，响应本地数据排序后的数据变化，
  - 加载状态 UI 重构，详情可以参见官网异步加载示例
- Loading: 支持通过设置父级 font-size 来控制 icon 显示大小
- InputNumber:
  - 支持键盘交互，
  - 支持数值为空的情况，

## 🌈 0.22.3 `2021-08-11`

### 🐞 Bug Fixes

- 整理组件声明导出顺序，修复构建产物中组件样式优先级错误的问题

## 🌈 0.22.2 `2021-08-11`

### 🐞 Bug Fixes

- Anchor: ponit 在 line 范围外显示的问题
- Pagination: 修复未正确引入 Select Option 导致的控制台报错问题
- Popup: 修复 Select、Pagination 等依赖 Popup 实现的组件，弹窗方向错误的问题，、
- Table: 修复当启用合并单元格，并有除了 columns 外的数据时出现问题，表格无法正常渲染的问题
- Menu: 移除了 logo slot 的预置样式，以及修复了收起时的抖动问题

### 🚀 Features

- Input: 新增 `maxcharacter` 属性，区别于现有的 `maxlength`，用于控制最多输入的字符个数
- Cascader: 增加展开动画
- Tab: TabPanel `label` 支持 Slot 方式自定义标签内容

## 🌈 0.22.1 `2021-08-05`

### 🐞 Bug Fixes

- 修复 0.22.0 版本构建产物中，部分全局样式丢失问题，
- DatePicker: 修复区间时间选择时，先选择结束时间后无法选择开始时间的问题，
- Upload: 修复不能取消上传，及图片批量上传时只显示“上传中”，没有“百分比”进度的问题，[common # 19]
- Input: 修复 suffix icon 在 `clearable = true` 且有值时不展示原设置的 icon 的问题
- Tabs: 修复选项卡区域出现滚动条时，滚动交互异常的问题，

### 🚀 Features

- DatePicker:
  - 有时间选择时，才显示底部操作栏区域中的确认按钮，
  - 区间日期选择时，头部按钮不再同步前进、后退面板区间，支持跨多个月份日期选择，
- DatePicker、TimePicker、TreeSelect、Select 组件统一增加展开收起动画；Select 箭头增加动画效果。

## 🌈 0.22.0 `2021-07-29`

### 🐞 Bug Fixes

- Table: 使用 `minWidth` 属性时时自动设置 `width`，防止出现 `minWidth` 不生效的问题，
- Pagination: 修复页数显示错误的问题，
- Cascader: 修复渲染了额外 CSS class 类名的问题，

### 🚀 Features

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

## 🌈 0.21.5 `2021-07-21`

### 🐞 Bug Fixes

- Table: 修复 `rowKey` 值不为 `id` 时，`selectedRowData` 返回值为空的问题，

## 🌈 0.21.4 `2021-07-21`

### 🐞 Bug Fixes

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

### 🚀 Features

- 新增 Cascader 级联选择器，详情参见 [官网](https://tdesign.tencent.com/vue/components/cascader)
- Popup: 新增 `zIndex` 用于自定义 z-index 层级，
- Messege: 插件式调用时，`duration` 不再是必传参数，
- TS 支持：导出所有组件 ts 定义，方便在 typescript 项目中使用组件
- 支持 less@4.x 环境下编译

## 🌈 0.21.0 `2021-07-14`

### ❗️ BREAKING CHANGES

- Table API 规范：详情参见
  - 移除 `BaseTable` 组件非必要参数 `width`
  - PrimaryTable 中，`checkboxProps` 更名为 `checkProps`，数据类型为 `RadioProps | CheckboxProps | (({ row, rowIndex }) => RadioProps | CheckboxProps)`
  - BaseTable 中 `rowClassName` 参数由 `(rowKey, row)` 变为 `({ row: RowData; rowIndex: number })`
  - 移除 BaseTableCol 中 `scopedSlots`，转而使用 `cell/title` 自定义插槽名称。默认依旧使用 `colKey` 作为插槽名称

### 🚀 Features

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

## 🌈 0.20.1 `2021-07-13`

### 🐞 Bug Fixes

- Transfer:
  - 修复禁用项仍可被全选的问题
  - 修复列表为空时，依然可以勾选全选的问题
- Button:
  - 修改 button theme 默认值，修复不写 theme 出现 theme-undefined 的类名问题
  - 修复 css 构建产物异常问题，

### 🚀 Features

- Loading:
  - 支持 `LoadingPlugin` 方式调用，
  - 支持 loading icon 部分自定义颜色设置
- Upload: 输入框文件上传，新增上传状态显示
- TreeSelect: `filterable` 和 `filter` 可以单独使用，`filter` 用于自定义本地搜索功能，`filterable` 和 `onSearch` 配合使用用作远程搜索功能配置，

## 🌈 0.20.0 `2021-07-07`

### ❗️ BREAKING CHANGES

- Anchor: 透传 Affix 组件配置能力的 API 命名调整，`affix` 更名为 `affixProps`

### 🐞 Bug Fixes

- InputNumber: 修复输入进位时值未同步的问题
- Pagination: 修复 `pageCount = 1` 时意外隐藏的问题，
- Popconfirm: 修复禁用按钮点击文字区域会触发的问题，
- Table: 修复出现滚动条时列展示错位的问题

### 🚀 Features

- Button: 新增支持 `success/warning` 主题配置，
- Menu: 增加动画效果
- 新增语言文本全局配置的组件：Tree、Select、TreeSelect

## 🌈 0.19.0 `2021-07-02`

### ❗️ BREAKING CHANGES

- Form API 规范: submit 事件参数由 `result` 更为 `validateResult`

### 🐞 Bug Fixes

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

### 🚀 Features

- Form: 新增组件函数 `submit` 和 `reset`，用于处理提交和重置按钮不在 Form 表单内的场景

## 🌈 0.18.0 `2021-06-24`

### ❗️ BREAKING CHANGES

- Popconfirm API 规范：详情参见
  - `cancelText` 重命名为 `cancelBtn`，并新增数据类型 `Object/Function`
  - `confirmText` 重命名为 `confirmBtn`，并新增数据类型 `Object/Function`
  - `theme` 可选值由 `default/info/warning/error` 更为 `default/warning/danger`
  - `icon` 移除数据类型 `string`
- Loading API 规范：
  - `preventScrollThrough` 默认值更为 `true`
  - props 不再支持传入 `className`

### 🐞 Bug Fixes

- Menu: 修复当前菜单重复点击时报错的问题
- Popup: 修复 overlayStyle 动态更新不生效的问题
- Select:
  - 支持自适应下拉框宽度设置，修复 、
  - 修复多选选择器，删除选择项时报错的问题，
- Message、Layout: 修复文案内容超长时溢出的问题，
- Loading: loading 状态修改时包裹元素消失问题

### 🚀 Features

- 新增 DatePicker，使用见 [文档](http://tdesign.tencent.com/vue/components/datepicker)
- Timepicker: 新交互样式修改，支持滑动选取时间
- Transfer: 支持全局配置 `placeholder` 属性
- Dialog、Drawer: `cancelBtn` 值为 `null/undefined` 时，不显示取消按钮
- Popconfirm: 详情参见
  - 支持自由控制展开或隐藏浮层
  - `overlayStyle` 支持 `function` 类型，用于自定义浮层宽度
  - `visible-change` 事件新增参数 `PopupVisibleChangeContext`，用于描述事件来源
- 新增语言文本全局配置的组件：Popconfirm、Pagination、Calendar、Transfer、Drawer、Dialog

## 🌈 0.17.0 `2021-06-16`

### ❗️ BREAKING CHANGES

- Icon: 图标库移除及名称变更 icon，参见
- Steps 组件 API 规范 、、

### 🐞 Bug Fixes

- Icon: 修复.native 修饰才能触发事件问题
- InputNumber: 修复无默认值时报错的问题
- Upload: 修复设置 `header` 属性后上传失败的问题

### 🚀 Features

- Tree-shaking: 组件库增加 `sideEffects` 设置，支持业务系统打包时按需加载组件库
- Notification: `title` 新增支持插槽及 render function
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

## 🌈 0.16.0 `2021-06-08`

### 🐞 Bug Fixes

- Grid: 修复 flex 布局问题
- InputNumber: 修复无默认值时报错的问题

### 🚀 Features

- Dialog & Drawer: 默认 `z-index` 改为 css 控制

## 🌈 0.15.3 `2021-06-03`

### 🐞 Bug Fixes

- Table: 修复表头省略显示问题
- Tree:
  - 修复更新 data 属性值后，dom 未同步更新的问题
  - 解决空数据初始化时不能插入数据的问题
  - 修复 treeItem 图标呈现时，loading 状态覆盖了自定义图标的问题

### 🚀 Features

- Breadcrumb: 面包屑超长部分使用 tooltip 展示
- 📦 打包构建：使用 `typescript2` 替代 `esbuild`

## 🌈 0.15.2 `2021-05-27`

### ❗️ BREAKING CHANGES

- Anchor: API 规范，`attach` 属性改为 `container`

### 🐞 Bug Fixes

- Tree: 组件解决空数据初始化时不能插入数据的问题
- Button: icon only 判断修复
- Layout: 修复组件动态监听 aside 组件问题
- Checkbox: 修复 checkbox display 样式影响 Tree、Select、TreeSelect、Table 组件部分功能体验的问题

### 🚀 Features

- TreeSelect: 增加 TreeSelect 新组件，支持树形选择需求，见[官网](http://tdesign.tencent.com/vue/components/treeselect)
- Popup: 支持通过接受 trigger 元素作为参数的函数定制 overlayStyle
- Select: 扩展 `Options` 类型

## 🌈 0.14.0 `2021-05-17`

- Transfer: `page-change` 事件参数和 API 文档保持一致，由 `{page: pageInfo, context: { type: listType }}` 修改为 `(pageInfo, { type: listType })`

### 🐞 Bug Fixes

- Dialog: 告警和失败类确认对话框，默认 icon 不对的问题修复
- Select: 修复在 Form 表单中使用时，无默认宽度的问题
- Tree: 修复点击事件未携带节点对象的问题
- Form: 修复无法通过 `refs` 访问实例对象的问题

### 🚀 Features

- Popup: 使用 jsx 重构
- Progress:
  - 使用 jsx 重构
  - 去除进度百分比信息内联样式实现
  - 优化 label 展示，进度在 10% 内时自动展示在进度条外侧
  - 支持自定义进度百分比
- Tag: 支持禁用态设置

## 🌈 0.13.0 `2021-04-30`

### ❗️ BREAKING CHANGES

- Pagination: API 规范，`pageSizeOption` 更名为 `pageSizeOptions`
- Upload: API 规范，`limit` 修改为 `max` 控制最大上传数量 、
- Dialog: API 规范，`theme` 可选值 `error` 更为 `danger`
- Select: API 规范，详情见

### 🐞 Bug Fixes

- Select: 修复 value 传入数字时不能正常展示的问题
- Table:
  - 修复无法按需加载的问题
  - 修复 Tips 展示内容错误的问题
- Tabs: 修复点击导航删除按钮时, 未正确 emit remove 事件的问题
- Drawer: 修复设置 `cancelBtn = ''` 时无法将取消按钮渲染为空的问题

### 🚀 Features

- Upload: 新增 `formatResponse` API，用于上传成功后格式化响应数据

## 🌈 0.12.1 `2021-04-26`

### 🐞 Bug Fixes

- Dialog: 修复组件按需加载场景下不支持插件方式使用的问题
- Menu: 修复因依赖路径错误，导致组件库包引入后运行报错的问题

## 🌈 0.12.0 `2021-04-22) 废弃，构建产物有问题，请直接升级到 0.12.1 版`

### ❗️ BREAKING CHANGES

- Menu: API 规范，详情见 、、、、
- Upload: API 规范，详情见 、、
- Pagination & Table: 详情见
  - Pagination 当分页大小和当前页发生变化时均会触发事件 change，且参数由 `(current, pageInfo)` 调整为 `(pageInfo)`
  - Table page-change 事件参数由 `(current, pageInfo)` 调整为 `(pageInfo)`
- InputNumber: API 规范， `formatter` 修改为 `format`

### 🐞 Bug Fixes

- Drawer:
  - 修复 `confirmBtn` 和 `cancelBtn` 无法正常呈现 `Function` 类型返回的内容的问题
  - 修复自定义关闭按钮无法关闭 Drawer 弹窗的问题
  - 修复在 Safari 浏览器下，使用 Drawer 组件后白屏的问题
- Upload: 修复 `auto-upload` 属性设置不生效的问题

### 🚀 Features

- Form: help 与 tips 展示分离
- Pagination: 新增 current-change 事件，参数为 `(current, pageInfo)`
- Message: 支持 `zIndex` 配置

## 🌈 0.11.0 `2021-04-14`

### ❗️ BREAKING CHANGES

- Drawer:
  - `footer` 不再支持 `string` 类型
  - `attach` 不再支持 `boolean` 类型，调整挂载元素实现

### 🐞 Bug Fixes

- Dialog: 修复挂载元素实现错误的问题
- RadioGroup: 修复 `disabled` 设置失效的问题
- Drawer: 修复不能正常展示关闭图标的问题
- Input: 修复回车键 enter 时触发 change 事件问题 ，无法粘贴内容的问题

### 🚀 Features

- 官网新增 shapan 在线 demo 能力，详情请访问[官网体验](http://tdesign.tencent.com/vue/components/button)
- Drawer
  - 新增 `showInAttachedElement` 表示抽屉在父元素打开
  - 新增：`click-close-btn` `click-cancel` `keydown-esc` `click-confirm` 等事件
  - `closeBtn` 新增支持 `string/function` 类型，用于自定义关闭按钮展示
  - 新增 `closeOnKeydownEsc`，控制是否在 ESC 键按下时触发关闭
  - 重构：`attach` 的实现和 Dialog 组件保持一致
  - `close` 事件新增参数 `{ trigger: EventSource; e: MouseEvent | KeyboardEvent }` `EventSource` 有如下枚举： `'keydownEsc' | 'clickCloseBtn' | 'clickCancel' | 'clickOverlay'`

## 🌈 0.10.0 `2021-04-08`

### ❗️ BREAKING CHANGES

- Badge: API 规范，详情见
- Tree: API 规范，详情见
- Pagination: API 规范，`curr` 修改为 `current`，`prev` 修改为 `previous`
- Table: API 规范，分页器部分的定义 `curr` 修改为 `current`，`prev` 修改为 `previous`，与 Pagination 组件 API 定义保持一致

### 🐞 Bug Fixes

- Form: 修复 Date 对象判断为空的逻辑
- Input: 兼容 safari 浏览器中文输入时多次触发 change 的问题，问题描述见 、，修复见 、
- Layout: 修复侧边栏宽度设置失败不生效的问题
- Radio: 修复禁用且选中状态时的样式问题
- Table: rowKey 获取 id 问题修复
- Timepicker: 去除输入框内多余背景色

### 🚀 Features

- Form: 新增 API `preventSubmitDefault`，用于控制是否阻止默认 submit 事件，默认值为 true
- Table: 新增 `ellipsis` 配置，支持 hover 呈现完整的内容

## 🌈 0.9.0 `2021-03-30`

### ❗️ BREAKING CHANGES

- InputNumber: API 规范，`mode` 变更为 `theme`

### 🐞 Bug Fixes

- Input: 解决 input 组件中文输入过程中不断触发 change 的问题

### 🚀 Features

- 新增 [Textarea 多行文本框组件](http://tdesign.tencent.com/vue/components/textarea)
- Checkbox:
  - 支持 `readonly` 属性
  - CheckboxGroup `options` 支持全选配置
  - CheckboxGroup `options` 支持传入形如 ['A', 'B', 'C'] 一类的参数
- InputNumber:
  - `theme` 新增可选值 normal ，用于表示 “没有 + - 控制的数字输入框”
  - 新增 `decimalPlaces`，支持配置小数位数
  - 其他调整详情参见

## 🌈 0.8.0 `2021-03-23`

### ❗️ BREAKING CHANGES

- Tabs: API 规范，详情参见

### 🐞 Bug Fixes

- Form: 手机号码校验正则修改
- map-props: 修复 JSX 调用 map-props 组件时无法解构传值的问题，详情参见

### 🚀 Features

- Table: 新增鼠标事件相关 API，支持非受控属性 defaultCurrent 和 defaultPagiSize 用法，详情参见
- Pagination: 支持非受控属性 defaultCurrent 和 defaultPagiSize 用法

## 🌈 0.7.1 `2021-03-11`

### 🐞 Bug Fixes

- Select: 修复构建产物 `@TdTypes/` 路径失效问题

## 🌈 0.7.0 `2021-03-11`

### ❗️ BREAKING CHANGES

- List: API 规范，loading 修改为 async-loading

### 🐞 Bug Fixes

- InputNumber: v-model 绑定值不生效问题修复

### 🚀 Features

- Input: type 支持 Number 类型

## 🌈 0.6.0 `2021-03-10`

### ❗️ BREAKING CHANGES

- Calendar: 规范 API，详情参见
- Alert: 规范 API，详情参见
- Tag: 规范 API，详情参见
- List: 规范 API，详情参见

### 🐞 Bug Fixes

- Dialog: 修复 duration 为 0 时 Message 组件自动关闭的问题

### 🚀 Features

- Progress: label 支持 Slot/TNode 类型，详情参见

## 🌈 0.5.0 `2021-02-24`

### ❗️ BREAKING CHANGES

- InputNumber: 规范 API，详情参见
- Input: 规范 API，详情参见
- Progress: 规范 API，详情参见
- Breadcrumb: 规范 API，详情参见
- Dialog: 规范 API

### 🐞 Bug Fixes

- Dropdown,Popconfirm 解决抖动问题
- Form: 解决 resetField 异步场景下失效问题，
- Select: 修复在 Dialog 场景下 select 下拉宽度判断为 0 不能正常展示的问题，

### 🚀 Features

- Form: rules 支持设置对象类型，

## 🌈 0.4.0 `2021-02-07`

### ❗️ BREAKING CHANGES

- Button: 规范 API，`variant` 参数默认值更改为 `base`

### 🐞 Bug Fixes

- switch: 修复开关无法正常切换问题
- Table:
  - 修复无法监听 pagination.current 问题
  - 修复无法监听 pagination.pageSize 问题
  - 修复数据分页问题：当数据长度等于 pageSize 时，从第 2 页开始，无法正常渲染表格数据

### 🚀 Features

- Tag: 新增 content 属性

## 🌈 0.3.0 `2021-01-26`

### ❗️ BREAKING CHANGES

- Button: 规范 API
- Checkbox/CheckboxGroup: 规范 API，详情见：

### 🐞 Bug Fixes

- Select: 修复多个 Select 组件，使用远程数据时，第二个选项开始弹不出来的问题
- Pagination: 官网 demo total 值改变时分页数据未响应的问题

### 🚀 Features

- Select: 多选且可搜索时，输入搜索项并选择一个选项后，保持搜索框 focusing

## 🌈 0.2.5 `2021-01-20`

### ❗️ BREAKING CHANGES

- Popup: 规范 API，visibleArrow 更名为 showArrow；placement 枚举值修改，不再使用小驼峰命名；
- Radio: 规范 API，size 可选值更为 small/medium/large，默认值为 medium；详情见：
- Tag: 规范 API，icon 属性不再支持 String 类型
- Notification: 规范 API，theme 默认值更为 info；icon 属性不再支持 String 类型；default 属性已更为 content

### 🐞 Bug Fixes

- Select: 修复不设置宽度时，下拉选项宽度异常问题
- Anchor: 修复复制链接未成功的问题

### 🚀 Features

- Popup: 增加 API 支持 onVisibleChange
- Message & Notification: 支持函数引入调用，见
- Tag: 增加 onClick & onClose 事件
- Radio/RadioGroup: value 同时支持 String 和 Number 类型；Radio/RadioGroup 新增 onChange API

## 🌈 0.2.4 `2021-01-14`

### 🐞 Bug Fixes

- Message/Notification: 插件无法弹出问题修复，

## 🌈 0.2.3 `2021-01-12`

### ❗️ BREAKING CHANGES

- Divider: 规范 API，详情见：
- Form: size 默认值由 default 改为 medium
- Tag: rename effect to variant
- Icon: size 去除 xs 和 xl，默认值更为 undefined，详情见：
- Notification: 规范 API，详情见：

### 🐞 Bug Fixes

- Table: 修复横向滚动时左侧固定列晃动问题，
- Input: active 状态边框颜色与组件库统一，
- Select: 为 Select 组件依赖的 Popup 组件增加 z-index 样式设置，默认值为 5500

### 🚀 Features

- Transfer 中使用分页组件改为迷你极简模式
- Form: 校验状态 type 去掉 success
- Table: 普通的加载状态，数据内容和加载状态互斥的，不共存,
- Tooltip: 默认增加箭头样式，

### 🌈 0.2.2 `2021-01-05`

### ❗️ BREAKING CHANGES

- Pagination: 规范 API
- Select: size 默认值由 `default` 改为 `medium`
- Message: 规范 API，详情见：
- Grid: span 默认值修改为 12
- Tag: 事件名称 `change` 更为 `click，去除` `disabled` / `checked`，详情见：
- Switch: 规范 API，详情见：

### 🐞 Bug Fixes

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

### 🚀 Features

- Checkbox: value & option.value 同时支持传入 string 和 number 类型 closes
- Dialog: 将 close 点击事件放到外层 div，避免点击区域过小的问题
- Pagination: 新增极简迷你版，适应轻量化翻页使用场景，见 [官网示例 1.7](http://tdesign.tencent.com/vue/components/pagination)
- Anchor: title 属性中增加 TNode 支持，change 支持透传
- 使用 mockdate 在 jest 运行时 mock 当前时间为固定值，防止 snapshot 失效

## 🌈 0.2.0 `2020-12-21`

### ❗️ BREAKING CHANGES

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

### 🚀 Features

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

### 🐞 Bug Fixes

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

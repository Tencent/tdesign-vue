---
title: 更新日志
spline: explain
toc: false
docClass: timeline
---

## 0.41.0 `2022-04-24`

### BREAKING CHANGES
* Table: 拖拽排序修改为`drag=sort` 表示列拖拽排序，`drag=row` 表示行拖拽排序，`drag=row-handler` 表示行手柄列拖拽排序。如果您使用了 `drag="col"` 来实现行拖拽排序，请更为使用 `drag="row-handler"`，[pr #755](https://github.com/Tencent/tdesign-vue/pull/755)，[@chaishi](https://github.com/chaishi)

### Bug Fixes
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
### Features
* Select: 去掉选中和下拉项中的 title 属性，[pr #777](https://github.com/Tencent/tdesign-vue/pull/777)，[@LoopZhou](https://github.com/LoopZhou) 
* Table: 支持树形结构展示，行展开或收起时触发 `onTreeExpandChange` 事件
* Collapse: 新增 Collapse 折叠面板组件，使用请参照 [官网](https://tdesign.tencent.com/vue/components/collapse)，[@asbstty](https://github.com/asbstty)
* Tree: [pr #740](https://github.com/Tencent/tdesign-vue/pull/740)，[@TabSpace](https://github.com/TabSpace)
  - Tree 组件实现嵌套结构渲染能力
  - 部分属性改为不让 Vue 监听，一定程度上提升组件性能，减少对外部组件交互性能的影响

## 0.40.3 `2022-04-15`

### Bug Fixes

* Timepicker: 修复手动清空 value 时异常的问题，[pr #731](https://github.com/Tencent/tdesign-vue/pull/731)，[@uyarn](https://github.com/uyarn)
* Textarea: 修复输入数字零时显示异常的问题，[issue #727](https://github.com/Tencent/tdesign-vue/issues/727)，[@mokywu](https://github.com/mokywu)
* Menu: 修复局部注册组件时报错的问题，[issue #696](https://github.com/Tencent/tdesign-vue/issues/696)，[@LeeJim](https://github.com/LeeJim)
* Select: 修复可过滤的选择器提前换行的问题，[issue #726](https://github.com/Tencent/tdesign-vue/issues/726)，[@uyarn](https://github.com/uyarn)
### Features

* Form: 默认渲染 extra DOM 节点，[pr #730](https://github.com/Tencent/tdesign-vue/pull/730)，[@HQ-Lin](https://github.com/HQ-Lin)
* Dialog: 新增 `showInAttachedElement` API 用于控制是否仅在挂载元素中显示弹窗，[pr #711](https://github.com/Tencent/tdesign-vue/pull/711)，[@zhaodanchun](https://github.com/zhaodanchun)
* Card: 新增卡片组件，[pr #739](https://github.com/Tencent/tdesign-vue/pull/739)，[@uyarn](https://github.com/uyarn)，[@zhwachen](https://github.com/zhwachen)
* Swiper: 新增轮播框组件，[pr #668](https://github.com/Tencent/tdesign-vue/pull/668)，[@start940315](https://github.com/start940315)

## 0.40.2 `2022-04-08`

### Bug Fixes

* Form: 修复 FormItem slot label 未正常占位的问题，[pr #699](https://github.com/Tencent/tdesign-vue/pull/699)，[@HQ-Lin](https://github.com/HQ-Lin)
* Slider: 修复设置 `inputnumberProps` 属性无效的问题，[issue #544](https://github.com/Tencent/tdesign-vue-next/issues/544)，[@uyarn](https://github.com/uyarn)
* Upload: [pr #698](https://github.com/Tencent/tdesign-vue/pull/698)，[@uyarn](https://github.com/uyarn)
  - 修复 `remove`、`selectChange` 事件回调异常的问题
  - 修复取消上传逻辑异常
### Features

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

## 0.40.1 `2022-03-31`

### Bug Fixes

* Table: 修复本地数据排序，异步加载数据时分页失效的问题，[pr #689](https://github.com/Tencent/tdesign-vue/pull/689)，[@chaishi](https://github.com/chaishi)

## 0.40.0 `2022-03-31`
### BREAKING CHANGES
* Table: 表格行列拖拽排序功能重构，新用法请参考[官网 demo](https://tdesign.tencent.com/vue/components/table#%E5%8F%AF%E6%8B%96%E6%8B%BD%E6%8E%92%E5%BA%8F%E7%9A%84%E8%A1%A8%E6%A0%BC)，[pr #657](https://github.com/Tencent/tdesign-vue/pull/657)，[@wangmerry](https://github.com/wangmerry)
* Form: label 为空时不再默认渲染宽度占位，需要手动设置样式保持表单对齐[pr #687](https://github.com/Tencent/tdesign-vue/pull/687)，[@HQ-Lin](https://github.com/HQ-Lin)
### Bug Fixes

* Popconfirm: 修复确认框中按钮默认大小，[pr #673](https://github.com/Tencent/tdesign-vue/pull/673)，[@pengYYYYY](https://github.com/pengYYYYY)
* Upload:
  - 修复上传中状态文案，[pr #678](https://github.com/Tencent/tdesign-vue/pull/678)，[@pengYYYYY](https://github.com/pengYYYYY)
  - 修复上传模版问题，[issue #675](https://github.com/Tencent/tdesign-vue/issues/675)，[@YikaJ](https://github.com/YikaJ)
* Popup: 修复 `hideEmptyPopup` 在动态改变内容时不生效的问题，[@LoopZhou](https://github.com/LoopZhou)
* Table: 修复合并单元格边框样式问题，[issue #671](https://github.com/Tencent/tdesign-vue/issues/671)，[@chaishi](https://github.com/chaishi)
* Datepicker: 修复区间时间选择时，月份/年份选择面板样式异常的问题，[issue #588](https://github.com/Tencent/tdesign-vue/issues/588)，[@HQ-Lin](https://github.com/HQ-Lin)
* 修复 Table/SelectInput/TagInput 按需引入时出现 composition-api 相关报错的问题，[pr #688](https://github.com/Tencent/tdesign-vue/pull/688)，[@xiaosansiji](https://github.com/xiaosansiji)

### Features

* Table: 支持外部设置当前显示列，新增 API `displayColumns` `defaultDisplayColumns` `onDisplayColumnsChange` 和事件 `display-columns-change`，[pr #672](https://github.com/Tencent/tdesign-vue/pull/672)，[@chaishi](https://github.com/chaishi)

## 0.39.1 `2022-03-29`

### Bug Fixes

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
### Features

* ConfigProvider: 完善语言配置能力，使用 common 仓库中的配置数据，[pr #643](https://github.com/Tencent/tdesign-vue/pull/643)，[@pengYYYYY](https://github.com/pengYYYYY)
* Table: [pr #660](https://github.com/Tencent/tdesign-vue/pull/660)，[@chaishi](https://github.com/chaishi)
  - 表格超出省略浮层父元素更为表头 `thead`，避免挂载到全局 `body`
  - 过滤功能浮层元素默认挂载到 `t-table`，不再挂载到全局 `body`，[issue#658](https://github.com/Tencent/tdesign-vue/issues/658)

## 0.39.0 `2022-03-28`
### BREAKING CHANGES
Table 组件使用 `Composition API` 重构，[pr #365](https://github.com/Tencent/tdesign-vue/pull/365)，[@chaishi](https://github.com/chaishi)
- BaseTable HTML 结构变更，写过 CSS 样式覆盖的同学需注意更新样式
- 表头更为使用 `th` 标签，之前为 `td`，不符合语义
- 事件 `row-db-click` 更为`row-dblclick` ，`onRowDbClick` 更为`onRowDblclick`
- 事件 `row-hover` 更为 `row-mouseover`, `onRowHover` 更为 `onRowMouseover`（本没有 rowHover 事件）
- CSS 类名 `t-table__row-first-full-row` 更为 `t-table__first-full-row`，`t-table__row-last-full-row` 更为 `t-table__last-full-row`

### Bug Fixes
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
### Features

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


## 0.38.1 `2022-03-26`
### Features
* SelectInput: 实现 `enter` 事件 [pr #642](https://github.com/Tencent/tdesign-vue/pull/642)，[@pengYYYYY](https://github.com/pengYYYYY)

## Bug Fixes
* SelectInput: 修复单选可输入状态下的 focus 时 input value 的错误 [pr #642](https://github.com/Tencent/tdesign-vue/pull/642)，[@pengYYYYY](https://github.com/pengYYYYY)

## 0.38.0 `2022-03-25`
### BREAKING CHANGES
* Input/Textarea: Input 外部传入样式挂载至 `t-input__wrap` 层级的 DOM 节点，不再传入到 `t-input` 层级；Textarea 去除 `t-textarea__wrap`，[pr #276](https://github.com/Tencent/tdesign-vue/pull/627)，[@pengYYYYY](https://github.com/pengYYYYY)

### Bug Fixes

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

### Features

* Table: 支持自定义 columns，[pr #423](https://github.com/Tencent/tdesign-vue/pull/423)，[@LeeJim](https://github.com/LeeJim)
* Message: 将 `placement = center` 的 fadeIn 动画改为从上往下出现，[pr #611](https://github.com/Tencent/tdesign-vue/pull/611)，[@Zack921](https://github.com/Zack921)
* Input: 增加 `inputClass` 属性，用于透传 class 到 `t-input` 同级，[pr #276](https://github.com/Tencent/tdesign-vue/pull/627)，[@pengYYYYY](https://github.com/pengYYYYY)
* Upload: 新增 `allowUploadDuplicateFile` 属性，支持重复文件名的文件上传，[pr #636](https://github.com/Tencent/tdesign-vue/pull/636)，[@brianzhang](https://github.com/brianzhang)

## 0.37.2 `2022-03-18`
### Bug Fixes

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

### Features

* Timepicker: `close`、`open` 事件回调增加参数，[pr #587](https://github.com/Tencent/tdesign-vue/pull/587)，[@uyarn](https://github.com/uyarn)

## 0.37.0 `2022-03-14`

### BREAKING CHANGES
* Input: `DOM` 结构调整，最外层调整为 `t-input-wrap`，有覆盖过 Input 相关组件样式的同学请注意，[common pr #276](https://github.com/Tencent/tdesign-common/pull/276)，[@pengYYYYY](https://github.com/pengYYYYY)
### Bug Fixes

* Select:
  - 修复已选值不在可选时不显示的问题，[issue #526](https://github.com/Tencent/tdesign-vue/issues/526)，[@geff1991](https://github.com/geff1991)
  - 增加 `icon`的兼容 `class`，解决样式问题，[pr #529](https://github.com/Tencent/tdesign-vue/pull/529)，[@pengYYYYY](https://github.com/pengYYYYY)
* Form: 修复当 `rule message` 为空时，不显示具体文案的问题，[issue #520](https://github.com/Tencent/tdesign-vue/issues/520)，[@YikaJ](https://github.com/YikaJ)
* Cascader: 修复 Cascade 组件可选任意一级时缺少高亮状态的问题，[pr #531](https://github.com/Tencent/tdesign-vue/pull/531)，[@pengYYYYY](https://github.com/pengYYYYY)
* Input/TagInput: [pr #522](https://github.com/Tencent/tdesign-vue/pull/522)，[@pengYYYYY](https://github.com/pengYYYYY)
  - Input 修复前后置标签输入框同时存在时，左侧样式异常的问题
  - TagInput 修复不同状态的标签输入框，样式异常的问题

### Features

* Form: `FormItem` 提供控件级别的 `showErrorMessage` 配置，优先级高于 `Form.showErrorMessage`，[pr #514](https://github.com/Tencent/tdesign-vue/pull/514)，[@YikaJ](https://github.com/YikaJ)
* Message: 新增组件出现和消失有线性渐入渐出动画，[pr #405](https://github.com/Tencent/tdesign-vue/pull/405)，[@Zack921](https://github.com/Zack921)
* InputNumber:
  - 支持 `autoWidth` 属性，[pr #541](https://github.com/Tencent/tdesign-vue/pull/541)，[@uyarn](https://github.com/uyarn)
  - 增加状态设置与提示设置功能，[pr #519](https://github.com/Tencent/tdesign-vue/pull/519)，[@jchalex](https://github.com/jchalex)

## 0.36.0 `2022-03-07`

### BREAKING CHANGES
* Input: input 元素 `ref` 名称由 `refInputElem` 更为 `inputRef，`[pr #428](https://github.com/Tencent/tdesign-vue/pull/433)，[@pengYYYYY](https://github.com/pengYYYYY)

### Bug Fixes

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

### Features

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

## 0.35.1 `2022-02-25`

### Bug Fixes

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

### Features

* Input: 新增 `format` 属性用于格式化数据，[pr #447](https://github.com/Tencent/tdesign-vue/pull/447)，[@mokywu](https://github.com/mokywu)
* Drawer: 新增 `sizeDraggable` 属性用于支持用户拖动改变 Drawer 大小，[pr #463](https://github.com/Tencent/tdesign-vue/pull/463)，[@uyarn](https://github.com/uyarn)


## 0.35.0 `2022-02-18`
### BREAKING CHANGES
* Menu: 移除冗余事件 `onCollapsed`，[pr #428](https://github.com/Tencent/tdesign-vue/pull/428)，[@LeeJim](https://github.com/LeeJim)

### Bug Fixes

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

### Features
* Form: 表单项值类型为数组时，FormRule 的 `max` 和 `min` 可以校验数组长度，[issue #301](https://github.com/Tencent/tdesign-react/issues/301)，[@dellyoung](https://github.com/dellyoung)
* Popup: [pr #358](https://github.com/Tencent/tdesign-vue/pull/358)，[@ikeq](https://github.com/ikeq)
  - 支持嵌套使用
  - 去除额外 reference 包裹元素
  - 弹窗展开动画优化
  - `overlayStyle` 类型为 Function 时，增加 `popupElement` 作为第二个参数，表示浮层元素 DOM 节点
  - 新增 `onScroll` 属性，响应下拉选项滚动事件
* Slider: 默认提示主题更改为暗色，[pr #424](https://github.com/Tencent/tdesign-vue/pull/424)，[@LuckyWinty](https://github.com/LuckyWinty)
* Table: 支持使用 `columnController` 属性自定义设置需要展示的列，[pr #423](https://github.com/Tencent/tdesign-vue/pull/423)，[@LeeJim](https://github.com/LeeJim)

## 0.34.0 `2022-01-27`

### BREAKING CHANGES
* Tag: `variant` 可选值修改为 `dark/light/outline/light-outline`，`plain` 已废弃，[pr #369](https://github.com/Tencent/tdesign-vue/pull/369)，[@xiaosansiji](https://github.com/xiaosansiji)

### Bug Fixes

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
### Features

* Select:
  - 优化加载中元素样式，[pr #356](https://github.com/Tencent/tdesign-vue/pull/356)，[@geff1991](https://github.com/geff1991)
  - 优化 `options` 的初始化解析，[pr #344](https://github.com/Tencent/tdesign-vue/pull/344)，[@ikeq](https://github.com/ikeq)
* Datepicker: 支持全局配置 `format`，[pr #355](https://github.com/Tencent/tdesign-vue/pull/355)，[@xiaosansiji](https://github.com/xiaosansiji)
* Form: 支持统一配置校验信息，无需每个字段的每个规则都单独配置 `message`，[pr #313](https://github.com/Tencent/tdesign-vue/issues/313)，[@chaishi](https://github.com/chaishi)
* Button: 统一各类型按钮边框宽度，[pr #176](https://github.com/Tencent/tdesign-common/pull/176)，[@BigLiao](https://github.com/BigLiao)
* InputNumber: 优化交互，点击 +/- 按钮时，自动设置值为最小值或最大值，[issue #319](https://github.com/Tencent/tdesign-vue/issues/319)，[@jchalex](https://github.com/jchalex)
* TimePicker: 优化 panel 定位时机，[pr #344](https://github.com/Tencent/tdesign-vue/pull/344)，[@ikeq](https://github.com/ikeq)
* Tooltip: 优化官网 demo 实现，[issue #353](https://github.com/Tencent/tdesign-vue/issues/353)，[@ccccpj](https://github.com/ccccpj)

## 0.33.2 `2022-01-21`


### Bug Fixes

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

### Features

* Table: 新增 `onCellClick` 事件，[issue #240](https://github.com/Tencent/tdesign-vue/issues/240)，[pr #297](https://github.com/Tencent/tdesign-vue/pull/297)，[@chaishi](https://github.com/chaishi)
* Skeleton: 新增骨架屏组件，请参照[官网](https://tdesign.tencent.com/vue/components/skeleton)使用，[@Wonder233](https://github.com/Wonder233)
* Textarea: 新增属性 `status` 用于控制状态，`tips` 用于控制信息提示，[pr 299](https://github.com/Tencent/tdesign-vue/pull/299)，[@chaishi](https://github.com/chaishi)
* Input: 新增 `tips` 用于控制信息提示， 新增 `mousenter`、`mouseleavt` 、`paste` 事件，[pr #305](https://github.com/Tencent/tdesign-vue/pull/305)，[@chaishi](https://github.com/chaishi)
* Input/InputNumber: 新增 `align` 用于控制输入文本对齐方向，[issue #293](https://github.com/Tencent/tdesign-vue/issues/293)，[pr #320](https://github.com/Tencent/tdesign-vue/pull/320)，[@chaishi](https://github.com/chaishi)

## 0.33.1 `2022-01-13`

### Bug Fixes

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

### Features

* Table: 为了保证每次展开的数据最新，展开行不再进行预渲染；异步加载功能重构，[pr 197](https://github.com/Tencent/tdesign-vue/pull/197)，[@chaishi](https://github.com/chaishi)
* Alert: 增加内容区折行展开和收起动效，[pr 123](https://github.com/Tencent/tdesign-common/pull/123)，[@pengYYYYY](https://github.com/pengYYYYY)

## 0.33.0 `2022-01-06`

### BREAKING CHANGES

Input 样式调整: 边框等样式由 `t-input__inner` 调整到上层父级 `t-input` class，[pr 98](https://github.com/Tencent/tdesign-common/pull/98)，[@mokywu](https://github.com/mokywu)，有覆盖过 Input 组件默认样式的同学请检查后升级。

### Bug Fixes

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
### Features

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

## 0.32.0 `2021-12-23`

### BREAKING CHANGES

CSS 类名规范: 
  组件相关类名根据 [BEM](https://github.com/Tencent/tdesign-common/blob/develop/css-naming.md) 规范重新整理，有覆盖过组件库默认样式的同学请务必参照 [#59](https://github.com/Tencent/tdesign-vue/issues/59) 检查后升级。

### Bug Fixes

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

### Features

- Icon: 官网图标示例支持选中复制代码能力，详情请访问 [官网](https://tdesign.tencent.com/vue/components/icon) 体验
- Select: 支持键盘交互能力，[pr 18](https://github.com/Tencent/tdesign-vue/pull/18)，[@geff1991](https://github.com/geff1991)
- Tree: treeNodeModel 添加 `setData`, `remove` 方法；优化动画性能。[pr 58](https://github.com/TDesignOteam/tdesign-vue/pull/58)，[@TabSpace](https://github.com/TabSpace)
- Form: 过滤 validate 结果，当字段校验不通过时，只返回校验失败的结果，[pr 55](https://github.com/TDesignOteam/tdesign-vue/pull/55)，[@dellyoung](https://github.com/dellyoung)
- Pagination: 支持受控用法，[pr 42](https://github.com/TDesignOteam/tdesign-vue/pull/42)，[@chaishi](https://github.com/chaishi)
- Tabs: 没有选项卡时依然可以显示新增选项卡按钮，[pr 10](https://github.com/Tencent/tdesign-vue/pull/10)，[@start940315](https://github.com/start940315)


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

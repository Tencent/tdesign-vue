---
title: 更新日志
spline: explain
toc: false
docClass: timeline
---


## 🌈 1.15.1 `2026-06-18` 
### 🚀 Features
- `InputNumber`: 新增 `autofocus` 属性 @betavs ([#3845](https://github.com/Tencent/tdesign-vue/pull/3845))
### 🐞 Bug Fixes
- `DateRangePickerPanel`: 修复跨年时月份联动的问题 @RSS1102 ([#3846](https://github.com/Tencent/tdesign-vue/pull/3846))


## 🌈 1.15.0 `2026-04-27` 
### 🚀 Features
- `Icon`: 新增 217 个与人工智能、文档、徽标和文件相关的图标 @uyarn([#3808](https://github.com/Tencent/tdesign-vue/pull/3808))
- `Dropdown`: `Dropdown` 支持 `panelTopContent` 和 `panelBottomContent` api @HaixingOoO ([#3826](https://github.com/Tencent/tdesign-vue/pull/3826))
- `popup`: 新增多个组件实例方法 `getOverlay` 用于获取浮层元素、`getOverlayState` 用于获取浮层悬浮状态 、`getPopper` 用于获取当前组件 popper 实例、`update` 用于更新浮层内容 @RSS1102 ([#3751](https://github.com/Tencent/tdesign-vue/pull/3751))
- `Typography`: 新增 `Typography` 排版组件 @uyarn ([#3831](https://github.com/Tencent/tdesign-vue/pull/3831))
### 🐞 Bug Fixes
- `Table`: 修复树形结构展开收起按钮没有更新展示状态的问题 @mark980828 ([#3816](https://github.com/Tencent/tdesign-vue/pull/3816))
- `TagInput`: 修复 `excessTagsDisplayType="break-line"` 时，`suffix` 没有固定在右侧的问题 @RylanBot ([#3829](https://github.com/Tencent/tdesign-vue/pull/3829))


## 🌈 1.14.5 `2026-01-21` 
### 🐞 Bug Fixes
- `Table`: 修复远程分页场景下，全选逻辑错误引起展示异常的问题 @RSS1102 ([#3801](https://github.com/Tencent/tdesign-vue/pull/3801))
- `Menu`: 修复在 Safari 浏览器中点击展开图标没有变换方向的问题 @liweijie0812 ([#3797](https://github.com/Tencent/tdesign-vue/pull/3797))
- `Menu`: 修复 `1.14.2` 后 menu-item 绝对定位样式丢失导致层级设置不生效的问题 @RSS1102 ([#3804](https://github.com/Tencent/tdesign-vue/pull/3804))
- `Select`: 修复在 Safari 浏览器中点击展开图标没有变换方向的问题 @liweijie0812 ([#3797](https://github.com/Tencent/tdesign-vue/pull/3797))
- `TreeSelect`: 修复在 Safari 浏览器中点击展开图标没有变换方向的问题 @liweijie0812 ([#3797](https://github.com/Tencent/tdesign-vue/pull/3797))
- `Cascader`: 修复在 Safari 浏览器中点击展开图标没有变换方向的问题 @liweijie0812 ([#3797](https://github.com/Tencent/tdesign-vue/pull/3797))
- `Table`: 优化存在固定表头或表尾场景滚动后表格位置异常的问题 @uyarn ([#3805](https://github.com/Tencent/tdesign-vue/pull/3805))




## 🌈 1.14.4 `2025-12-26` 
### 🐞 Bug Fixes
- `Drawer`: 修复 `DOM` 元素未正确移除的问题 @RSS1102 ([#3788](https://github.com/Tencent/tdesign-vue/pull/3788))
- `Guide`: 修复 `DOM` 元素未正确移除的问题 @RSS1102 ([#3788](https://github.com/Tencent/tdesign-vue/pull/3788))


## 🌈 1.14.3 `2025-12-23` 
### 🚀 Features
- `ImageViewer`: 
    - 优化下载跨域图片时的格式处理和压缩比例  @RylanBot ([common#2311](https://github.com/Tencent/tdesign-common/pull/2311)) 
    - 支持直接下载同域图片，避免二次转换导致体积增大和动图失效等问题 @RylanBot ([common#2311](https://github.com/Tencent/tdesign-common/pull/2311)) 
- `Popup`: 新增 `onOverlayClick` 事件，支持内容面板点击时触发 @RSS1102  ([#3752](https://github.com/Tencent/tdesign-vue/pull/3752))
### 🐞 Bug Fixes
- `Avatar`: 修复样式与设计稿不一致的问题 @liweijie0812 ([common#2364](https://github.com/Tencent/tdesign-common/pull/2364))
- `Menu`: 修复菜单选项默认边距和图标大小的问题 @liweijie0812 ([common#2369](https://github.com/Tencent/tdesign-common/pull/2369))
- `Table`: 修复行选中收缩后,表格头全选状态异常的问题 @liweijie0812 ([#3771](https://github.com/Tencent/tdesign-vue/pull/3771))
- `Upload`: 修复不支持文件数组上传的问题 @GATING ([common#2078](https://github.com/Tencent/tdesign-common/pull/2078))
- `Upload`: 修复 `theme` 为 `image-flow` 的告警问题 @uyarn ([#3782](https://github.com/Tencent/tdesign-vue/pull/3782))


## 🌈 1.14.2 `2025-11-07` 
### 🚀 Features
- `Watermark`: 新增 `layout` API，支持生成不同布局的水印 @Wesley-0808 ([#3726](https://github.com/Tencent/tdesign-vue/pull/3726))
- `Cascader`: 
     - 支持 `filterable` 与 `checkStrictly` 及`valueMode = parentFirst`配合使用，展示非叶子节点的效果 @uyarn ([#3763](https://github.com/Tencent/tdesign-vue/pull/3763))
     - `option` 新增`onChange`和`onExpand` 方法，用于多选场景下，自定义节点时自定义点击节点的触发逻辑，具体使用请参考自定义下拉选项的参考示例 @uyarn ([#3763](https://github.com/Tencent/tdesign-vue/pull/3763))
### 🐞 Bug Fixes
- `Cascader`: 
     - 修复多选自定义节点无法进行展开处理的问题 @uyarn ([#3763](https://github.com/Tencent/tdesign-vue/pull/3763)) 
     -  修复`reserveKeyword` API 无效的问题 @uyarn ([#3763](https://github.com/Tencent/tdesign-vue/pull/3763))
- `Watermark`: 
     - 修复多行图文水印图片配置了灰度时，整个画布内容也会灰度的问题 @Wesley-0808 ([#3726](https://github.com/Tencent/tdesign-vue/pull/3726))
     - 修复 window 不存在场景，构建时报错的问题 @Wesley-0808([#3736](https://github.com/Tencent/tdesign-vue/pull/3736))
- `Textarea`: 修复内容超长情况下，设置 `autosize` 没有完整自动撑开高度，存在有滚动条的问题 @engvuchen ([#3727](https://github.com/Tencent/tdesign-vue/pull/3727))
- `Form`: 修复错误消息 `max` 和 `min` 英文翻译错误 @liweijie0812([#3743](https://github.com/Tencent/tdesign-vue/pull/3743))
- `Calendar`: 
     - 修复了年份选项错误地使用了月份选项禁用范围判定逻辑的问题 @shumuuu ([#3759](https://github.com/Tencent/tdesign-vue/pull/3759))
     - 修复了当设定日历的range值为同一年内时，终止月份之后的月份选项没有正常禁用的问题 @shumuuu ([#3759](https://github.com/Tencent/tdesign-vue/pull/3759))
- `Menu`: 修复菜单项自动翻转失效的问题 @RSS1102 ([#3744](https://github.com/Tencent/tdesign-vue/pull/3744))

### 🚧 Others
- `Tabs`: 在非拖拽场景下不注册拖拽事件 @RSS1102 ([#3738](https://github.com/Tencent/tdesign-vue/pull/3738))


## 🌈 1.14.1 `2025-09-22` 
### 🐞 Bug Fixes
- `Watermark`: 修复 `1.14.0` 版本中多次引入水印组件出现节点渲染颜色过深的问题 @uyarn ([#3721](https://github.com/Tencent/tdesign-vue/pull/3721))


## 🌈 1.14.0 `2025-09-19` 
### 🚀 Features
- `Icon`： @uyarn 
    - `tdesign-icons-vue` 发布 0.4.x 版本，新增 align-bottom、no-result、no-result-filled、 tree-list、wifi-no、 wifi-no-filled、logo-stackblitz-filled、logo-stackblitz、logo-wecom-filled 图标，移除 video-camera-3、video-camera-3-filled、list 图标，此前有依赖以上三个图标升级请注意 ⚠️  ([#3709](https://github.com/Tencent/tdesign-vue/pull/3709))
    - 按需加载方式使用的图标资源支持可变粗细功能，通过`strokeWidth`属性进行配置，详情请参考示例和文档 ([#3709](https://github.com/Tencent/tdesign-vue/pull/3709))
   - 按需加载方式使用的图标资源支持多色填充功能，通过`strokeColor` 和 `fillColor` 属性进行配置，详情请参考示例和文档 ([#3709](https://github.com/Tencent/tdesign-vue/pull/3709))
- `Textarea`: 新增 `allowInputOverMax` API，允许输入超过 `maxlength` @RSS1102 ([#3691](https://github.com/Tencent/tdesign-vue/pull/3691))
- `Tabs`: @RSS1102 
    - 新增 `dragSort` 和 `onDragSort` 方法，用于进行选项卡调换顺序的需求  ([#3711](https://github.com/Tencent/tdesign-vue/pull/3711))
    - 将 remove 事件从删除图标移至外层容器, 保证替换图标功能正常使用，有覆盖删除图标样式请注意此变更 ⚠️ ([#3686](https://github.com/Tencent/tdesign-vue/pull/3686))
- `Skeleton`: 修复 `theme` 默认值不符合文档描述的问题，需要 `paragraph` 效果升级后手动设置 `theme` @liweijie0812 ([#3682](https://github.com/Tencent/tdesign-vue/pull/3682))

### 🐞 Bug Fixes
- `Tree`: 修复 `draggable` 在 `disabled` 状态下依旧生效的异常 @RylanBot ([#3690](https://github.com/Tencent/tdesign-vue/pull/3690))
- `Watermark`: 修复深色模式下，文字水印内容显示不明显的问题 @liweijie0812 ([#3697](https://github.com/Tencent/tdesign-vue/pull/3697))
- `Dialog`: 修复`1.10.8`版本后，`showInAttachedElement` 不能配合 `attach` 一起使用的问题 @uyarn ([#3692](https://github.com/Tencent/tdesign-vue/pull/3692))
- `Tree`: 修复自定义 icon 场景下，全被设为 open 状态，导致图标颜色错误的问题 @RylanBot([#3713](https://github.com/Tencent/tdesign-vue/pull/3713))
- `Tag`: 修复点击关闭按钮会同时触发点击事件的问题 @uyarn ([#3715](https://github.com/Tencent/tdesign-vue/pull/3715))
- `Select`: 修复设置 `keys` 后， onChange 回调参数中 selectedOptions 参数缺失的问题 @uyarn ([#3716](https://github.com/Tencent/tdesign-vue/pull/3716))

## 🌈 1.13.1 `2025-08-20` 
### 🚀 Features
- `Table`: 新增切换分页后重置滚动条回到顶部的特性 @RSS1102 ([#3684](https://github.com/Tencent/tdesign-vue/pull/3684))
### 🐞 Bug Fixes
- `QRCode`: 修复 `type='svg'` 时 `value` 值变化而二维码未刷新的问题 @RSS1102 ([#3681](https://github.com/Tencent/tdesign-vue/pull/3681))
- `Radio`: 修复 `RadioGroup` 组件的告警问题 @uyarn ([#3685](https://github.com/Tencent/tdesign-vue/pull/3685))


## 🌈 1.13.0 `2025-08-07` 
### 🚀 Features
- `QRCode`: 新增 `QRCode` 二维码组件 @Wesley-0808 ([#3652](https://github.com/Tencent/tdesign-vue/pull/3652))
-  `Alert`: 新增 `closeBtn` API，与其他组件保持一致，`close` 将在未来版本废弃，请尽快调整为 `closeBtn` 使用 @ngyyuusora ([#3631](https://github.com/Tencent/tdesign-vue/pull/3631))
- `Tree`: 多选场景下每个节点新增 hover 提示，与单选场景保持一致 @RSS1102 ([#3633](https://github.com/Tencent/tdesign-vue/pull/3633))
- `Upload`: 扩大单文件/图片风格的点击事件触发热区至整个卡片区域 @RSS1102 ([#3614](https://github.com/Tencent/tdesign-vue/pull/3614))
### 🐞 Bug Fixes
- `Cascader`: 修复 `value-type="full"` ，value 为 undefined时组件内部报错 @liweijie0812 ([#3622](https://github.com/Tencent/tdesign-vue/pull/3622))
- `ColorPicker`: 减少颜色跨色彩空间的多次转换，降低误差 @RylanBot ([#3661](https://github.com/Tencent/tdesign-vue/pull/3661))
- `DatePicker`: 
     - 修复多选情况下周和季度模式的标签删除异常和可以重复选择的问题 @betavs ([#3653](https://github.com/Tencent/tdesign-vue/pull/3653))
    -  修复多选情况下周模式可以重复选择的问题 @betavs ([#3658](https://github.com/Tencent/tdesign-vue/pull/3658))
- `Descriptions`: 修复无边框模式下左右内边距的异常问题 @liweijie0812 ([common#2219](https://github.com/Tencent/tdesign-common/pull/2219))
- `Image`: 修复 `1.12.1` 版本后控制台报错的问题 @betavs ([#3670](https://github.com/Tencent/tdesign-vue/pull/3670))
- `ImageViewer`: 修复在多图预览中点击对应图片与预览图片不一致的问题 @betavs ([#3670](https://github.com/Tencent/tdesign-vue/pull/3670))
- `Loading`: 修复在 iPad 微信上图标位置错误的问题 @Nero978([#3650](https://github.com/Tencent/tdesign-vue/pull/3650))
- `Menu`: 修复多级菜单在子组件存在多层封装后无法正常高亮的问题 @uyarn ([#3675](https://github.com/Tencent/tdesign-vue/pull/3675))
- `Popconfirm`: 当初始 `visible` 为 true 时，点击外部时弹出窗口不关闭的问题 @RSS1102 ([#3659](https://github.com/Tencent/tdesign-vue/pull/3659))
- `Popup`: 当初始 `visible` 为 true 时，点击外部时弹出窗口不关闭的问题 @RSS1102 ([#3659](https://github.com/Tencent/tdesign-vue/pull/3659))
- `Select`: 修复虚拟滚动搜索后出现空白区域的问题 @betavs ([#3669](https://github.com/Tencent/tdesign-vue/pull/3669))
- `Statistic`: 修改 color 属性类型为字符串，以支持任何 [CSS color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) 支持的颜色值 @RSS1102 ([#3671](https://github.com/Tencent/tdesign-vue/pull/3671))
- `Table`: 修复 `resizable` 开启时，列边框线引起的列名内容移动的问题 @QuentinHsu ([common#2224](https://github.com/Tencent/tdesign-common/pull/2224))


## 🌈 1.12.1 `2025-07-03` 
### 🚀 Features
- `locale`: 支持内置多语言的英文版本的单复数场景正常展示 @YunYouJun ([#3641](https://github.com/Tencent/tdesign-vue/pull/3641))
### 🐞 Bug Fixes
- `ImageViewer`: 修复图片预览操作栏多语言失效的问题 @uyarn ([#3636](https://github.com/Tencent/tdesign-vue/pull/3636))
- `Textarea`: 优化 `scrollbar` 样式 @RSS1102([#3639](https://github.com/Tencent/tdesign-vue/pull/3639))



## 🌈 1.12.0 `2025-06-11` 
### 🚀 Features
- `ColorPicker`: 自动根据「触发器 / 最近颜色 / 预设颜色」的色值进行切换单色和渐变模式；只开启渐变模式时，过滤「预设颜色 / 当前颜色」中的非渐变色值；新增 format `HEX8`，移除 `HSB`；使用渐变模式的业务请注意此变更 ⚠️  @RylanBot ([#3572](https://github.com/Tencent/tdesign-vue/pull/3572))
- `Icon`: 新增 `logo-miniprogram`、`logo-cnb`、`seal`、`quote` 图标，优化多个文件相关图标的绘制效果，修复 `gesture-right-slip` 的绘制问题 @taowensheng1997 @uyarn ([#3577](https://github.com/Tencent/tdesign-vue/pull/3577))
- `InputNumber`: `decimalPlaces` 支持 `enableRound` 参数，用于控制是否启用四舍五入 @RylanBot ([#3601](https://github.com/Tencent/tdesign-vue/pull/3601))
- `Select`: 多项选择器支持删除选项 @richardji202 ([#3584](https://github.com/Tencent/tdesign-vue/pull/3584))
- `TagInput`: 优化可拖拽时，鼠标光标显示为移动光标 @liweijie0812 ([#3594](https://github.com/Tencent/tdesign-vue/pull/3594))
- `Tree`: `expandAll` API 支持响应式 @uyarn ([#3619](https://github.com/Tencent/tdesign-vue/pull/3619))
- `Upload`: 支持 `image-flow` 模式支持自定义错误文本 @ngyyuusora ([#3574](https://github.com/Tencent/tdesign-vue/pull/3574))
### 🐞 Bug Fixes
- `Cascader`: 修复选项存在超长文字在大小尺寸下展示异常的问题 @Shabi-x([#3593](https://github.com/Tencent/tdesign-vue/pull/3593))
- `ColorPicker`: 修复开启透明通道时的返回值格式化异常 @RylanBot ([#3572](https://github.com/Tencent/tdesign-vue/pull/3572))
- `DatePicker`: 修复通过 `popupProps.visible` 直接打开选择面板时无法更新时间的问题 @RSS1102 ([#3600](https://github.com/Tencent/tdesign-vue/pull/3600))
- `Drawer`:  修复 `cancel-btn` 和 `confirm-btn` 的类型缺失`null` 声明的问题 @RSS1102 ([#3612](https://github.com/Tencent/tdesign-vue/pull/3612))
- `Select`: 修复`valueType`为`object`与 `keys` 同时设置时的绑定值错误 @morningbao ([#3583](https://github.com/Tencent/tdesign-vue/pull/3583))
- `Table`: 优化关闭列配置弹窗时，选择列数据与所展示列数据不一致的问题 @RSS1102 ([#3616](https://github.com/Tencent/tdesign-vue/pull/3616))
- `Tabs`:  修复选项卡 label 过长时, 滑动按钮失效的问题 @wonkzhang([#3571](https://github.com/Tencent/tdesign-vue/pull/3571))
- `Tag`: 修复未设置 `max-width` 导致无法渲染 `title` 属性的问题 @betavs ([#3592](https://github.com/Tencent/tdesign-vue/pull/3592))




## 🌈 1.11.2 `2025-04-15` 
### 🚀 Features

- `Drawer`: 新增 `DrawerPlugin`，支持`插件函数式`调用，具体使用请参考示例 @Wesley-0808 ([#3501](https://github.com/Tencent/tdesign-vue/pull/3501))
- `Drawer`: 新增 `drawerClassName`API，用于定义抽屉本身的相关`class` @Wesley-0808 ([#3501](https://github.com/Tencent/tdesign-vue/pull/3501))
- `Form`: 新增`requiredMarkPosition`，用于自定义必填符号的位置 @Wesley-0808 ([#3562](https://github.com/Tencent/tdesign-vue/pull/3562))
- `Layout`: 子组件 `Content` 新增  `content` API  @liweijie0812 ([#3506](https://github.com/Tencent/tdesign-vue/pull/3506))
### 🐞 Bug Fixes
- `ImageViewer`: 修复设置`step` 存在精度展示异常的问题 @uyarn ([#3563](https://github.com/Tencent/tdesign-vue/pull/3563))
- `Select`: 修复 `keys` 属性配置 `content` 作为 `value` 时展示异常的问题 @hello-ishine ([#3540](https://github.com/Tencent/tdesign-vue/pull/3540))
- `Transfer`: 修复 children 为空数组的节点未能正确渲染的问题 @RSS1102 ([#3535](https://github.com/Tencent/tdesign-vue/pull/3535))

### 📝 Documentation
- `ConfigProvider`: 增加 `globalConfig` API 文档，规范 API 文档顺序 @liweijie0812 ([#3506](https://github.com/Tencent/tdesign-vue/pull/3506))
### 🚧 Others
- `Plugin`: 新增`ConfigProvider`等组件的编辑器提示功能 @liweijie0812 ([#3506](https://github.com/Tencent/tdesign-vue/pull/3506))

## 🌈 1.11.1 `2025-03-07` 
### 🚀 Features
- `ImageViewer`: @Wesley-0808 ([#3516](https://github.com/Tencent/tdesign-vue/pull/3516))
    - 新增`imageReferrerpolicy`API，适用于需要配置`Referrerpolicy`的场景
    - 新增`onDownload`API，用于需要自定义下载回调的场景
- `DatePicker`: 调整组件禁用日期`before`和`after`参数的逻辑，调整为禁用`before`定义之前和`after`定义之后的日期选择，更符合使用习惯。此前有使用相关 API 请注意此改动 @RSS1102 ([#3511](https://github.com/Tencent/tdesign-vue/pull/3511))
- `Upload`: 支持表单禁用功能作用到上传组件 @RSS1102 ([#3525](https://github.com/Tencent/tdesign-vue/pull/3525))

### 🐞 Bug Fixes
- `Select`: 修复多选情况下移除标签时，`trigger` 参数值错误的问题 @betavs ([#3509](https://github.com/Tencent/tdesign-vue/pull/3509))
- `Message`: 修复连续调用messagePlugin时，返回的实例不正确的问题 @maoyiluo ([#3514](https://github.com/Tencent/tdesign-vue/pull/3514))
- `Dialog`:  自定义 `cancelBtn` 文本时保留 `t-dialog__cancel` 样式 @RSS1102 ([#3528](https://github.com/Tencent/tdesign-vue/pull/3528))
- `Bundle`: 修复`1.11.0`的产物中的`cjs` 在 node 20 以下的使用异常的问题 @uyarn ([#3512](https://github.com/Tencent/tdesign-vue/pull/3512))

## 🌈 1.11.0 `2025-02-21` 
### 🚀 Features
- `Drawer`: sizeDraggable支持SizeDragLimit类型 @huangchen1031 ([#3465](https://github.com/Tencent/tdesign-vue/pull/3465))
- `Form`: `FormItem` 新增 `status` 和 `tips` API @RSS1102 ([#3490](https://github.com/Tencent/tdesign-vue/pull/3490))
- `Icon`: 新增`logo-alipay`、`logo-behance-filled`等图标，修改`logo-wecom`图标，移除不合理的`logo-wecom-filled`图标 @uyarn([#3468](https://github.com/Tencent/tdesign-vue/pull/3468))

### 🐞 Bug Fixes
- `AutoComplete`: 修复 `options` 为空数组，empty 节点没显示的问题 @liweijie0812 ([#3474](https://github.com/Tencent/tdesign-vue/pull/3474))
- `Dialog`: 修复 `1.10.8` 版本后当 mode 为 "normal" 时渲染不符合预期的问题 @RSS1102 ([#3493](https://github.com/Tencent/tdesign-vue/pull/3493))
- `ImageViewer`: 修复开启`closeOnOverlay`时，点击蒙层关闭存在闪烁情况的问题 @huangchen1031([#3472](https://github.com/Tencent/tdesign-vue/pull/3472))
- `Menu`: 修复`MenuGroup`的 title 不支持使用函数渲染的问题 @uyarn ([#3497](https://github.com/Tencent/tdesign-vue/pull/3497))
- `Statistic`: 修复 `decimalPlaces=0` 时数值动画期间精度错误的问题 @liweijie0812 ([#3496](https://github.com/Tencent/tdesign-vue/pull/3496))
- `Tabs`: 修复可滑动`Tabs`配合`action`使用的样式问题 @Wesley-0808([#3477](https://github.com/Tencent/tdesign-vue/pull/3477))
- `Transfer`: 确保 `filterTransferData` 仅返回有效值 @RSS1102 ([#3487](https://github.com/Tencent/tdesign-vue/pull/3487))

### 🚧 Others
- 调整组件依赖 `lodash`  为`lodash-es` @liweijie0812 ([#3486](https://github.com/Tencent/tdesign-vue/pull/3486))

## 🌈 1.10.9 `2025-01-10` 
### 🚀 Features
- `AutoComplete`: 新增`empty` API，用于配置空状态下的下拉内容展示 @liweijie0812 ([#3462](https://github.com/Tencent/tdesign-vue/pull/3462))
- `DatePicker`: 新增 `cancelRangeSelectLimit` API ，用于日期范围选择器不限制日期区间的范围 @FliPPeDround ([#3460](https://github.com/Tencent/tdesign-vue/pull/3460))
### 🐞 Bug Fixes
- `AutoComplete`: 修复选项为空时显示效果异常的问题 @betavs ([#3461](https://github.com/Tencent/tdesign-vue/pull/3461))
- `Table`:  @uyarn
    - 优化`select-change`中回调参数的返回值，不返回不存在的rowData ([#3446](https://github.com/Tencent/tdesign-vue/pull/3446))
    - 修复无法通过键盘操作表格左右滚动的问题 @uyarn ([#3463](https://github.com/Tencent/tdesign-vue/pull/3463))


## 🌈 1.10.8 `2024-12-30` 
### 🚀 Features
- `ConfigProvider`: 新增`attach` 配置，支持全局设置`Popup`、`Dialog`、`Drawer`的挂载节点 @liweijie0812 ([#3437](https://github.com/Tencent/tdesign-vue/pull/3437))
- `Radio`: 新增`theme`API，用于配置 `RadioGroup` 使用`options` 时渲染的子组件样式 @myronliu347 ([#3402](https://github.com/Tencent/tdesign-vue/pull/3402))
- `Radio`: 新增 `readonly` API，用于支持只读属性配置 @liweijie0812 ([#3431](https://github.com/Tencent/tdesign-vue/pull/3431))
- `Table`: 支持行高亮功能及相关操作，具体使用请参考示例代码 @uyarn ([#3442](https://github.com/Tencent/tdesign-vue/pull/3442))

### 🐞 Bug Fixes
- `Cascader`：@betavs
    - 当 `valueType` 为 `full` 时会意外触发 `change` 事件  ([#3435](https://github.com/Tencent/tdesign-vue/pull/3435))
   - 修复`valueType` 为 `full` 且`showAllLevels `为`false`无法正常展示的功能问题 ([#3438](https://github.com/Tencent/tdesign-vue/pull/3438))
- `Dialog`: 修复默认挂载节点非`body`的异常 @liweijie0812 ([#3437](https://github.com/Tencent/tdesign-vue/pull/3437))
- `Dialog`: 修复`1.10.6`版本`closeOnOverlayClick`的默认行为异常的问题 @uyarn ([#3433](https://github.com/Tencent/tdesign-vue/pull/3433))
- `Select`: @RSS1102
    - 修复`onInputChange` 事件丢失第二个回调参数的问题  ([#3427](https://github.com/Tencent/tdesign-vue/pull/3427))
   - 优化`reserveKeyword`配合`filterable`在全选下的行为 ([#3440](https://github.com/Tencent/tdesign-vue/pull/3440))
   - 修复分组情况下标题不存在的渲染报错的问题 ([#3445](https://github.com/Tencent/tdesign-vue/pull/3445))
### 📝 Documentation
- `ConfigProvider`: 补充`Empty`组件的全局配置相关文档 @liweijie0812 ([#3437](https://github.com/Tencent/tdesign-vue/pull/3437))
- `Upload`: 优化上传组件图片展示样式 @huangchen1031 ([#3429](https://github.com/Tencent/tdesign-vue/pull/3429))


## 🌈 1.10.7 `2024-12-16` 
### 🐞 Bug Fixes
- `ColorPicker`:  修复颜色选择器的国际化配置问题 @liweijie0812 ([#3403](https://github.com/Tencent/tdesign-vue/pull/3403))
- `Dialog`: 修复`1.10.6`版本中`Dialog`组件 `props` 重复导致的异常问题 @uyarn ([#3423](https://github.com/Tencent/tdesign-vue/pull/3423))
- `Table`: 修复 `filterIcon` 不生效的问题 @liweijie0812 ([#3422](https://github.com/Tencent/tdesign-vue/pull/3422))




## 🌈 1.10.6 `2024-12-05`

### 🚀 Features

- `Icon`: 图标库发布 `0.3.0`版本，新增 907 个新图标；命名优化`blockchain` 重命名改为`transform-1`,`gesture-pray-1`重命名为`gesture-open`,`gesture-ranslation-1`重命名为`wave-bye`, `gesture-up-1`重命名为`gesture-typing`,`gesture-up-2`重命名为`gesture-right-slip`,`logo-wechat`重命名为`logo-wechat-stroke-filled`，移除`tree-list`、`logo-adobe-photoshop-1` 等错误图标 @uyarn ([#3392](https://github.com/Tencent/tdesign-vue/pull/3392))
- `DatePicker`: 新增 `multiple` API, 用于支持多选日期的场景 @hkaikai ([#3407](https://github.com/Tencent/tdesign-vue/pull/3407))
- `Dialog`: 新增 `beforeOpen` 和 `beforeClose` API @Wesley-0808 ([#3393](https://github.com/Tencent/tdesign-vue/pull/3393))
- `Drawer`: 新增 `beforeOpen` 和 `beforeClose` API @Wesley-0808 ([#3393](https://github.com/Tencent/tdesign-vue/pull/3393))
- `Form`: 表单组件同时支持 `change` 和 `blur` 的校验触发方式 @myronliu347 ([#3323](https://github.com/Tencent/tdesign-vue/pull/3323))
- `Tree`: 支持通过`scrollTo`方法滚动到指定节点，`scrollToElement`方法仍保留 @uyarn ([#3415](https://github.com/Tencent/tdesign-vue/pull/3415))
- `Tree`: 支持`scrollTo`方法通过唯一`key`滚动到指定节点，减少业务计算`index`的需求，具体方法参考示例 @uyarn ([#3415](https://github.com/Tencent/tdesign-vue/pull/3415))

### 🐞 Bug Fixes

- `Transfer`: 修复设置 pageSizeOptions 时切换 pageSize 无法生效得问题 @morningbao ([#3374](https://github.com/Tencent/tdesign-vue/pull/3374))
- `InputNumber`: 限制输入超过范围外的数字未触发 `blur` 事件 @betavs ([#3399](https://github.com/Tencent/tdesign-vue/pull/3399))
- `Select`: 修复搜索过滤选项列表时选中值显示错误问题 @morningbao ([#3410](https://github.com/Tencent/tdesign-vue/pull/3410))
- `Transfer`: 修复树形组件选项禁用在全选下仍可选中的缺陷 @uyarn ([#3412](https://github.com/Tencent/tdesign-vue/pull/3412))
- `Transer`: 修复拖拽排序向后移动的功能异常 @uyarn ([#3412](https://github.com/Tencent/tdesign-vue/pull/3412))
- `Table`: 修复树形表格列改变时渲染出错的问题 @myronliu347 ([#3400](https://github.com/Tencent/tdesign-vue/pull/3400))
- `Slider`: 修复组件不支持受控用法的问题 @uyarn ([#3414](https://github.com/Tencent/tdesign-vue/pull/3414))

### 📝 Documentation

- `Icon`: 优化图标检索功能，支持中英文搜索图标 @uyarn ([#3392](https://github.com/Tencent/tdesign-vue/pull/3392))



## 🌈 1.10.5 `2024-11-08` 
### 🚀 Features
- `Switch`: 新增 `before-change` API, 用于需要发起异步请求的场景 @centuryPark ([#3386](https://github.com/Tencent/tdesign-vue/pull/3386))
- `DatePicker`: 新增 `disableTime` API，在日期时间选择器场景下使用 @myronliu347 ([#3324](https://github.com/Tencent/tdesign-vue/pull/3324))
- `Cascader`: 单选模式下当`trigger`为`hover`时，选中选项后自动关闭面板 @uyarn ([#3389](https://github.com/Tencent/tdesign-vue/pull/3389))
### 🐞 Bug Fixes
- `DatePicker`: `DateRangePickerPanel`组件`mode`为`week`时无法通过左右箭头调整月份 @RSS1102 ([#3370](https://github.com/Tencent/tdesign-vue/pull/3370))
- `Table`: 修复多级表头下的通过`colspan`合并表头的问题 @wangyang0210 ([#3372](https://github.com/Tencent/tdesign-vue/pull/3372))
- `ColorPicker`: 修复最近使用颜色删除的缺陷，调整为选中才能删除 @superNos ([#3384](https://github.com/Tencent/tdesign-vue/pull/3384))
- `TagInput`: 修复在`readonly` 模式下仍可以通过`Backspace` 删除已选项的缺陷 @RSS1102 ([#3376](https://github.com/Tencent/tdesign-vue/pull/3376))
### 🚧 Others
- `Drawer`: 修复 `live demo` 中头部配置展示异常的问题 @cszhjh  ([#3385](https://github.com/Tencent/tdesign-vue/pull/3385))

## 🌈 1.10.4 `2024-10-18` 
### 🚀 Features
- `TimePicker`: 新增 `autoSwap` API，支持`1.10.2` 版本之后仍支持保持选定的左右侧时间大小顺序 @uyarn ([#3363](https://github.com/Tencent/tdesign-vue/pull/3363))
### 🐞 Bug Fixes
- `Tree`: 修复叶子节点自定义的图标可被点击的问题 @RSS1102 ([#3354](https://github.com/Tencent/tdesign-vue/pull/3354))
- `Drawer`: 修复打开 `drawer` 时页面抖动的问题 @RSS1102 @uyarn ([#3362](https://github.com/Tencent/tdesign-vue/pull/3362))
- `Dialog`: 修复打开 `dialog` 时页面抖动的问题 @RSS1102 ([#3362](https://github.com/Tencent/tdesign-vue/pull/3362))
### 🚧 Others
- `DatePicker`: 移除文档中错误的`value` 类型描述

## 🌈 1.10.3 `2024-09-27` 
### 🐞 Bug Fixes
- `Cascader`: 修复初始化滚动节点时未兼容单选父节点滚动的缺陷 @uyarn ([#3342](https://github.com/Tencent/tdesign-vue/pull/3342))

## 🌈 1.10.2 `2024-09-24` 
### 🐞 Bug Fixes
-  修复`1.10.1`版本中构建产物异常的问题

## 🌈 1.10.1 `2024-09-24`

### 🚀 Features

- `Button`: 新增`form` API，原生的 form 属性，支持用于通过 form 属性触发对应 id 的 form 的表单事件 @uyarn ([#3310](https://github.com/Tencent/tdesign-vue/pull/3310))
- `Cascader`: 支持在打开菜单时滚动到首个已选项所在节点的能力 @uyarn ([#3335](https://github.com/Tencent/tdesign-vue/pull/3335))
- `DatePicker`: 支持`readonly`属性 @myronliu347 ([#3311](https://github.com/Tencent/tdesign-vue/pull/3311))
- `Form`: 新增`id` API，表单原生的 id 属性，支持用于配合非表单内的按钮通过 form 属性来触发表单事件 @uyarn ([#3310](https://github.com/Tencent/tdesign-vue/pull/3310))
- `Menu`: `expandType`为`normal`时，支持三级子菜单的展示 @setcy ([#3296](https://github.com/Tencent/tdesign-vue/pull/3296))
- `Select`: 支持在过滤情况下使用`checkAll`配置全选的功能 @zhengchengshi ([#3295](https://github.com/Tencent/tdesign-vue/pull/3295))
- `Table`: 可展开收起场景下新增 `t-table__row--expanded` 和 `t-table__row--folded` 用于区分展开和收起的行 @uyarn ([#3331](https://github.com/Tencent/tdesign-vue/pull/3331))
- `Tag`: 新增 `title` API 控制鼠标悬停显示的文本 @liweijie0812 ([#3309](https://github.com/Tencent/tdesign-vue/pull/3309))
- `TimePicker`:
  - 支持`readonly`属性 @myronliu347 ([#3311](https://github.com/Tencent/tdesign-vue/pull/3311))
  - 当结束时间大于开始时间时，自动调整 `TimeRangePicker` 时间范围的顺序 @myronliu347 ([#3327](https://github.com/Tencent/tdesign-vue/pull/3327))
- `TreeSelect`: 修改多选状态下默认点击父节点选项的行为为选中父节点，如果需要点击展开的交互效果，请配置`treeProps.expandOnClickNode` @uyarn ([#3330](https://github.com/Tencent/tdesign-vue/pull/3330))
- `Rate`: 新增支持`clearable` API，用于清空评分 @myronliu347 ([#3332](https://github.com/Tencent/tdesign-vue/pull/3332))

### 🐞 Bug Fixes

- `Cascader`: 修复过滤条件下选择父节点导致样式异常的问题 @uyarn ([#3333](https://github.com/Tencent/tdesign-vue/pull/3333))
- `DatePicker`: 修复周选择器下，年份边界日期返回格式错误的问题 @uyarn ([#3336](https://github.com/Tencent/tdesign-vue/pull/3336))
- `Select`: 修复下拉面板存在自定义节点且存在回车等操作时与组件自身键盘事件冲突的问题 @uyarn ([#3303](https://github.com/Tencent/tdesign-vue/pull/3303))
- `SelectInput`: 修复动态变化输入框宽度的情况下，下拉菜单宽度没有动态跟随变化的问题 @myronliu347 ([#3325](https://github.com/Tencent/tdesign-vue/pull/3325))
- `Slider`: 修复`change-end`事件回到没有正确`emit`的问题 @myronliu347 ([#3320](https://github.com/Tencent/tdesign-vue/pull/3320))
- `Table`: 修复表格开启虚拟滚动和 `loading` 后，分页和表格内容顺序错乱的问题 @myronliu347 ([#3319](https://github.com/Tencent/tdesign-vue/pull/3319))
- `TimePicker`: 修复 12 小时制切换在 `dayjs` 切换中文情况下失效的问题 @myronliu347 ([#3326](https://github.com/Tencent/tdesign-vue/pull/3326))
- `TreeSelect`: 修复无法支持深层的 `keys` 设置的问题 @myronliu347 ([#3313](https://github.com/Tencent/tdesign-vue/pull/3313))
- `Upload`: 修复 `uploadPastedFiles = false` 时第一次上传文件后报错导致响应式丢失的问题 @myronliu347 ([#3308](https://github.com/Tencent/tdesign-vue/pull/3308))

### 🚧 Others

- `DatePicker`: 优化周选择器配合`firstDayOfWeek`使用的问题，详情请查看示例代码 @uyarn ([#3336](https://github.com/Tencent/tdesign-vue/pull/3336))
- `Dialog`: 优化非模态模式下的展示样式 @RSS1102 ([common#1945](https://github.com/Tencent/tdesign-common/pull/1945))
- `Popup`: 修复文档内容错误 @novlan1 ([common#1941](https://github.com/Tencent/tdesign-common/pull/1941))
- `i18n`: 新增俄语和意大利语的语言配置支持 @liweijie0812 ([#3334](https://github.com/Tencent/tdesign-vue/pull/3334))


## 🌈 1.10.0 `2024-08-29`
### 🚀 Features
- `Empty`: 新增空状态组件 `Empty`，用于空状态时的占位提示 @HaixingOoO  ([#3287](https://github.com/Tencent/tdesign-vue/pull/3287))
- `ConfigProvider`: 新增支持 `descriptions.colonText rate.rateText 和 setpes.checkIcon` 的全局配置 @liweijie0812 ([#3288](https://github.com/Tencent/tdesign-vue/pull/3288))
- `Cascader`: 级联面板完善支持自定义下拉选项内容的能力 ([#3290](https://github.com/Tencent/tdesign-vue/pull/3290))
- `List`: 新增`scroll` API，支持开启虚拟滚动适用于大数据量的场景，具体使用方式参考示例代码
@uyarn ([#3286](https://github.com/Tencent/tdesign-vue/pull/3286))

### 🐞 Bug Fixes
- `Select`: @dhwebs ([#3278](https://github.com/Tencent/tdesign-vue/pull/3278))
  - 修复分组状态下，通过上下键切换时下拉面板不会跟随滚动的问题
  - 修复分组状态下，通过上下键切换时无法正确切换的问题
- `ColorPicker`: 修复`ColorPicker`透传`SelectInputProps`无效问题 @taninsist ([#3279](https://github.com/Tencent/tdesign-vue/pull/3279))
- `TimePicker`: @myronliu347 
  - 修复 `disableTime` 中 `position` 一直是 `start` 的问题 ([#3281](https://github.com/Tencent/tdesign-vue/pull/3281))
  - 修复 `format` 仅支持 `HH:mm:ss` 格式的问题 ([#3280](https://github.com/Tencent/tdesign-vue/pull/3280))
- `Form`: 添加 `whitespace` 校验默认错误信息 @liweijie0812 ([#3284](https://github.com/Tencent/tdesign-vue/pull/3284))


## 🌈 1.9.9 `2024-08-15`

### 🚀 Features

- `Table`: 新增支持 API `thClassName`，用于需要在列表头自定义类名的场景 @theBestVayne ([#3238](https://github.com/Tencent/tdesign-vue/pull/3238))
- `Input`: 新增 `borderless` API，支持无边框模式 @liweijie0812 ([#3249](https://github.com/Tencent/tdesign-vue/pull/3249))
- `AutoComplete`: 新增 `borderless` API，支持无边框模式 @liweijie0812 ([#3249](https://github.com/Tencent/tdesign-vue/pull/3249))
- `ColorPicker`: 新增 `borderless` API，支持无边框模式 @liweijie0812 ([#3249](https://github.com/Tencent/tdesign-vue/pull/3249))
- `DatePicker`: 新增 `borderless` API，支持无边框模式 @liweijie0812 ([#3249](https://github.com/Tencent/tdesign-vue/pull/3249))
- `TagInput`: 新增 `borderless` API，支持无边框模式 @liweijie0812 ([#3249](https://github.com/Tencent/tdesign-vue/pull/3249))
- `TimePicker`: 新增 `borderless` API，支持无边框模式 @liweijie0812 ([#3249](https://github.com/Tencent/tdesign-vue/pull/3249))
- `Description`: layout 类型定义调整为字符串多类型 @liweijie0812 ([#3252](https://github.com/Tencent/tdesign-vue/pull/3252))

### 🐞 Bug Fixes

- `Cascader`: 修复多选下点击清空按钮的功能异常及多次触发 `onChange` 事件的问题 @uyarn ([#3273](https://github.com/Tencent/tdesign-vue/pull/3273))
- `Form`: 修复某种情况下 scrollToFirstError 失效的问题 @morningbao ([#3251](https://github.com/Tencent/tdesign-vue/pull/3251))
- `InputNumber`: 修复小数点精度计算，以 0 开头的计算边界逻辑缺失导致计算错误的问题 @uyarn ([#3273](https://github.com/Tencent/tdesign-vue/pull/3273))
- `Table`: 修复拖拽排序时，祖先节点内的顺序错误的问题 @uyarn ([#3273](https://github.com/Tencent/tdesign-vue/pull/3273))
- `TagInput`: 修复`tagProps` 没有作用到折叠的标签上的缺陷 @uyarn ([#3260](https://github.com/Tencent/tdesign-vue/pull/3260))
- `Upload`: 修复部分图标不支持全局替换的问题 @uyarn ([#3244](https://github.com/Tencent/tdesign-vue/pull/3244))


## 🌈 1.9.8 `2024-07-11` 
### 🚀 Features
- `Icon`: 新增有序列表图标 `list-numbered`，优化`lock-off`图标的绘制路径 @DOUBLE-DENG ([icon#9f4acfd](https://github.com/Tencent/tdesign-icons/commit/9f4acfdda58f84f9bca71a22f033e27127dd26db))
### 🐞 Bug Fixes
- `Icon`: 修复图标`chart-column`的命名错误问题，如果使用旧错误命名请注意 @uyarn ([#3229](https://github.com/Tencent/tdesign-vue/pull/3229))
- `Tree`: 修复树形组件错误过滤 `value` 为 `0` 的节点的问题 @uyarn ([#3233](https://github.com/Tencent/tdesign-vue/pull/3233))
- `Input`: 修复禁用状态下仍可以切换明文密文的问题 @jby0107 ([#3230](https://github.com/Tencent/tdesign-vue/pull/3230))
- `Input`: 修复禁用状态下超出问题文字长度异常的问题 @uyarn ([common#1831](https://github.com/Tencent/tdesign-common/pull/1831))
- `Menu`: 修复样式文件多余的空格导致部分场景打包异常的问题 @liweijie0812 ([common#1828](https://github.com/Tencent/tdesign-common/pull/1828))

## 🌈 1.9.7 `2024-06-28` 
### 🐞 Bug Fixes
- `Dialog`: 修复 `Dialog` 组件在 `SSR` 环境下的使用问题 @qqw78901 ([#3219](https://github.com/Tencent/tdesign-vue/pull/3219))

## 🌈 1.9.6 `2024-06-26` 
### 🐞 Bug Fixes
- `Tree`: 修复 `1.9.5` 版本使用拖拽功能的报错问题 @uyarn ([#3212](https://github.com/Tencent/tdesign-vue/pull/3212))

## 🌈 1.9.5 `2024-06-20` 
### 🚀 Features
- `Transfer`: 修复通过 `Function` 方法使用 `Tree` 属性的能力 @sinbadmaster ([#3185](https://github.com/Tencent/tdesign-vue/pull/3185))
- `Tabs`:
   - 支持通过滚轮或者触摸板进行滚动的操作 @oljc ([#3187](https://github.com/Tencent/tdesign-vue/pull/3187))
   - 新增 `scrollPosition` API, 支持自定义选中滑块滚动最终停留的位置 @oljc ([#3196](https://github.com/Tencent/tdesign-vue/pull/3196))
- `DatePicker`: 优化日期区间选择器头部区间的变化逻辑，选择后左侧区间大于右侧区间，则默认调整为左侧区间始终比右侧区间小 1 @uyarn ([#3207](https://github.com/Tencent/tdesign-vue/pull/3207))
### 🐞 Bug Fixes
- `Tree`: 新增 `allowDrop` API，支持拖放限制的能力，具体参考相关示例 @TabSpace ([#3206](https://github.com/Tencent/tdesign-vue/pull/3206))
- `Cascader`: 修复无children选项点击时仍然显示之前列表的问题 @1379255913 ([#3201](https://github.com/Tencent/tdesign-vue/pull/3201))
- `InputNumber`: 修复 `allowInputOverLimit=false` 大小值判断时，`value` 为 `undefined` 时，会出现显示 Infinity 的问题 @HaixingOoO
- `SelectInput`: 修复多选情况下设置 `allowInput` 为 true 无法输入的问题 @hy212 ([#3195](https://github.com/Tencent/tdesign-vue/pull/3195))


## 🌈 1.9.4 `2024-05-16`
### 🚀 Features
- `Input`: 新增 `borderless` 无边框模式输入框 @uyarn ([#3162](https://github.com/Tencent/tdesign-vue/pull/3162))
- `Scroll`: 调整 `Chrome 121` 升级带来的滚动条样式的兼容方式，不再依赖 `autoprefixer`或`vue-cli` 的版本 @loopZhou ([#3162](https://github.com/Tencent/tdesign-vue/pull/3162))
- `DatePicker`:  `DatePicker` 及 `DateRangePicker` 组件新增 `label` 属性 @fython ([#3169](https://github.com/Tencent/tdesign-vue/pull/3169))
- `RangeInput`: 新增 `label` 属性 @fython ([#3169](https://github.com/Tencent/tdesign-vue/pull/3169))
### 🐞 Bug Fixes
- `ColorPicker`: 修复切换预览颜色时，通道按钮位置不变的问题 @fennghuang ([#3163](https://github.com/Tencent/tdesign-vue/pull/3163))
- `RangeInput`: 修复 `prefix/suffix` 未垂直居中对齐的问题 @fython ([#3175](https://github.com/Tencent/tdesign-vue/pull/3175))
- `Menu`: 提升 `t-popup__menu` 的样式优先级，解决 dist 内样式优先级一致导致样式异常的问题 @uyarn ([#3178](https://github.com/Tencent/tdesign-vue/pull/3178))
- `Select`: 
    - 优化已选样式覆盖已禁用样式的问题 @fython ([#3178](https://github.com/Tencent/tdesign-vue/pull/3178))
    - 修复`1.9.2` 版本错误移除 `value` 默认值的问题 @uyarn ([#3177](https://github.com/Tencent/tdesign-vue/pull/3177))
- `Upload`: 修复图片上传错误类型下的样式异常的问题 @uyarn ([#3178](https://github.com/Tencent/tdesign-vue/pull/3178))
### 🚧 Others
- `Upload`: 
  - 修复文档中`locale`跳转链接异常的问题 @uyarn ([#3178](https://github.com/Tencent/tdesign-vue/pull/3178))
  - 修复文档中关于 `OPTIONS` 方法的说明 @Summer-Shen ([#3155](https://github.com/Tencent/tdesign-vue/pull/3155))


## 🌈 1.9.3 `2024-04-26` 
### 🚀 Features
- `Menu`: `Submenu`透传 `Popup` 组件全部特性 @betavs ([#3145](https://github.com/Tencent/tdesign-vue/pull/3145))
### 🐞 Bug Fixes
- `Submenu`: 修复设置 `popup-props` 中 `placement` 属性无效的问题 @betavs ([#3145](https://github.com/Tencent/tdesign-vue/pull/3145))
- `Textarea`: 修复`autosize` 在 `Firefox` 中不生效的问题 @XBIsland ([#3148](https://github.com/Tencent/tdesign-vue/pull/3148))
- `Select`: 修复 `option` 插槽 value 为 `Boolean` 类型的报错问题 @uyarn ([#3154](https://github.com/Tencent/tdesign-vue/pull/3154))
- `Upload`: 修复自定义方法通过`uploadFilePercent`更新百分比无效的问题 @XBIsland ([#3149](https://github.com/Tencent/tdesign-vue/pull/3149))
- `Style`: 修复部分节点前缀无法统一替换的缺陷 @ZWkang [common#1773](https://github.com/Tencent/tdesign-common/pull/1773)

### 🚧 Others
- docs: 更新关于CDN资源用法的说明文档  @uyarn ([#3144](https://github.com/Tencent/tdesign-vue/pull/3144))


## 🌈 1.9.2 `2024-04-11` 
### 🚀 Features
- `Tag`: 新增 `color` API，支持自定义颜色  @maoyiluo ([#3101](https://github.com/Tencent/tdesign-vue/pull/3101))
- `TagInput`: 统一新增 `collapsedItems` 的 `onClose` 回调，支持对折叠选项的删除操作 @topazur @uyarn ([#2942](https://github.com/Tencent/tdesign-vue/pull/2942))
- `SelectInput`: 统一新增 `collapsedItems` 的 `onClose` 回调，支持对折叠选项的删除操作 @topazur @uyarn ([#2942](https://github.com/Tencent/tdesign-vue/pull/2942))
- `TreeSelect`: 统一新增 `collapsedItems` 的 `onClose` 回调，支持对折叠选项的删除操作 @topazur @uyarn ([#2942](https://github.com/Tencent/tdesign-vue/pull/2942))
- `Cascader`: 统一新增 `collapsedItems` 的 `onClose` 回调，支持对折叠选项的删除操作 @topazur @uyarn ([#2942](https://github.com/Tencent/tdesign-vue/pull/2942))
### 🐞 Bug Fixes
- `Transfer`: 
    - 修复 `search` 事件的 `trigger` 的异常 @betavs ([#3118](https://github.com/Tencent/tdesign-vue/pull/3118))
    - 修复树形结构数据过滤异常的问题 @uyarn ([#3137](https://github.com/Tencent/tdesign-vue/pull/3137))
- `Locale`: 修复`Image`和`ImageViewer`组件英文语言包异常的问题，优化`DatePicker`部分语言配置 @uyarn ([#3119](https://github.com/Tencent/tdesign-vue/pull/3119))
- `Checkbox`: 修复 `checkboxGroup.max` 禁用态显示的问题 @LoopZhou ([#3124](https://github.com/Tencent/tdesign-vue/pull/3124))
- `DatePicker`: 
    - 修复`valueType` 为 `Date` 类型时仍然进行转换的缺陷 @uyarn ([#3127](https://github.com/Tencent/tdesign-vue/pull/3127))
    - 修复周和季度模式选择异常的问题 @uyarn ([#3138](https://github.com/Tencent/tdesign-vue/pull/3138))
- `Table`: 修复使用 `fixedRows` 时的报错问题 @betavs ([#3134](https://github.com/Tencent/tdesign-vue/pull/3134))
- `Loading`:导出 `LoadingDirective` 使用 @XBIsland ([#3120](https://github.com/Tencent/tdesign-vue/pull/3120))
- `Scroll`: 修复由于Chrome 121版本支持scroll width之后导致`Table`、`Select`及部分出现滚动条组件的样式异常问题 @loopzhou ([common#1765](https://github.com/Tencent/tdesign-vue/pull/1765))。请注意，基于 `@vue/cli-service 4.x` 及以下版本初始化的项目由于依赖的 postcss 版本过低，会因为这个修复受影响，需要升级postcss至8.0以上或整体升级`@vue/cli-service`至5.0以上

### 🚧 Others
- `Dialog`: 优化插件部分的使用示例 @Lyan-u ([#3126](https://github.com/Tencent/tdesign-vue/pull/3126))
- `Dialog`: 优化插件部分的使用说明 @Summer-Shen ([#3125](https://github.com/Tencent/tdesign-vue/pull/3125))
- `Menu`: 移除示例代码中废弃的高度示例 @Summer-Shen ([#3135](https://github.com/Tencent/tdesign-vue/pull/3135))


## 🌈 1.9.1 `2024-03-10`

### 🚀 Features
- `Slider`: 支持通过 `label=null` 或 `label=false` 隐藏滑块数字浮层 @chaishi ([#3100](https://github.com/Tencent/tdesign-vue/pull/3100))
- `Table`: 支持全局配置 size @Lyan-u ([#3103](https://github.com/Tencent/tdesign-vue/pull/3103))
- `Table`: 可筛选表格，单选/多选筛选条件,支持搜索选项 @chaishi ([#3098](https://github.com/Tencent/tdesign-vue/pull/3098))
- `Tabs`: 调整激活 Tab下划线与 TabHeader边框的层级关系 @uyarn 

### 🐞 Bug Fixes
- `DatePicker`: 修复 `format` 与 `valueType` 不一致的场景下计算错误的问题 @uyarn ([#3106](https://github.com/Tencent/tdesign-vue/pull/3106))
- `Descriptions`: 解决控制台报错绑定属性 `title` 已声明为属性的问题 @betavs ([#3065](https://github.com/Tencent/tdesign-vue/pull/3065))
- `Descriptions`: 优化自适应宽度的问题 @uyarn ([#3105](https://github.com/Tencent/tdesign-vue/pull/3105))
- `Table`: 树形结构表格，修复同时异步设置 data 和 expandedTreeNodes 时，展开节点的无效问题 @chaishi ([#3098](https://github.com/Tencent/tdesign-vue/pull/3098))
- `Table`: 固定列表格，修复固定多列时，在 Dialog 中固定列位置压缩问题 @chaishi ([#3098](https://github.com/Tencent/tdesign-vue/pull/3098))
- `Table`: 修复`Table`缺失`refreshTable`方法的异常 @uyarn ([#3104](https://github.com/Tencent/tdesign-vue/pull/3104))

### 🚧 Others
- `Form` 文档更新 @liweijie0812 ([#3064](https://github.com/Tencent/tdesign-vue/pull/3064))
- 新增 `composition API` 示例，详情请参考官网各示例代码 @chaishi @uyarn @HaixingOoO ([#3081](https://github.com/Tencent/tdesign-vue/pull/3081))


## 🌈 1.9.0 `2024-01-23` 
### 🚀 Features
- `Descriptions`: 新增 `Descriptions` 描述组件 @zhangpaopao0609 ([#3035](https://github.com/Tencent/tdesign-vue/pull/3035))
- `Slider`:  新增 `changeEnd` 事件 API @uyarn ([#3056](https://github.com/Tencent/tdesign-vue/pull/3056))
### 🐞 Bug Fixes
- `Loading`: 修复重复调用`LoadingPlugin()`时报错 @Zz-ZzzZ ([#3025](https://github.com/Tencent/tdesign-vue/pull/3025))
- `Textarea`: 修复设置`maxlength`后，在windows自带输入法中，中文时不到最大长度也会自动覆盖之前已输入内容的缺陷 @azx1573 ([#3044](https://github.com/Tencent/tdesign-vue/pull/3044))
- `Textarea`: value绑定值时，autosize时无法输入中文问题 @LoopZhou ([#3057](https://github.com/Tencent/tdesign-vue/pull/3057))
- `TagInput`: 修复`size` API 没有作用到折叠选项的问题 @uyarn ([#3055](https://github.com/Tencent/tdesign-vue/pull/3055))
- `Select`: 修复点击清除按钮触发多次`onChange`事件的异常 @uyarn ([#3054](https://github.com/Tencent/tdesign-vue/pull/3054))
- `Form`: 修复计算`^`字符长度异常的问题 @uyarn ([#3058](https://github.com/Tencent/tdesign-vue/pull/3058))
- `Form`: 更正表单组件实例方法为非`required`类型 @iiimix ([#3034](https://github.com/Tencent/tdesign-vue/pull/3034))
### 🚧 Others
- docs(Card): 更新组件 API 文档 @liweijie0812 ([#3021](https://github.com/Tencent/tdesign-vue/pull/3021))
- docs: 更正 `webpack` 中使用 `unplugin-auto-import`的说明文档 @uyarn ([#3030](https://github.com/Tencent/tdesign-vue/pull/3030))



## 🌈 1.8.4 `2024-01-02` 
### 🚀 Features
- `Upload`: 手动上传场景，支持进行粘贴上传 @chaishi ([#2991](https://github.com/Tencent/tdesign-vue/pull/2991))
- `Card`: 支持传入`loadingProps`参数修改加载状态的展示 @iiimix ([#2959](https://github.com/Tencent/tdesign-vue/pull/2959))

### 🐞 Bug Fixes
- `Upload`: @chaishi ([#2991](https://github.com/Tencent/tdesign-vue/pull/2991))
   - 修复手动上传时，无法更新上传进度问题 
    - 修复图片预览时，无法切换预览图片问题
- `Table`: @chaishi ([#2990](https://github.com/Tencent/tdesign-vue/pull/2990))
    - 横向滚动场景，修复吸顶表头在移动端无法跟随滚动的问题 
    - 横向滚动场景，修复横向滚动在有惯性滚动浏览器中的滚动的问题
   -  横向滚动场景，修复在 Windows 场景中，按下鼠标（不松开鼠标）横向滚动时，表头没有跟随滚动的问题
   -  修复可筛选表格，修复筛选值为 `0` 时，筛选图表没有高亮的问题
- `Pagination`: 将总数单位 `项` 改为 `条` , 保持内容一致性 @dinghuihua ([#2996](https://github.com/Tencent/tdesign-vue/pull/2996))
- `Radio`: 处理选中状态也会触发 `change` 事件的问题 @betavs ([#3000](https://github.com/Tencent/tdesign-vue/pull/3000))
- `Textarea`: 修复组件初始处于隐藏状态，可视后未做高度再计算的问题 @azx1573 ([#3003](https://github.com/Tencent/tdesign-vue/pull/3003))
- `ImageViewer`: 添加defaultScale @sinbadmaster ([#3013](https://github.com/Tencent/tdesign-vue/pull/3013))
- `Upload`: 修复 `Form` 的 `disabled` 属性没有作用到上传组件部分按钮的问题 @uyarn ([#3012](https://github.com/Tencent/tdesign-vue/pull/3012))
- `Select`: 修复`naruto`版本`minCollapsedNum`与`disabled` API的功能异常问题  @uyarn
### 🚧 Others
- `Popup`: 丰富插件使用方式的使用示例 @uyarn ([#3014](https://github.com/Tencent/tdesign-vue/pull/3014))

## 🌈 1.8.3 `2023-12-15` 
### 🚀 Features
- `Upload`: 新增支持 `uploadPastedFiles`，用于控制是否允许用户粘贴文件上传，默认允许 @chaishi ([#2966](https://github.com/Tencent/tdesign-vue/pull/2966))
- `Dropdown`: 移除对 left 的 item 样式特殊处理 @uyarn [common#1677](https://github.com/Tencent/tdesign-common/pull/1677)
### 🐞 Bug Fixes
- `DatePicker`: 修复选择同一个月内的日期后，打开面板左右月份一样的问题 @Lyan-u ([#2972](https://github.com/Tencent/tdesign-vue/pull/2972))
- `Drawer`: 处理点击esc无法关闭的问题 @betavs ([#2967](https://github.com/Tencent/tdesign-vue/pull/2967))
- `ImageViewer`: 滚轮缩放符合操作直觉 @sinbadmaster ([#2974](https://github.com/Tencent/tdesign-vue/pull/2974))
- `SSR`: 修复 `SSR` 场景使用报错的问题  @uyarn ([#2985](https://github.com/Tencent/tdesign-vue/pull/2985))
- `Tree`: 处理 `height` 属性无效的问题 @betavs ([#2968](https://github.com/Tencent/tdesign-vue/pull/2968))
- `Tree`: 解决初始化节点选中态异常的问题 @TabSpace ([#2985](https://github.com/Tencent/tdesign-vue/pull/2985))
- `Upload`: 卡片式文件上传，修复取消上传时，文件依然显示的问题 @chaishi ([#2966](https://github.com/Tencent/tdesign-vue/pull/2966))

## 🌈 1.8.1 `2023-12-07` 
### 🚀 Features
- `Cascader`:  新增 `valueDisplay` API @PengYYYYY ([#2938](https://github.com/Tencent/tdesign-vue/pull/2938))
- `Menu`: 选中后关闭菜单，与其他组件保持交互行为一致 @uyarn ([#2963](https://github.com/Tencent/tdesign-vue/pull/2963))
- `Tabs`: 优化初始化滚动的场景，对处于中间的部分场景进行进一步优化 @uyarn ([#2964](https://github.com/Tencent/tdesign-vue/pull/2964))
### 🐞 Bug Fixes
- `Radio`: 选项内容变化后样式问题修复 @hkaikai ([#2936](https://github.com/Tencent/tdesign-vue/pull/2936))
- `Pagination`: 修复当 `total` 为 0 并且 `pageSize` 改变时， `current` 值为 0 的问题 @betavs ([#2937](https://github.com/Tencent/tdesign-vue/pull/2937))
- `Tree`: @TabSpace
   - 改进节点禁用状态的逻辑  ([#2935](https://github.com/Tencent/tdesign-vue/pull/2935))
   - value、active和expanded 属性, 支持数组操作触发视图变更 ([#2951](https://github.com/Tencent/tdesign-vue/pull/2951))
- `Table`: @chaishi
    - 修复分页场景，动态切换分页数据从 undefined 到具体真实数据时，分页无效的问题 ([#2954](https://github.com/Tencent/tdesign-vue/pull/2954))
    - 修复分页功能在序号、行选择、行拖拽排序等场景的问题 ([#2962](https://github.com/Tencent/tdesign-vue/pull/2962))
    - 修复可编辑表格的 `row-edit` 事件没有触发的问题 ([#2934](https://github.com/Tencent/tdesign-vue/pull/2934))
- `ImageViewer`: 修复在抽屉组件等组件中使用图片预览组件，按下 `esc` 键抽屉组件和图片预览组件会同时关闭的问题 @sinbadmaster ([#2958](https://github.com/Tencent/tdesign-vue/pull/2958))
- `AutoComplete`: 修复匹配特殊字符报错的问题  @ZWkang ([#2943](https://github.com/Tencent/tdesign-vue/pull/2943))
- `Dropdown`: 处理禁用状态可点击的问题 @betavs ([issue #3693](https://github.com/Tencent/tdesign-vue-next/issues/3693)) 

## 🌈 1.8.0 `2023-11-23`

### 🚀 Features

- `Statistic`: 新增`Statistic`统计数值组件 @LIjiAngChen8 ([#2397](https://github.com/Tencent/tdesign-vue/pull/2397))
- `Loading`: 支持使用 v-if 和 v-loading 混用的场景 @Zz-ZzzZ ([#2902](https://github.com/Tencent/tdesign-vue/pull/2902))
- `Space`: 支持老旧浏览器也能正常显示子元素之间的间距 @chaishi ([#2887](https://github.com/Tencent/tdesign-vue/pull/2887))
- `Table`: 可编辑单元格/可编辑行场景，支持使用参数 `updateEditedCellValue` 更新其他处于编辑态的列数据 @chaishi ([#2917](https://github.com/Tencent/tdesign-vue/pull/2917))
- `Input`: 恢复 `value` 对`number`的支持 @chaishi ([#2906](https://github.com/Tencent/tdesign-vue/pull/2906))

### 🐞 Bug Fixes

- `Radio`: 修复误判删除键(backspace)是空格键(space)的问题 @liweijie0812 ([#2905](https://github.com/Tencent/tdesign-vue/pull/2905))
- `Checkbox`: 修复误判删除键(backspace)是空格键(space)的问题 @liweijie0812 ([#2905](https://github.com/Tencent/tdesign-vue/pull/2905))
- `Table`: @chaishi
  - 列配置操作场景，修复表头不显示时，报错问题 ([#2909](https://github.com/Tencent/tdesign-vue/pull/2909))
  - 优化多级表头的列配置功能，不再显示非叶子节点 ([#2916](https://github.com/Tencent/tdesign-vue/pull/2916))
  - 修复列宽调整在某种情况下的列宽问题 ([#2916](https://github.com/Tencent/tdesign-vue/pull/2916))
  - 修复懒加载场景默认依然会执行内部逻辑问题 @chaishi ([#2915](https://github.com/Tencent/tdesign-vue/pull/2915))
- `Checkbox`: 修复 `CheckboxGroup.max` 超出数量限制时的禁用态显示问题 @betavs ([#2911](https://github.com/Tencent/tdesign-vue/pull/2911))
- `Checkbox`: 修复提前设置某个选项的值在选中项 `CheckboxGorup.value` 里面，再放入选项到 `options` 中，选项呈现状态为非选中问题 @chaishi ([#2914](https://github.com/Tencent/tdesign-vue/pull/2914))
- `Checkbox`: 修复懒加载场景默认依然会执行内部逻辑问题 @chaishi ([#2915](https://github.com/Tencent/tdesign-vue/pull/2915))
- `Cascader`: 修复数字为 value 时的告警问题 @uyarn ([#2924](https://github.com/Tencent/tdesign-vue/pull/2924))
- `TreeSelect`: 修复数字为 value 时的告警问题 @uyarn ([#2924](https://github.com/Tencent/tdesign-vue/pull/2924))
- `Popup`: 修复`destroyOnClose`时，快速重复 hover 后组件无法正常展示的问题 @guxi11 ([#2898](https://github.com/Tencent/tdesign-vue/pull/2898))
- `Textarea`: 修复表格中使用 `Textarea` 且设置`autosize`为 true 报错的问题 @nined9 ([#2921](https://github.com/Tencent/tdesign-vue/pull/2921))

### 🚧 Others

- `Table`: 优化吸顶表头/表尾示例代码 @chaishi ([#2916](https://github.com/Tencent/tdesign-vue/pull/2916))


## 🌈 1.7.2 `2023-11-07` 
### 🚀 Features
- `ImageViewer`: 新增支持 `closeOnEscKeydown` ，用于控制是否允许 ESC 键关闭预览 @chaishi ([#2890](https://github.com/Tencent/tdesign-vue/pull/2890))
- `Upload`: @chaishi
   - 批量文件上传支持在列表中显示上传失败的原因 ([#2891](https://github.com/Tencent/tdesign-vue/pull/2891))
   - 支持使用 `fileListDisplay=null` 隐藏文件或文件列表显示 ([#2889](https://github.com/Tencent/tdesign-vue/pull/2889))
   - 图片预览功能，新增支持透传图片预览全部属性 `imageViewerProps` ([#2891](https://github.com/Tencent/tdesign-vue/pull/2891))
   -  ⚠️ 新增图片上传大小超出限制提醒，有额外单独实现此功能的业务需注意是否存在重复显示大小限制提醒问题 ([#2891](https://github.com/Tencent/tdesign-vue/pull/2891))
   - 多文件/图片上传场景下，`autoUpload=false` 时，支持使用 Props 属性/函数/插槽等方法自定义上传按钮和取消上传按钮 ([#2891](https://github.com/Tencent/tdesign-vue/pull/2891))
   - 多文件/图片上传场景下，`autoUpload=false` 时，区分已上传状态和待上传状态 ([#2891](https://github.com/Tencent/tdesign-vue/pull/2891))
- `Select`: `collapsedItems` 属性或插槽新增参数 `onClose`，用于删除标签 @ubloglab ([#2863](https://github.com/Tencent/tdesign-vue/pull/2863))
### 🐞 Bug Fixes
- `Tree`: @TabSpace
   - 解决 `watch` 回调时间过迟的问题 ([#2873](https://github.com/Tencent/tdesign-vue/pull/2873))
   - 提供获取树结构数据的 API `getTreeData` ([#2888](https://github.com/Tencent/tdesign-vue/pull/2888))
- `Upload`: 修复 `max=1 multiple=false` 情况下，无法替换上传文件问题 @chaishi ([#2891](https://github.com/Tencent/tdesign-vue/pull/2891))
- `Cascader`: 选项`disabled`修改后，选项不是禁用状态的问题 #2859 @lxc-orange ([#2872](https://github.com/Tencent/tdesign-vue/pull/2872))
- `Slider`: 修复step小于1无法正常使用的问题 @uyarn ([#2894](https://github.com/Tencent/tdesign-vue/pull/2894))
- `Link`: 修复样式居中的缺陷 @uyarn ([#2894](https://github.com/Tencent/tdesign-vue/pull/2894))
- `Checkbox`: 修复 value.splice 无法设置选中项变化问题 @chaishi
- `lodash`: 修复非按需引入导致全量引入的问题 @fennghuang ([#2893](https://github.com/Tencent/tdesign-vue/pull/2893))


## 🌈 1.7.1 `2023-10-20` 
### 🚀 Features
- `Table`: 可筛选表格，支持设置 `confirmEvents: ['onChange']` 后，单选筛选器(Radio) 选择完成后自动关闭筛选器浮层 @chaishi ([#2850](https://github.com/Tencent/tdesign-vue/pull/2850))
### 🐞 Bug Fixes
- `Tree`: 
    - 修复 `setItem` 方法设置 checked, actived, expanded 属性时，未触发 props 变更与相应事件的问题 @TabSpace ([#2852](https://github.com/Tencent/tdesign-vue/pull/2852))
    - 完善受控逻辑，解决 onChange 事件触发时，组件状态传递有延迟的问题 @TabSpace ([#2861](https://github.com/Tencent/tdesign-vue/pull/2861))
- `Checkbox`: 修复 `checkbox.disabled` 动态赋值失效问题 @chaishi ([#2849](https://github.com/Tencent/tdesign-vue/pull/2849))

## 🌈 1.7.0 `2023-10-12` 
### 🚀 Features
- `Tag`: @chaishi
    - 支持多种风格标签配置 ([#2824](https://github.com/Tencent/tdesign-vue/pull/2824))
   -  支持标签组`CheckTagGroup`的使用，详见示例文档 ([#2824](https://github.com/Tencent/tdesign-vue/pull/2824))
- `Anchor`: `anchor-item` 左侧边距的计算方式由嵌套改为 --level 结合 css 计算 @ontheroad1992 ([#2816](https://github.com/Tencent/tdesign-vue/pull/2816))
- `TagInput`: 支持在exceedType为scroll的场景下通过滚动对选项进行操作 @uyarn ([#2846](https://github.com/Tencent/tdesign-vue/pull/2846))

### 🐞 Bug Fixes
- `Dialog`: 修复 Dialog 弹框中打开表格，表格中分页组件信息出现超出省略问题 @LoopZhou ([#2821](https://github.com/Tencent/tdesign-vue/pull/2821))
- `ImageViewer`: 修复关闭时偶尔会出现抖动现象 @betavs ([#2823](https://github.com/Tencent/tdesign-vue/pull/2823))
- `DatePicker`:
    - 修复`confirm` 事件无效的问题 @betavs ([#2833](https://github.com/Tencent/tdesign-vue/pull/2833))
    - 修复禁用日期格式化问题 @honkinglin ([common#1618](https://github.com/Tencent/tdesign-common/pull/1618))
- `Cascader`:  修复 `change` 事件中 `source` 异常的问题 @betavs ([#2837](https://github.com/Tencent/tdesign-vue/pull/2837))
- `Breadcrumb`: 修复暗黑模式下的样式分隔符样式问题 @uyarn ([common#1608](https://github.com/Tencent/tdesign-common/pull/1608))
- `List`: 优化滚动条的样式 @liweijie0812 ([common#1601](https://github.com/Tencent/tdesign-common/pull/1601))
- `Radio`: 修复表单验证提示的场景下，右边框颜色不一致的问题 @liweijie0812 ([common#1599](https://github.com/Tencent/tdesign-common/pull/1599))
- `Tree`: @TabSpace
    - 解决 setData 方法无法触发属性变更的问题 ([#2820](https://github.com/Tencent/tdesign-vue/pull/2820))
    -  解决虚拟滚动，滚动条形态错误的问题  ([#2820](https://github.com/Tencent/tdesign-vue/pull/2820))
### 🚧 Others
- `Tree`: 实现与 vue3 项目共用业务代码, 提供更多的测试用例 @TabSpace ([#2820](https://github.com/Tencent/tdesign-vue/pull/2820))

## 🌈 1.6.7 `2023-09-21` 
### 🚀 Features
- `TreeSelect`: 支持`panelTopContent`和 `panelBottomContent` 的使用 @uyarn ([#2797](https://github.com/Tencent/tdesign-vue/pull/2797))
- `Table`:  @chaishi 
   - 除全局配置支持语言配置外，本次新增通过属性 `locale` 进行单个组件进行语言配置 ([#2810](https://github.com/Tencent/tdesign-vue/pull/2810))
   - 列配置功能，支持定义 `columnControllerTopContent` 和 `columnControllerBottomContent` 定义列配置弹框顶部或底部内容 ([#2810](https://github.com/Tencent/tdesign-vue/pull/2810))
   - 列配置功能，支持分组显示列配置信息，一般用于表格列数量特别多，需要分类显示场景([#2810](https://github.com/Tencent/tdesign-vue/pull/2810))
- `Card`: 卡片标题 `title` 使用 `div` 取代 `span` 在自定义场景下更符合规范 @uyarn ([#2812](https://github.com/Tencent/tdesign-vue/pull/2812))
### 🐞 Bug Fixes
- `useResizeObserver`: 修复缺少容器元素判空问题 @chaishi ([#2806](https://github.com/Tencent/tdesign-vue/pull/2806))
- `Table`: 列配置功能，修复每次打开自定义列配置弹框，都会创建一个新的弹框而旧弹框没有消除问题 @chaishi ([#2810](https://github.com/Tencent/tdesign-vue/pull/2810))
- `Dialog`: 修复没有定义确认按钮属性场景时（即没有设置 confirmBtn），`confirmLoading` 无效问题 @chaishi ([#2814](https://github.com/Tencent/tdesign-vue/pull/2814))

## 🌈 1.6.6 `2023-09-07` 
### 🐞 Bug Fixes
- `Checkbox`: 修复动态设置 `options` 无效问题 @chaishi ([#2793](https://github.com/Tencent/tdesign-vue/pull/2793))
- `Upload`: 上传组件 `theme='image'` 时，在 `disabled` 状态不显示上传按钮 @chaishi ([#2793](https://github.com/Tencent/tdesign-vue/pull/2793))
- `Table`: 可编辑表格，修复多个可编辑表格同时存在时，校验互相影响问题 @chaishi ([#2787](https://github.com/Tencent/tdesign-vue/pull/2787))

## 🌈 1.6.5 `2023-09-05` 
### 🚀 Features
- `Table`: @chaishi
  - 可筛选表格，`onFilterChange` 事件新增参数 `trigger: 'filter-change' | 'confirm' | 'reset' | 'clear'`，表示触发筛选条件变化的来源  ([#2767](https://github.com/Tencent/tdesign-vue/pull/2767))
  - 可筛选表格，支持使用 `filter.label` 单独定义晒选项别名，可以和 `title` 标题不一样 ([#2771](https://github.com/Tencent/tdesign-vue/pull/2771))
- `Dialog`: @chaishi ([#2769](https://github.com/Tencent/tdesign-vue/pull/2769))
  - 支持使用 `confirmLoading` 控制确认按钮加载状态
  - 组件实例函数新增 `confirmDialog.setConfirmLoading(true)` 和 `confirmDialog.update({ confirmLoading: true })`，用于设置确认按钮加载状态
- `Watermark`: 水印组件文字新增 `fontFamily` 属性 @LadyChatterleyLover ([common#1580](https://github.com/Tencent/tdesign-common/pull/1580))
- `GlobalConfig`: 全局配置中，步骤条组件添加已完成状态自定义功能 @Zzongke ([common#1579](https://github.com/Tencent/tdesign-common/pull/1579))
### 🐞 Bug Fixes
- `Table`:
  - 树形结构，修复 v1.6.4 中 `tree.defaultExpandAll` 失效问题 @chaishi ([#2752](https://github.com/Tencent/tdesign-vue/pull/2752))
  - 树形结构表格，修复 `expandedTreeNodes.sync` 和 `@expanded-tree-nodes-change` 使用 `expandTreeNodeOnClick ` 时无效问题 @chaishi ([#2767](https://github.com/Tencent/tdesign-vue/pull/2767))
  - 可筛选表格，修复 `resetValue` 在清空筛选时，未能重置到指定 `resetValue` 值的问题 @chaishi ([#2767](https://github.com/Tencent/tdesign-vue/pull/2767))
  - 可筛选表格，修复单选筛选器触发两次 `onFilterChange` 事件问题 @chaishi ([#2767](https://github.com/Tencent/tdesign-vue/pull/2767))
  - 拖拽排序表格，修复添加 `lazyLoad` 懒加载属性后，拖拽排序功能失效问题 @chaishi ([#2767](https://github.com/Tencent/tdesign-vue/pull/2767))
  - 可筛选表格，解决 `title` 使用函数或插槽定义时，过滤结果行文本显示问题 ([#2767](https://github.com/Tencent/tdesign-vue/pull/2767))
  - 可筛选表格，修复晒选项的值为 `false` 时，筛选图标未能高亮问题 ([#2771](https://github.com/Tencent/tdesign-vue/pull/2771))
- `Form`: 修复调用`form`组件暴露的`reset`方法后未定义`name`的`form-item`也被一同加入清除 @Zz-ZzzZ ([#2760](https://github.com/Tencent/tdesign-vue/pull/2760))
- `Checkbox`: 修复同时有多个 CheckGroup 时，选中值显示异常问题 @chaishi ([#2768](https://github.com/Tencent/tdesign-vue/pull/2768))
- `Image`: @chaishi ([#2770](https://github.com/Tencent/tdesign-vue/pull/2770))
  - 修复 `fallback` 在第一次加载失败后无效问题
  - 修复图片预览出现两个预览按钮问题
- `Dialog`: 修复组件如果初始默认显示， 按 esc 关不掉的问题 @Zhanjiachun ([#2708](https://github.com/Tencent/tdesign-vue/pull/2708))
- `Loading`: 修复Plugin在部分场景下设置 false 入参时重新创建实例的问题 @uyarn ([#2778](https://github.com/Tencent/tdesign-vue/pull/2778))
- `Autocomplete`: 修复错误的移除事件监听时机 @uyarn ([#2777](https://github.com/Tencent/tdesign-vue/pull/2777))
- `Table`: 修复固定表头/尾错误的移除事件监听时机 @uyarn ([#2777](https://github.com/Tencent/tdesign-vue/pull/2777))
- `Popup`: 修复产物中 `env` 环境的问题 @uyarn ([#2776](https://github.com/Tencent/tdesign-vue/pull/2776))
- `Select`: 修复多选且开启`reserveKeyword`的场景下删除 input 中的内容时，会删除已选项的缺陷 @uyarn ([#2779](https://github.com/Tencent/tdesign-vue/pull/2779))

## 🌈 1.6.4 `2023-08-29` 
### 🚀 Features
- `Tabs`: 支持 `tab-panel` 内容懒加载 @FireBushtree ([#2714](https://github.com/Tencent/tdesign-vue/pull/2714))
- `Table`: 树形结构，没有设置 `expandedTreeNodes` 情况下，data 数据发生变化时，自动重置收起所有展开节点。如果希望保持展开节点，请使用属性 `expandedTreeNodes` 控制变化后的数据展开节点。原因：表格数据变化前后的节点可能会有不同，`expandedTreeNodes`自然也会不同，组件内部无法预判新数据中展开哪些节点 @chaishi ([#2742](https://github.com/Tencent/tdesign-vue/pull/2742))
- `Input`: `maxlength` 属性 `String` 类型设置 @Zz-ZzzZ ([#2733](https://github.com/Tencent/tdesign-vue/pull/2733))
- `Textarea`: `maxlength` 属性 `String` 类型设置 @Zz-ZzzZ ([#2733](https://github.com/Tencent/tdesign-vue/pull/2733))
### 🐞 Bug Fixes
- `Dropdown`: 修复部分场景下展示下拉菜单异常的问题 @uyarn ([#2619](https://github.com/Tencent/tdesign-vue/pull/2619))
- `Upload`: @chaishi ([#2741](https://github.com/Tencent/tdesign-vue/pull/2741))
  - 修复非自动上传场景，无法预览图片问题
  - 修复非图片组件预览时的文本错位问题
- `Select`: 按需引入时，OptionGroup未注册 @KMethod ([#2738](https://github.com/Tencent/tdesign-vue/pull/2738))
- `Table`:  @chaishi ([#2742](https://github.com/Tencent/tdesign-vue/pull/2742))
  - 分页功能，修复分页非受控用法，数据变化时无法更新数据问题
  - 拖拽排序 + 本地数据分页场景，修复拖拽排序事件参数 `currentIndex/targetIndex/current/target` 等不正确问题
  - 拖拽排序 + 本地数据分页场景，修复在第二页 @chaishi ([#2742](https://github.com/Tencent/tdesign-vue/pull/2742))
  - 支持分页非受控用法的拖拽排序场景
- `Select`: 修复`1.6.2`改动导致选项 `disabled` 属性失效的问题 @uyarn ([#2744](https://github.com/Tencent/tdesign-vue/pull/2744))

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
  - 点击行展开/点击行选中，修复 `expandOnRowClick`和 `selectOnRowClick` 无法独立控制行点击执行交互问题
- `Popconfirm`: 修复因变量计算导致的 minx.css 压缩后产物样式改变的问题 @honkinglin ([common#1573](https://github.com/Tencent/tdesign-common/pull/1573))
- `Cascader`: 修复 `label` 属性自定义插槽不生效的问题 @ubloglab ([#2724](https://github.com/Tencent/tdesign-vue/pull/2724))

## 🌈 1.6.2 `2023-08-17` 
### 🚀 Features
- `TreeSelect`: 增加 `keys` 字段用于定制数据中对应的字段别名 @PengYYYYY ([#2697](https://github.com/Tencent/tdesign-vue/pull/2697))
- `Cascader`: 增加 `keys.disabled` 用于定制字段控制节点的禁用 @PengYYYYY ([#2697](https://github.com/Tencent/tdesign-vue/pull/2697))
- `Tree`: 增加 `keys.disabled` 用于定制字段控制节点的禁用 @PengYYYYY ([#2697](https://github.com/Tencent/tdesign-vue/pull/2697))
- `Select`: 增加 `keys.disabled` 用于定制字段控制选项的禁用 @PengYYYYY ([#2697](https://github.com/Tencent/tdesign-vue/pull/2697))
- `Transfer`: 增加 `keys.disabled` 用于定制字段控制选项的禁用 @PengYYYYY ([#2697](https://github.com/Tencent/tdesign-vue/pull/2697))
### 🐞 Bug Fixes
- `Checkbox`: 
  - 修复控制台报错 @yaogengzhu ([#2702](https://github.com/Tencent/tdesign-vue/pull/2702))
  - 修复 `options` 异步获取时，`disabled` 失效问题 @chaishi ([#2706](https://github.com/Tencent/tdesign-vue/pull/2706))
  - 修复 `options` 异步获取时，`value` 失效问题 @chaishi ([#2706](https://github.com/Tencent/tdesign-vue/pull/2706))
- `Image`: 修复 1.6.x 无法动态设置 `src` 问题 @chaishi ([#2709](https://github.com/Tencent/tdesign-vue/pull/2709))
### 🚧 Others
- `Cascader`: 补充 `borderless` 文档 @PengYYYYY ([#2697](https://github.com/Tencent/tdesign-vue/pull/2697))

## 🌈 1.6.1 `2023-08-15` 
### 🚀 Features
- `Menu`: menu-item `click` 事件参数增加 value @dexterBo ([#2689](https://github.com/Tencent/tdesign-vue/pull/2689))
- `Checkbox`: 支持使用空格键选中或取消选中 @chaishi ([#2683](https://github.com/Tencent/tdesign-vue/pull/2683))
- `Radio`: 支持使用空格键选中或取消选中 @chaishi ([#2683](https://github.com/Tencent/tdesign-vue/pull/2683))
- `SelectInput`: 支持键盘事件 @chaishi ([#2683](https://github.com/Tencent/tdesign-vue/pull/2683))
- `Select`: 支持键盘操作聚焦和显示下拉框，可通过上下键切换选项 @chaishi ([#2683](https://github.com/Tencent/tdesign-vue/pull/2683))
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
- `Link`: 新增透传 `download` 属性，支持浏览器直接下载 @xiaosansiji ([#2659](https://github.com/Tencent/tdesign-vue/pull/2659))
### 🐞 Bug Fixes
- `InputAdornment`: 修复装饰文字折行的问题 @PengYYYYY ([common#1553](https://github.com/Tencent/tdesign-common/pull/1553))
### 🚧 Others
- `官网`: 新增分类展示全部图标的 UI  @uyarn ([#2677](https://github.com/Tencent/tdesign-vue/pull/2677))

## 🌈 1.5.2 `2023-08-01` 
### 🚀 Features
- `Table`: @chaishi
  - 可筛选表格，支持透传 attrs/style/classNames 属性、样式、类名等信息到自定义组件 ([#2629](https://github.com/Tencent/tdesign-vue/pull/2629))
  - 虚拟滚动场景，支持通过行唯一标识跳转到指定行（通过行下标跳转到指定行，以前的版本已支持）([#2643](https://github.com/Tencent/tdesign-vue/pull/2643))
- `Upload`: 拖拽上传场景，支持 accept 限制可上传的文件类型 @chaishi ([common#1547](https://github.com/Tencent/tdesign-common/pull/1547))
### 🐞 Bug Fixes
- `Checkbox`: 支持 `value` 传入 `undefined` @chaishi ([#2623](https://github.com/Tencent/tdesign-vue/pull/2623))
- `Table`: @chaishi
  - 可筛选表格场景，filterValue 透传优化，没有显示写明 value 值的筛选项，不再透传 `undefined` 到子组件，因有些组件的默认值不允许为 undefined ([#2623](https://github.com/Tencent/tdesign-vue/pull/2623))
  - 树形结构表格，修复选中行的值 `selectedRowKeys` 不在数据 `data` 中时，报错问题 ([#2629](https://github.com/Tencent/tdesign-vue/pull/2629))
  - 修复 1.5.0 版本空表格没有显示占位元素问题 ([#2641](https://github.com/Tencent/tdesign-vue/pull/2641))
  - 固定列空数据场景，元素显示错位问题 ([#2641](https://github.com/Tencent/tdesign-vue/pull/2641))
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
- `Table`: @chaishi
  - 可编辑表格场景，支持设置 `colKey` 值为链式属性，如：`a.b.c` ([#2605](https://github.com/Tencent/tdesign-vue/pull/2605))
  - 可编辑表格场景，行编辑，`edit.props` 和 `edit.on` 为函数时，新增参数 `updateEditedCellValue` 用于更新编辑状态的表格数据 ([#2605](https://github.com/Tencent/tdesign-vue/pull/2605))
  - 修复列宽调整 + 表头吸顶 + 列配置自定义综合场景下，列宽变少时，表格宽度无法恢复原来的宽度 ([#2606](https://github.com/Tencent/tdesign-vue/pull/2606))
- `Checkbox`: 修复版本 `v1.4.8` 中无法在 CheckboxGroup 内部自定义任意节点的问题 @chaishi ([#2604](https://github.com/Tencent/tdesign-vue/pull/2604))
- `InputNumber`: 修复 `decimalPlaces` 存在时，数值满足要求，用户未操作，就已经触发 `onChange` 事件问题，[issue#2616](https://github.com/Tencent/tdesign-vue/issues/2616) @chaishi ([#2617](https://github.com/Tencent/tdesign-vue/pull/2617))
- `Menu`: @boogie-ben ([#2603](https://github.com/Tencent/tdesign-vue/pull/2603))
  - 渲染为 a 标签时，a 标签覆盖范围扩大至整个菜单项，而不是只有文本部分
  - 修复当菜单项渲染 a 标签并且 `collapsed = true` 状态时，菜单项内区隐藏导致无法点击跳转的问题
  - 修复渲染为 a 标签，弹出展示子菜单，文本未对齐的问题
  - 修复 SubMenu 菜单项过多时无法完整展示的问题
- `Menu`: 修复 `MenuItem` click 点击事件未传递 event 参数的问题 @xiaosansiji ([#2561](https://github.com/Tencent/tdesign-vue/pull/2561))
- `Tree`: @TabSpace ([common#1535](https://github.com/Tencent/tdesign-common/pull/1535))
  - 修复 `treeNodeModel` 实例未能同步 node 属性的问题
  - 优化节点状态更新时的性能 

## 🌈 1.4.8 `2023-07-18` 
### 🚀 Features
- `DatePicker`: 优化关闭浮层后重置默认选中区域 @honkinglin ([#2585](https://github.com/Tencent/tdesign-vue/pull/2585))
- `Checkbox`: @chaishi ([#2583](https://github.com/Tencent/tdesign-vue/pull/2583))
    - 新增支持 `lazyLoad` 懒加载，用于需要渲染大量数据，或加载复杂内容/图片的场景
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
  - `theme=image`，支持点击名称打开新窗口访问图片
  - 拖拽上传场景，支持 `accept` 文件类型限制
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
- `Table`: 列配置和列宽调整场景，修复列数量由多变少时未能更新宽度问题 @chaishi ([#2535](https://github.com/Tencent/tdesign-vue/pull/2535))
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
- `ColorPicker`: 初始化为渐变模式时，支持空字符串作为初始值 @uyarn ([#2511](https://github.com/Tencent/tdesign-vue/pull/2511))
- `TreeSelect`: 修复 keys配合 `valueType = object` 时使用的异常问题 @uyarn ([#2511](https://github.com/Tencent/tdesign-vue/pull/2511))
- `Cascader`: 修复空数组选项展示异常的问题 @uyarn ([#2511](https://github.com/Tencent/tdesign-vue/pull/2511))
- `Upload`: 删除 Upload 中对 loading 的重复颜色设置 @sinbadmaster ([common#1399](https://github.com/Tencent/tdesign-common/pull/1399))

## 🌈 1.4.0 `2023-06-06` 
### 🚀 Features
- `Menu`: @xiaosansiji ([#2461](https://github.com/Tencent/tdesign-vue/pull/2461))
  - 设置 `href` 时使用 `<a>` 标签渲染菜单项
  - 使用 Popup 重构 Menu 弹出菜单实现
- `Select`: 优化选项结构，移除多余的 span 节点 @uyarn ([#2480](https://github.com/Tencent/tdesign-vue/pull/2480))
- `InputNumber`: 支持默认格式化小数点 @chaishi ([#2478](https://github.com/Tencent/tdesign-vue/pull/2478))
### 🐞 Bug Fixes
- `Loading`: 修复多次调用关闭全屏函数时控制台报错问题 @huangpiqiao ([#2465](https://github.com/Tencent/tdesign-vue/pull/2465))
- `Menu`: @xiaosansiji ([#2461](https://github.com/Tencent/tdesign-vue/pull/2461))
  - 修复收起菜单时超出内容无法滚动的问题
  - 修复侧边导航菜单，次级弹出菜单也会展示 Tooltip 的问题
- `InputNumber`: 修复部分小数点数字无法输入问题 @chaishi ([#2460](https://github.com/Tencent/tdesign-vue/pull/2460))
- `Popup`: 修复 `popupPlugin `用法的 `triggerElement` 参数的类型报错的问题 @zhangpaopao0609 ([#2477](https://github.com/Tencent/tdesign-vue/pull/2477))
- `Input`: 修复快速输入或同时输入时输入值异常的问题 @uyarn ([#2479](https://github.com/Tencent/tdesign-vue/pull/2479))
- `InputAdornment`: 修复 1.3.4 中修复空字符串导致插槽没有正常渲染的问题 @uyarn ([#2480](https://github.com/Tencent/tdesign-vue/pull/2480))
- `ImageViewer`: 修复 closeBtn `prop = false` 时渲染异常的问题 @sinbadmaster ([#2472](https://github.com/Tencent/tdesign-vue/pull/2472))
- `类型问题`: 修复 `Radio`、`Checkbox`、`Input`、`Tabs`、`Popup` 等组件缺少 type 的问题 @chaishi ([#2475](https://github.com/Tencent/tdesign-vue/pull/2475))

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
  - 支持使用 `filterIcon` 支持不同列显示不同的筛选图标
  - 支持横向滚动到固定列
- `ColorPicker`: 新增`enableMultipleGradient`, 支持渐变色只存在起始和结束梯度 @uyarn ([#2260](https://github.com/Tencent/tdesign-vue/pull/2260))
- `TimePicker`: 新增`size` API , 用于控制时间输入框大小，`pick`事件增加`context`回调参数 @uyarn ([#2260](https://github.com/Tencent/tdesign-vue/pull/2260))
- `Dropdown`: 支持透传popupProps的`on-visible-change`的写法 @uyarn ([#2260](https://github.com/Tencent/tdesign-vue/pull/2260))
### 🐞 Bug Fixes
- `Popup`: 修复需多次点击才能关闭的问题 @ikeq ([#2247](https://github.com/Tencent/tdesign-vue/pull/2247))
- `TreeSelect`:
  - 修复树选择组件，在表格组件里面时，显示两个 Tips 的问题 @chaishi ([#2251](https://github.com/Tencent/tdesign-vue/pull/2251))
- `Tree`: 修复空初始值或不存在的初始值的问题，@uyarn ([common #1213](https://github.com/Tencent/tdesign-common/pull/1213))
- `Table`:
  - 单行选中功能，修复 `allowUncheck: false` 无效问题 @chaishi ([#2256](https://github.com/Tencent/tdesign-vue/pull/2256))
  - 修复 lazyload 的问题 @yanxugong ([#2250](https://github.com/Tencent/tdesign-vue/pull/2250))

## 🌈 1.2.2 `2023-03-16` 
### 🚀 Features
- `Table`: @chaishi ([#2227](https://github.com/Tencent/tdesign-vue/pull/2227))
  - 可编辑单元格(行)功能，支持编辑模式下，数据变化时实时校验，`col.edit.validateTrigger`
  - 只有固定列存在时，才会设置类名 `.t-table__content--scrollable-to-left` 和 `.t-table__content--scrollable-to-right`
  - 拖拽功能，支持禁用固定列不可拖拽调整顺序
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
  - 修复 Dialog 中使用 Table 时列宽调整的问题
  - 可编辑单元格(行)功能，修复输入框回车会触发 Form 表单的 submit 事件的问题
  - 可编辑单元格，修复下拉选择类组件 `abortEditOnEvent` 没有包含 `onChange` 时，依然会在数据变化时触发退出编辑态的问题
- `Table`: 修复存在表格冻结列，滚动时冻结列与表格内容未对齐的问题 @huangpiqiao ([common#1197](https://github.com/Tencent/tdesign-common/pull/1197))
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
- `Tree`: 完善激活态单元测试 @TabSpace ([#2209](https://github.com/Tencent/tdesign-vue/pull/2209))

## 🌈 1.2.0 `2023-03-02` 
### 🚀 Features
- `Textarea`: 为解决 Textarea 字符限制文案会遮挡文本内容的问题，内容长度限制提示位置由组件内右下角移动到组件之外的右下角，与 tips 在同一行 @duanbaosheng ([#2194](https://github.com/Tencent/tdesign-vue/pull/2194))
- `Upload`: 自定义上传方法，支持一个请求上传返回多个文件的数据回显 @chaishi ([common #1165](https://github.com/Tencent/tdesign-common/pull/1165))
- `Image`: 图片组件支持特殊格式的地址 `.avif` 和 `.webp` @chaishi ([#2182](https://github.com/Tencent/tdesign-vue/pull/2182))
- `ConfigProvider`: 新增 `Image` 全局配置 `globalConfig.image.replaceImageSrc`，用于统一替换图片地址 @chaishi ([#2182](https://github.com/Tencent/tdesign-vue/pull/2182))
- `Tree`: 支持虚拟滚动 @TabSpace ([#2181](https://github.com/Tencent/tdesign-vue/pull/2181))
- `Dialog`: 支持插件调用形式接收来自 `ConfigProvider` 的配置 @uyarn ([#2191](https://github.com/Tencent/tdesign-vue/pull/2191))
- `全局类型`: 新增公共 types 文件的导出  @uyarn ([#2201](https://github.com/Tencent/tdesign-vue/pull/2201))
### 🐞 Bug Fixes
- `Table`: @chaishi ([#2183](https://github.com/Tencent/tdesign-vue/pull/2183))
  - 列宽调整功能，修复左右侧固定列宽度调整问题
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
- `Popup`: 新增 `onScrollToBottom` 事件，新增 `popperOptions` API @uyarn ([#2176](https://github.com/Tencent/tdesign-vue/pull/2176))
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
- `Drawer`: 修复滚动条检测问题 @honkinglin ([#2173](https://github.com/Tencent/tdesign-vue/pull/2173))
- `Dialog`: 修复滚动条检测问题 @honkinglin ([#2173](https://github.com/Tencent/tdesign-vue/pull/2173))
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
  - 修复添加 `resizable` 属性后，在 Dialog 组件中宽度计算问题，并非提前设置好的 column.width
  - 修复 `column.resizable=false` 在某些场景下无效问题
  - 修复在自定义列数量场景，表格宽度未能根据列数自适应
  - 修复宽度计算的各类问题
  - 修复空表格在 Dialog 组件中，文本显示位置不正确问题
  - 分页功能，修复 `pagination.onChange` 被调用两次问题
- `Table`: 修复 `affixHeader` 在IE上高度异常问题 @huangpiqiao ([#2129](https://github.com/Tencent/tdesign-vue/pull/2129))
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
  - 支持 `collapsedItems` 定义折叠的元素
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
- `InputNumber`: 修复小数点后第二个数字若为 0 无法输入问题 @chaishi ([#2105](https://github.com/Tencent/tdesign-vue/pull/2105))
- `Form`:
  - 修复其他表单项变化，触发 `<form-item :rules="[]" />` 校验问题 @chaishi ([#2105](https://github.com/Tencent/tdesign-vue/pull/2105))
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
  - `onError/onSuccess/onProgress` 添加关键事件参数 `XMLHttpRequest`，用于获取上传请求更详细的信息
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
  - 修复无法使用 `overlayContent` 自定义浮层问题
  - 修复无法使用 `placeholder` 自定义图片占位问题
- `Image` 修复动态修改 src 值图片无法显示问题 @sechi747 ([#2036](https://github.com/Tencent/tdesign-vue/pull/2036))
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
  - RadioGroup 支持 `allowUncheck`
- `Table`: @chaishi ([#2016](https://github.com/Tencent/tdesign-vue/pull/2016))
  - 可编辑单元格，支持使用 `col.edit.on` 透传组件事件
  - 可编辑单元格，支持使用 `validateTableData` 校验处于编辑态的单元格
  - 可编辑单元格，单元格的值 cellValue 不再进行解构处理
  - 新增 `attach`，用于统一设置超出省略浮层、筛选过滤下拉框等元素的挂载元素。如：`attach={() => document.body}`
- `Dialog`: 组件实例方法从可选更为必须存在 @chaishi ([#2026](https://github.com/Tencent/tdesign-vue/pull/2026))
### 🐞 Bug Fixes
- `Dialog`: 组件销毁前立即移除当前节点，不需要 `setTimeout` 等待时间 @chaishi ([#2011](https://github.com/Tencent/tdesign-vue/pull/2011))
- `Select`: 修复子组件方式混合传入分组与单个选项时，可能导致顺序错乱、筛选结果有误的问题 @skytt ([#2009](https://github.com/Tencent/tdesign-vue/pull/2009))
- `Radio`: 修复 RadioGroup 和 Radio 组合使用时，`allowUncheck` 无效问题 @chaishi ([#2010](https://github.com/Tencent/tdesign-vue/pull/2010))
- `Table`:
  - 处理单击和双击事件冲突问题，避免双击的时候触发行选中或行展开 @chaishi ([#2016](https://github.com/Tencent/tdesign-vue/pull/2016))
  - 修复表格列动态设置插槽名，渲染无效的问题 @chaishi ([#2016](https://github.com/Tencent/tdesign-vue/pull/2016))
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
- `Form`: 修复表单校验，未监听 `name` 和 `rules` 变化的问题 @chaishi ([#1971](https://github.com/Tencent/tdesign-vue/pull/1971))
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
- `Link` / `Input`: 去掉非必要的类名 `t-size-m` @chaishi ([#1983](https://github.com/Tencent/tdesign-vue/pull/1983))

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

## 🌈 0.x `2020-12-21 - 2022-12-14`
前往 [GitHub](https://github.com/Tencent/tdesign-vue/blob/develop/CHANGELOG-0.x.md) 查看 `0.x` 更新日志


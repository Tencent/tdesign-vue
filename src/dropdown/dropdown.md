:: BASE_DOC ::

## API

### Dropdown Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
direction | String | - | 多层级操作时，是否需要点击菜单项来展开下一层级菜单。默认为 true，表示点击菜单项展开下一层级菜单；设置为 false 表示 hover 菜单项展开下一层级菜单。可选项：left/right。TS 类型：`'left' \| 'right'` | N
disabled | Boolean | false | 是否禁用组件 | N
hideAfterItemClick | Boolean | true | 点击菜单项后是否隐藏下拉菜单 | N
maxColumnWidth | String / Number | 100 | 弹窗的最大宽度，单位：px | N
maxHeight | String / Number | 300 | 弹窗的最大高度，单位：px | N
minColumnWidth | String / Number | 10 | 弹窗的最小宽度，单位：px | N
options | Array | [] | 下拉操作项。TS 类型：`Array<DropdownOption>` | N
panelBottomContent | String / Slot / Function | - | 面板内的底部内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts) | N
panelTopContent | String / Slot / Function | - | 面板内的顶部内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts) | N
trigger | String | hover | 触发下拉的呈现方式。可选项：hover/click/focus。TS 类型：`'hover' \| 'click' \| 'focus'` | N
onClick | Function |  | TS 类型：`(dropdownItem: DropdownOption, context: { e: MouseEvent }) => void`<br/>下拉操作项点击时触发 | N
onHover | Function |  | TS 类型：`(dropdownItem: DropdownOption, context: { e: MouseEvent }) => void`<br/>鼠标悬浮下拉操作项时触发 | N

### Dropdown Events

名称 | 参数 | 描述
-- | -- | --
click | `(dropdownItem: DropdownOption, context: { e: MouseEvent })` | 下拉操作项点击时触发
hover | `(dropdownItem: DropdownOption, context: { e: MouseEvent })` | 鼠标悬浮下拉操作项时触发

### DropdownItem Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
active | Boolean | false | 是否高亮当前操作项 | N
content | String / Slot / Function | '' | 下拉操作项内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts) | N
disabled | Boolean | false | 是否禁用操作项 | N
divider | Boolean | false | 是否显示操作项之间的分隔线（分隔线默认在下方） | N
prefixIcon | Function | - | 组件前置图标。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts) | N
theme | String | default | 下拉菜单选项主题。可选项：default/success/warning/error。TS 类型：`DropdownItemTheme` | N
value | String / Number / Object | - | 下拉操作项唯一标识。TS 类型：`string \| number \| { [key: string]: any }` | N
onClick | Function |  | TS 类型：`(dropdownItem: DropdownOption, context: { e: MouseEvent }) => void`<br/>点击时触发 | N
onHover | Function |  | TS 类型：`(dropdownItem: DropdownOption, context: { e: MouseEvent }) => void`<br/>鼠标悬浮时触发 | N

### DropdownItem Events

名称 | 参数 | 描述
-- | -- | --
click | `(dropdownItem: DropdownOption, context: { e: MouseEvent })` | 点击时触发
hover | `(dropdownItem: DropdownOption, context: { e: MouseEvent })` | 鼠标悬浮时触发

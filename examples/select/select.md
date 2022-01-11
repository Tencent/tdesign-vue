:: BASE_DOC ::

## API
### Select Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
bordered | Boolean | true | 是否有边框。<br/><br/> | N
clearable | Boolean | false | 是否可以清空选项。<br/><br/> | N
collapsedItems | Slot / Function | - | 多选情况下，用于设置折叠项内容，默认为 `+N`。如果需要悬浮就显示其他内容，可以使用 collapsedItems 自定义。TS 类型：`TNode<{ value: T[]; collapsedSelectedItems: T[]; count: number }>`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
creatable | Boolean | false | 是否允许用户创建新条目，需配合 filterable 使用。<br/><br/> | N
disabled | Boolean | false | 是否禁用组件。<br/><br/> | N
empty | String / Slot / Function | '' | 当下拉列表为空时显示的内容。TS 类型：`string | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
filter | Function | - | 自定义过滤方法，用于对现有数据进行搜索过滤，判断是否过滤某一项数据。TS 类型：`(filterWords: string, option: T) => boolean | Promise<boolean>`。<br/><br/> | N
filterable | Boolean | false | 是否可搜索。<br/><br/> | N
keys | Object | - | 用来定义 value / label 在 `options` 中对应的字段别名。TS 类型：`SelectKeysType`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。[详细类型定义](https://github.com/Tencent/tdesign-vue/tree/develop/src/select/type.ts)。<br/><br/> | N
loading | Boolean | false | 是否为加载状态。<br/><br/> | N
loadingText | String / Slot / Function | '' | 远程加载时显示的文字，支持自定义。如加上超链接。TS 类型：`string | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
max | Number | 0 | 用于控制多选数量，值为 0 则不限制。<br/><br/> | N
minCollapsedNum | Number | 0 | 最小折叠数量，用于多选情况下折叠选中项，超出该数值的选中项折叠。值为 0 则表示不折叠。<br/><br/> | N
multiple | Boolean | false | 是否允许多选。<br/><br/> | N
options | Array | [] | 数据化配置选项内容。TS 类型：`Array<T>`。<br/><br/> | N
panelBottomContent | String / Slot / Function | - | 面板内的底部内容。TS 类型：`string | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
panelTopContent | String / Slot / Function | - | 面板内的顶部内容。TS 类型：`string | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
placeholder | String | undefined | 占位符。<br/><br/> | N
popupProps | Object | - | 透传给 popup 组件的参数。TS 类型：`PopupProps`。[详细类型定义](https://github.com/Tencent/tdesign-vue/tree/develop/src/select/type.ts)。<br/><br/> | N
prefixIcon | Slot / Function | - | 组件前置图标。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
reserveKeyword | Boolean | false | 多选且可搜索时，是否在选中一个选项后保留当前的搜索关键词。<br/><br/> | N
showArrow | Boolean | true | 是否显示右侧箭头，默认显示。<br/><br/> | N
size | String | medium | 组件尺寸。可选项：small / medium / large。TS 类型：`SizeEnum`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
value | String / Number / Object / Array | - | 选中值。支持语法糖。TS 类型：`SelectValue`。[详细类型定义](https://github.com/Tencent/tdesign-vue/tree/develop/src/select/type.ts)。<br/><br/> | N
defaultValue | String / Number / Object / Array | - | 选中值。非受控属性。TS 类型：`SelectValue`。[详细类型定义](https://github.com/Tencent/tdesign-vue/tree/develop/src/select/type.ts)。<br/><br/> | N
valueDisplay | Slot / Function | - | 自定义选中项呈现方式。TS 类型：`TNode<{ value: T[]; onClose: () => void }>`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
valueType | String | value | 用于控制选中值的类型。假设数据选项为：`[{ label: '姓名', value: 'name' }]`，value 表示值仅返回数据选项中的 value， object 表示值返回全部数据。。可选项：value/object。<br/><br/> | N
onBlur | Function |  | TS 类型：`(context: { value: SelectValue; e: FocusEvent | KeyboardEvent }) => void`<br/>输入框失去焦点时触发。<br/><br/> | N
onChange | Function |  | TS 类型：`(value: SelectValue) => void`<br/>选中值变化时触发。<br/><br/> | N
onClear | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/>点击清除按钮时触发。<br/><br/> | N
onCreate | Function |  | TS 类型：`(value: string | number) => void`<br/>当选择新创建的条目时触发。<br/><br/> | N
onEnter | Function |  | TS 类型：`(context: { inputValue: string; e: KeyboardEvent; value: SelectValue }) => void`<br/>回车键按下时触发。`inputValue` 表示输入框的值，`value` 表示选中值。<br/><br/> | N
onFocus | Function |  | TS 类型：`(context: { value: SelectValue; e: FocusEvent | KeyboardEvent }) => void`<br/>输入框获得焦点时触发。<br/><br/> | N
onRemove | Function |  | TS 类型：`(options: SelectRemoveContext<T>) => void`<br/>多选模式下，选中数据被移除时触发。[详细类型定义](https://github.com/Tencent/tdesign-vue/tree/develop/src/select/type.ts)。<br/>`interface SelectRemoveContext<T> { value: string | number; data: T; e: MouseEvent | KeyboardEvent }`<br/> | N
onSearch | Function |  | TS 类型：`(filterWords: string) => void`<br/>输入值变化时，触发搜索事件。主要用于远程搜索新数据。<br/><br/> | N
onVisibleChange | Function |  | TS 类型：`(visible: boolean) => void`<br/>下拉框隐藏/显示时触发。<br/><br/> | N

### Select Events

名称 | 参数 | 描述
-- | -- | --
blur | `(context: { value: SelectValue; e: FocusEvent | KeyboardEvent })` | 输入框失去焦点时触发。<br/><br/>
change | `(value: SelectValue)` | 选中值变化时触发。<br/><br/>
clear | `(context: { e: MouseEvent })` | 点击清除按钮时触发。<br/><br/>
create | `(value: string | number)` | 当选择新创建的条目时触发。<br/><br/>
enter | `(context: { inputValue: string; e: KeyboardEvent; value: SelectValue })` | 回车键按下时触发。`inputValue` 表示输入框的值，`value` 表示选中值。<br/><br/>
focus | `(context: { value: SelectValue; e: FocusEvent | KeyboardEvent })` | 输入框获得焦点时触发。<br/><br/>
remove | `(options: SelectRemoveContext<T>)` | 多选模式下，选中数据被移除时触发。[详细类型定义](https://github.com/Tencent/tdesign-vue/tree/develop/src/select/type.ts)。<br/>`interface SelectRemoveContext<T> { value: string | number; data: T; e: MouseEvent | KeyboardEvent }`<br/>
search | `(filterWords: string)` | 输入值变化时，触发搜索事件。主要用于远程搜索新数据。<br/><br/>
visible-change | `(visible: boolean)` | 下拉框隐藏/显示时触发。<br/><br/>

### Option Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
content | String / Slot / Function | - | 用于定义复杂的选项内容。TS 类型：`string | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
default | String / Slot / Function | - | 用于定义复杂的选项内容。同 content。TS 类型：`string | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
disabled | Boolean | false | 是否禁用该选项。<br/><br/> | N
label | String | - | 选项名称。<br/><br/> | N
value | String / Number | - | 选项值。<br/><br/> | N

### OptionGroup Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
divider | Boolean | true | 是否显示分隔线。<br/><br/> | N
label | String | - | 分组别名。<br/><br/> | N

:: BASE_DOC ::

## API
### TreeSelect Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
clearable | Boolean | false | 是否允许清空。<br/><br/> | N
collapsedItems | Slot / Function | - | 多选情况下，用于设置折叠项内容，默认为 `+N`。如果需要悬浮就显示其他内容，可以使用 collapsedItems 自定义。TS 类型：`TNode<{ value: DataOption[]; collapsedSelectedItems: DataOption[]; count: number }>`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
data | Array | [] | 数据。TS 类型：`Array<DataOption>`。<br/><br/> | N
disabled | Boolean | false | 是否禁用组件。<br/><br/> | N
empty | String / Slot / Function | '' | 当下拉列表为空时显示的内容。TS 类型：`string | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
filter | Function | - | 过滤方法，用于对现有数据进行搜索过滤，判断是否过滤某一项数据。TS 类型：`(filterWords: string, option: DataOption) => boolean`。<br/><br/> | N
filterable | Boolean | false | 是否可搜索。<br/><br/> | N
loading | Boolean | false | 是否正在加载数据。<br/><br/> | N
loadingText | String / Slot / Function | '' | 远程加载时显示的文字，支持自定义。如加上超链接。TS 类型：`string | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
max | Number | 0 | 用于控制多选数量，值为 0 则不限制。<br/><br/> | N
minCollapsedNum | Number | 0 | 最小折叠数量，用于多选情况下折叠选中项，超出该数值的选中项折叠。值为 0 则表示不折叠。<br/><br/> | N
multiple | Boolean | false | 是否允许多选。<br/><br/> | N
placeholder | String | undefined | 占位符。<br/><br/> | N
popupProps | Object | - | 透传给 popup 组件的参数。TS 类型：`PopupProps`。[详细类型定义](https://github.com/Tencent/tdesign-vue/tree/develop/src/tree-select/type.ts)。<br/><br/> | N
prefixIcon | Slot / Function | - | 组件前置图标。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
size | String | medium | 尺寸。可选项：small/medium/large。<br/><br/> | N
treeProps | Object | - | 透传 Tree 组件属性。TS 类型：`TreeProps`。[详细类型定义](https://github.com/Tencent/tdesign-vue/tree/develop/src/tree-select/type.ts)。<br/><br/> | N
value | String / Number / Object / Array | - | 选中值。支持语法糖。TS 类型：`TreeSelectValue`。[详细类型定义](https://github.com/Tencent/tdesign-vue/tree/develop/src/tree-select/type.ts)。<br/><br/> | N
defaultValue | String / Number / Object / Array | - | 选中值。非受控属性。TS 类型：`TreeSelectValue`。[详细类型定义](https://github.com/Tencent/tdesign-vue/tree/develop/src/tree-select/type.ts)。<br/><br/> | N
valueDisplay | Slot / Function | - | 自定义选中项呈现方式。TS 类型：`TNode<{ value: DataOption[]; onClose: () => void }>`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
valueType | String | value | 用于控制选中值的类型。假设数据选项为：`[{ label: '姓名', value: 'name' }]`，value 表示值仅返回数据选项中的 value， object 表示值返回全部数据。可选项：value/object。<br/><br/> | N
onBlur | Function |  | TS 类型：`(context: { value: TreeSelectValue; e: FocusEvent }) => void`<br/>输入框失去焦点时触发。<br/><br/> | N
onChange | Function |  | TS 类型：`(value: TreeSelectValue, context: { node: TreeNodeModel<DataOption> }) => void`<br/>节点选中状态变化时触发，context.node 表示当前变化的选项。<br/><br/> | N
onClear | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/>点击清除按钮时触发。<br/><br/> | N
onFocus | Function |  | TS 类型：`(context: { value: TreeSelectValue; e: FocusEvent }) => void`<br/>输入框获得焦点时触发。<br/><br/> | N
onRemove | Function |  | TS 类型：`(options: RemoveOptions<DataOption>) => void`<br/>多选模式下，选中数据被移除时触发。[详细类型定义](https://github.com/Tencent/tdesign-vue/tree/develop/src/tree-select/type.ts)。<br/>`interface RemoveOptions<T> { value: string | number | object; data: T; e: MouseEvent }`<br/> | N
onSearch | Function |  | TS 类型：`(filterWords: string) => void`<br/>输入值变化时，触发搜索事件。主要用于远程搜索新数据。<br/><br/> | N

### TreeSelect Events

名称 | 参数 | 描述
-- | -- | --
blur | `(context: { value: TreeSelectValue; e: FocusEvent })` | 输入框失去焦点时触发。<br/><br/>
change | `(value: TreeSelectValue, context: { node: TreeNodeModel<DataOption> })` | 节点选中状态变化时触发，context.node 表示当前变化的选项。<br/><br/>
clear | `(context: { e: MouseEvent })` | 点击清除按钮时触发。<br/><br/>
focus | `(context: { value: TreeSelectValue; e: FocusEvent })` | 输入框获得焦点时触发。<br/><br/>
remove | `(options: RemoveOptions<DataOption>)` | 多选模式下，选中数据被移除时触发。[详细类型定义](https://github.com/Tencent/tdesign-vue/tree/develop/src/tree-select/type.ts)。<br/>`interface RemoveOptions<T> { value: string | number | object; data: T; e: MouseEvent }`<br/>
search | `(filterWords: string)` | 输入值变化时，触发搜索事件。主要用于远程搜索新数据。<br/><br/>

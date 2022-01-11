:: BASE_DOC ::

## API
### Tree Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
activable | Boolean | false | 节点是否可高亮。<br/><br/> | N
actived | Array | - | 高亮的节点值。支持语法糖。TS 类型：`Array<TreeNodeValue>`。<br/><br/> | N
defaultActived | Array | - | 高亮的节点值。非受控属性。TS 类型：`Array<TreeNodeValue>`。<br/><br/> | N
activeMultiple | Boolean | false | 是否允许多个节点同时高亮。<br/><br/> | N
checkable | Boolean | false | 隐藏节点复选框。<br/><br/> | N
checkProps | Object | - | 透传属性到 checkbox 组件。参考 checkbox 组件 API。TS 类型：`CheckboxProps`。[详细类型定义](https://github.com/Tencent/tdesign-vue/tree/develop/src/tree/type.ts)。<br/><br/> | N
checkStrictly | Boolean | false | 父子节点选中状态不再关联，可各自选中或取消。<br/><br/> | N
data | Array | [] | 树数据，泛型 `T` 表示树节点 TS 类型。TS 类型：`Array<T>`。<br/><br/> | N
disableCheck | Boolean / Function | false | 禁用复选框，可支持禁用不同的行。TS 类型：`boolean | ((node: TreeNodeModel) => boolean)`。<br/><br/> | N
disabled | Boolean | - | 是否禁用树操作。<br/><br/> | N
empty | String / Slot / Function | '' | 数据为空时展示的文本。TS 类型：`string | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
expandAll | Boolean | false | 是否展开全部节点。<br/><br/> | N
expanded | Array | [] | 展开的节点值。支持语法糖。TS 类型：`Array<TreeNodeValue>`。<br/><br/> | N
defaultExpanded | Array | [] | 展开的节点值。非受控属性。TS 类型：`Array<TreeNodeValue>`。<br/><br/> | N
expandLevel | Number | 0 | 默认展开的级别，第一层为 0。<br/><br/> | N
expandMutex | Boolean | false | 同级别展开互斥，手风琴效果。<br/><br/> | N
expandOnClickNode | Boolean | false | 是否支持点击节点也能展开收起。<br/><br/> | N
expandParent | Boolean | false | 展开子节点时是否自动展开父节点。<br/><br/> | N
filter | Function | - | 节点过滤方法，只呈现返回值为 true 的节点，泛型 `T` 表示树节点 TS 类型。TS 类型：`(node: TreeNodeModel<T>) => boolean`。<br/><br/> | N
hover | Boolean | - | 节点是否有悬浮状态。<br/><br/> | N
icon | Boolean / Slot / Function | true | 节点图标，可自定义。TS 类型：`boolean | TNode<TreeNodeModel>`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
keys | Object | - | 用来定义 value / label / children 在 `options` 中对应的字段别名。TS 类型：`TreeKeysType`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。[详细类型定义](https://github.com/Tencent/tdesign-vue/tree/develop/src/tree/type.ts)。<br/><br/> | N
label | String / Boolean / Slot / Function | true | 自定义节点内容，值为 false 不显示，值为 true 显示默认 label，值为字符串直接输出该字符串。泛型 `T` 表示树节点 TS 类型。TS 类型：`string | boolean | TNode<TreeNodeModel<T>>`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
lazy | Boolean | true | 延迟加载 children 为 true 的节点的子节点数据，即使 expandAll 被设置为 true，也同样延迟加载。<br/><br/> | N
line | Boolean / Slot / Function | false | 连接线。值为 false 不显示连接线；值为 true 显示默认连接线；值类型为 Function 表示自定义连接线。TS 类型：`boolean | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
load | Function | - | 加载子数据的方法，在展开节点时调用（仅当节点 children 为 true 时生效），泛型 `T` 表示树节点 TS 类型。TS 类型：`(node: TreeNodeModel<T>) => Promise<Array<T>>`。<br/><br/> | N
operations | Slot / Function | - | 自定义节点操作项，泛型 `T` 表示树节点 TS 类型。TS 类型：`TNode<TreeNodeModel<T>>`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
transition | Boolean | true | 节点展开折叠时是否使用过渡动画。<br/><br/> | N
value | Array | [] | 选中值（组件为可选状态时）。支持语法糖。TS 类型：`Array<TreeNodeValue>`。[详细类型定义](https://github.com/Tencent/tdesign-vue/tree/develop/src/tree/type.ts)。<br/><br/> | N
defaultValue | Array | [] | 选中值（组件为可选状态时）。非受控属性。TS 类型：`Array<TreeNodeValue>`。[详细类型定义](https://github.com/Tencent/tdesign-vue/tree/develop/src/tree/type.ts)。<br/><br/> | N
valueMode | String | onlyLeaf | 选中值模式。all 表示父节点和子节点全部会出现在选中值里面；parentFirst 表示当子节点全部选中时，仅父节点在选中值里面；onlyLeaft 表示无论什么情况，选中值仅呈现叶子节点。可选项：onlyLeaf/parentFirst/all。<br/><br/> | N
onActive | Function |  | TS 类型：`(value: Array<TreeNodeValue>, context: { node: TreeNodeModel<T> }) => void`<br/>节点激活时触发，泛型 `T` 表示树节点 TS 类型。<br/><br/> | N
onChange | Function |  | TS 类型：`(value: Array<TreeNodeValue>, context: { node: TreeNodeModel<T> }) => void`<br/>节点选中状态变化时触发，context.node 表示当前变化的选项，泛型 `T` 表示树节点 TS 类型。<br/><br/> | N
onClick | Function |  | TS 类型：`(context: { node: TreeNodeModel<T>; e: MouseEvent }) => void`<br/>节点点击时触发，泛型 `T` 表示树节点 TS 类型。<br/><br/> | N
onExpand | Function |  | TS 类型：`(value: Array<TreeNodeValue>, context: { node: TreeNodeModel<T>; e: MouseEvent }) => void`<br/>节点展开或收起时触发，泛型 `T` 表示树节点 TS 类型。<br/><br/> | N
onLoad | Function |  | TS 类型：`(context: { node: TreeNodeModel<T> }) => void`<br/>异步加载后触发，泛型 `T` 表示树节点 TS 类型。<br/><br/> | N

### Tree Events

名称 | 参数 | 描述
-- | -- | --
active | `(value: Array<TreeNodeValue>, context: { node: TreeNodeModel<T> })` | 节点激活时触发，泛型 `T` 表示树节点 TS 类型。<br/><br/>
change | `(value: Array<TreeNodeValue>, context: { node: TreeNodeModel<T> })` | 节点选中状态变化时触发，context.node 表示当前变化的选项，泛型 `T` 表示树节点 TS 类型。<br/><br/>
click | `(context: { node: TreeNodeModel<T>; e: MouseEvent })` | 节点点击时触发，泛型 `T` 表示树节点 TS 类型。<br/><br/>
expand | `(value: Array<TreeNodeValue>, context: { node: TreeNodeModel<T>; e: MouseEvent })` | 节点展开或收起时触发，泛型 `T` 表示树节点 TS 类型。<br/><br/>
load | `(context: { node: TreeNodeModel<T> })` | 异步加载后触发，泛型 `T` 表示树节点 TS 类型。<br/><br/>

### TreeInstanceFunctions 组件实例方法

名称 | 参数 | 返回值 | 描述
-- | -- | -- | --
appendTo | `(value: TreeNodeValue, newData: T | Array<T>)` | - | 为指定节点添加子节点，默认添加到根节点，泛型 `T` 表示树节点 TS 类型。<br/><br/>
getIndex | `(value: TreeNodeValue)` | `number` | 获取指定节点下标。<br/><br/>
getItem | `(value: TreeNodeValue)` | `TreeNodeModel<T>` | 获取指定节点所有信息，泛型 `T` 表示树节点 TS 类型。<br/><br/>
getItems | `(value?: TreeNodeValue)` | `Array<TreeNodeModel<T>>` | 获取某节点的全部子孙节点；参数为空，则表示获取整棵树的全部节点，泛型 `T` 表示树节点 TS 类型。<br/><br/>
getParent | `(value: TreeNodeValue)` | `TreeNodeModel<T>` | 获取指定节点的直属父节点，泛型 `T` 表示树节点 TS 类型。<br/><br/>
getParents | `(value: TreeNodeValue)` | `TreeNodeModel<T>[]` | 获取指定节点的全部父节点，泛型 `T` 表示树节点 TS 类型。<br/><br/>
getPath | `(value: TreeNodeValue)` | `TreeNodeModel<T>[]` | 自下而上获取全路径数据，泛型 `T` 表示树节点 TS 类型。<br/><br/>
insertAfter | `(value: TreeNodeValue, newData: T)` | - | 插入新节点到指定节点后面，泛型 `T` 表示树节点 TS 类型。<br/><br/>
insertBefore | `(value: TreeNodeValue, newData: T)` | - | 插入新节点到指定节点前面，泛型 `T` 表示树节点 TS 类型。<br/><br/>
remove | `(value: TreeNodeValue)` | - | 移除指定节点。<br/><br/>
setItem | `(value: TreeNodeValue, options: TreeNodeState)` | - | 设置节点状态。<br/><br/>

### TreeNodeState

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
activable | Boolean | false | 节点是否允许被激活。<br/><br/> | N
actived | Boolean | false | 节点是否被激活。<br/><br/> | N
checkable | Boolean | false | 节点是否允许被选中。<br/><br/> | N
checked | Boolean | false | 节点是否被选中。<br/><br/> | N
disabled | Boolean | false | 节点是否被禁用。<br/><br/> | N
expanded | Boolean | false | 节点是否已展开。<br/><br/> | N
expandMutex | Boolean | false | 子节点是否互斥展开。<br/><br/> | N
indeterminate | Boolean | false | 节点是否为半选中状态。<br/><br/> | N
label | String | - | 节点标签文案。<br/><br/> | N
loading | Boolean | false | 子节点数据是否在加载中。<br/><br/> | N
value | String / Number | - | 节点值。<br/><br/> | N
visible | Boolean | false | 节点是否可视。<br/><br/> | N

### TreeNodeModel

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
actived | Boolean | - | 必需。当前节点是否处于高亮激活态。<br/><br/> | Y
checked | Boolean | - | 必需。当前节点是否被选中。<br/><br/> | Y
data | Object | - | 必需。节点数据，泛型 `T` 表示树节点 TS 类型。TS 类型：`T`。<br/><br/> | Y
expanded | Boolean | - | 必需。当前节点是否展开。<br/><br/> | Y
indeterminate | Boolean | - | 必需。当前节点是否处于半选状态。<br/><br/> | Y
loading | Boolean | - | 必需。当前节点是否处于加载中状态。<br/><br/> | Y
TreeNodeState | - | - | 继承 `TreeNodeState` 中的全部 API。<br/><br/> | N
### TreeNodeModel

名称 | 参数 | 返回值 | 描述
-- | -- | -- | --
appendData | `(data: T | Array<T>)` | - | 必需。追加子节点数据，泛型 `T` 表示树节点 TS 类型。<br/><br/>
getChildren | `(deep: boolean)` | `Array<TreeNodeModel> | boolean` | 必需。默认获取当前节点的全部子节点，deep 值为 true 则表示获取全部子孙节点。<br/><br/>
getIndex | - | `number` | 必需。获取节点在父节点的子节点列表中的位置，如果没有父节点，则获取节点在根节点列表的位置。<br/><br/>
getLevel | - | `number` | 必需。获取节点所在的层级。<br/><br/>
getParent | - | `TreeNodeModel` | 必需。获取单个父节点。<br/><br/>
getParents | - | `Array<TreeNodeModel>` | 必需。获取所有父节点。<br/><br/>
getPath | - | `Array<TreeNodeModel>` | 必需。获取节点全路径。<br/><br/>
getRoot | - | `TreeNodeModel` | 必需。获取根节点。<br/><br/>
getSiblings | - | `Array<TreeNodeModel>` | 必需。获取兄弟节点，包含自己在内。<br/><br/>
insertAfter | `(newData: T)` | - | 必需。在当前节点前插入新节点，泛型 `T` 表示树节点 TS 类型。<br/><br/>
insertBefore | `(newData: T)` | - | 必需。在当前节点前插入新节点，泛型 `T` 表示树节点 TS 类型。<br/><br/>
isFirst | - | `boolean` | 必需。是否为兄弟节点中的第一个节点。<br/><br/>
isLast | - | `boolean` | 必需。是否为兄弟节点中的最后一个节点。<br/><br/>
isLeaf | - | `boolean` | 必需。是否为叶子节点。<br/><br/>
remove | `(value?: TreeNodeValue)` | - | 必需。移除当前节点或当前节点的子节点，值为空则移除当前节点，值存在则移除当前节点的子节点。<br/><br/>
setData | `(data: T)` | - | 必需。设置当前节点数据，数据变化可自动刷新页面，泛型 `T` 表示树节点 TS 类型。<br/><br/>

:: BASE_DOC ::

## API
### Checkbox Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
checkAll | Boolean | false | 用于标识是否为「全选选项」。单独使用无效，需在 CheckboxGroup 中使用。<br/><br/> | N
checked | Boolean | false | 是否选中。支持语法糖。<br/><br/> | N
defaultChecked | Boolean | false | 是否选中。非受控属性。<br/><br/> | N
default | String / Slot / Function | - | 复选框内容，同 label。TS 类型：`string | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
disabled | Boolean | undefined | 是否禁用组件。<br/><br/> | N
indeterminate | Boolean | false | 是否为半选。<br/><br/> | N
label | String / Slot / Function | - | 主文案。TS 类型：`string | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
name | String | - | HTML 元素原生属性。<br/><br/> | N
readonly | Boolean | false | 组件是否只读。<br/><br/> | N
value | String / Number | - | 复选框的值。TS 类型：`string | number`。<br/><br/> | N
onChange | Function |  | TS 类型：`(checked: boolean, context: { e: Event }) => void`<br/>值变化时触发。<br/><br/> | N

### Checkbox Events

名称 | 参数 | 描述
-- | -- | --
change | `(checked: boolean, context: { e: Event })` | 值变化时触发。<br/><br/>

### CheckboxGroup Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
disabled | Boolean | false | 是否禁用组件。<br/><br/> | N
max | Number | undefined | 支持最多选中的数量。<br/><br/> | N
name | String | - | 统一设置内部复选框 HTML 属性。<br/><br/> | N
options | Array | [] | 以配置形式设置子元素。示例1：`['北京', '上海']` ，示例2: `[{ label: '全选', checkAll: true }, { label: '上海', value: 'shanghai' }]`。checkAll 值为 true 表示当前选项为「全选选项」。TS 类型：`Array<CheckboxOption>`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。[详细类型定义](https://github.com/Tencent/tdesign-vue/tree/develop/src/checkbox/type.ts)。<br/><br/> | N
value | Array | [] | 选中值。支持语法糖。TS 类型：`CheckboxGroupValue`。[详细类型定义](https://github.com/Tencent/tdesign-vue/tree/develop/src/checkbox/type.ts)。<br/><br/> | N
defaultValue | Array | [] | 选中值。非受控属性。TS 类型：`CheckboxGroupValue`。[详细类型定义](https://github.com/Tencent/tdesign-vue/tree/develop/src/checkbox/type.ts)。<br/><br/> | N
onChange | Function |  | TS 类型：`(value: CheckboxGroupValue, context: { e: Event }) => void`<br/>值变化时触发。<br/><br/> | N

### CheckboxGroup Events

名称 | 参数 | 描述
-- | -- | --
change | `(value: CheckboxGroupValue, context: { e: Event })` | 值变化时触发。<br/><br/>

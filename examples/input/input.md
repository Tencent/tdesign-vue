:: BASE_DOC ::

### 禁用状态的输入框
::: demo demos/disabled input
:::

## API
### Input Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
autocomplete | Boolean | false | 是否开启自动填充功能。<br/><br/> | N
autofocus | Boolean | false | 自动聚焦。<br/><br/> | N
clearable | Boolean | false | 是否可清空。<br/><br/> | N
disabled | Boolean | false | 是否禁用输入框。<br/><br/> | N
label | String / Slot / Function | - | 左侧文本。TS 类型：`string | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
maxcharacter | Number | - | 用户最多可以输入的字符个数，一个中文汉字表示两个字符长度。`maxcharacter` 和 `maxlength` 二选一使用。<br/><br/> | N
maxlength | Number | - | 用户最多可以输入的文本长度。值小于等于 0 的时候，则不限制输入长度。`maxcharacter` 和 `maxlength` 二选一使用。<br/><br/> | N
name | String | - | 名称。<br/><br/> | N
placeholder | String | undefined | 占位符。<br/><br/> | N
prefixIcon | Slot / Function | - | 组件前置图标。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
readonly | Boolean | false | 输入框是否只读。<br/><br/> | N
size | String | medium | 输入框尺寸。可选项：small/medium/large。TS 类型：`SizeEnum`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
status | String | undefined | 输入框状态。可选项：success/warning/error。<br/><br/> | N
suffix | String / Slot / Function | - | 后置图标前的后置内容。TS 类型：`string | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
suffixIcon | Slot / Function | - | 组件后置图标。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
tips | String / Slot / Function | - | 【讨论中】输入框下方提示文本，会根据不同的 `status` 呈现不同的样式。TS 类型：`string | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
type | String | text | 输入框类型。可选项：text/number/url/tel/password/search/submit/hidden。<br/><br/> | N
value | String / Number | - | 输入框的值。支持语法糖。TS 类型：`InputValue`。[详细类型定义](https://github.com/Tencent/tdesign-vue/tree/develop/src/input/type.ts)。<br/><br/> | N
defaultValue | String / Number | - | 输入框的值。非受控属性。TS 类型：`InputValue`。[详细类型定义](https://github.com/Tencent/tdesign-vue/tree/develop/src/input/type.ts)。<br/><br/> | N
onBlur | Function |  | TS 类型：`(value: InputValue, context: { e: FocusEvent }) => void`<br/>失去焦点时触发。<br/><br/> | N
onChange | Function |  | TS 类型：`(value: InputValue, context?: { e?: InputEvent | MouseEvent }) => void`<br/>输入框值发生变化时触发。<br/><br/> | N
onClear | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/>清空按钮点击时触发。<br/><br/> | N
onEnter | Function |  | TS 类型：`(value: InputValue, context: { e: KeyboardEvent }) => void`<br/>回车键按下时触发。<br/><br/> | N
onFocus | Function |  | TS 类型：`(value: InputValue, context: { e: FocusEvent }) => void`<br/>获得焦点时触发。<br/><br/> | N
onKeydown | Function |  | TS 类型：`(value: InputValue, context: { e: KeyboardEvent }) => void`<br/>键盘按下时触发。<br/><br/> | N
onKeypress | Function |  | TS 类型：`(value: InputValue, context: { e: KeyboardEvent }) => void`<br/>按下字符键时触发（keydown -> keypress -> keyup）。<br/><br/> | N
onKeyup | Function |  | TS 类型：`(value: InputValue, context: { e: KeyboardEvent }) => void`<br/>释放键盘时触发。<br/><br/> | N
onMouseenter | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/>进入输入框时触发。<br/><br/> | N
onMouseleave | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/>离开输入框时触发。<br/><br/> | N
onPaste | Function |  | TS 类型：`(context: { e: ClipboardEvent; pasteValue: string }) => void`<br/>粘贴事件，`pasteValue` 表示粘贴板的内容。<br/><br/> | N

### Input Events

名称 | 参数 | 描述
-- | -- | --
blur | `(value: InputValue, context: { e: FocusEvent })` | 失去焦点时触发。<br/><br/>
change | `(value: InputValue, context?: { e?: InputEvent | MouseEvent })` | 输入框值发生变化时触发。<br/><br/>
clear | `(context: { e: MouseEvent })` | 清空按钮点击时触发。<br/><br/>
enter | `(value: InputValue, context: { e: KeyboardEvent })` | 回车键按下时触发。<br/><br/>
focus | `(value: InputValue, context: { e: FocusEvent })` | 获得焦点时触发。<br/><br/>
keydown | `(value: InputValue, context: { e: KeyboardEvent })` | 键盘按下时触发。<br/><br/>
keypress | `(value: InputValue, context: { e: KeyboardEvent })` | 按下字符键时触发（keydown -> keypress -> keyup）。<br/><br/>
keyup | `(value: InputValue, context: { e: KeyboardEvent })` | 释放键盘时触发。<br/><br/>
mouseenter | `(context: { e: MouseEvent })` | 进入输入框时触发。<br/><br/>
mouseleave | `(context: { e: MouseEvent })` | 离开输入框时触发。<br/><br/>
paste | `(context: { e: ClipboardEvent; pasteValue: string })` | 粘贴事件，`pasteValue` 表示粘贴板的内容。<br/><br/>

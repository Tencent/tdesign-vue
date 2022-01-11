:: BASE_DOC ::

## API
### InputNumber Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
decimalPlaces | Number | undefined | [小数位数](https://en.wiktionary.org/wiki/decimal_place)。<br/><br/> | N
disabled | Boolean | false | 禁用组件。<br/><br/> | N
format | Function | - | 指定输入框展示值的格式。TS 类型：`(value: number) => number | string`。<br/><br/> | N
max | Number | Infinity | 最大值。<br/><br/> | N
min | Number | -Infinity | 最小值。<br/><br/> | N
placeholder | String | undefined | 占位符。<br/><br/> | N
size | String | medium | 组件尺寸。可选项：small/medium/large。<br/><br/> | N
step | Number | 1 | 数值改变步数，可以是小数。<br/><br/> | N
theme | String | row | 按钮布局。可选项：column/row/normal。<br/><br/> | N
value | Number | undefined | 值。支持语法糖。<br/><br/> | N
defaultValue | Number | undefined | 值。非受控属性。<br/><br/> | N
onBlur | Function |  | TS 类型：`(value: number, context: { e: FocusEvent }) => void`<br/>失去焦点时触发。<br/><br/> | N
onChange | Function |  | TS 类型：`(value: number, context: ChangeContext) => void`<br/>值变化时触发。[详细类型定义](https://github.com/Tencent/tdesign-vue/tree/develop/src/input-number/type.ts)。<br/>`interface ChangeContext { type: ChangeSource; e: InputEvent | MouseEvent | FocusEvent }`<br/><br/>`type ChangeSource = 'add' | 'reduce' | 'input' | ''`<br/> | N
onEnter | Function |  | TS 类型：`(value: number, context: { e: KeyboardEvent }) => void`<br/>回车键按下时触发。<br/><br/> | N
onFocus | Function |  | TS 类型：`(value: number, context: { e: FocusEvent }) => void`<br/>获取焦点时触发。<br/><br/> | N
onKeydown | Function |  | TS 类型：`(value: number, context: { e: KeyboardEvent }) => void`<br/>键盘按下时触发。<br/><br/> | N
onKeypress | Function |  | TS 类型：`(value: number, context: { e: KeyboardEvent }) => void`<br/>按下字符键时触发（keydown -> keypress -> keyup）。<br/><br/> | N
onKeyup | Function |  | TS 类型：`(value: number, context: { e: KeyboardEvent }) => void`<br/>释放键盘时触发。<br/><br/> | N

### InputNumber Events

名称 | 参数 | 描述
-- | -- | --
blur | `(value: number, context: { e: FocusEvent })` | 失去焦点时触发。<br/><br/>
change | `(value: number, context: ChangeContext)` | 值变化时触发。[详细类型定义](https://github.com/Tencent/tdesign-vue/tree/develop/src/input-number/type.ts)。<br/>`interface ChangeContext { type: ChangeSource; e: InputEvent | MouseEvent | FocusEvent }`<br/><br/>`type ChangeSource = 'add' | 'reduce' | 'input' | ''`<br/>
enter | `(value: number, context: { e: KeyboardEvent })` | 回车键按下时触发。<br/><br/>
focus | `(value: number, context: { e: FocusEvent })` | 获取焦点时触发。<br/><br/>
keydown | `(value: number, context: { e: KeyboardEvent })` | 键盘按下时触发。<br/><br/>
keypress | `(value: number, context: { e: KeyboardEvent })` | 按下字符键时触发（keydown -> keypress -> keyup）。<br/><br/>
keyup | `(value: number, context: { e: KeyboardEvent })` | 释放键盘时触发。<br/><br/>

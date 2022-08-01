:: BASE_DOC ::

## API
### InputNumber Props

name | type | default | description | required
-- | -- | -- | -- | --
align | String | - | options：left/center/right | N
autoWidth | Boolean | false | \- | N
decimalPlaces | Number | undefined | \- | N
disabled | Boolean | false | \- | N
format | Function | - | Typescript：`(value: InputNumberValue, context?: { fixedNumber?: InputNumberValue }) => InputNumberValue` | N
inputProps | Object | - | Typescript：`InputProps`，[Input API Documents](./input?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/input-number/type.ts) | N
largeNumber | Boolean | false | \- | N
max | String / Number | Infinity | Typescript：`InputNumberValue` | N
min | String / Number | -Infinity | Typescript：`InputNumberValue` | N
placeholder | String | undefined | \- | N
readonly | Boolean | false | \- | N
size | String | medium | options：small/medium/large | N
status | String | - | options：success/warning/error | N
step | String / Number | 1 | Typescript：`InputNumberValue` | N
theme | String | row | options：column/row/normal | N
tips | String / Slot / Function | - | Typescript：`string | TNode`。[see more ts definition](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts) | N
value | String / Number | undefined | `v-model` is supported。Typescript：`InputNumberValue` `type InputNumberValue = number | string`。[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/input-number/type.ts) | N
defaultValue | String / Number | undefined | uncontrolled property。Typescript：`InputNumberValue` `type InputNumberValue = number | string`。[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/input-number/type.ts) | N
onBlur | Function |  | TS 类型：`(value: InputNumberValue, context: { e: FocusEvent }) => void`<br/> | N
onChange | Function |  | TS 类型：`(value: InputNumberValue, context: ChangeContext) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/input-number/type.ts)。<br/>`interface ChangeContext { type: ChangeSource; e: InputEvent | MouseEvent | FocusEvent | KeyboardEvent }`<br/><br/>`type ChangeSource = 'add' | 'reduce' | 'input' | 'blur' | 'enter' | ''`<br/> | N
onEnter | Function |  | TS 类型：`(value: InputNumberValue, context: { e: KeyboardEvent }) => void`<br/> | N
onFocus | Function |  | TS 类型：`(value: InputNumberValue, context: { e: FocusEvent }) => void`<br/> | N
onKeydown | Function |  | TS 类型：`(value: InputNumberValue, context: { e: KeyboardEvent }) => void`<br/> | N
onKeypress | Function |  | TS 类型：`(value: InputNumberValue, context: { e: KeyboardEvent }) => void`<br/> | N
onKeyup | Function |  | TS 类型：`(value: InputNumberValue, context: { e: KeyboardEvent }) => void`<br/> | N
onValidate | Function |  | TS 类型：`(context: { error?: 'exceed-maximum' | 'below-minimum' }) => void`<br/> | N

### InputNumber Events

name | params | description
-- | -- | --
blur | `(value: InputNumberValue, context: { e: FocusEvent })` | \-
change | `(value: InputNumberValue, context: ChangeContext)` | [see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/input-number/type.ts)。<br/>`interface ChangeContext { type: ChangeSource; e: InputEvent | MouseEvent | FocusEvent | KeyboardEvent }`<br/><br/>`type ChangeSource = 'add' | 'reduce' | 'input' | 'blur' | 'enter' | ''`<br/>
enter | `(value: InputNumberValue, context: { e: KeyboardEvent })` | \-
focus | `(value: InputNumberValue, context: { e: FocusEvent })` | \-
keydown | `(value: InputNumberValue, context: { e: KeyboardEvent })` | \-
keypress | `(value: InputNumberValue, context: { e: KeyboardEvent })` | \-
keyup | `(value: InputNumberValue, context: { e: KeyboardEvent })` | \-
validate | `(context: { error?: 'exceed-maximum' | 'below-minimum' })` | \-

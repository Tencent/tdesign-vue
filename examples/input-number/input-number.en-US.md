:: BASE_DOC ::

## API

### InputNumber Props

name | type | default | description | required
-- | -- | -- | -- | --
align | String | - | options：left/center/right | N
autoWidth | Boolean | false | \- | N
decimalPlaces | Number | undefined | \- | N
disabled | Boolean | false | \- | N
format | Function | - | Typescript：`(value: number) => number | string` | N
max | Number | Infinity | \- | N
min | Number | -Infinity | \- | N
placeholder | String | undefined | \- | N
readonly | Boolean | false | \- | N
size | String | medium | options：small/medium/large | N
status | String | - | options：success/warning/error | N
step | Number | 1 | \- | N
theme | String | row | options：column/row/normal | N
tips | String / Slot / Function | - | Typescript：`string | TNode`。[see more ts definition](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts) | N
value | Number | undefined | `v-model` is supported | N
defaultValue | Number | undefined | uncontrolled property | N
onBlur | Function |  | TS 类型：`(value: number, context: { e: FocusEvent }) => void`<br/> | N
onChange | Function |  | TS 类型：`(value: number, context: ChangeContext) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/input-number/type.ts)。<br/>`interface ChangeContext { type: ChangeSource; e: InputEvent | MouseEvent | FocusEvent }`<br/><br/>`type ChangeSource = 'add' | 'reduce' | 'input' | ''`<br/> | N
onEnter | Function |  | TS 类型：`(value: number, context: { e: KeyboardEvent }) => void`<br/> | N
onFocus | Function |  | TS 类型：`(value: number, context: { e: FocusEvent }) => void`<br/> | N
onKeydown | Function |  | TS 类型：`(value: number, context: { e: KeyboardEvent }) => void`<br/> | N
onKeypress | Function |  | TS 类型：`(value: number, context: { e: KeyboardEvent }) => void`<br/> | N
onKeyup | Function |  | TS 类型：`(value: number, context: { e: KeyboardEvent }) => void`<br/> | N

### InputNumber Events

name | params | description
-- | -- | --
blur | `(value: number, context: { e: FocusEvent })` | \-
change | `(value: number, context: ChangeContext)` | [see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/input-number/type.ts)。<br/>`interface ChangeContext { type: ChangeSource; e: InputEvent | MouseEvent | FocusEvent }`<br/><br/>`type ChangeSource = 'add' | 'reduce' | 'input' | ''`<br/>
enter | `(value: number, context: { e: KeyboardEvent })` | \-
focus | `(value: number, context: { e: FocusEvent })` | \-
keydown | `(value: number, context: { e: KeyboardEvent })` | \-
keypress | `(value: number, context: { e: KeyboardEvent })` | \-
keyup | `(value: number, context: { e: KeyboardEvent })` | \-

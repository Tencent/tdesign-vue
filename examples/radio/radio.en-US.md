:: BASE_DOC ::

## API

### Radio Props

name | type | default | description | required
-- | -- | -- | -- | --
allowUncheck | Boolean | false | \- | N
checked | Boolean | false | `v-model` is supported | N
defaultChecked | Boolean | false | uncontrolled property | N
default | String / Slot / Function | - | Typescript：`string | TNode`。[see more ts definition](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts) | N
disabled | Boolean | undefined | \- | N
label | String / Slot / Function | - | Typescript：`string | TNode`。[see more ts definition](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts) | N
name | String | - | \- | N
value | String / Number / Boolean | false | Typescript：`RadioValue` `type RadioValue = string | number | boolean`。[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/radio/type.ts) | N
onChange | Function |  | TS 类型：`(checked: boolean, context: { e: Event }) => void`<br/> | N

### Radio Events

name | params | description
-- | -- | --
change | `(checked: boolean, context: { e: Event })` | \-

### RadioGroup Props

name | type | default | description | required
-- | -- | -- | -- | --
disabled | Boolean | undefined | \- | N
name | String | - | \- | N
options | Array | - | Typescript：`Array<RadioOption>` `type RadioOption = string | number | RadioOptionObj` `interface RadioOptionObj { label?: string | TNode; value?: string | number; disabled?: boolean }`。[see more ts definition](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/radio/type.ts) | N
size | String | medium | options：small/medium/large。Typescript：`SizeEnum`。[see more ts definition](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts) | N
value | String / Number / Boolean | false | `v-model` is supported。Typescript：`RadioValue` | N
defaultValue | String / Number / Boolean | false | uncontrolled property。Typescript：`RadioValue` | N
variant | String | outline | options：outline/primary-filled/default-filled | N
onChange | Function |  | TS 类型：`(value: RadioValue, context: { e: Event }) => void`<br/> | N

### RadioGroup Events

name | params | description
-- | -- | --
change | `(value: RadioValue, context: { e: Event })` | \-

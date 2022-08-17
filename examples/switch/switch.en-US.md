:: BASE_DOC ::

## API

### Switch Props

name | type | default | description | required
-- | -- | -- | -- | --
customValue | Array | - | Typescript：`Array<SwitchValue>` | N
disabled | Boolean | false | \- | N
label | Array / Slot / Function | [] | Typescript：`Array<string | TNode> | TNode<{ value: SwitchValue }>`。[see more ts definition](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts) | N
loading | Boolean | false | \- | N
size | String | medium | options：small/medium/large | N
value | String / Number / Boolean | - | `v-model` is supported。Typescript：`SwitchValue` `type SwitchValue = string | number | boolean`。[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/switch/type.ts) | N
defaultValue | String / Number / Boolean | - | uncontrolled property。Typescript：`SwitchValue` `type SwitchValue = string | number | boolean`。[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/switch/type.ts) | N
onChange | Function |  | TS 类型：`(value: SwitchValue) => void`<br/> | N

### Switch Events

name | params | description
-- | -- | --
change | `(value: SwitchValue)` | \-

:: BASE_DOC ::

## API

### Jumper Props

name | type | default | description | required
-- | -- | -- | -- | --
disabled | Boolean / Object | - | Typescript：`boolean | JumperDisabledConfig` `type JumperDisabledConfig = { prev?: boolean; current?: boolean; next?: boolean; }`。[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/jumper/type.ts) | N
layout | String | horizontal | horizontal or vertical。options：horizontal/vertical | N
showCurrent | Boolean | true | Typescript：`boolean` | N
size | String | medium | Button size。options：small/medium/large。Typescript：`SizeEnum`。[see more ts definition](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts) | N
tips | Object | - | Typescript：`boolean | JumperTipsConfig` `type JumperTipsConfig = { prev?: string; current?: string; next?: string; }`。[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/jumper/type.ts) | N
variant | String | text | options：text/outline | N
onChange | Function |  | TS 类型：`(context: {e: MouseEvent, trigger: JumperTrigger}) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/jumper/type.ts)。<br/>`type JumperTrigger = 'prev' | 'current' | 'next'`<br/> | N

### Jumper Events

name | params | description
-- | -- | --
change | `(context: {e: MouseEvent, trigger: JumperTrigger})` | [see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/jumper/type.ts)。<br/>`type JumperTrigger = 'prev' | 'current' | 'next'`<br/>

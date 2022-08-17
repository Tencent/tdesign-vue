:: BASE_DOC ::

## API

### Affix Props

name | type | default | description | required
-- | -- | -- | -- | --
container | String / Function | () => (() => window) | Typescript：`ScrollContainer` | N
offsetBottom | Number | 0 | \- | N
offsetTop | Number | 0 | \- | N
zIndex | Number | - | \- | N
onFixedChange | Function |  | TS 类型：`(affixed: boolean, context: { top: number }) => void`<br/> | N

### Affix Events

name | params | description
-- | -- | --
fixed-change | `(affixed: boolean, context: { top: number })` | \-

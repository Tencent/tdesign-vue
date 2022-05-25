:: BASE_DOC ::

## API

### Tooltip Props

name | type | default | description | required
-- | -- | -- | -- | --
delay | Number | - | \- | N
destroyOnClose | Boolean | true | \- | N
duration | Number | - | \- | N
placement | String | top | Typescript：`'mouse' | PopupPlacement`，[Popup API Documents](./popup?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/tooltip/type.ts) | N
showArrow | Boolean | true | \- | N
theme | String | default | options：default/primary/success/danger/warning/light | N
`Omit<PopupProps, 'placement'>` | \- | - | \- | N

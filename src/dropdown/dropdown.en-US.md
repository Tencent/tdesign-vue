:: BASE_DOC ::

## API

### Dropdown Props

name | type | default | description | required
-- | -- | -- | -- | --
direction | String | - | options: left/right。Typescript：`'left' \| 'right'` | N
disabled | Boolean | false | \- | N
hideAfterItemClick | Boolean | true | \- | N
maxColumnWidth | String / Number | 100 | \- | N
maxHeight | String / Number | 300 | \- | N
minColumnWidth | String / Number | 10 | \- | N
options | Array | [] | Typescript：`Array<DropdownOption>` | N
panelBottomContent | String / Slot / Function | - | Typescript：`string \| TNode`，[TNode Definition](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts) | N
panelTopContent | String / Slot / Function | - | Typescript：`string \| TNode`，[TNode Definition](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts) | N
trigger | String | hover | options: hover/click/focus。Typescript：`'hover' \| 'click' \| 'focus'` | N
onClick | Function |  | Typescript：`(dropdownItem: DropdownOption, context: { e: MouseEvent }) => void`<br/> | N
onHover | Function |  | Typescript：`(dropdownItem: DropdownOption, context: { e: MouseEvent }) => void`<br/> | N

### Dropdown Events

name | params | description
-- | -- | --
click | `(dropdownItem: DropdownOption, context: { e: MouseEvent })` | \-
hover | `(dropdownItem: DropdownOption, context: { e: MouseEvent })` | \-

### DropdownItem Props

name | type | default | description | required
-- | -- | -- | -- | --
active | Boolean | false | \- | N
content | String / Slot / Function | '' | Typescript：`string \| TNode`，[TNode Definition](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts) | N
disabled | Boolean | false | \- | N
divider | Boolean | false | \- | N
prefixIcon | Function | - | Typescript：`TNode`，[TNode Definition](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts) | N
theme | String | default | options: default/success/warning/error。Typescript：`DropdownItemTheme` | N
value | String / Number / Object | - | Typescript：`string \| number \| { [key: string]: any }` | N
onClick | Function |  | Typescript：`(dropdownItem: DropdownOption, context: { e: MouseEvent }) => void`<br/> | N
onHover | Function |  | Typescript：`(dropdownItem: DropdownOption, context: { e: MouseEvent }) => void`<br/> | N

### DropdownItem Events

name | params | description
-- | -- | --
click | `(dropdownItem: DropdownOption, context: { e: MouseEvent })` | \-
hover | `(dropdownItem: DropdownOption, context: { e: MouseEvent })` | \-

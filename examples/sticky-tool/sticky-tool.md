:: BASE_DOC ::

## API
### StickyTool Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
collapsed | Boolean | false | 默认是否折叠。<br/><br/> | N
draggable | Boolean | false | 是否可拖拽。<br/><br/> | N
entrance | Slot / Function | - | 自定义折叠入口，collapsed 值为 true 有效。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
list | Array | [] | 列表。TS 类型：`Array<TdStickyItemProps>`。<br/><br/> | N
offset | Object | - | 相对于 placement 的偏移量，示例：[-10, 20] 或 ['10em', '8rem']。TS 类型：`Array<string | number>`。<br/><br/> | N
placement | String | right-bottom | 固定位置。可选项：right-top/right-center/right-bottom/left-top/left-center/left-bottom。<br/><br/> | N
width | String / Number | - | 宽度。<br/><br/> | N
onClick | Function |  | TS 类型：`(context: { e: MouseEvent; item: TdStickyItemProps }) => void`<br/>点击某一项时触发。<br/><br/> | N
onHover | Function |  | TS 类型：`(context: { e: MouseEvent; item: TdStickyItemProps }) => void`<br/>悬浮到某一项时触发。<br/><br/> | N

### StickyTool Events

名称 | 参数 | 描述
-- | -- | --
click | `(context: { e: MouseEvent; item: TdStickyItemProps })` | 点击某一项时触发。<br/><br/>
hover | `(context: { e: MouseEvent; item: TdStickyItemProps })` | 悬浮到某一项时触发。<br/><br/>

### StickyItem Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
icon | String / Slot / Function | - | 图标。TS 类型：`string | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
label | String / Slot / Function | - | 名称。TS 类型：`string | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
popup | String / Slot / Function | - | 浮层内容。TS 类型：`string | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
popupProps | Object | - | 透传浮层组件全部属性。TS 类型：`PopupProps`。[详细类型定义](https://github.com/Tencent/tdesign-vue/tree/develop/src/sticky-tool/type.ts)。<br/><br/> | N
trigger | String | hover | 触发浮层显示的方式。可选项：hover/click。<br/><br/> | N

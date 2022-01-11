:: BASE_DOC ::

## API
### Button Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
block | Boolean | false | 是否为块级元素。<br/><br/> | N
content | String / Slot / Function | - | 按钮内容。TS 类型：`string | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
default | String / Slot / Function | - | 按钮内容。TS 类型：`string | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
disabled | Boolean | false | 是否禁用按钮。<br/><br/> | N
ghost | Boolean | false | 是否为幽灵按钮（镂空按钮）。<br/><br/> | N
icon | Slot / Function | - | 按钮内部图标，可完全自定义。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
loading | Boolean | false | 是否显示为加载状态。<br/><br/> | N
shape | String | rectangle | 按钮形状，有 4 种：长方形、正方形、圆角长方形、圆形。可选项：rectangle/square/round/circle。<br/><br/> | N
size | String | medium | 组件尺寸。可选项：small/medium/large。TS 类型：`SizeEnum`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
theme | String | undefined | 组件风格，依次为默认色、品牌色、危险色、警告色、成功色。可选项：default/primary/danger/warning/success。<br/><br/> | N
type | String | button | 按钮类型。可选项：submit/reset/button。<br/><br/> | N
variant | String | base | 按钮形式，基础、线框、虚线、文字。可选项：base/outline/dashed/text。<br/><br/> | N
onClick | Function |  | TS 类型：`(e: MouseEvent) => void`<br/>点击时触发。<br/><br/> | N

### Button Events

名称 | 参数 | 描述
-- | -- | --
click | `(e: MouseEvent)` | 点击时触发。<br/><br/>

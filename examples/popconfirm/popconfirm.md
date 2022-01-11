:: BASE_DOC ::

## API
### Popconfirm Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
cancelBtn | String / Object / Slot / Function | '' | 取消按钮，可自定义。值为 null 则不显示取消按钮。值类型为字符串，则表示自定义按钮文本，值类型为 Object 则表示透传 Button 组件属性。使用 TNode 自定义按钮时，需自行控制取消事件。TS 类型：`string | ButtonProps | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。[详细类型定义](https://github.com/Tencent/tdesign-vue/tree/develop/src/popconfirm/type.ts)。<br/><br/> | N
confirmBtn | String / Object / Slot / Function | '' | 确认按钮。值类型为字符串，则表示自定义按钮文本，值类型为 Object 则表示透传 Button 组件属性。使用 TNode 自定义按钮时，需自行控制确认事件。TS 类型：`string | ButtonProps | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
content | String / Slot / Function | - | 确认框内容。TS 类型：`string | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
default | String / Slot / Function | - | 触发元素，同 triggerElement。TS 类型：`string | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
destroyOnClose | Boolean | true | 是否在关闭浮层时销毁浮层。<br/><br/> | N
icon | Slot / Function | - | 确认框图标。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
placement | String | top | 浮层出现位置。可选项：top/left/right/bottom/top-left/top-right/bottom-left/bottom-right/left-top/left-bottom/right-top/right-bottom。<br/><br/> | N
popupProps | Object | - | 透传 Popup 组件属性。TS 类型：`PopupProps`。[详细类型定义](https://github.com/Tencent/tdesign-vue/tree/develop/src/popconfirm/type.ts)。<br/><br/> | N
showArrow | Boolean | true | 是否显示浮层箭头。<br/><br/> | N
theme | String | default | 文字提示风格。可选项：default/warning/danger。<br/><br/> | N
triggerElement | String / Slot / Function | - | 触发元素。TS 类型：`string | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
visible | Boolean | - | 是否显示气泡确认框。支持语法糖。<br/><br/> | N
defaultVisible | Boolean | - | 是否显示气泡确认框。非受控属性。<br/><br/> | N
onCancel | Function |  | TS 类型：`(options: { e: MouseEvent }) => void`<br/>点击取消按钮时触发。<br/><br/> | N
onConfirm | Function |  | TS 类型：`(options: { e: MouseEvent }) => void`<br/>点击确认按钮时触发。<br/><br/> | N
onVisibleChange | Function |  | TS 类型：`(visible: boolean, context?: PopconfirmVisibleChangeContext) => void`<br/>确认框显示或隐藏时触发。[详细类型定义](https://github.com/Tencent/tdesign-vue/tree/develop/src/popconfirm/type.ts)。<br/>`interface PopconfirmVisibleChangeContext { trigger?: TriggerSource; e?: MouseEvent }`<br/><br/>`type TriggerSource = 'cancel' | 'confirm' | 'document' | 'trigger-element-click'`<br/> | N

### Popconfirm Events

名称 | 参数 | 描述
-- | -- | --
cancel | `(options: { e: MouseEvent })` | 点击取消按钮时触发。<br/><br/>
confirm | `(options: { e: MouseEvent })` | 点击确认按钮时触发。<br/><br/>
visible-change | `(visible: boolean, context?: PopconfirmVisibleChangeContext)` | 确认框显示或隐藏时触发。[详细类型定义](https://github.com/Tencent/tdesign-vue/tree/develop/src/popconfirm/type.ts)。<br/>`interface PopconfirmVisibleChangeContext { trigger?: TriggerSource; e?: MouseEvent }`<br/><br/>`type TriggerSource = 'cancel' | 'confirm' | 'document' | 'trigger-element-click'`<br/>

:: BASE_DOC ::

### 超长省略文本标签

通过 `maxWidth` 设置最大宽度，超出部分自动省略。

::: demo demos/long-text
:::

### 不同尺寸的标签

提供大、中（默认）、小三种尺寸。

::: demo demos/size
:::

### 不同形状的标签

提供方形、圆角方形、标记型三种形状。

::: demo demos/shape
:::

## API
### Tag Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
closable | Boolean | false | 标签是否可关闭。<br/><br/> | N
content | String / Number / Slot / Function | - | 组件子元素。TS 类型：`string | number | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
default | String / Number / Slot / Function | - | 组件子元素（默认插槽），同 content。TS 类型：`string | number | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
disabled | Boolean | false | 标签禁用态，失效标签不能触发事件。默认风格（theme=default）才有禁用态。<br/><br/> | N
icon | Slot / Function | undefined | 标签中的图标，可自定义图标呈现。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
maxWidth | String / Number | - | 标签最大宽度，宽度超出后会出现省略号。示例：'50px' / 80。TS 类型：`CSSProperties['maxWidth'] | number`。<br/><br/> | N
shape | String | square | 标签类型，有三种：方形、圆角方形、标记型。可选项：square/round/mark。<br/><br/> | N
size | String | medium | 标签尺寸。可选项：small/medium/large。TS 类型：`SizeEnum`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
theme | String | default | 组件风格，用于描述组件不同的应用场景。可选项：default/primary/warning/danger/success。<br/><br/> | N
variant | String | dark | 影响标签风格（theme）。可选项：dark/light/plain。<br/><br/> | N
onClick | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/>点击时触发。<br/><br/> | N
onClose | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/>如果关闭按钮存在，点击关闭按钮时触发。<br/><br/> | N

### Tag Events

名称 | 参数 | 描述
-- | -- | --
click | `(context: { e: MouseEvent })` | 点击时触发。<br/><br/>
close | `(context: { e: MouseEvent })` | 如果关闭按钮存在，点击关闭按钮时触发。<br/><br/>

### CheckTag Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
checked | Boolean | false | 标签选中的状态，默认风格（theme=default）才有选中态。支持语法糖。<br/><br/> | N
defaultChecked | Boolean | false | 标签选中的状态，默认风格（theme=default）才有选中态。非受控属性。<br/><br/> | N
content | String / Number / Slot / Function | - | 组件子元素。TS 类型：`string | number | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
default | String / Number / Slot / Function | - | 组件子元素，同 content。TS 类型：`string | number | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
disabled | Boolean | false | 标签禁用态，失效标签不能触发事件。默认风格（theme=default）才有禁用态。<br/><br/> | N
onChange | Function |  | TS 类型：`(checked: boolean) => void`<br/>组件子元素。<br/><br/> | N
onClick | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/>点击标签时触发。<br/><br/> | N

### CheckTag Events

名称 | 参数 | 描述
-- | -- | --
change | `(checked: boolean)` | 组件子元素。<br/><br/>
click | `(context: { e: MouseEvent })` | 点击标签时触发。<br/><br/>

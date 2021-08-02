:: BASE_DOC ::

## 事件示例

### Vue事件
定义 - 通过methods来定义事件的执行逻辑。

使用场景 - 组件提供提供了一些事件，开发者可以使用这些事件去实现一些更加定制化的功能（详见文档“Calendar Events”的说明）

{{ events }}

### 事件属性
定义 - 通过Prpos API来定义事件的执行逻辑。

使用场景 - 和Events事件一一对应，通过Prpos API来处理事件的回调逻辑
```
💡 简单的说就是把@aa-bbb换成:onAaBbb
```

{{ events-props-api }}

## 插槽示例

### 头部插槽（组件左上角）
定义 - 在组件左上角展示内容。

使用场景 - 某些业务场景下，可能需要在组件左上角显示一个标题之类的内容，那么就可以使用head具名插槽了。

{{ head }}

### 单元格插槽-追加内容
定义 - 在现有单元格展示内容的基础上追加展示内容。
``` 
💡 小Tips：不同模式下使用的是同一个slot，可以通过slot-scope的data.mode来判断当前是哪种模式，然后做出不同渲染 :)
```
使用场景 - 默认情况下日历单元格中会显示当前日期，如果还需要额外显示其他信息，可以通过cellAppend具名插槽来实现。

{{ cell-append }}

### 单元格插槽-自定义内容
定义 - 完全重写单元格展示的内容。

使用场景 - 和cellAppend具名插槽不同，cell具名插槽可以完全自定义单元格内容。

{{ cell }}

### 卡片风格下的单元格插槽
使用场景 - 卡片风格下单元格的空间非常有限，可以slot-scope的data.theme来判断当前是那种风格，然后做出不同渲染 :)

{{ card-cell }}

### 属性插槽
定义 - 通过Props API来使用插槽。

使用场景 - 某些场景下可能希望通过Props API来渲染插槽内容，head、cell、cellAppend都有其对应的Props API，以下简单演示了head、cell的Props API

{{ slot-props-api }}

:: BASE_PROPS ::

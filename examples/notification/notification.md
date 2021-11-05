:: BASE_DOC ::

### 关闭多个消息通知

可以通过`closeAll`同时关闭多个消息通知。

{{ close-all }}

### 指令调用形式的消息通知

支持插件式调用 `this.$notify` 和函数式调用 `NotifyPlugin` 两种方式，两种方式参数完全一样。

示例：`NotifyPlugin.warning('请输入信息')` 或 `this.$notify.warning('请输入信息')`

{{ plugin }}

:: BASE_PROPS ::

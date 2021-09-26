:: BASE_DOC ::

### 关闭按钮

{{ close }}

### 关闭提示

如果不希望通过计时关闭，或者用户点击按钮关闭，也可以使用关闭函数。

{{ toggle }}

### 关闭全部

{{ close-all }}

### 位置控制

全局提示显示位置可控制，placement 用于控制大概位置，offset 用于设置相对于 placement 所在位置的偏移

{{ placement }}

### 插件调用 与 函数式调用

除了常规的组件使用，还可以通过插件调用，如`$message.info('信息提示',1000)`或`$message('warning', '用户表示操作引起一定后果')`等;

也可通过函数式调用，如`MessagePlugin.info('信息提示')`或`MessagePlugin('warning', { content: '用户表示操作引起一定后果' })`等

{{ plugin }}

:: BASE_PROPS ::

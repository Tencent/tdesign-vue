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

支持插件式调用（this.$message）和函数式调用（MessagePlugin）两种方式，两种方式参数完全一样。示例：MessagePlugin.warning('请输入信息') 或 this.$message.warning('请输入信息')


{{ plugin }}

:: BASE_PROPS ::

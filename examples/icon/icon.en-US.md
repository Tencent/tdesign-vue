:: BASE_DOC ::

### 安装独立 Icon 包

图标相对其他基础组件较为独立，所以作为一个独立的 npm 包做发布管理。如果项目中直接使用，请安装`tdesign-icons-vue`。 同时 tdesign-vue 也内置了 icon,支持直接通过 t-icon 来使用

### SVG 全量引入

图标尺寸单位支持多种， 'small', 'medium', 'large', '35px', '3em' 等。
图标颜色使用 CSS 控制，如：style="color: red"，或者 style="fill: red"。
点击右侧导航「全部图标」即可查看组件库全部图标。

{{ base }}

### SVG 按需引入

图标可以按需引入单个 SVG 图标。组件开发内部使用到 Icon 时，均按需引入 SVG 图标。

{{ single }}

### SVG 高级用法

可以传入 url 加入新的 SVG 图标。

引入新的图标 Url 之后，图标名称必须写全称，以作区分，如：`"name='home'"` 需要写成 `"name='t-icon-home'"`。

组件会引入默认的 SVG 图标，如果希望禁止组件加载默认的 SVG 图标，将 `loadDefaultIcons` 置为 false 即可。

{{ enhanced }}

### iconfont 图标

使用 Iconfont 图标需要单独引入 Iconfont 图标组件

{{ iconfont }}

### iconfont 高级用法

可以传入 url 加入新的 iconfont 图标。

引入新的图标 Url 之后，图标名称必须写全称，以作区分，如：`"name='home'"` 需要写成 `"name='t-icon-home'"`。

组件会引入默认的 iconfont 图标，如果希望禁止组件加载默认的 iconfont 图标，将 `loadDefaultIcons` 置为 false 即可。

{{ iconfont-enhanced }}

### 全部图标

<td-icons-view />

## API

### IconSVG Props

name | type | default | description | required
-- | -- | -- | -- | --
loadDefaultIcons | Boolean | true | \- | N
name | String | - | required | Y
size | String | undefined | \- | N
style | String | - | html attribute | N
url | String / Array | - | Typescript：`string | Array<string>` | N
onClick | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/> | N

### IconSVG Events

name | params | description
-- | -- | --
click | `(context: { e: MouseEvent })` | \-

### Iconfont Props

name | type | default | description | required
-- | -- | -- | -- | --
loadDefaultIcons | Boolean | true | \- | N
name | String | - | required | Y
size | String | undefined | \- | N
style | String | - | html attribute | N
tag | String | i | \- | N
url | String / Array | - | Typescript：`string | Array<string>` | N
onClick | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/> | N

### Iconfont Events

name | params | description
-- | -- | --
click | `(context: { e: MouseEvent })` | \-

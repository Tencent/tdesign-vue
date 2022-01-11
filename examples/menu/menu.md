:: BASE_DOC ::

### 可设置宽度的侧边导航

通过 `width` 设置侧边导航的宽度。

::: demo demos/side-menu-width menu
:::

## API
### Menu Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
collapsed | Boolean | false | 是否收起菜单。<br/><br/> | N
expanded | Array | - | 展开的子菜单集合。支持语法糖。TS 类型：`Array<MenuValue>`。<br/><br/> | N
defaultExpanded | Array | - | 展开的子菜单集合。非受控属性。TS 类型：`Array<MenuValue>`。<br/><br/> | N
expandMutex | Boolean | false | 同级别互斥展开。<br/><br/> | N
expandType | String | normal | 二级菜单展开方式，平铺展开和浮层展开。可选项：normal/popup。<br/><br/> | N
logo | Slot / Function | - | 站点 LOGO。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
operations | Slot / Function | - | 导航操作区域。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
theme | String | light | 菜单风格。可选项：light/dark。<br/><br/> | N
value | String / Number | - | 激活菜单项。支持语法糖。TS 类型：`MenuValue`。[详细类型定义](https://github.com/Tencent/tdesign-vue/tree/develop/src/menu/type.ts)。<br/><br/> | N
defaultValue | String / Number | - | 激活菜单项。非受控属性。TS 类型：`MenuValue`。[详细类型定义](https://github.com/Tencent/tdesign-vue/tree/develop/src/menu/type.ts)。<br/><br/> | N
width | String / Number / Array | '232px' | 菜单宽度。值类型为数组时，分别表示菜单展开和折叠的宽度。[ 展开时的宽度, 折叠时的宽度 ]，示例：['200px', '80px']。TS 类型：`string | number | Array<string | number>`。<br/><br/> | N
onChange | Function |  | TS 类型：`(value: MenuValue) => void`<br/>激活菜单项发生变化时触发。<br/><br/> | N
onCollapsed | Function |  | TS 类型：`(options: { collapsed: boolean; e?: MouseEvent }) => void`<br/>侧边栏导航展开/收起发生变化时触发。<br/><br/> | N
onExpand | Function |  | TS 类型：`(value: Array<MenuValue>) => void`<br/>展开的菜单项发生变化时触发。<br/><br/> | N

### Menu Events

名称 | 参数 | 描述
-- | -- | --
change | `(value: MenuValue)` | 激活菜单项发生变化时触发。<br/><br/>
collapsed | `(options: { collapsed: boolean; e?: MouseEvent })` | 侧边栏导航展开/收起发生变化时触发。<br/><br/>
expand | `(value: Array<MenuValue>)` | 展开的菜单项发生变化时触发。<br/><br/>

### HeadMenu Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
expanded | Array | - | 展开的子菜单集合。支持语法糖。TS 类型：`Array<MenuValue>`。<br/><br/> | N
defaultExpanded | Array | - | 展开的子菜单集合。非受控属性。TS 类型：`Array<MenuValue>`。<br/><br/> | N
expandType | String | normal | 二级菜单展开方式，平铺展开和浮层展开。可选项：normal/popup。<br/><br/> | N
logo | Slot / Function | - | 站点 LOGO。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
operations | Slot / Function | - | 导航操作区域。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
theme | String | light | 可选项：light/dark。<br/><br/> | N
value | String / Number | - | 激活菜单项。支持语法糖。TS 类型：`MenuValue`。[详细类型定义](https://github.com/Tencent/tdesign-vue/tree/develop/src/menu/type.ts)。<br/><br/> | N
defaultValue | String / Number | - | 激活菜单项。非受控属性。TS 类型：`MenuValue`。[详细类型定义](https://github.com/Tencent/tdesign-vue/tree/develop/src/menu/type.ts)。<br/><br/> | N
onChange | Function |  | TS 类型：`(value: MenuValue) => void`<br/>激活菜单项发生变化时触发。<br/><br/> | N
onExpand | Function |  | TS 类型：`(value: Array<MenuValue>) => void`<br/>展开的菜单项发生变化时触发。<br/><br/> | N

### HeadMenu Events

名称 | 参数 | 描述
-- | -- | --
change | `(value: MenuValue)` | 激活菜单项发生变化时触发。<br/><br/>
expand | `(value: Array<MenuValue>)` | 展开的菜单项发生变化时触发。<br/><br/>

### Submenu Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
content | String / Slot / Function | - | 菜单项内容。TS 类型：`string | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
default | String / Slot / Function | - | 菜单项内容，同 content。TS 类型：`string | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
disabled | Boolean | - | 是否禁用菜单项展开/收起/跳转等功能。<br/><br/> | N
icon | Slot / Function | - | 菜单项图标。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
title | String / Slot / Function | - | 二级菜单内容。TS 类型：`string | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
value | String / Number | - | 菜单项唯一标识。TS 类型：`MenuValue`。<br/><br/> | N

### MenuItem Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
content | String / Slot / Function | - | 菜单项内容。TS 类型：`string | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
default | String / Slot / Function | - | 菜单项内容，同 content。TS 类型：`string | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
disabled | Boolean | - | 是否禁用菜单项展开/收起/跳转等功能。<br/><br/> | N
href | String | - | 跳转链接。<br/><br/> | N
icon | Slot / Function | - | 图标。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
replace | Boolean | false | 路由跳转是否采用覆盖的方式（覆盖后将没有浏览器历史记录）。<br/><br/> | N
router | Object | - | 路由对象。如果项目存在 Router，则默认使用 Router。。TS 类型：`Record<string, any>`。<br/><br/> | N
target | String | - | 链接或路由跳转方式。可选项：_blank/_self/_parent/_top。<br/><br/> | N
to | String / Object | - | 路由跳转目标，当且仅当 Router 存在时，该 API 有效。TS 类型：`MenuRoute`。[详细类型定义](https://github.com/Tencent/tdesign-vue/tree/develop/src/menu/type.ts)。<br/><br/> | N
value | String / Number | - | 菜单项唯一标识。TS 类型：`MenuValue`。<br/><br/> | N
onClick | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/>点击时触发。<br/><br/> | N

### MenuItem Events

名称 | 参数 | 描述
-- | -- | --
click | `(context: { e: MouseEvent })` | 点击时触发。<br/><br/>

### MenuGroup Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
title | String / Slot / Function | - | 菜单组标题。TS 类型：`string | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N

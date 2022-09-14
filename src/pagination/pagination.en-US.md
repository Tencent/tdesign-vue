:: BASE_DOC ::

## API

### Pagination Props

name | type | default | description | required
-- | -- | -- | -- | --
current | Number | 1 | `v-model` is supported | N
defaultCurrent | Number | 1 | uncontrolled property | N
disabled | Boolean | false | \- | N
foldedMaxPageBtn | Number | 5 | \- | N
maxPageBtn | Number | 10 | \- | N
pageSize | Number | 10 | `.sync` is supported | N
defaultPageSize | Number | 10 | uncontrolled property | N
pageSizeOptions | Array | () => [5, 10, 20, 50] | Typescript：`Array<number | { label: string; value: number }>` | N
showFirstAndLastPageBtn | Boolean | false | \- | N
showJumper | Boolean | false | \- | N
showPageNumber | Boolean | true | \- | N
showPageSize | Boolean | true | \- | N
showPreviousAndNextBtn | Boolean | true | \- | N
size | String | medium | options：small/medium | N
theme | String | default | options：default/simple | N
total | Number | 0 | \- | N
totalContent | Boolean / Slot / Function | true | Typescript：`boolean | TNode`。[see more ts definition](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts) | N
onChange | Function |  | TS 类型：`(pageInfo: PageInfo) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/pagination/type.ts)。<br/>`interface PageInfo { current: number; previous: number; pageSize: number }`<br/> | N
onCurrentChange | Function |  | TS 类型：`(current: number, pageInfo: PageInfo) => void`<br/> | N
onPageSizeChange | Function |  | TS 类型：`(pageSize: number, pageInfo: PageInfo) => void`<br/> | N

### Pagination Events

name | params | description
-- | -- | --
change | `(pageInfo: PageInfo)` | [see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/pagination/type.ts)。<br/>`interface PageInfo { current: number; previous: number; pageSize: number }`<br/>
current-change | `(current: number, pageInfo: PageInfo)` | \-
page-size-change | `(pageSize: number, pageInfo: PageInfo)` | \-

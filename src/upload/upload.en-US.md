:: BASE_DOC ::

## API

### Upload Props

name | type | default | description | required
-- | -- | -- | -- | --
accept | String | - | \- | N
action | String | - | \- | N
allowUploadDuplicateFile | Boolean | false | \- | N
autoUpload | Boolean | true | \- | N
beforeUpload | Function | - | Typescript：`(file: File | UploadFile) => boolean | Promise<boolean>` | N
data | Object | - | Typescript：`Record<string, any> | ((file: File) => Record<string, any>)` | N
default | String / Slot / Function | - | Typescript：`string | TNode`。[see more ts definition](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts) | N
disabled | Boolean | false | \- | N
draggable | Boolean | false | \- | N
fileListDisplay | Slot / Function | - | Typescript：`TNode`。[see more ts definition](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts) | N
files | Array | - | `v-model` is supported。Typescript：`Array<UploadFile>` | N
defaultFiles | Array | - | uncontrolled property。Typescript：`Array<UploadFile>` | N
format | Function | - | Typescript：`(file: File) => UploadFile` | N
formatResponse | Function | - | Typescript：`(response: any, context: FormatResponseContext) => ResponseType ` `type ResponseType = { error?: string; url?: string } & Record<string, any>` `interface FormatResponseContext { file: UploadFile; currentFiles?: UploadFile[] }`。[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/upload/type.ts) | N
headers | Object | - | Typescript：`{[key: string]: string}` | N
isBatchUpload | Boolean | false | \- | N
max | Number | 0 | \- | N
method | String | POST | options：POST/GET/PUT/OPTION/PATCH/post/get/put/option/patch | N
multiple | Boolean | false | \- | N
name | String | file | \- | N
placeholder | String | - | \- | N
requestMethod | Function | - | Typescript：`(files: UploadFile | UploadFile[]) => Promise<RequestMethodResponse>` `interface RequestMethodResponse { status: 'success' | 'fail'; error?: string; response: { url?: string; [key: string]: any } }`。[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/upload/type.ts) | N
showUploadProgress | Boolean | true | \- | N
sizeLimit | Number / Object | - | Typescript：`number | SizeLimitObj` `interface SizeLimitObj { size: number; unit: SizeUnit ; message?: string }` `type SizeUnitArray = ['B', 'KB', 'MB', 'GB']` `type SizeUnit = SizeUnitArray[number]`。[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/upload/type.ts) | N
theme | String | file | options：custom/file/file-input/file-flow/image/image-flow | N
tips | String | - | \- | N
trigger | String / Slot / Function | - | Typescript：`string | TNode<TriggerContext>` `interface TriggerContext { dragActive?: boolean; uploadingFile?: UploadFile | Array<UploadFile> }`。[see more ts definition](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/upload/type.ts) | N
uploadAllFilesInOneRequest | Boolean | false | \- | N
useMockProgress | Boolean | true | \- | N
withCredentials | Boolean | false | \- | N
onCancelUpload | Function |  | TS 类型：`() => void`<br/> | N
onChange | Function |  | TS 类型：`(value: Array<UploadFile>, context: UploadChangeContext) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/upload/type.ts)。<br/>`interface UploadChangeContext { e?: MouseEvent | ProgressEvent; response?: any; trigger: string; index?: number; file?: UploadFile }`<br/> | N
onDragenter | Function |  | TS 类型：`(context: { e: DragEvent }) => void`<br/> | N
onDragleave | Function |  | TS 类型：`(context: { e: DragEvent }) => void`<br/> | N
onDrop | Function |  | TS 类型：`(context: { e: DragEvent }) => void`<br/> | N
onFail | Function |  | TS 类型：`(options: { e: ProgressEvent; file: UploadFile }) => void`<br/> | N
onPreview | Function |  | TS 类型：`(options: { file: UploadFile; e: MouseEvent }) => void`<br/> | N
onProgress | Function |  | TS 类型：`(options: ProgressContext) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/upload/type.ts)。<br/>`interface ProgressContext { e?: ProgressEvent; file: UploadFile; percent: number; type: UploadProgressType }`<br/><br/>`type UploadProgressType = 'real' | 'mock'`<br/> | N
onRemove | Function |  | TS 类型：`(context: UploadRemoveContext) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/upload/type.ts)。<br/>`interface UploadRemoveContext { index?: number; file?: UploadFile; e: MouseEvent }`<br/> | N
onSelectChange | Function |  | TS 类型：`(files: Array<UploadFile>) => void`<br/> | N
onSuccess | Function |  | TS 类型：`(context: SuccessContext) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/upload/type.ts)。<br/>`interface SuccessContext { e?: ProgressEvent; file?: UploadFile; fileList?: UploadFile[]; response: any }`<br/> | N

### Upload Events

name | params | description
-- | -- | --
cancel-upload | \- | \-
change | `(value: Array<UploadFile>, context: UploadChangeContext)` | [see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/upload/type.ts)。<br/>`interface UploadChangeContext { e?: MouseEvent | ProgressEvent; response?: any; trigger: string; index?: number; file?: UploadFile }`<br/>
dragenter | `(context: { e: DragEvent })` | \-
dragleave | `(context: { e: DragEvent })` | \-
drop | `(context: { e: DragEvent })` | \-
fail | `(options: { e: ProgressEvent; file: UploadFile })` | \-
preview | `(options: { file: UploadFile; e: MouseEvent })` | \-
progress | `(options: ProgressContext)` | [see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/upload/type.ts)。<br/>`interface ProgressContext { e?: ProgressEvent; file: UploadFile; percent: number; type: UploadProgressType }`<br/><br/>`type UploadProgressType = 'real' | 'mock'`<br/>
remove | `(context: UploadRemoveContext)` | [see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/upload/type.ts)。<br/>`interface UploadRemoveContext { index?: number; file?: UploadFile; e: MouseEvent }`<br/>
select-change | `(files: Array<UploadFile>)` | \-
success | `(context: SuccessContext)` | [see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/upload/type.ts)。<br/>`interface SuccessContext { e?: ProgressEvent; file?: UploadFile; fileList?: UploadFile[]; response: any }`<br/>

### UploadFile

name | type | default | description | required
-- | -- | -- | -- | --
lastModified | Number | - | \- | N
name | String | - | \- | N
percent | Number | - | \- | N
raw | Object | - | Typescript：`File` | N
response | Object | - | \- | N
size | Number | - | \- | N
status | String | - | Typescript：` 'success' | 'fail' | 'progress' | 'waiting'` | N
type | String | - | \- | N
url | String | - | required | Y

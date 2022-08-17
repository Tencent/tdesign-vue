:: BASE_DOC ::

## API

### Form Props

name | type | default | description | required
-- | -- | -- | -- | --
colon | Boolean | false | \- | N
data | Object | {} | Typescript：`FormData` | N
disabled | Boolean | undefined | \- | N
errorMessage | Object | - | Typescript：`FormErrorMessage` | N
formControlledComponents | Array | - | Typescript：`Array<string>` | N
labelAlign | String | right | options：left/right/top | N
labelWidth | String / Number | '100px' | \- | N
layout | String | vertical | options：vertical/inline | N
preventSubmitDefault | Boolean | true | \- | N
requiredMark | Boolean | undefined | \- | N
resetType | String | empty | options：empty/initial | N
rules | Object | - | Typescript：`{ [field in keyof FormData]: Array<FormRule> }` | N
scrollToFirstError | String | - | options：smooth/auto | N
showErrorMessage | Boolean | true | \- | N
statusIcon | Boolean / Slot / Function | undefined | Typescript：`boolean | TNode<TdFormItemProps>`。[see more ts definition](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts) | N
submitWithWarningMessage | Boolean | false | \- | N
onReset | Function |  | TS 类型：`(context: { e?: FormResetEvent }) => void`<br/> | N
onSubmit | Function |  | TS 类型：`(context: SubmitContext<FormData>) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/form/type.ts)。<br/>`interface SubmitContext<T extends Data = Data> { e?: FormSubmitEvent; validateResult: FormValidateResult<T>; firstError?: string }`<br/><br/>`type FormValidateResult<T> = boolean | ValidateResultObj<T>`<br/><br/>`type ValidateResultObj<T> = { [key in keyof T]: boolean | ValidateResultList }`<br/><br/>`type ValidateResultList = Array<AllValidateResult>`<br/><br/>`type AllValidateResult = CustomValidateObj | ValidateResultType`<br/><br/>`interface ValidateResultType extends FormRule { result: boolean }`<br/><br/>`type ValidateResult<T> = { [key in keyof T]: boolean | ErrorList }`<br/><br/>`type ErrorList = Array<FormRule>`<br/> | N
onValidate | Function |  | TS 类型：`(result: ValidateResultContext<FormData>) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/form/type.ts)。<br/>`type ValidateResultContext<T> = Omit<SubmitContext<T>, 'e'>`<br/> | N

### Form Events

name | params | description
-- | -- | --
reset | `(context: { e?: FormResetEvent })` | \-
submit | `(context: SubmitContext<FormData>)` | [see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/form/type.ts)。<br/>`interface SubmitContext<T extends Data = Data> { e?: FormSubmitEvent; validateResult: FormValidateResult<T>; firstError?: string }`<br/><br/>`type FormValidateResult<T> = boolean | ValidateResultObj<T>`<br/><br/>`type ValidateResultObj<T> = { [key in keyof T]: boolean | ValidateResultList }`<br/><br/>`type ValidateResultList = Array<AllValidateResult>`<br/><br/>`type AllValidateResult = CustomValidateObj | ValidateResultType`<br/><br/>`interface ValidateResultType extends FormRule { result: boolean }`<br/><br/>`type ValidateResult<T> = { [key in keyof T]: boolean | ErrorList }`<br/><br/>`type ErrorList = Array<FormRule>`<br/>
validate | `(result: ValidateResultContext<FormData>)` | [see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/form/type.ts)。<br/>`type ValidateResultContext<T> = Omit<SubmitContext<T>, 'e'>`<br/>

### FormInstanceFunctions 组件实例方法

name | params | return | description
-- | -- | -- | --
clearValidate | `(fields?: Array<keyof FormData>)` | \- | \-
reset | `(params?: FormResetParams)` | \- | [see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/form/type.ts)。<br/>`interface FormResetParams { type: 'initial' | 'empty'; fields?: Array<keyof FormData> }`<br/>
setValidateMessage | `(message: FormValidateMessage<FormData>)` | \- | [see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/form/type.ts)。<br/>`type FormValidateMessage<FormData> = { [field in keyof FormData]: FormItemValidateMessage[] }`<br/><br/>`interface FormItemValidateMessage { type: 'warning' | 'error'; message: string }`<br/>
submit | \- | \- | \-
validate | `(params?: FormValidateParams)` | `Promise<FormValidateResult<FormData>>` | [see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/form/type.ts)。<br/>`interface FormValidateParams { fields?: Array<string>; trigger?: ValidateTriggerType }`<br/><br/>`type ValidateTriggerType = 'blur' | 'change' | 'all'`<br/>

### FormItem Props

name | type | default | description | required
-- | -- | -- | -- | --
for | String | - | \- | N
help | String / Slot / Function | - | Typescript：`string | TNode`。[see more ts definition](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts) | N
label | String / Slot / Function | '' | Typescript：`string | TNode`。[see more ts definition](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts) | N
labelAlign | String | - | options：left/right/top | N
labelWidth | String / Number | - | \- | N
name | String / Number / Array | - | Typescript：`string | number | Array<string | number>` | N
requiredMark | Boolean | undefined | \- | N
rules | Array | [] | Typescript：`Array<FormRule>` | N
showErrorMessage | Boolean | undefined | \- | N
statusIcon | Boolean / Slot / Function | undefined | Typescript：`boolean | TNode`。[see more ts definition](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts) | N
successBorder | Boolean | false | \- | N

### FormRule

name | type | default | description | required
-- | -- | -- | -- | --
boolean | Boolean | - | \- | N
date | Boolean / Object | - | Typescript：`boolean | IsDateOptions` `interface IsDateOptions { format: string; strictMode: boolean; delimiters: string[] }`。[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/form/type.ts) | N
email | Boolean / Object | - | Typescript：`boolean | IsEmailOptions` `import { IsEmailOptions } from 'validator/es/lib/isEmail'`。[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/form/type.ts) | N
enum | Array | - | Typescript：`Array<string>` | N
idcard | Boolean | - | \- | N
len | Number / Boolean | - | \- | N
max | Number / Boolean | - | \- | N
message | String | - | \- | N
min | Number / Boolean | - | \- | N
number | Boolean | - | \- | N
pattern | Object | - | Typescript：`RegExp` | N
required | Boolean | - | \- | N
telnumber | Boolean | - | \- | N
trigger | String | change | options：change/blur | N
type | String | error | options：error/warning | N
url | Boolean / Object | - | Typescript：`boolean | IsURLOptions` `import { IsURLOptions } from 'validator/es/lib/isURL'`。[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/form/type.ts) | N
validator | Function | - | Typescript：`CustomValidator` `type CustomValidator = (val: ValueType) => CustomValidateResolveType | Promise<CustomValidateResolveType>` `type CustomValidateResolveType = boolean | CustomValidateObj` `interface CustomValidateObj { result: boolean; message: string; type?: 'error' | 'warning' | 'success' }` `type ValueType = any`。[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/form/type.ts) | N

### FormErrorMessage

name | type | default | description | required
-- | -- | -- | -- | --
boolean | String | - | \- | N
date | String | - | \- | N
enum | String | - | \- | N
idcard | String | - | \- | N
len | String | - | \- | N
max | String | - | \- | N
min | String | - | \- | N
number | String | - | \- | N
pattern | String | - | \- | N
required | String | - | \- | N
telnumber | String | - | \- | N
url | String | - | \- | N
validator | String | - | \- | N

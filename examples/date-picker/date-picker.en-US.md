:: BASE_DOC ::

## API

### DatePicker Props

name | type | default | description | required
-- | -- | -- | -- | --
allowInput | Boolean | false | \- | N
clearable | Boolean | false | \- | N
disabled | Boolean | false | \- | N
disableDate | Object / Array / Function | - | Typescript：`DisableDate` `type DisableDate = Array<DateValue> | DisableDateObj | ((date: DateValue) => boolean)` `interface DisableDateObj { from?: string; to?: string; before?: string; after?: string }`。[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/date-picker/type.ts) | N
enableTimePicker | Boolean | false | \- | N
firstDayOfWeek | Number | - | options：1/2/3/4/5/6/7 | N
format | String | undefined | \- | N
inputProps | Object | - | Typescript：`InputProps`，[Input API Documents](./input?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/date-picker/type.ts) | N
mode | String | date | options：year/month/date | N
placeholder | String / Array | undefined | Typescript：`string` | N
popupProps | Object | - | Typescript：`PopupProps`，[Popup API Documents](./popup?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/date-picker/type.ts) | N
prefixIcon | Slot / Function | - | Typescript：`TNode`。[see more ts definition](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts) | N
presets | Object | - | Typescript：`PresetDate` `interface PresetDate { [name: string]: DateValue | (() => DateValue) }`。[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/date-picker/type.ts) | N
presetsPlacement | String | bottom | options：left/top/right/bottom | N
range | Boolean | false | \- | N
suffixIcon | Slot / Function | - | Typescript：`TNode`。[see more ts definition](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts) | N
timePickerProps | Object | - | Typescript：`TimePickerProps`，[TimePicker API Documents](./time-picker?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/date-picker/type.ts) | N
value | String / Number / Array / Date | - | `v-model` is supported。Typescript：`DateValue` `type DateValue = string | number | Date`。[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/date-picker/type.ts) | N
defaultValue | String / Number / Array / Date | - | uncontrolled property。Typescript：`DateValue` `type DateValue = string | number | Date`。[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/date-picker/type.ts) | N
valueType | String | YYYY-MM-DD | \- | N
onBlur | Function |  | TS 类型：`(context: { value: DateValue; e: FocusEvent }) => void`<br/> | N
onChange | Function |  | TS 类型：`(value: DateValue, context: { dayjsValue?: Dayjs, trigger?: DatePickerTriggerSource }) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/date-picker/type.ts)。<br/>`import { Dayjs } from 'dayjs'`<br/><br/>`type DatePickerTriggerSource = 'confirm' | 'pick' | 'enter' | 'preset' | 'clear'`<br/> | N
onFocus | Function |  | TS 类型：`(context: { value: DateValue; e: FocusEvent }) => void`<br/> | N
onInput | Function |  | TS 类型：`(context: { input: string; value: DateValue; e: InputEvent }) => void`<br/> | N
onPick | Function |  | TS 类型：`(value: DateValue) => void`<br/> | N

### DatePicker Events

name | params | description
-- | -- | --
blur | `(context: { value: DateValue; e: FocusEvent })` | \-
change | `(value: DateValue, context: { dayjsValue?: Dayjs, trigger?: DatePickerTriggerSource })` | [see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/date-picker/type.ts)。<br/>`import { Dayjs } from 'dayjs'`<br/><br/>`type DatePickerTriggerSource = 'confirm' | 'pick' | 'enter' | 'preset' | 'clear'`<br/>
focus | `(context: { value: DateValue; e: FocusEvent })` | \-
input | `(context: { input: string; value: DateValue; e: InputEvent })` | \-
pick | `(value: DateValue)` | \-

### DateRangePicker Props

name | type | default | description | required
-- | -- | -- | -- | --
allowInput | Boolean | false | \- | N
clearable | Boolean | false | \- | N
disabled | Boolean / Array | false | Typescript：`boolean | Array<boolean>` | N
disableDate | Object / Array / Function | - | Typescript：`DisableRangeDate` `type DisableRangeDate = Array<DateValue> | DisableDateObj | ((context: { date: DateRangeValue; partial: DateRangePickerPartial }) => boolean)` `interface DisableDateObj { from?: string; to?: string; before?: string; after?: string }` `type DateRangePickerPartial = 'start' | 'end'`。[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/date-picker/type.ts) | N
enableTimePicker | Boolean | false | \- | N
firstDayOfWeek | Number | - | options：1/2/3/4/5/6/7 | N
format | String | 'YYYY-MM-DD' | \- | N
mode | String | date | options：year/month/date | N
placeholder | String / Array | - | Typescript：`string | Array<string>` | N
popupProps | Object | - | Typescript：`PopupProps`，[Popup API Documents](./popup?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/date-picker/type.ts) | N
prefixIcon | Slot / Function | - | Typescript：`TNode`。[see more ts definition](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts) | N
presets | Object | - | Typescript：`PresetRange` `interface PresetRange { [range: string]: DateRange | (() => DateRange)}` `type DateRange = [DateValue, DateValue]`。[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/date-picker/type.ts) | N
presetsPlacement | String | bottom | options：left/top/right/bottom | N
rangeInputProps | Object | - | Typescript：`RangeInputProps`，[RangeInput API Documents](./range-input?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/date-picker/type.ts) | N
separator | String | - | \- | N
size | String | medium | options：small/medium/large | N
suffixIcon | Slot / Function | - | Typescript：`TNode`。[see more ts definition](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts) | N
timePickerProps | Object | - | Typescript：`TimePickerProps`，[TimePicker API Documents](./time-picker?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/date-picker/type.ts) | N
value | Array | - | `v-model` is supported。Typescript：`DateRangeValue` `type DateRangeValue = Array<DateValue>`。[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/date-picker/type.ts) | N
defaultValue | Array | - | uncontrolled property。Typescript：`DateRangeValue` `type DateRangeValue = Array<DateValue>`。[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/date-picker/type.ts) | N
valueType | String | YYYY-MM-DD | \- | N
onBlur | Function |  | TS 类型：`(context: { value: DateRangeValue; partial: DateRangePickerPartial; e: FocusEvent }) => void`<br/> | N
onChange | Function |  | TS 类型：`(value: DateRangeValue, context: { dayjsValue?: Dayjs[], trigger?: DatePickerTriggerSource }) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/date-picker/type.ts)。<br/>`import { Dayjs } from 'dayjs'`<br/> | N
onFocus | Function |  | TS 类型：`(context: { value: DateRangeValue; partial: DateRangePickerPartial; e: FocusEvent }) => void`<br/> | N
onInput | Function |  | TS 类型：`(context: { input: string; value: DateRangeValue; partial: DateRangePickerPartial; e: InputEvent }) => void`<br/> | N
onPick | Function |  | TS 类型：`(value: DateValue, context: PickContext) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/date-picker/type.ts)。<br/>`interface PickContext { e: MouseEvent; partial: DateRangePickerPartial }`<br/> | N

### DateRangePicker Events

name | params | description
-- | -- | --
blur | `(context: { value: DateRangeValue; partial: DateRangePickerPartial; e: FocusEvent })` | \-
change | `(value: DateRangeValue, context: { dayjsValue?: Dayjs[], trigger?: DatePickerTriggerSource })` | [see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/date-picker/type.ts)。<br/>`import { Dayjs } from 'dayjs'`<br/>
focus | `(context: { value: DateRangeValue; partial: DateRangePickerPartial; e: FocusEvent })` | \-
input | `(context: { input: string; value: DateRangeValue; partial: DateRangePickerPartial; e: InputEvent })` | \-
pick | `(value: DateValue, context: PickContext)` | [see more ts definition](https://github.com/Tencent/tdesign-vue/tree/develop/src/date-picker/type.ts)。<br/>`interface PickContext { e: MouseEvent; partial: DateRangePickerPartial }`<br/>

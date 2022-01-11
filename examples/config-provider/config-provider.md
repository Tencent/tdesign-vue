:: BASE_DOC ::

## API
### GlobalConfigProvider

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
calendar | Object | - | 日历组件全局配置。TS 类型：`CalendarConfig`。<br/><br/> | N
cascader | Object | - | 级联选择器全局配置。TS 类型：`CascaderConfig`。<br/><br/> | N
datePicker | Object | - | 日期选择器全局配置。TS 类型：`DatePickerConfig`。<br/><br/> | N
dialog | Object | - | 对话框全局配置。TS 类型：`DialogConfig`。<br/><br/> | N
drawer | Object | - | 抽屉全局配置。TS 类型：`DrawerConfig`。<br/><br/> | N
form | Object | - | 表单组件全局配置。TS 类型：`FormConfig`。<br/><br/> | N
input | Object | - | 输入框组件全局配置。TS 类型：`InputConfig`。<br/><br/> | N
pagination | Object | - | 分页组件全局配置。TS 类型：`PaginationConfig`。<br/><br/> | N
popconfirm | Object | - | 气泡确认框全局配置。TS 类型：`PopconfirmConfig`。<br/><br/> | N
select | Object | - | 选择器组件全局配置。TS 类型：`SelectConfig`。<br/><br/> | N
steps | Object | - | 步骤条组件全局配置。TS 类型：`StepsConfig`。<br/><br/> | N
table | Object | - | 表格组件全局配置。TS 类型：`TableConfig`。<br/><br/> | N
tag | Object | - | 标签全局配置。TS 类型：`TagConfig`。<br/><br/> | N
timePicker | Object | - | 时间选择器全局配置。TS 类型：`TimePickerConfig`。<br/><br/> | N
transfer | Object | - | 穿梭框全局配置。TS 类型：`TransferConfig`。<br/><br/> | N
tree | Object | - | 树组件全局配置。TS 类型：`TreeConfig`。<br/><br/> | N
treeSelect | Object | - | 树选择器组件全局配置。TS 类型：`TreeSelectConfig`。<br/><br/> | N
upload | Object | - | 上传组件全局配置。TS 类型：`UploadConfig`。<br/><br/> | N

### InputConfig

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
placeholder | String | 请输入 | 占位符文本。<br/><br/> | N

### PaginationConfig

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
itemsPerPage | String | '{size} 条/页' | 每页条数文本，示例：`'{ total } / page'`。<br/><br/> | N
jumpTo | String | '跳至' | 页码跳转文本，示例：'jump to'。<br/><br/> | N
page | String | '页' | “页”文本，示例：'page'。<br/><br/> | N
total | String | '共 {total} 项数据' | 数据总条数文本，示例：`'total { total }'`。<br/><br/> | N

### CalendarConfig

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
cellMonth | String | '一月,二月,三月,四月,五月,六月,七月,八月,九月,十月,十一月,十二月' | 月份描述文本。<br/><br/> | N
controllerConfig | Object | - | 日历右上角控制器按钮配置。TS 类型：`CalendarController`。[详细类型定义](https://github.com/Tencent/tdesign-vue/tree/develop/src/config-provider/type.ts)。<br/><br/> | N
fillWithZero | Boolean | true | 当日期数字小于 10 时，是否使用 '0' 填充。<br/><br/> | N
firstDayOfWeek | Number | 1 | 第一天从星期几开始。可选项：1/2/3/4/5/6/7。<br/><br/> | N
hideWeekend | String | '隐藏周末' | “隐藏周末”描述文本。<br/><br/> | N
monthRadio | String | '月' | 模式切换时的“月”描述文本。<br/><br/> | N
monthSelection | String | '{month} 月' | "月"选择描述文本。<br/><br/> | N
showWeekend | String | '显示周末末' | “显示周末”描述文本。<br/><br/> | N
thisMonth | String | '本月' | “本月”描述文本。<br/><br/> | N
today | String | '今天' | “今天”描述文本。<br/><br/> | N
week | String | 一,二,三,四,五,六,日 | 星期描述文本，示例：'周一,周二,周三,周四,周五,周六,周日'。<br/><br/> | N
yearRadio | String | '年' | 模式切换时的“年”描述文本。<br/><br/> | N
yearSelection | String | '{year} 年' | “年”选择描述文本。<br/><br/> | N

### CascaderConfig

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
empty | String | '暂无数据' | 空数据文本，示例：'empty data'。<br/><br/> | N
loadingText | String | '加载中' | “加载中”描述文本。<br/><br/> | N
placeholder | String | '请选择' | 选择器占位文本，示例：'select time'。<br/><br/> | N

### TransferConfig

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
empty | String | '暂无数据' | 空数据描述文本。<br/><br/> | N
placeholder | String | '请输入关键词搜索' | 占位符描述文本。<br/><br/> | N
title | String | '{checked} / {total} 项' | 穿梭框标题描述文本。<br/><br/> | N

### TimePickerConfig

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
anteMeridiem | String | '上午' | “上午”描述文本。<br/><br/> | N
confirm | String | '确定' | “确定”描述文本。<br/><br/> | N
now | String | '此刻' | “此刻”描述文本。<br/><br/> | N
placeholder | String | '请选择时间' | 占位符描述文本。<br/><br/> | N
postMeridiem | String | '下午' | “下午”描述文本。<br/><br/> | N

### DatePickerConfig

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
confirm | String | '确定' | “确定” 描述文本。<br/><br/> | N
dayAriaLabel | String | '日' | “日” 描述文本。<br/><br/> | N
direction | String | 'ltr' | 日期方向，'ltr' 表示从左往右。<br/><br/> | N
firstDayOfWeek | Number | 7 | 第一天从星期几开始。可选项：1/2/3/4/5/6/7。<br/><br/> | N
format | String | 'YYYY-MM-DD' | 日期格式化规则。<br/><br/> | N
months | Array | - | 星期文本描述，默认值：['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']。TS 类型：`string[]`。<br/><br/> | N
nextDecade | String | '下个十年' | “下个十年” 描述文本。<br/><br/> | N
nextMonth | String | '下个月' | “下个月” 描述文本。<br/><br/> | N
nextYear | String | '下一年' | “下一年” 描述文本。<br/><br/> | N
now | String | '此刻' | “now” 描述文本。<br/><br/> | N
placeholder | Object | - | 占位符文本提示，默认值：`{ date: '请选择日期',  month: '请选择月份',  year: '请选择年份' }`。TS 类型：`{ date?: string; month?: string; year?: string }`。<br/><br/> | N
preDecade | String | '上个十年' | “上个十年” 描述文本。<br/><br/> | N
preMonth | String | '上个月' | “上个月” 描述文本。<br/><br/> | N
presets | Object | - | 【暂不支持，讨论确认中】预设快捷日期选择，示例：`{ '元旦': '2021-01-01', '昨天':  dayjs().subtract(1, 'day').format('YYYY-MM-DD'), '特定日期': () => ['2021-02-01'] }`。TS 类型：`ConfigPresetDate`。[详细类型定义](https://github.com/Tencent/tdesign-vue/tree/develop/src/config-provider/type.ts)。<br/><br/> | N
preYear | String | '上一年' | “上一年” 描述文本。<br/><br/> | N
rangeSeparator | String | ' 至 ' | 范围分隔符描述文本，示例：' ~ '。<br/><br/> | N
selectDate | String | '选择日期' | “选择日期” 描述文本。<br/><br/> | N
selectTime | String | '选择时间' | “选择时间” 描述文本。<br/><br/> | N
weekAbbreviation | String | '周' | “周” 描述文本。<br/><br/> | N
weekdays | Object | - | 星期文本描述，默认值：['日', '一', '二', '三', '四', '五', '六']。TS 类型：`string[]`。<br/><br/> | N
yearAriaLabel | String | '年' | “年” 描述文本。<br/><br/> | N

### DialogConfig

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
cancel | Object | - | 取消按钮风格。TS 类型：`string | ButtonProps`。[详细类型定义](https://github.com/Tencent/tdesign-vue/tree/develop/src/config-provider/type.ts)。<br/><br/> | N
confirm | Object | - | 确认按钮风格。TS 类型：`string | ButtonProps`。<br/><br/> | N
confirmBtnTheme | Object | - | 确认按钮主题色，即 Dialog 的 `theme` 和 确认按钮的 `theme` 映射关系。示例：{ danger: 'danger' }。TS 类型：`{ default: string; info: string; warning: string; danger: string; success: string; }`。<br/><br/> | N

### DrawerConfig

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
cancel | String | '取消' | “取消”描述文本。TS 类型：`string | ButtonProps`。<br/><br/> | N
confirm | String | '确认' | “确认”描述文本。TS 类型：`string | ButtonProps`。<br/><br/> | N

### PopconfirmConfig

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
cancel | String / Object | '取消' | “取消”描述文本。TS 类型：`string | ButtonProps`。[详细类型定义](https://github.com/Tencent/tdesign-vue/tree/develop/src/config-provider/type.ts)。<br/><br/> | N
confirm | String / Object | '确定' | “确定”描述文本。TS 类型：`string | ButtonProps`。<br/><br/> | N
confirmBtnTheme | Object | - | 确认按钮主题色，即 Popconfirm 的 `theme` 和 确认按钮的 `theme` 映射关系。示例：{ danger: 'danger' }。TS 类型：`{ default: string; warning: string; danger: string; }`。<br/><br/> | N

### TableConfig

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
empty | String | '暂无数据' | “暂无数据”描述文本。<br/><br/> | N
expandIcon | Function | undefined | 展开和收起图标（配置传入收起图标即可），如果没有配置，组件会内置默认图标。【注意】使用渲染函数输出图标组件。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
sortIcon | Function | undefined | 排序图标（配置传入降序图标即可），如果没有配置，组件会内置默认图标。【注意】使用渲染函数输出图标组件。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N

### SelectConfig

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
clearIcon | Function | - | 清除图标，【注意】使用渲染函数输出图标组件。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N
empty | String | '暂无数据' | “暂无数据”描述文本。<br/><br/> | N
loadingText | String | '加载中' | “加载中”描述文本。<br/><br/> | N
placeholder | String | '请选择' | 占位符描述文本。<br/><br/> | N

### TreeConfig

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
empty | String | '暂无数据' | “暂无数据”描述文本。<br/><br/> | N
folderIcon | Function | - | 目录层级图标，传入收起状态图标即可。【注意】使用渲染函数输出图标组件。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N

### TreeSelectConfig

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
empty | String | '暂无数据' | “暂无数据”描述文本。<br/><br/> | N
loadingText | String | '加载中' | “加载中”描述文本。<br/><br/> | N

### UploadConfig

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
cancelUploadText | String | '取消上传' | “取消上传” 描述文本。<br/><br/> | N
sizeLimitMessage | String | '文件大小不能超过 {sizeLimit}' | 文件大小超出限制时提醒文本。<br/><br/> | N

### FormConfig

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
requiredMark | Boolean | true | 是否显示必填符号，默认显示。<br/><br/> | N

### TagConfig

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
closeIcon | Function | - | 关闭图标，【注意】使用渲染函数输出图标组件。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N

### StepsConfig

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
errorIcon | Slot / Function | - | 错误步骤图标，【注意】使用渲染函数输出图标组件。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-vue/blob/develop/src/common.ts)。<br/><br/> | N

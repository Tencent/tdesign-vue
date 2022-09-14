/** 常量 */
// 非法日期的标识
export const INVALID_DATE = 'Invalid Date';
// 最小年份
export const MIN_YEAR = 1970;
// 每年首月份
export const FIRST_MONTH_OF_YEAR = 1;
// 每年最后一个月份
export const LAST_MONTH_OF_YEAR = 12;

/** 默认值 */
// 默认的日期字符串格式
export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';
// 默认模式值
export const DEFAULT_MODE = 'month';
// 默认周起始日
export const DEFAULT_FIRST_DAY_OF_WEEK = 1;
// 默认风格类型
export const DEFAULT_THEME = 'full';
// 年历中每一行显示的月数量
export const DEFAULT_YEAR_CELL_NUMINROW = 4;

/** 数据源 */
// 日历组件风格的可选值
export const THEME_LIST: string[] = ['full', 'card'];
// 日历组件模式的可选值
export const MODE_LIST: string[] = ['month', 'year'];
// 日历组件首列星期的可选值
export const FIRST_DAY_OF_WEEK_LIST: number[] = [1, 2, 3, 4, 5, 6, 7];

// 星期的显示值
export const DAY_CN_MAP: Record<string, string> = {
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
  7: '日',
};
// 月份的显示值
export const MONTH_CN_MAP: Record<string, string> = {
  1: '一月',
  2: '二月',
  3: '三月',
  4: '四月',
  5: '五月',
  6: '六月',
  7: '七月',
  8: '八月',
  9: '九月',
  10: '十月',
  11: '十一月',
  12: '十二月',
};

export default {
  INVALID_DATE,
  MIN_YEAR,
  FIRST_MONTH_OF_YEAR,
  LAST_MONTH_OF_YEAR,

  DEFAULT_DATE_FORMAT,
  DEFAULT_MODE,
  DEFAULT_FIRST_DAY_OF_WEEK,
  DEFAULT_THEME,
  DEFAULT_YEAR_CELL_NUMINROW,

  MODE_LIST,
  FIRST_DAY_OF_WEEK_LIST,

  THEME_LIST,
  DAY_CN_MAP,
  MONTH_CN_MAP,
};

import { prefix } from '../config';

export const componentName = `${prefix}-time-picker`;

export const AM = 'AM';
export const PM = 'PM';

export const MERIDIEM_LIST = [AM, PM];

// 上下午前置
export const AM_FORMAT = /^(a|A)\s+?[h]{1,2}(:[m]{1,2}(:[s]{1,2})?)?$/;
// 上下午后置
export const PM_Format = /^[h]{1,2}(:[m]{1,2}(:[s]{1,2})?)?(\s+(a|A))?$/;

export const TIME_PICKER_EMPTY: Array<undefined> = [undefined, undefined];

export const EMPTY_VALUE = -1;

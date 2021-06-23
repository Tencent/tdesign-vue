import { prefix } from '../config';

export const componentName = `${prefix}-time-picker`;

export enum EPickerCols {
    zh = 'zh-cn',
    hour = 'hour',
    minute = 'minute',
    second = 'second',
    en = 'en'
}

export const AM = 'AM';
export const PM = 'PM';

export const zhList = ['上午', '下午'];
export const enList = [AM, PM];
export const pmList = ['下午', PM];
export const amList = ['上午', AM];

export const meridiemZHList = [
  {
    label: '上午',
    value: AM,
  },
  {
    label: '下午',
    value: PM,
  },
];

export const meridiemENList = [
  {
    label: AM,
    value: AM,
  },
  {
    label: PM,
    value: PM,
  },
];
// 上下午前置
export const meridiemBeforeFormatREG = /^(a|A)\s+?[hH]{1,2}(:[m]{1,2}(:[s]{1,2})?)?$/;
// 上下午后置
export const meridiemAfterFormatREG = /^[hH]{1,2}(:[m]{1,2}(:[s]{1,2})?)?(\s+(a|A))?$/;

export const TIME_PICKER_EMPTY: Array<undefined> = [undefined, undefined];

export enum KEYBOARD_DIRECTION {
   left = 37,
   up = 38,
   right = 39,
   down = 40
}

export const EMPTY_VALUE = -1;

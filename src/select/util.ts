/* eslint-disable no-restricted-syntax */
import cloneDeep from 'lodash/cloneDeep';
import {
  SelectOption, SelectOptionGroup, SelectValue, TdOptionProps, TdSelectProps,
} from './type';

export const getSingleContent = (value: TdSelectProps['value'], options: SelectOption[]): string => {
  for (const option of options) {
    if ((option as TdOptionProps).value === value) {
      // 保底使用 value 作为显示
      return option?.label || String((option as TdOptionProps).value);
    }
  }
  return value !== undefined && value !== null ? String(value) : undefined;
};

export const getMultipleContent = (value: SelectValue[], options: SelectOption[]) => {
  const res: string[] = [];
  for (const iterator of value) {
    const resLabel = getSingleContent(iterator, options);
    if (resLabel) {
      res.push(resLabel);
    }
  }
  return res;
};

export const getNewMultipleValue = (innerValue: SelectValue[], optionValue: SelectValue) => {
  const value = cloneDeep(innerValue) as SelectValue[];
  const valueIndex = value.indexOf(optionValue);
  if (valueIndex < 0) {
    value.push(optionValue);
  } else {
    value.splice(valueIndex, 1);
  }
  return {
    value,
    isCheck: valueIndex < 0,
  };
};

export const getAllSelectableOption = (options: TdOptionProps[]) => options.filter((option) => !option.disabled && !option.checkAll);

/** 将 options 扁平化，拍扁所有 group */
export const flattenOptions = (options: (TdOptionProps & { isCreated?: boolean })[]): SelectOption[] => options.reduce((acc, current) => {
  acc.push((current as SelectOptionGroup).group ? flattenOptions((current as SelectOptionGroup).children) : current);
  return acc;
}, [] as SelectOption[]);

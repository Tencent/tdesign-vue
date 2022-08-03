/* eslint-disable no-restricted-syntax */
import cloneDeep from 'lodash/cloneDeep';
import {
  SelectOption, SelectValue, TdOptionProps, TdSelectProps,
} from './type';

export const getSingleContent = (value: TdSelectProps['value'], options: SelectOption[]): string => {
  for (const option of options) {
    if ((option as TdOptionProps).value === value) {
      return option?.label;
    }
  }
  return value as string;
};

export const getMultipleContent = (value: SelectValue[], options: SelectOption[]) => {
  const res = [];
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

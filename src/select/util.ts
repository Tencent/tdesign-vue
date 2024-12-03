/* eslint-disable no-restricted-syntax */
import cloneDeep from 'lodash/cloneDeep';
import {
  SelectOption, SelectOptionGroup, SelectValue, TdOptionProps, TdSelectProps,
} from './type';

export const getSingleContent = (
  value: TdSelectProps['value'],
  optionsMap: Map<SelectValue<SelectOption>, TdOptionProps>,
): string => {
  const option = optionsMap.get(value);
  return option?.label || value?.toString();
};

export const getMultipleContent = (value: SelectValue[], optionsMap: Map<SelectValue<SelectOption>, TdOptionProps>) => {
  const res: string[] = [];
  for (const iterator of value) {
    const resLabel = getSingleContent(iterator, optionsMap);
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
export const flattenOptions = (options: (TdOptionProps & { isCreated?: boolean })[]): SelectOption[] => options.reduce(
  (acc, current) => acc.concat(
    (current as SelectOptionGroup).group ? flattenOptions((current as SelectOptionGroup).children) : [current],
  ),
    [] as SelectOption[],
);

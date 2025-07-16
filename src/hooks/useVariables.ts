import { ref } from '@vue/composition-api';
import type { Ref } from '@vue/composition-api';
import { isString } from 'lodash-es';
import { getColorTokenColor } from '../_common/js/utils/getColorTokenColor';
import { THEME_MODE } from '../_common/js/common';
import useMutationObservable from './useMutationObservable';

/**
 * useVariables
 * @param variable CSS 变量名
 * @example
 *  单个变量：const textColor = useVariables('--td-color-primary');
 *
 *  多个变量（一）：
 *   const variables = useVariables('--td-color-primary','--td-brand-color');
 *   const textColor = variables['--td-color-primary'];
 *   const brandColor = variables['--td-brand-color'];
 *
 *  多个变量（二）：
 *   const { textColor, brandColor } = useVariables({
 *      textColor: '--td-color-primary',
 *      brandColor: '--td-brand-color',
 *   });
 */
export function useVariables(variable: string): Ref<string>;
export function useVariables(variables: string[]): Record<string, Ref<string>>;
export function useVariables(variables: Record<string, string>): Record<string, Ref<string>>;
export function useVariables(
  variables: string | string[] | Record<string, string>,
): Ref<string> | Record<string, Ref<string>> {
  const values: Record<string, Ref<string>> = {};
  let varsArray: string[] = [];

  if (isString(variables)) {
    varsArray = [variables];
  } else if (Array.isArray(variables)) {
    varsArray = variables;
  } else {
    varsArray = Object.values(variables);
    Object.entries(variables).forEach(([key, varName]) => {
      values[key] = ref(getColorTokenColor(varName));
    });
  }

  varsArray.forEach((varName) => {
    values[varName] = ref(getColorTokenColor(varName));
  });

  const targetElement = document?.documentElement;
  useMutationObservable(targetElement, (mutationsList) => {
    mutationsList.some((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === THEME_MODE) {
        if (isString(variables) || Array.isArray(variables)) {
          varsArray.forEach((varName) => {
            values[varName].value = getColorTokenColor(varName);
          });
        } else {
          Object.entries(variables).forEach(([key, varName]) => {
            values[key].value = getColorTokenColor(varName);
          });
        }
        return true;
      }
      return false;
    });
  });

  if (isString(variables)) {
    return values[variables];
  }
  if (Array.isArray(variables)) {
    return values;
  }
  return values;
}

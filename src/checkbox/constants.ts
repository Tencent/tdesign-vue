import { ComputedRef, InjectionKey } from 'vue';
import { TdCheckboxProps } from './type';

export interface CheckboxGroupInjectData {
  handleCheckboxChange: (data: { checked: boolean; e: Event; option: TdCheckboxProps }) => void;
  onCheckedChange: (p: { checked: boolean; checkAll: boolean; e: Event; option: TdCheckboxProps }) => void;
}

export const CheckboxGroupInjectionKey: InjectionKey<ComputedRef<CheckboxGroupInjectData>> = Symbol('CheckboxGroupProvide');

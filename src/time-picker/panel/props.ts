import { PropType } from 'vue';

import { TdTimePickerProps } from '../../time-picker';
import * as Props from '../props';

export const panelProps = () => ({
  disabled: {
    type: Boolean,
    default: false,
  },
  isFocus: {
    type: Boolean,
    default: false,
  },
  value: {
    type: String,
    default: '',
  },
  format: {
    type: String,
    default: 'HH:mm:ss',
  },
  steps: {
    type: Array as PropType<Array<string | number>>,
    default: () => [1, 1, 1],
  },
  isShowPanel: {
    type: Boolean,
    default: true,
  },
  activeIndex: {
    type: Number,
  },
  presets: {
    type: Object as PropType<TdTimePickerProps['presets']>,
  },
  hideDisabledTime: {
    ...Props.default.hideDisabledTime,
  },
  isFooterDisplay: {
    type: Boolean,
    default: false,
  },
});

export const panelColProps = () => ({
  format: {
    type: String,
    default: 'HH:mm:ss',
  },
  value: {
    type: String,
    default: '',
  },
  steps: {
    type: Array as PropType<Array<string | number>>,
    default: () => [1, 1, 1],
  },
  hideDisabledTime: {
    ...Props.default.hideDisabledTime,
  },
});

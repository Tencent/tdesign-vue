import { PropType } from 'vue';

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
    default: false,
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

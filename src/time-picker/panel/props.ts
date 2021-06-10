import { PropType } from 'vue';
import dayjs from 'dayjs';

import { BooleanType } from '../props';
import * as Props from '../../../types/time-picker/props';
import { EPickerCols } from '../constant';

const ElementRefType = {
  type: typeof Element === 'undefined' ? Object : Element,
  ...({
    default: null,
  }),
};

export const panelProps = () => ({
  disabled: {
    ...BooleanType,
    ...({
      default: false,
    }),
  },
  isFocus: {
    ...BooleanType,
    ...({
      default: false,
    }),
  },
  refDom: {
    ...ElementRefType,
  },
  dayjs: {
    type: Array as PropType<Array<dayjs.Dayjs | undefined>>,
    default: () => [dayjs()] as Array<dayjs.Dayjs | undefined>,
  },
  format: {
    type: String,
    default: 'a HH:mm:ss',
  },
  steps: {
    type: Array as PropType<Array<string | number>>,
    ...({
      default: [1, 1, 1],
    }),
  },
  isShowPanel: {
    ...BooleanType,
    ...({
      default: false,
    }),
  },
  hideDisabledTime: {
    ...Props.default.hideDisabledTime,
  },
  disableTime: {
    ...Props.default.disableTime,
  },
});


export const panelColProps = () => ({
  format: {
    type: String,
    default: 'a HH:mm:ss',
  },
  cols: {
    type: Array as PropType<Array<EPickerCols>>,
    default: () => [EPickerCols.zh, EPickerCols.hour, EPickerCols.minute, EPickerCols.second],
  },
  value: {
    type: Object as PropType<dayjs.Dayjs>,
    ...({
      default: () => (dayjs()),
    }),
  },
  range: {
    type: Array as PropType<Array<dayjs.Dayjs>>,
    default: () => [] as Array<dayjs.Dayjs>,
  },
  steps: {
    type: Array as PropType<Array<string | number>>,
    ...({
      default: [1, 1, 1],
    }),
  },
  hideDisabledTime: {
    ...Props.default.hideDisabledTime,
  },
  disableTime: {
    ...Props.default.disableTime,
  },
});

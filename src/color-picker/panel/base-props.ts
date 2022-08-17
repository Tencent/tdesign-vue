import { PropType } from 'vue';
import { TdColorHandler } from '../interfaces';
import { Color } from '../utils';

export default {
  /** 是否禁用组件 */
  disabled: Boolean,
  /** Color Instance */
  color: {
    type: Object as PropType<Color>,
  },
  handleChange: {
    type: Function as PropType<TdColorHandler>,
    default: () => () => {},
  },
};

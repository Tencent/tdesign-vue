import {
  defineComponent, PropType, reactive, watch,
} from '@vue/composition-api';
import { throttle } from 'lodash-es';
import { TdColorHandler } from '../../interfaces';
import props from '../../props';
import { Color, getColorFormatInputs, getColorFormatMap } from '../../utils';
import { Select as TSelect, Option as TOption } from '../../../select';
import TInput from '../../../input';
import TInputNumber from '../../../input-number';

export default defineComponent({
  name: 'FormatInputs',
  components: {
    TSelect,
    TOption,
    TInput,
    TInputNumber,
  },
  inheritAttrs: false,
  props: {
    ...props,
    color: {
      type: Object as PropType<Color>,
    },
    handleFormatInputChange: {
      type: Function as PropType<TdColorHandler>,
      default: () => () => {},
    },
  },
  setup(props) {
    // 这些值需要初始化一下
    const modelValues = reactive<any>({
      r: 0,
      g: 0,
      b: 0,
      a: 0,
      c: 0,
      m: 0,
      y: 0,
      k: 0,
      h: 0,
      l: 0,
      s: 0,
      v: 0,
      hex: '',
      css: '',
    });
    const lastModelValue = reactive<any>({});

    // 更新 modelValues
    const updateModelValue = () => {
      const { format, color } = props;
      const values = getColorFormatMap(color, 'encode')[format];
      // @ts-ignore
      values.a = Math.round(color.alpha * 100);
      Object.keys(values).forEach((key) => {
        // @ts-ignore
        modelValues[key] = values[key];
        // @ts-ignore
        lastModelValue[key] = values[key];
      });
    };

    updateModelValue();
    const throttleUpdate = throttle(updateModelValue, 100);

    watch(() => {
      const {
        saturation, hue, value, alpha,
      } = props.color;
      return [saturation, hue, value, alpha, props.format];
    }, throttleUpdate);

    const handleChange = (key: string, v: number | string) => {
      if (v === lastModelValue[key]) return;

      if (key === 'a') {
        // eslint-disable-next-line vue/no-mutating-props, no-param-reassign
        props.color.alpha = (v as number) / 100;
      } else {
        props.color.update(v as string);
      }
      const value = getColorFormatMap(props.color, 'decode')[props.format];
      props.handleFormatInputChange(value, props.color.alpha, key, v);
    };

    return {
      modelValues,
      handleChange,
    };
  },
  render() {
    const inputProps = {
      ...((this.inputProps as any) || {}),
    };
    return (
      <div class="input-group">
        {getColorFormatInputs(this.format, this.enableAlpha).map((config) => (
          <div
            class="input-group__item"
            key={config.key}
            style={{
              flex: config.flex || 1,
            }}
          >
            {config.type === 'input' ? (
              <t-input
                {...inputProps}
                align="center"
                size="small"
                disabled={this.disabled}
                v-model={this.modelValues[config.key]}
                maxlength={this.format === 'HEX' ? 9 : undefined}
                title={this.modelValues[config.key]}
                onBlur={(v: string) => this.handleChange(config.key, v)}
                onEnter={(v: string) => this.handleChange(config.key, v)}
              />
            ) : (
              <t-input-number
                {...inputProps}
                align="center"
                theme="normal"
                size="small"
                disabled={this.disabled}
                v-model={this.modelValues[config.key]}
                title={this.modelValues[config.key]}
                min={config.min}
                max={config.max}
                step={1}
                format={config.format}
                onBlur={(v: number) => this.handleChange(config.key, v)}
                onEnter={(v: number) => this.handleChange(config.key, v)}
              />
            )}
          </div>
        ))}
      </div>
    );
  },
});

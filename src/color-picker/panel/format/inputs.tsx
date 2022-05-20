import {
  computed, defineComponent, PropType, reactive, watch,
} from '@vue/composition-api';
import throttle from 'lodash/throttle';
import { TdColorHandler } from '../../interfaces';
import props from '../../props';
import { Color } from '../../utils';
import { Select as TSelect, Option as TOption } from '../../../select';
import TInput from '../../../input';
import TInputNumber from '../../../input-number';
import { FORMAT_INPUT_CONFIG } from './config';

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
    const inputConfigs = computed(() => {
      const configs = [...FORMAT_INPUT_CONFIG[props.format]];
      if (props.enableAlpha) {
        configs.push({
          type: 'inputNumber',
          key: 'a',
          min: 0,
          max: 100,
          format: (value: number) => `${value}%`,
          flex: 1.15,
        });
      }
      return configs;
    });

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

    /**
     * 获取不同格式的输入输出值
     * @param type 'encode' | 'decode'
     * @returns
     */
    const getFormatColorMap = (type: 'encode' | 'decode') => {
      const { color } = props;
      if (type === 'encode') {
        return {
          HSV: color.getHsva(),
          HSL: color.getHsla(),
          RGB: color.getRgba(),
          CMYK: color.getCmyk(),
          CSS: {
            css: color.css,
          },
          HEX: {
            hex: color.hex,
          },
        };
      }
      // decode
      return {
        HSV: Color.object2color(modelValues, 'HSV'),
        HSL: Color.object2color(modelValues, 'HSL'),
        RGB: Color.object2color(modelValues, 'RGB'),
        CMYK: Color.object2color(modelValues, 'CMYK'),
        CSS: modelValues.css,
        HEX: modelValues.hex,
      };
    };

    // 更新modelValues
    const updateModelValue = () => {
      const { format, color } = props;
      const values: any = getFormatColorMap('encode')[format];
      values.a = Math.round(color.alpha * 100);
      Object.keys(values).forEach((key) => {
        modelValues[key] = values[key];
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
      if (v === lastModelValue[key]) {
        return;
      }
      const value = getFormatColorMap('decode')[props.format];
      props.handleFormatInputChange(value, modelValues.a / 100, key, v);
    };

    return {
      modelValues,
      inputConfigs,
      handleChange,
    };
  },
  render() {
    const inputProps = {
      ...((this.inputProps as any) || {}),
    };
    return (
      <div class="input-group">
        {this.inputConfigs.map((config) => (
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

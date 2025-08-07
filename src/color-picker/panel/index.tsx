import {
  computed, defineComponent, ref, toRefs, watch,
} from '@vue/composition-api';
import useCommonClassName from '../../hooks/useCommonClassName';
import { useConfig } from '../../hooks/useConfig';
import useDefaultValue from '../../hooks/useDefaultValue';
import useVModel from '../../hooks/useVModel';
import { useBaseClassName } from '../hooks';
import type { TdColorModes } from '../interfaces';
import props from '../props';
import type { ColorPickerChangeTrigger } from '../type';
import {
  Color,
  DEFAULT_COLOR,
  DEFAULT_LINEAR_GRADIENT,
  DEFAULT_SYSTEM_SWATCH_COLORS,
  getColorObject,
  GradientColorPoint,
  initColorFormat,
  TD_COLOR_USED_COLORS_MAX_SIZE,
  type ColorFormat,
} from '../utils';
import AlphaSlider from './alpha';
import FormatPanel from './format';
import PanelHeader from './header';
import HueSlider from './hue';
import LinearGradient from './linear-gradient';
import SaturationPanel from './saturation';
import SwatchesPanel from './swatches';

export default defineComponent({
  name: 'ColorPanel',
  components: {
    PanelHeader,
    LinearGradient,
    SaturationPanel,
    HueSlider,
    AlphaSlider,
    FormatPanel,
    SwatchesPanel,
  },
  props: {
    ...props,
  },
  setup(props) {
    const baseClassName = useBaseClassName();
    const { statusClassNames } = useCommonClassName();
    const { t, global } = useConfig('colorPicker');
    const { value: inputValue, recentColors } = toRefs(props);
    const [innerValue, setInnerValue] = useVModel(inputValue, props.defaultValue, props.onChange, 'change');

    const getModeByColor = (input: string) => {
      if (props.colorModes.length === 1) return props.colorModes[0];
      return props.colorModes.includes('linear-gradient') && Color.isGradientColor(input)
        ? 'linear-gradient'
        : 'monochrome';
    };
    const mode = ref<TdColorModes>(getModeByColor(innerValue.value));

    const isGradient = computed(() => mode.value === 'linear-gradient');
    const defaultEmptyColor = computed(() => (isGradient.value ? DEFAULT_LINEAR_GRADIENT : DEFAULT_COLOR));

    const color = ref<Color>(new Color(innerValue.value || defaultEmptyColor.value));

    const formatModel = ref<ColorFormat>(initColorFormat(props.format, props.enableAlpha));

    const [recentlyUsedColors, setRecentlyUsedColors] = useDefaultValue(
      recentColors,
      props.defaultRecentColors,
      props.onRecentColorsChange,
      'recentColors',
      'recentColorsChange',
    );

    /**
     * 添加最近使用颜色
     * @returns void
     */
    const addRecentlyUsedColor = () => {
      if (recentlyUsedColors.value === null || recentlyUsedColors.value === false) {
        return;
      }
      const colors = (recentlyUsedColors.value as string[]) || [];
      const currentColor = color.value.isGradient ? color.value.linearGradient : color.value.rgba;
      const index = colors.indexOf(currentColor);
      if (index > -1) {
        colors.splice(index, 1);
      }
      colors.unshift(currentColor);
      if (colors.length > TD_COLOR_USED_COLORS_MAX_SIZE) {
        colors.length = TD_COLOR_USED_COLORS_MAX_SIZE;
      }
      handleRecentlyUsedColorsChange(colors);
    };

    /**
     * 最近使用颜色变更时触发
     * @param colors
     */
    const handleRecentlyUsedColorsChange = (colors: string[]) => {
      recentlyUsedColors.value = colors;
      setRecentlyUsedColors(colors);
    };

    /**
     * onChange
     * @param trigger
     */
    const emitColorChange = (trigger?: ColorPickerChangeTrigger) => {
      const value = color.value.getFormattedColor(props.format, props.enableAlpha);
      setInnerValue(value, {
        color: getColorObject(color.value),
        trigger: trigger || 'palette-saturation-brightness',
      });
    };

    watch(
      () => innerValue.value,
      (newColor: string) => {
        const newMode = getModeByColor(newColor);
        mode.value = newMode;
        color.value.isGradient = newMode === 'linear-gradient';
        const currentColor = color.value.getFormattedColor(formatModel.value, props.enableAlpha);
        if (currentColor !== newColor) {
          color.value.update(newColor);
        }
      },
    );

    /**
     * mode change
     * @param newMode
     * @returns
     */
    const handleModeChange = (newMode: TdColorModes) => {
      mode.value = newMode;

      const isGradientMode = newMode === 'linear-gradient';
      color.value.isGradient = isGradientMode;

      if (isGradientMode) {
        color.value.update(
          color.value.gradientColors.length > 0 ? color.value.linearGradient : DEFAULT_LINEAR_GRADIENT,
        );
      } else {
        color.value.update(color.value.rgba);
      }
      emitColorChange();
    };

    /**
     * 饱和度亮度变化
     */
    const handleSatAndValueChange = ({ saturation, value }: { saturation: number; value: number }) => {
      const { saturation: sat, value: val } = color.value;
      let changeTrigger: ColorPickerChangeTrigger = 'palette-saturation-brightness';
      if (value !== val && saturation !== sat) {
        color.value.saturation = saturation;
        color.value.value = value;
        changeTrigger = 'palette-saturation-brightness';
      } else if (saturation !== sat) {
        color.value.saturation = saturation;
        changeTrigger = 'palette-saturation';
      } else if (value !== val) {
        color.value.value = value;
        changeTrigger = 'palette-brightness';
      } else {
        return;
      }
      emitColorChange(changeTrigger);
    };

    /**
     * 色相变化
     * @param hue
     */
    const handleHueChange = (hue: number) => {
      color.value.hue = hue;
      emitColorChange('palette-hue-bar');
      props.onPaletteBarChange?.({
        color: getColorObject(color.value),
      });
    };

    /**
     * 透明度变化
     * @param alpha
     */
    const handleAlphaChange = (alpha: number) => {
      color.value.alpha = alpha;
      emitColorChange('palette-alpha-bar');
    };

    /**
     * 输入框触发改变
     * @param input
     * @param alpha
     */
    const handleInputChange = (input: string) => {
      color.value.update(input);
      emitColorChange('input');
    };

    /**
     * 渐变改变
     * @param param0
     */
    const handleGradientChange = ({
      key,
      payload,
    }: {
      key: 'degree' | 'selectedId' | 'colors';
      payload: number | string | GradientColorPoint[];
    }) => {
      let trigger: ColorPickerChangeTrigger = 'palette-saturation-brightness';
      switch (key) {
        case 'degree':
          color.value.gradientDegree = payload as number;
          trigger = 'input';
          break;
        case 'selectedId':
          color.value.gradientSelectedId = payload as string;
          break;
        case 'colors':
          color.value.gradientColors = payload as GradientColorPoint[];
          break;
      }
      emitColorChange(trigger);
    };

    /**
     * 色块点击
     * @param type
     * @param value
     */
    const handleSetColor = (value: string, trigger: ColorPickerChangeTrigger) => {
      const newMode = getModeByColor(value);
      mode.value = newMode;
      color.value.isGradient = newMode === 'linear-gradient';
      color.value.update(value);
      emitColorChange(trigger);
    };

    // 预览颜色
    const previewColorStyle = computed(() => mode.value === 'linear-gradient' ? color.value.linearGradient : color.value.rgba);

    return {
      baseClassName,
      statusClassNames,
      t,
      global,
      color,
      mode,
      isGradient,
      formatModel,
      recentlyUsedColors,
      previewColorStyle,
      addRecentlyUsedColor,
      handleModeChange,
      handleSatAndValueChange,
      handleHueChange,
      handleAlphaChange,
      handleGradientChange,
      handleSetColor,
      handleInputChange,
      handleRecentlyUsedColorsChange,
    };
  },
  render() {
    const {
      baseClassName, statusClassNames, t, global, swatchColors, previewColorStyle, isGradient, colorModes,
    } = this;

    // 只支持渐变模式
    const onlySupportGradient = colorModes.length === 1 && colorModes.includes('linear-gradient');

    // 最近使用颜色
    let recentColors = this.recentlyUsedColors;
    if (onlySupportGradient && Array.isArray(recentColors)) {
      recentColors = recentColors.filter((color) => Color.isGradientColor(color));
    }
    const showUsedColors = Array.isArray(this.recentlyUsedColors) || this.recentlyUsedColors === true;

    // 系统预设颜色
    let systemColors = swatchColors;
    if (systemColors === undefined) {
      systemColors = [...DEFAULT_SYSTEM_SWATCH_COLORS];
    }
    if (onlySupportGradient) {
      systemColors = systemColors?.filter((color) => Color.isGradientColor(color));
    }
    const showSystemColors = Array.isArray(systemColors) && systemColors.length > 0;

    const renderSwatches = () => {
      if (!showSystemColors && !showUsedColors) {
        return null;
      }
      return (
        <div class={`${baseClassName}__swatches-wrap`}>
          {showUsedColors ? (
            <swatches-panel
              color={this.color}
              disabled={this.disabled}
              title={t(global.recentColorTitle)}
              editable
              colors={this.recentlyUsedColors}
              handleAddColor={this.addRecentlyUsedColor}
              handleSetColor={(color: string) => this.handleSetColor(color, 'recent')}
              handleChange={this.handleRecentlyUsedColorsChange}
            />
          ) : null}
          {showSystemColors ? (
            <swatches-panel
              color={this.color}
              disabled={this.disabled}
              title={t(global.swatchColorTitle)}
              colors={systemColors}
              handleSetColor={(color: string) => this.handleSetColor(color, 'preset')}
            />
          ) : null}
        </div>
      );
    };

    return (
      <div class={[`${baseClassName}__panel`, this.disabled ? statusClassNames.disabled : false]}>
        <panel-header
          {...{
            props: {
              ...this.$props,
            },
          }}
          mode={this.mode}
          handleModeChange={this.handleModeChange}
        />
        <div class={[`${baseClassName}__body`]}>
          {isGradient ? (
            <linear-gradient
              color={this.color}
              disabled={this.disabled}
              handleChange={this.handleGradientChange}
              enableMultipleGradient={this.enableMultipleGradient}
            />
          ) : null}
          <saturation-panel color={this.color} disabled={this.disabled} handleChange={this.handleSatAndValueChange} />
          <div class={[`${baseClassName}__sliders-wrapper`]}>
            <div class={[`${baseClassName}__sliders`]}>
              <hue-slider color={this.color} disabled={this.disabled} handleChange={this.handleHueChange} />
              {this.enableAlpha ? (
                <alpha-slider color={this.color} disabled={this.disabled} handleChange={this.handleAlphaChange} />
              ) : null}
            </div>
            {this.showPrimaryColorPreview ? (
              <div class={[`${baseClassName}__sliders-preview`, `${baseClassName}--bg-alpha`]}>
                <span
                  class={`${baseClassName}__sliders-preview-inner`}
                  style={{
                    background: previewColorStyle,
                  }}
                />
              </div>
            ) : null}
          </div>

          <format-panel
            {...{
              props: {
                ...this.$props,
                format: this.formatModel,
              },
            }}
            color={this.color}
            handleFormatInputChange={this.handleInputChange}
          />
          {renderSwatches()}
        </div>
      </div>
    );
  },
});

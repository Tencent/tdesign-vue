import { computed, defineComponent } from '@vue/composition-api';
import { isNumber } from 'lodash-es';
import { usePrefixClass, useConfig, useVariables } from '../hooks';
import { renderTNodeJSX } from '../utils/render-tnode';
import { DEFAULT_FRONT_COLOR } from '../_common/js/qrcode/utils';
import props from './props';

import QRCodeCanvas from './components/QRCodeCanvas';
import QRCodeSVG from './components/QRCodeSVG';
import QRcodeStatus from './components/QRCodeStatus';

import type { ImageSettings } from '../_common/js/qrcode/types';

export default defineComponent({
  name: 'TQrcode',
  props,
  setup(props) {
    const classPrefix = usePrefixClass();
    const { globalConfig } = useConfig('qrcode');

    const { themeFgColor, themeBgColor } = useVariables({
      themeFgColor: '--td-text-color-primary',
      themeBgColor: '--td-bg-color-specialcomponent',
    });

    // bgColor：自定义颜色 > 主题色适配 > 透明[transparent]
    const finalBgColor = computed(() => props.bgColor || themeBgColor.value || 'transparent');
    // color[fgColor]：自定义颜色 > 主题色适配 > 默认颜色[#000000]
    const finalFgColor = computed(() => props.color || themeFgColor.value || DEFAULT_FRONT_COLOR);

    if (!props.value) {
      return null;
    }

    const imageSettings = computed<ImageSettings>(() => ({
      src: props.icon,
      x: undefined,
      y: undefined,
      height: isNumber(props.iconSize) ? props.iconSize : props.iconSize?.height ?? 40,
      width: isNumber(props.iconSize) ? props.iconSize : props.iconSize?.width ?? 40,
      excavate: true,
      crossOrigin: 'anonymous',
    }));

    const classes = computed(() => [
      `${classPrefix.value}-qrcode`,
      {
        [`${classPrefix.value}-borderless`]: props.borderless,
        [`${classPrefix.value}-qrcode-svg`]: props.type === 'svg',
      },
    ]);

    const mergedStyle = computed(() => ({
      backgroundColor: finalBgColor.value,
      width: `${props.size}px`,
      height: `${props.size}px`,
    }));

    return {
      classes,
      mergedStyle,
      globalConfig,
      finalBgColor,
      finalFgColor,
      classPrefix,
      imageSettings,
    };
  },
  render() {
    return (
      <div value={this.value} class={this.classes} style={this.mergedStyle} {...{ level: this.level }}>
        {this.status !== 'active' && (
          <div
            class={[`${this.classPrefix}-mask`, { [`${this.classPrefix}-${this.status}`]: this.status !== 'loading' }]}
          >
            <QRcodeStatus
              locale={this.globalConfig}
              status={this.status}
              statusRender={() => renderTNodeJSX(this, 'statusRender')}
              refresh={this.onRefresh}
            />
          </div>
        )}
        {this.type === 'canvas' ? (
          <QRCodeCanvas
            imageSettings={this.icon ? this.imageSettings : undefined}
            level={this.level}
            bgColor={this.finalBgColor}
            fgColor={this.finalFgColor}
            value={this.value}
            size={this.size}
          />
        ) : (
          <QRCodeSVG
            imageSettings={this.icon ? this.imageSettings : undefined}
            level={this.level}
            bgColor={this.finalBgColor}
            fgColor={this.finalFgColor}
            value={this.value}
            size={this.size}
          />
        )}
      </div>
    );
  },
});

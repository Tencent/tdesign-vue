import { computed, defineComponent } from 'vue';
import { QRCodeSubComponentProps } from './props';
import {
  DEFAULT_NEED_MARGIN, DEFAULT_MINVERSION, excavateModules, generatePath,
} from '../../_common/js/qrcode/utils';
import { useQRCode } from '../hooks/useQRCode';

export default defineComponent({
  name: 'QRCodeSVG',
  props: QRCodeSubComponentProps,
  setup(props) {
    const {
      margin, cells, numCells, calculatedImageSettings,
    } = useQRCode({
      value: props.value,
      level: props.level,
      minVersion: DEFAULT_MINVERSION,
      includeMargin: DEFAULT_NEED_MARGIN,
      marginSize: props.marginSize,
      imageSettings: props.imageSettings,
      size: props.size,
    });

    const cellsToDraw = computed(() => {
      if (props.imageSettings && calculatedImageSettings.value?.excavation != null) {
        return excavateModules(cells.value, calculatedImageSettings.value.excavation);
      }
      return cells.value;
    });

    return {
      cellsToDraw,
      calculatedImageSettings,
      margin,
      numCells,
    };
  },
  render() {
    const fgPath = generatePath(this.cellsToDraw, this.margin);

    const imageNode = () => {
      if (!this.imageSettings || !this.calculatedImageSettings) return null;

      return (
        <image
          href={this.imageSettings.src}
          height={this.calculatedImageSettings.h}
          width={this.calculatedImageSettings.w}
          x={this.calculatedImageSettings.x + this.margin}
          y={this.calculatedImageSettings.y + this.margin}
          crossOrigin={this.calculatedImageSettings.crossOrigin}
        />
      );
    };

    return (
      <svg
        height={this.size}
        width={this.size}
        viewBox={`0 0 ${this.numCells} ${this.numCells}`}
        role="img"
        style={this.style}
      >
        {!!this.title && <title>{this.title}</title>}
        <path fill={this.bgColor} d={`M0,0 h${this.numCells}v${this.numCells}H0z`} shape-rendering="crispEdges" />
        <path fill={this.fgColor} d={fgPath} shape-rendering="crispEdges" />
        {imageNode()}
      </svg>
    );
  },
});

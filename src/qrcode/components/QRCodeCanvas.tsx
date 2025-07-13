import { computed, defineComponent, ref } from '@vue/composition-api';
import { QRCodeSubComponentProps } from './props';
import {
  DEFAULT_NEED_MARGIN,
  DEFAULT_MINVERSION,
  isSupportPath2d,
  excavateModules,
  generatePath,
} from '../../_common/js/qrcode/utils';
import { useQRCode } from '../hooks/useQRCode';

export default defineComponent({
  name: 'QRCodeCanvas',
  props: QRCodeSubComponentProps,
  setup(props) {
    const imgSrc = computed(() => props.imageSettings?.src);
    const imgCrossOrigin = ref('');

    return {
      imgSrc,
      imgCrossOrigin,
    };
  },
  methods: {
    renderQRCode() {
      const {
        margin, cells, numCells, calculatedImageSettings,
      } = useQRCode({
        value: this.value,
        level: this.level,
        minVersion: DEFAULT_MINVERSION,
        includeMargin: DEFAULT_NEED_MARGIN,
        marginSize: this.marginSize,
        imageSettings: this.imageSettings,
        size: this.size,
      });

      if (!this.$refs.canvasRef) {
        return;
      }

      const canvas = (this.$refs.canvasRef as HTMLCanvasElement) ?? null;
      const ctx = canvas?.getContext('2d');

      if (!ctx) {
        return;
      }

      this.imgCrossOrigin = calculatedImageSettings.value?.crossOrigin;

      let cellsToDraw = cells;
      const image = (this.$refs.imageRef as HTMLImageElement) ?? null;

      if (image) {
        image.crossOrigin = calculatedImageSettings.value.crossOrigin;
      }

      const haveImageToRender = calculatedImageSettings.value
        && image !== null
        && image.complete
        && image.naturalHeight !== 0
        && image.naturalWidth !== 0;

      if (haveImageToRender && calculatedImageSettings.value.excavation != null) {
        cellsToDraw = computed(() => excavateModules(cells.value, calculatedImageSettings.value.excavation));
      }

      const pixelRatio = window.devicePixelRatio || 1;
      canvas.height = this.size * pixelRatio;
      canvas.width = this.size * pixelRatio;
      const scale = (this.size / numCells.value) * pixelRatio;
      ctx.scale(scale, scale);

      ctx.fillStyle = this.bgColor;
      ctx.fillRect(0, 0, numCells.value, numCells.value);

      ctx.fillStyle = this.fgColor;
      if (isSupportPath2d) {
        ctx.fill(new Path2D(generatePath(cellsToDraw.value, margin.value)));
      } else {
        cells.value.forEach((row, rdx) => {
          row.forEach((cell, cdx) => {
            if (cell) {
              ctx.fillRect(cdx + margin.value, rdx + margin.value, 1, 1);
            }
          });
        });
      }

      if (this.calculatedImageSettings) {
        ctx.globalAlpha = calculatedImageSettings.value.opacity;
      }

      if (haveImageToRender) {
        ctx.globalAlpha = calculatedImageSettings.value.opacity;
        ctx.drawImage(
          image,
          calculatedImageSettings.value.x + margin.value,
          calculatedImageSettings.value.y + margin.value,
          calculatedImageSettings.value.w,
          calculatedImageSettings.value.h,
        );
      }
    },
  },
  mounted() {
    this.renderQRCode();
  },
  watch: {
    value() {
      this.renderQRCode();
    },
    size() {
      this.renderQRCode();
    },
    level() {
      this.renderQRCode();
    },
    bgColor() {
      this.renderQRCode();
    },
    fgColor() {
      this.renderQRCode();
    },
  },
  render() {
    return (
      <div style="display: flex">
        <canvas ref="canvasRef" role="img" />
        {this.imgSrc != null ? (
          <img ref="imageRef" onLoad={this.renderQRCode} style={{ display: 'none' }} src={this.imgSrc} />
        ) : null}
      </div>
    );
  },
});

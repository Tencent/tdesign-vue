import { computed, defineComponent, PropType } from '@vue/composition-api';
import {
  ImageIcon, ZoomInIcon, ZoomOutIcon, DownloadIcon, MirrorIcon, RotationIcon,
} from 'tdesign-icons-vue';
import TImageViewerIcon from './ImageModalIcon';
import TToolTip from '../../tooltip';
import { useConfig } from '../../hooks/useConfig';
import { useImagePreviewUrl } from '../../hooks';
import { largeNumberToFixed } from '../../_common/js/input-number/large-number';

import { ImageInfo } from '../type';

const currentImage = {
  type: Object as PropType<ImageInfo>,
  default() {
    return {};
  },
};

export default defineComponent({
  name: 'TImageViewerUtils',
  props: {
    scale: Number,
    rotateHandler: Function as PropType<() => void>,
    zoomInHandler: Function as PropType<() => void>,
    zoomOutHandler: Function as PropType<() => void>,
    mirrorHandler: Function as PropType<() => void>,
    resetHandler: Function as PropType<() => void>,
    downloadHandler: Function as PropType<(url: string) => void>,
    globalConfig: Object,
    currentImage,
  },
  setup(props) {
    const { classPrefix } = useConfig('imageViewer');
    const imageUrl = computed(() => props.currentImage.mainImage);

    const { previewUrl } = useImagePreviewUrl(imageUrl);

    return {
      classPrefix,

      previewUrl,
    };
  },
  render() {
    return (
      <div class={`${this.classPrefix}-image-viewer__utils`}>
        <div class={`${this.classPrefix}-image-viewer__utils-content`}>
          <TToolTip
            overlayClassName={`${this.classPrefix}-image-viewer__utils--tip`}
            content={this.globalConfig.mirrorTipText}
            destroyOnClose
            placement="top"
            showArrow
            theme="default"
          >
            <TImageViewerIcon clickHandler={this.mirrorHandler} icon={() => <MirrorIcon size="medium" />} />
          </TToolTip>
          <TToolTip
            overlayClassName={`${this.classPrefix}-image-viewer__utils--tip`}
            content={this.globalConfig.rotateTipText}
            destroyOnClose
            placement="top"
            showArrow
            theme="default"
          >
            <TImageViewerIcon clickHandler={this.rotateHandler} icon={() => <RotationIcon size="medium" />} />
          </TToolTip>
          <TImageViewerIcon icon={() => <ZoomOutIcon size="medium" />} clickHandler={this.zoomOutHandler} />
          <TImageViewerIcon
            class={`${this.classPrefix}-image-viewer__utils-scale`}
            size="medium"
            label={`${largeNumberToFixed(String(this.scale * 100))}%`}
          />
          <TImageViewerIcon icon={() => <ZoomInIcon size="medium" />} clickHandler={this.zoomInHandler} />
          <TToolTip
            overlayClassName={`${this.classPrefix}-image-viewer__utils--tip`}
            content={this.globalConfig.originalSizeTipText}
            destroyOnClose
            placement="top"
            showArrow
            theme="default"
          >
            <div class={`${this.classPrefix}-image-viewer__modal-icon`}>
              <TImageViewerIcon icon={() => <ImageIcon size="medium" />} clickHandler={this.resetHandler} />
            </div>
          </TToolTip>
          {this.currentImage.download && (
            <TImageViewerIcon
              icon={() => <DownloadIcon size="medium" />}
              clickHandler={() => {
                this.downloadHandler(this.previewUrl);
              }}
            />
          )}
        </div>
      </div>
    );
  },
});

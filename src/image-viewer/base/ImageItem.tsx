import {
  computed, defineComponent, PropType, ref, toRefs, watch,
} from '@vue/composition-api';
import { ImageErrorIcon } from 'tdesign-icons-vue';
import { useConfig } from '../../hooks/useConfig';
import { useDrag } from '../hooks';
import { setTransform } from '../../utils/helper';
import { useImagePreviewUrl } from '../../hooks';
import { TdImageViewerProps } from '../type';

export default defineComponent({
  name: 'TImageItem',
  props: {
    rotate: Number,
    scale: Number,
    mirror: Number,
    src: [String, Object] as PropType<string | File>,
    placementSrc: [String, Object] as PropType<string | File>,
    imageReferrerpolicy: String as PropType<TdImageViewerProps['imageReferrerpolicy']>,
  },

  setup(props) {
    const { src, placementSrc } = toRefs(props);
    const { classPrefix, global: globalConfig } = useConfig('imageViewer');
    const error = ref(false);
    const loaded = ref(false);
    const { transform, mouseDownHandler } = useDrag({ translateX: 0, translateY: 0 });

    const { previewUrl: mainImagePreviewUrl } = useImagePreviewUrl(src);
    const { previewUrl: placementImagePreviewUrl } = useImagePreviewUrl(placementSrc);

    const imgStyle = computed(() => ({
      ...setTransform(`rotate(${props.rotate}deg) scale(${props.scale})`),
      display: !props.placementSrc || loaded.value ? 'block' : 'none',
    }));
    const placementImgStyle = computed(() => ({
      ...setTransform(`rotate(${props.rotate}deg) scale(${props.scale})`),
      display: !loaded.value ? 'block' : 'none',
    }));
    const boxStyle = computed(() => {
      const { translateX, translateY } = transform.value;
      return setTransform(`translate(${translateX}px, ${translateY}px) scale(${props.mirror}, 1)`);
    });

    const resetStatus = () => {
      error.value = false;
      loaded.value = false;
    };

    watch([mainImagePreviewUrl, placementImagePreviewUrl], () => {
      resetStatus();
    });

    return {
      globalConfig,
      classPrefix,
      boxStyle,
      loaded,
      error,
      mouseDownHandler,
      placementImgStyle,
      imgStyle,
      mainImagePreviewUrl,
      placementImagePreviewUrl,
    };
  },
  render() {
    return (
      <div class={`${this.classPrefix}-image-viewer__modal-pic`}>
        <div class={`${this.classPrefix}-image-viewer__modal-box`} style={this.boxStyle}>
          {this.error && (
            <div class={`${this.classPrefix}-image-viewer__img-error`}>
              {/* 脱离文档流 */}
              <div class={`${this.classPrefix}-image-viewer__img-error-content`}>
                <ImageErrorIcon size="4em" />
                <div class={`${this.classPrefix}-image-viewer__img-error-text`}>{this.globalConfig.errorText}</div>
              </div>
            </div>
          )}

          {!this.error && !!this.placementSrc && this.placementImagePreviewUrl && (
            <img
              class={`${this.classPrefix}-image-viewer__modal-image`}
              onMousedown={(event: MouseEvent) => {
                event.stopPropagation();
                this.mouseDownHandler(event);
              }}
              src={this.placementImagePreviewUrl}
              style={this.placementImgStyle}
              alt="image"
              draggable="false"
              referrerpolicy={this.imageReferrerpolicy}
            />
          )}

          {!this.error && this.mainImagePreviewUrl && (
            <img
              class={`${this.classPrefix}-image-viewer__modal-image`}
              onMousedown={(event: MouseEvent) => {
                event.stopPropagation();
                this.mouseDownHandler(event);
              }}
              src={this.mainImagePreviewUrl}
              onLoad={() => (this.loaded = true)}
              onError={() => (this.error = true)}
              style={this.imgStyle}
              alt="image"
              draggable="false"
              referrerpolicy={this.imageReferrerpolicy}
            />
          )}
        </div>
      </div>
    );
  },
});

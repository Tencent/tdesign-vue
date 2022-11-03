import {
  computed, defineComponent, ref, watch,
} from '@vue/composition-api';
import { ImageErrorIcon } from 'tdesign-icons-vue';
import { usePrefixClass } from '../../hooks/useConfig';
import { useDrag } from '../hooks';
import { setTransform } from '../../utils/helper';

export default defineComponent({
  name: 'TImageItem',
  props: {
    rotate: Number,
    scale: Number,
    mirror: Number,
    src: String,
    placementSrc: String,
  },
  setup(props) {
    const classPrefix = usePrefixClass();
    const error = ref(false);
    const loaded = ref(false);
    const { transform, mouseDownHandler } = useDrag({ translateX: 0, translateY: 0 });

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

    watch(
      () => props.src,
      () => {
        resetStatus();
      },
    );

    return {
      classPrefix,
      boxStyle,
      loaded,
      error,
      mouseDownHandler,
      placementImgStyle,
      imgStyle,
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
                <div class={`${this.classPrefix}-image-viewer__img-error-text`}>图片加载失败，可尝试重新加载</div>
              </div>
            </div>
          )}

          {!this.error && !!this.placementSrc && (
            <img
              class={`${this.classPrefix}-image-viewer__modal-image`}
              onMousedown={(event: MouseEvent) => {
                event.stopPropagation();
                this.mouseDownHandler(event);
              }}
              src={this.placementSrc}
              style={this.placementImgStyle}
              alt="image"
              draggable="false"
            />
          )}

          {!this.error && (
            <img
              class={`${this.classPrefix}-image-viewer__modal-image`}
              onMousedown={(event: MouseEvent) => {
                event.stopPropagation();
                this.mouseDownHandler(event);
              }}
              src={this.src}
              onLoad={() => (this.loaded = true)}
              onError={() => (this.error = true)}
              style={this.imgStyle}
              alt="image"
              draggable="false"
            />
          )}
        </div>
      </div>
    );
  },
});

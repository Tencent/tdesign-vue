import { computed, defineComponent, PropType } from '@vue/composition-api';
import TDialog from '../../dialog';
import TImageItem from './ImageItem';
import TImageViewerUtils from './ImageViewerUtils';
import { usePrefixClass } from '../../hooks/useConfig';
import { useTNodeJSX } from '../../hooks/tnode';
import { ImageInfo, TdImageViewerProps } from '../type';
import props from '../props';

const defaultProps = {
  zIndex: Number,
  visible: Boolean,
  index: Number,
  images: props.images,
  scale: Number,
  rotate: Number,
  mirror: Number,
  currentImage: {
    type: Object as PropType<ImageInfo>,
    default() {
      return {};
    },
  },
  rotateHandler: Function as PropType<() => void>,
  zoomInHandler: Function as PropType<() => void>,
  zoomOutHandler: Function as PropType<() => void>,
  mirrorHandler: Function as PropType<() => void>,
  downloadHandler: Function as PropType<(url: string) => void>,
  resetHandler: Function as PropType<() => void>,
  closeHandler: props.onClose,
  draggable: {
    type: Boolean,
    default: true,
  },
  viewerScale: {
    type: Object as PropType<TdImageViewerProps['viewerScale']>,
    default() {
      return {};
    },
  },
  showOverlay: Boolean,
  closeBtn: props.closeBtn,
  imageReferrerpolicy: props.imageReferrerpolicy,
  title: String as PropType<TdImageViewerProps['title']>,
};

export default defineComponent({
  name: 'TImageViewerModal',
  props: { ...defaultProps },
  setup(props) {
    const classPrefix = usePrefixClass();
    const renderJSX = useTNodeJSX();
    const style = computed(() => ({
      minWidth: props.viewerScale.minWidth,
      minHeight: props.viewerScale.minHeight,
    }));

    return {
      classPrefix,
      renderJSX,
      style,
    };
  },
  render() {
    return (
      <TDialog
        destroyOnClose
        onClose={this.closeHandler}
        visible={this.visible}
        placement="center"
        mode="modeless"
        width={1000}
        cancelBtn={null}
        confirmBtn={null}
        draggable={this.draggable}
        zIndex={this.zIndex}
        showOverlay={this.showOverlay}
        class={`${this.classPrefix}-image-viewer__dialog`}
        header={this.title}
        footer={() => (
          <div class={`${this.classPrefix}-image-viewer-mini__footer`}>
            <TImageViewerUtils
              zoomInHandler={this.zoomInHandler}
              zoomOutHandler={this.zoomOutHandler}
              scale={this.scale}
              currentImage={this.currentImage}
              rotateHandler={this.rotateHandler}
              mirrorHandler={this.mirrorHandler}
              resetHandler={this.resetHandler}
              downloadHandler={this.downloadHandler}
            />
          </div>
        )}
      >
        <div class={`${this.classPrefix}-image-viewer-mini__content`} style={this.style}>
          <TImageItem
            rotate={this.rotate}
            scale={this.scale}
            mirror={this.mirror}
            src={this.currentImage.mainImage}
            placementSrc={this.currentImage.thumbnail}
            imageReferrerpolicy={props.imageReferrerpolicy}
          />
        </div>
      </TDialog>
    );
  },
});

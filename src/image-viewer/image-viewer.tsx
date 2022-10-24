import {
  computed, defineComponent, ref, toRefs, watch,
} from '@vue/composition-api';
import { ChevronLeftIcon, ChevronDownIcon, CloseIcon } from 'tdesign-icons-vue';

import props from './props';
import Container from './base/Container';
import TImageViewerIcon from './base/ImageModalIcon';
import TImageViewerUtils from './base/ImageViewerUtils';
import TImageItem from './base/ImageItem';
import TImageViewerModal from './base/ImageViewerModal';
import useVModel from '../hooks/useVModel';
import useDefaultValue from '../hooks/useDefaultValue';
import { usePrefixClass } from '../hooks/useConfig';
import { renderTNodeJSX } from '../utils/render-tnode';
import { setTransform } from '../utils/helper';

import { TdImageViewerProps } from './type';
import { useMirror, useRotate, useScale } from './hooks';
import { formatImages, getOverlay } from './utils';
import { EVENT_CODE } from './const';

export default defineComponent({
  name: 'TImageViewer',
  props: { ...props },
  model: {
    prop: 'visible',
    event: 'change',
  },
  setup(props, { emit }) {
    const classPrefix = usePrefixClass();
    const COMPONENT_NAME = usePrefixClass('image-viewer');
    const isExpand = ref(false);
    const showOverlayValue = computed(() => getOverlay(props));

    const { index, visible } = toRefs(props);
    const [indexValue, setIndexValue] = useDefaultValue(
      index,
      props.defaultIndex ?? 0,
      props.onIndexChange,
      'index',
      'index-change',
    );
    const [visibleValue, setVisibleValue] = useVModel(visible, props.defaultVisible, () => {}, 'change', 'visible');

    const rootClass = computed(() => [`${COMPONENT_NAME.value}`]);
    const wrapClass = computed(() => [
      `${COMPONENT_NAME.value}-preview-image`,
      {
        [`${classPrefix.value}-is-hide`]: !visibleValue.value,
      },
    ]);
    const headerClass = computed(() => [
      `${classPrefix.value}-image-viewer__modal-header`,
      {
        [`${classPrefix.value}-is-show`]: isExpand.value,
      },
    ]);
    const zIndexValue = computed(() => props.zIndex ?? 2600);
    const toggleExpand = () => {
      isExpand.value = !isExpand.value;
    };

    const { mirror, onMirror, resetMirror } = useMirror();
    const {
      scale, onZoomIn, onZoomOut, resetScale,
    } = useScale(props.imageScale);
    const { rotate, onRotate, resetRotate } = useRotate();
    const onRest = () => {
      resetMirror();
      resetScale();
      resetRotate();
    };

    const imagesList = computed(() => formatImages(props.images));
    const currentImage = computed(() => imagesList.value[indexValue.value] ?? { mainImage: '' });

    const prevImage = () => {
      const newIndex = indexValue.value - 1;
      setIndexValue(newIndex < 0 ? 0 : newIndex, { trigger: 'prev' });
    };

    const nextImage = () => {
      const newIndex = indexValue.value + 1;
      setIndexValue(newIndex >= imagesList.value.length ? indexValue.value : newIndex, { trigger: 'next' });
    };

    const onImgClick = (i: number) => {
      setIndexValue(i, { trigger: i > indexValue.value ? 'next' : 'prev' });
    };

    const openHandler = () => {
      setVisibleValue(true);
    };

    const onCloseHandle: TdImageViewerProps['onClose'] = (ctx) => {
      setVisibleValue(false);
      props.onClose?.(ctx);
      emit('close', ctx);
    };
    const closeBtnAction = (e: MouseEvent) => {
      onCloseHandle({ e, trigger: 'close-btn' });
    };
    const clickOverlayHandler = (e: MouseEvent) => {
      if (props.closeOnOverlay) {
        onCloseHandle({ e, trigger: 'overlay' });
      }
    };

    const keydownHandler = (e: KeyboardEvent) => {
      switch (e.code) {
        case EVENT_CODE.left:
          prevImage();
          break;
        case EVENT_CODE.right:
          nextImage();
          break;
        case EVENT_CODE.up:
          onZoomIn();
          break;
        case EVENT_CODE.down:
          onZoomOut();
          break;
        case EVENT_CODE.esc:
          onCloseHandle({ e, trigger: 'esc' });
          break;
        default:
          break;
      }
    };

    const containerRef = ref();
    const mountContent = () => {
      if (containerRef) {
        containerRef.value.mountContent();
      }
    };
    const unmountContent = () => {
      if (containerRef) {
        containerRef.value.unmountContent();
      }
    };

    watch(
      () => visibleValue.value,
      (val) => {
        if (val) {
          window.addEventListener('keydown', keydownHandler);
          mountContent();
          return;
        }
        window.removeEventListener('keydown', keydownHandler);
        unmountContent();
      },
    );

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const { deltaY, ctrlKey } = e;
      // mac触摸板双指缩放时ctrlKey=true，deltaY>0为缩小  <0为放大
      if (ctrlKey) {
        return deltaY > 0 ? onZoomOut() : onZoomIn();
      }
      deltaY > 0 ? onZoomIn() : onZoomOut();
    };

    const transStyle = computed(() => setTransform(`translateX(-${indexValue.value * 84}px)`));
    const isMultipleImg = computed(() => imagesList.value.length > 1);

    return {
      COMPONENT_NAME,
      rootClass,
      classPrefix,
      prevImage,
      nextImage,
      zIndexValue,
      visibleValue,
      indexValue,
      imagesList,
      showOverlayValue,
      wrapClass,
      rotate,
      mirror,
      currentImage,
      onRotate,
      onZoomIn,
      onZoomOut,
      onMirror,
      onRest,
      openHandler,
      onCloseHandle,
      onWheel,
      clickOverlayHandler,
      headerClass,
      toggleExpand,
      transStyle,
      onImgClick,
      closeBtnAction,
      scale,
      isMultipleImg,
      containerRef,
    };
  },
  methods: {
    renderHeader() {
      return (
        <div class={this.headerClass}>
          <TImageViewerIcon
            icon={() => <ChevronDownIcon size="20px" />}
            class={`${this.COMPONENT_NAME}__header-pre-bt`}
            clickHandler={this.toggleExpand}
          />
          <div class={`${this.COMPONENT_NAME}__header-prev`}>
            <div class={`${this.COMPONENT_NAME}__bokeh-left`} />
            <div class={`${this.COMPONENT_NAME}__bokeh-right`} />
            <div class={`${this.COMPONENT_NAME}__header-trans`} style={this.transStyle}>
              {this.imagesList.map((image, index) => (
                <div
                  key={index}
                  class={[
                    `${this.COMPONENT_NAME}__header-box`,
                    {
                      [`${this.classPrefix}-is-active`]: index === this.indexValue,
                    },
                  ]}
                >
                  <img
                    alt=""
                    src={image.thumbnail || image.mainImage}
                    class={`${this.COMPONENT_NAME}__header-img`}
                    onClick={() => this.onImgClick(index)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    },
    renderNavigationArrow(type: 'prev' | 'next') {
      const rotateDeg = type === 'prev' ? 0 : 180;
      const icon = renderTNodeJSX(
        this,
        'navigationArrow',
        <ChevronLeftIcon style={setTransform(`rotate(${rotateDeg}deg)`)} size="24px" />,
      );

      return (
        <TImageViewerIcon
          class={`${this.COMPONENT_NAME}__modal-${type}-bt`}
          clickHandler={type === 'prev' ? this.prevImage : this.nextImage}
          icon={() => icon}
        />
      );
    },
    renderModal() {
      return (
        <TImageViewerModal
          zIndex={this.zIndexValue}
          visible={this.visibleValue}
          index={this.indexValue}
          images={this.imagesList}
          scale={this.scale}
          rotate={this.rotate}
          mirror={this.mirror}
          currentImage={this.currentImage}
          rotateHandler={this.onRotate}
          zoomInHandler={this.onZoomIn}
          zoomOutHandler={this.onZoomOut}
          mirrorHandler={this.onMirror}
          resetHandler={this.onRest}
          closeHandler={this.onCloseHandle}
          draggable={this.draggable}
          showOverlay={this.showOverlayValue}
          closeBtn={this.closeBtn}
        />
      );
    },
    renderViewer() {
      return (
        <div class={this.wrapClass} style={{ zIndex: this.zIndexValue }} onWheel={this.onWheel}>
          {!!this.showOverlayValue && (
            <div class={`${this.COMPONENT_NAME}__modal-mask`} onClick={this.clickOverlayHandler} />
          )}
          {this.isMultipleImg && this.renderHeader()}
          {this.isMultipleImg && this.renderNavigationArrow('prev')}
          {this.isMultipleImg && this.renderNavigationArrow('next')}
          {this.isMultipleImg && (
            <div class={`${this.COMPONENT_NAME}__modal-index`}>
              {renderTNodeJSX(this, 'title')}
              {`${this.indexValue + 1}/${this.imagesList.length}`}
            </div>
          )}
          <div
            class={[`${this.COMPONENT_NAME}__modal-icon`, `${this.COMPONENT_NAME}__modal-close-bt`]}
            onClick={this.closeBtnAction}
          >
            {renderTNodeJSX(this, 'closeBtn', <CloseIcon size="24px" />)}
          </div>
          <TImageViewerUtils
            zoomInHandler={this.onZoomIn}
            zoomOutHandler={this.onZoomOut}
            mirrorHandler={this.onMirror}
            resetHandler={this.onRest}
            rotateHandler={this.onRotate}
            scale={this.scale}
            currentImage={this.currentImage}
          />
          <TImageItem
            scale={this.scale}
            rotate={this.rotate}
            mirror={this.mirror}
            src={this.currentImage.mainImage}
            placementSrc={this.currentImage.thumbnail}
          />
        </div>
      );
    },
  },

  render() {
    return (
      <Container ref="containerRef" mode={this.mode} renderModal={this.renderModal} renderViewer={this.renderViewer}>
        {renderTNodeJSX(this, 'trigger', { params: { open: this.openHandler } })}
      </Container>
    );
  },
});

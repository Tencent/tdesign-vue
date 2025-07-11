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
import { usePrefixClass, useConfig } from '../hooks/useConfig';
import { renderTNodeJSX } from '../utils/render-tnode';
import { setTransform } from '../utils/helper';
import { TdImageViewerProps } from './type';
import { useMirror, useRotate, useScale } from './hooks';

import { downloadFile, formatImages, getOverlay } from './utils';
import { EVENT_CODE, DEFAULT_IMAGE_SCALE } from './const';
import Image from '../image';

export default defineComponent({
  name: 'TImageViewer',
  props: { ...props },
  model: {
    prop: 'visible',
    event: 'change',
  },
  setup(props, { emit, listeners }) {
    const classPrefix = usePrefixClass();
    const COMPONENT_NAME = usePrefixClass('image-viewer');
    const { globalConfig } = useConfig('imageViewer');

    const isExpand = ref(true);
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
      COMPONENT_NAME.value,
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

    const imageScaleRef = computed(() => props.imageScale ?? DEFAULT_IMAGE_SCALE);
    const { mirror, onMirror, resetMirror } = useMirror();
    const {
      scale, onZoomIn, onZoomOut, resetScale,
    } = useScale(imageScaleRef);
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
      onRest();
      setIndexValue(newIndex < 0 ? 0 : newIndex, { trigger: 'prev' });
    };

    const nextImage = () => {
      const newIndex = indexValue.value + 1;
      onRest();
      setIndexValue(newIndex >= imagesList.value.length ? indexValue.value : newIndex, { trigger: 'next' });
    };

    const onImgClick = (i: number) => {
      setIndexValue(i, { trigger: 'current' });
    };

    const onDownloadClick = (url: string) => {
      if (props.onDownload || listeners.download) {
        props.onDownload?.(url);
        emit('download', url);
        return;
      }
      downloadFile(url);
    };

    const openHandler = () => {
      setVisibleValue(true);
    };

    const onCloseHandle: TdImageViewerProps['onClose'] = (ctx) => {
      setVisibleValue(false);

      unmountContent();

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
      e.stopPropagation();

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
          if (props.closeOnEscKeydown) {
            onCloseHandle({ e, trigger: 'esc' });
          }
          break;
        default:
          break;
      }
    };

    const containerRef = ref();
    const mountContent = () => {
      if (containerRef.value) {
        containerRef.value.mountContent();
      }
    };
    const unmountContent = () => {
      if (containerRef.value) {
        containerRef.value.unmountContent();
      }
    };
    const divRef = ref<HTMLDivElement>();
    const getFocus = () => {
      if (divRef.value) {
        // 只设置tabindex值无法自动获取到焦点，使用focus获取焦点
        divRef.value.focus();
      }
    };
    watch(
      () => visibleValue.value,
      (val) => {
        if (val) {
          onRest();
          mountContent();
          getFocus();
        }
      },
    );

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const { deltaY } = e;

      deltaY > 0 ? onZoomOut() : onZoomIn();
    };

    const transStyle = computed(() => setTransform(`translateX(calc(-${indexValue.value} * (40px / 9 * 16 + 4px)))`));
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
      onDownloadClick,
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
      keydownHandler,
      divRef,
      globalConfig,
    };
  },
  methods: {
    renderHeader() {
      return (
        <div class={this.headerClass}>
          <TImageViewerIcon
            icon={() => <ChevronDownIcon />}
            class={`${this.COMPONENT_NAME}__header-pre-bt`}
            clickHandler={this.toggleExpand}
          />
          <div class={`${this.COMPONENT_NAME}__header-prev`}>
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
                  <Image
                    alt=""
                    error=""
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
          downloadHandler={this.onDownloadClick}
          resetHandler={this.onRest}
          closeHandler={this.onCloseHandle}
          draggable={this.draggable}
          showOverlay={this.showOverlayValue}
          closeBtn={this.closeBtn}
          imageReferrerpolicy={this.imageReferrerpolicy}
        />
      );
    },
    renderCloseBtn() {
      if (this.closeBtn === false) {
        return;
      }
      return (
        <div
          class={[`${this.COMPONENT_NAME}__modal-icon`, `${this.COMPONENT_NAME}__modal-close-bt`]}
          onClick={this.closeBtnAction}
        >
          {renderTNodeJSX(this, 'closeBtn', <CloseIcon size="24px" />)}
        </div>
      );
    },
    renderViewer() {
      return (
        <div
          tabindex={-1}
          onKeydown={this.keydownHandler}
          ref="divRef"
          class={this.wrapClass}
          style={{ zIndex: this.zIndexValue }}
          onWheel={this.onWheel}
        >
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
          {this.renderCloseBtn()}
          <TImageViewerUtils
            zoomInHandler={this.onZoomIn}
            zoomOutHandler={this.onZoomOut}
            mirrorHandler={this.onMirror}
            downloadHandler={this.onDownloadClick}
            resetHandler={this.onRest}
            rotateHandler={this.onRotate}
            scale={this.scale}
            currentImage={this.currentImage}
            globalConfig={this.globalConfig}
          />
          <TImageItem
            scale={this.scale}
            rotate={this.rotate}
            mirror={this.mirror}
            src={this.currentImage.mainImage}
            placementSrc={this.currentImage.thumbnail}
            imageReferrerpolicy={this.imageReferrerpolicy}
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

import {
  computed, defineComponent, ref, watch,
} from '@vue/composition-api';
import omit from 'lodash/omit';
import isFunction from 'lodash/isFunction';
import { ImageErrorIcon, ImageIcon } from 'tdesign-icons-vue';
import observe from '../_common/js/utils/observe';
import { useConfig } from '../config-provider/useConfig';
import { TdImageProps } from './type';
import props from './props';
import { renderTNodeJSX } from '../utils/render-tnode';
import Space from '../space';

export default defineComponent({
  name: 'TImage',
  components: { Space },
  props,
  setup(props: TdImageProps, { emit }) {
    const {
      lazy, overlayTrigger, onLoad, onError,
    } = props;

    const rest = omit(props, [
      'className',
      'src',
      'style',
      'alt',
      'fit',
      'position',
      'shape',
      'placeholder',
      'loading',
      'error',
      'overlayTrigger',
      'overlayContent',
      'lazy',
      'gallery',
      'onLoad',
      'onError',
    ]);

    const { classPrefix, globalConfig } = useConfig('image');
    const imageRef = ref<HTMLElement>(null);

    // replace image url
    const imageSrc = computed(() => isFunction(globalConfig.value.replaceImageSrc) ? globalConfig.value.replaceImageSrc(props) : props.src);

    watch(
      () => props.src,
      () => {
        hasError.value = false;
        isLoaded.value = false;
      },
    );

    const shouldLoad = ref(!lazy);
    const handleLoadImage = () => {
      shouldLoad.value = true;
    };

    const isLoaded = ref(false);
    const handleLoad = (e: Event) => {
      isLoaded.value = true;
      emit('load', { e });
      onLoad?.({ e });
    };

    const hasError = ref(false);
    const handleError = (e: Event) => {
      hasError.value = true;
      emit('error', { e });
      onError?.({ e });
    };

    const hasMouseEvent = overlayTrigger === 'hover';

    const shouldShowOverlay = ref(!hasMouseEvent);
    const handleToggleOverlay = () => {
      if (hasMouseEvent) {
        shouldShowOverlay.value = !shouldShowOverlay.value;
      }
    };

    const imageClasses = computed(() => [
      `${classPrefix.value}-image`,
      `${classPrefix.value}-image--fit-${props.fit}`,
      `${classPrefix.value}-image--position-${props.position}`,
    ]);

    return {
      imageRef,
      imageClasses,
      handleLoadImage,
      classPrefix,
      globalConfig,
      hasMouseEvent,
      handleToggleOverlay,
      shouldShowOverlay,
      imageSrc,
      hasError,
      shouldLoad,
      handleError,
      handleLoad,
      isLoaded,
      rest,
    };
  },
  mounted(this) {
    if (!this.lazy || !this.imageRef) return;

    const io = observe(this.imageRef as HTMLElement, null, this.handleLoadImage as Function, 0);
    this.io = io;
  },
  destroyed(this) {
    this.imageRef && this.io && (this.io as IntersectionObserver).unobserve(this.imageRef as Element);
  },
  methods: {
    renderPlaceholder() {
      const placeholder = renderTNodeJSX(this, 'placeholder');
      if (!placeholder) return;
      return <div class={`${this.classPrefix}-image__placeholder`}>{placeholder}</div>;
    },
    renderGalleryShadow() {
      if (!this.gallery) return null;
      return <div class={`${this.classPrefix}-image__gallery-shadow`} />;
    },
    renderOverlay() {
      const overlay = renderTNodeJSX(this, 'overlayContent');
      if (!overlay) return null;
      return (
        <div
          class={[
            `${this.classPrefix}-image__overlay-content`,
            !this.shouldShowOverlay && `${this.classPrefix}-image__overlay-content--hidden`,
          ]}
        >
          {overlay}
        </div>
      );
    },

    renderImageSrcset() {
      return (
        <picture>
          {Object.entries(this.srcset).map(([type, url]) => (
            <source type={type} srcset={url} />
          ))}
          {this.src && this.renderImage(this.src)}
        </picture>
      );
    },

    renderImage(url: string) {
      return (
        <img src={url} onError={this.handleError} onLoad={this.handleLoad} class={this.imageClasses} alt={this.alt} />
      );
    },
  },

  render() {
    return (
      <div
        ref="imageRef"
        class={[
          `${this.classPrefix}-image__wrapper`,
          `${this.classPrefix}-image__wrapper--shape-${this.shape}`,
          this.gallery && `${this.classPrefix}-image__wrapper--gallery`,
          this.hasMouseEvent && `${this.classPrefix}-image__wrapper--need-hover`,
          this.className,
        ]}
        onMouseenter={this.handleToggleOverlay}
        onMouseleave={this.handleToggleOverlay}
        {...this.rest}
      >
        {this.renderPlaceholder()}
        {this.renderGalleryShadow()}

        {(this.hasError || !this.shouldLoad) && <div class={`${this.classPrefix}-image`} />}
        {!(this.hasError || !this.shouldLoad)
          && (this.srcset && Object.keys(this.srcset).length ? this.renderImageSrcset() : this.renderImage(this.imageSrc))}
        {!(this.hasError || !this.shouldLoad) && !this.isLoaded && (
          <div class={`${this.classPrefix}-image__loading`}>
            {renderTNodeJSX(this, 'loading') || (
              <Space direction="vertical" size={8} align="center">
                <ImageIcon size="24px" />
                {this.globalConfig.loadingText}
              </Space>
            )}
          </div>
        )}

        {this.hasError && (
          <div class={`${this.classPrefix}-image__error`}>
            {renderTNodeJSX(this, 'error') || (
              <Space direction="vertical" size={8} align="center">
                <ImageErrorIcon size="24px" />
                {this.globalConfig.errorText}
              </Space>
            )}
          </div>
        )}

        {this.renderOverlay()}
      </div>
    );
  },
});

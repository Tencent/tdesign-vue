import {
  computed, defineComponent, onMounted, onUnmounted, ref, watch, toRefs,
} from 'vue';
import omit from 'lodash/omit';
import isFunction from 'lodash/isFunction';
import { ImageErrorIcon, ImageIcon } from 'tdesign-icons-vue';
import observe from '../_common/js/utils/observe';
import { useConfig } from '../config-provider/useConfig';
import { TdImageProps } from './type';
import props from './props';
import { renderTNodeJSX } from '../utils/render-tnode';
import Space from '../space';
import { useImagePreviewUrl } from '../hooks';

export default defineComponent({
  name: 'TImage',
  components: { Space },
  props,
  setup(props: TdImageProps, { emit }) {
    const { onLoad, onError } = props;

    const {
      src, lazy, fallback, overlayTrigger,
    } = toRefs(props);

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
    const imageStrSrc = ref(src.value);

    watch(
      [src, globalConfig],
      ([src, globalConfig]) => {
        const { replaceImageSrc } = globalConfig || {};
        const tmpUrl = isFunction(replaceImageSrc) ? replaceImageSrc(props) : src;
        if (tmpUrl === src) return;
        imageStrSrc.value = tmpUrl;
      },
      { immediate: true },
    );

    const { previewUrl } = useImagePreviewUrl(imageStrSrc);

    watch([previewUrl], () => {
      hasError.value = false;
      isLoaded.value = false;
    });

    const shouldLoad = ref(!lazy.value);
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
      // show fallback url if load failed
      if (fallback.value) {
        imageStrSrc.value = fallback.value;
      }
      emit('error', { e });
      onError?.({ e });
    };

    const hasMouseEvent = overlayTrigger.value === 'hover';

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

    const io = ref(null);

    onMounted(() => {
      if (!lazy || !imageRef.value) return;
      io.value = observe(imageRef.value as HTMLElement, null, handleLoadImage as Function, 0);
    });

    onUnmounted(() => {
      imageRef.value && io && (io as IntersectionObserver).unobserve(imageRef.value as Element);
    });

    return {
      imageRef,
      imageClasses,
      handleLoadImage,
      classPrefix,
      globalConfig,
      hasMouseEvent,
      handleToggleOverlay,
      shouldShowOverlay,
      imageStrSrc,
      previewUrl,
      hasError,
      shouldLoad,
      handleError,
      handleLoad,
      isLoaded,
      io,
      rest,
    };
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
          {this.renderImage()}
        </picture>
      );
    },

    renderImage() {
      // string / File
      const url = typeof this.imageStrSrc === 'string' ? this.imageStrSrc : this.previewUrl;
      return (
        <img
          src={url}
          onError={this.handleError}
          onLoad={this.handleLoad}
          class={this.imageClasses}
          alt={this.alt}
          // @ts-ignore
          referrerpolicy={this.referrerpolicy}
        />
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
        ]}
        onMouseenter={this.handleToggleOverlay}
        onMouseleave={this.handleToggleOverlay}
        {...this.rest}
        // @ts-ignore
        on={this.$listeners}
      >
        {this.renderPlaceholder()}
        {this.renderGalleryShadow()}

        {(this.hasError || !this.shouldLoad) && <div class={`${this.classPrefix}-image`} />}
        {!(this.hasError || !this.shouldLoad)
          && (this.srcset && Object.keys(this.srcset).length ? this.renderImageSrcset() : this.renderImage())}
        {!(this.hasError || !this.shouldLoad) && !this.isLoaded && (
          <div class={`${this.classPrefix}-image__loading`}>
            {renderTNodeJSX(this, 'loading') || (
              <Space direction="vertical" size={8} align="center">
                <ImageIcon size="24px" />
                {typeof this.loading === 'string' ? this.loading : this.globalConfig.loadingText}
              </Space>
            )}
          </div>
        )}

        {this.hasError && (
          <div class={`${this.classPrefix}-image__error`}>
            {renderTNodeJSX(this, 'error') || (
              <Space direction="vertical" size={8} align="center">
                <ImageErrorIcon size="24px" />
                {typeof this.error === 'string' ? this.error : this.globalConfig.errorText}
              </Space>
            )}
          </div>
        )}

        {this.renderOverlay()}
      </div>
    );
  },
});

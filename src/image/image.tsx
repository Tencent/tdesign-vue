import { defineComponent, ref } from '@vue/composition-api';
import omit from 'lodash/omit';
import observe from '../_common/js/utils/observe';
import { useConfig } from '../config-provider/useConfig';
import { TdImageProps } from './type';
import props from './props';

export default defineComponent({
  name: 'TImage',
  components: {},
  props,
  setup(props: TdImageProps) {
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

    const { classPrefix } = useConfig();
    const imageRef = ref<HTMLElement>(null);
    const shouldLoad = ref(!lazy);
    const handleLoadImage = () => {
      shouldLoad.value = true;
    };

    const isLoaded = ref(false);
    const handleLoad = () => {
      isLoaded.value = true;
      onLoad?.();
    };

    const hasError = ref(false);
    const handleError = () => {
      hasError.value = true;
      onError?.();
    };

    const hasMouseEvent = overlayTrigger === 'hover';

    const shouldShowOverlay = ref(!hasMouseEvent);
    const handleToggleOverlay = () => {
      if (hasMouseEvent) {
        shouldShowOverlay.value = !shouldShowOverlay.value;
      }
    };

    return {
      imageRef,
      handleLoadImage,
      classPrefix,
      hasMouseEvent,
      handleToggleOverlay,
      shouldShowOverlay,
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
      if (!this.placeholder) {
        return null;
      }
      return <div class={`${this.classPrefix}-image__placeholder`}>{this.placeholder}</div>;
    },
    renderGalleryShadow() {
      if (!this.gallery) return null;
      return <div class={`${this.classPrefix}-image__gallery-shadow`} />;
    },
    renderOverlay() {
      if (!this.overlayContent) return null;
      return (
        <div
          class={[
            `${this.classPrefix}-image__overlay-content`,
            !this.shouldShowOverlay && `${this.classPrefix}-image__overlay-content--hidden`,
          ]}
        >
          {this.overlayContent}
        </div>
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
        {!(this.hasError || !this.shouldLoad) && (
          <img
            src={this.src}
            onError={this.handleError}
            onLoad={this.handleLoad}
            class={[
              `${this.classPrefix}-image`,
              `${this.classPrefix}-image--fit-${this.fit}`,
              `${this.classPrefix}-image--position-${this.position}`,
            ]}
            alt={this.alt}
          />
        )}
        {!(this.hasError || !this.shouldLoad) && !this.isLoaded && (
          <div class={`${this.classPrefix}-image__loading`}>
            {this.loading || (
              <div direction="vertical" size={8} align="center">
                图片加载中
              </div>
            )}
          </div>
        )}

        {this.hasError && (
          <div class={`${this.classPrefix}-image__error`}>
            {this.error || (
              <div direction="vertical" size={8} align="center">
                图片无法显示
              </div>
            )}
          </div>
        )}

        {this.renderOverlay()}
      </div>
    );
  },
});

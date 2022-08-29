import { defineComponent, ref } from '@vue/composition-api';
import { useConfig } from '../config-provider/useConfig';
import { TdImageProps } from './type';

export default defineComponent({
  name: 'TImage',
  components: {},
  setup(props: TdImageProps) {
    const {
      src,
      alt,
      fit,
      position,
      shape,
      placeholder,
      loading,
      error,
      overlayTrigger,
      overlayContent,
      lazy,
      gallery,
      onLoad,
      onError,
      ...rest
    } = props;

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
      shouldShowOverlay.value = !shouldShowOverlay.value;
    };

    const renderOverlay = () => {
      if (!overlayContent) return null;
      return (
        <div
          class={[
            `${classPrefix}-image__overlay-content`,
            !shouldShowOverlay && `${classPrefix}-image__overlay-content--hidden`,
          ]}
        >
          {overlayContent}
        </div>
      );
    };

    const renderPlaceholder = () => {
      if (!placeholder) {
        return null;
      }
      return <div className={`${classPrefix}-image__placeholder`}>{placeholder}</div>;
    };

    const renderGalleryShadow = () => {
      if (!gallery) return null;
      return <div className={`${classPrefix}-image__gallery-shadow`} />;
    };

    return {
      classPrefix,
      shape,
      gallery,
      hasMouseEvent,
      handleToggleOverlay,
      rest,
      renderPlaceholder,
      renderGalleryShadow,
      hasError,
      shouldLoad,
      src,
      handleError,
      handleLoad,
      fit,
      position,
      alt,
      isLoaded,
      loading,
      error,
      renderOverlay,
    };
  },
  methods: {},

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
        {...(this.hasMouseEvent
          ? {
            onMouseEnter: this.handleToggleOverlay,
            onMouseLeave: this.handleToggleOverlay,
          }
          : null)}
        {...this.rest}
      >
        {this.renderPlaceholder()}

        {this.renderGalleryShadow()}

        {this.hasError || !this.shouldLoad ? (
          <div className={`${this.classPrefix}-image`} />
        ) : (
          <template>
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
            {!this.isLoaded && (
              <div className={`${this.classPrefix}-image__loading`}>
                {this.loading || (
                  <div direction="vertical" size={8} align="center">
                    图片加载中
                  </div>
                )}
              </div>
            )}
          </template>
        )}

        {this.hasError && (
          <div className={`${this.classPrefix}-image__error`}>
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

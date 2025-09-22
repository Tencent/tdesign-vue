import {
  defineComponent, computed, ref, onMounted, watch,
} from '@vue/composition-api';
import generateBase64Url from '../_common/js/watermark/generateBase64Url';
import randomMovingStyle from '../_common/js/watermark/randomMovingStyle';
import injectStyle from '../_common/js/utils/injectStyle';
import { usePrefixClass } from '../hooks/useConfig';
import { useContent } from '../hooks/tnode';
import { useMutationObserver } from './hooks';
import { useVariables } from '../hooks';
import props from './props';
import setStyle from '../_common/js/utils/setStyle';

export default defineComponent({
  name: 'TWatermark',
  props,
  setup(props) {
    const backgroundImage = ref('');
    const watermarkRef = ref<HTMLElement>();
    const watermarkContentRef = ref<HTMLElement>();
    const parent = ref<HTMLElement>();
    const gapX = computed(() => (props.movable ? 0 : props.x));
    const gapY = computed(() => (props.movable ? 0 : props.y));
    const rotate = computed(() => (props.movable ? 0 : props.rotate));

    const backgroundRepeat = computed(() => {
      if (props.movable) {
        return 'no-repeat';
      }
      return props.isRepeat ? 'repeat' : 'no-repeat';
    });

    const offsetLeft = computed(() => props.offset?.[0] || gapX.value / 2);

    const offsetTop = computed(() => props.offset?.[1] || gapY.value / 2);
    const { fontColor } = useVariables({
      fontColor: '--td-text-color-watermark',
    });
    const bgImageOptions = computed(() => ({
      width: props.width,
      height: props.height,
      rotate: rotate.value,
      lineSpace: props.lineSpace,
      alpha: props.alpha,
      gapX: gapX.value,
      gapY: gapY.value,
      watermarkContent: props.watermarkContent,
      offsetLeft: offsetLeft.value,
      offsetTop: offsetTop.value,
      fontColor: fontColor.value,
    }));
    const removeWaterMark = () => {
      if (!watermarkContentRef.value) return;
      watermarkContentRef.value.remove();
      watermarkContentRef.value = null;
    };

    const injectWaterMark = () => {
      generateBase64Url(bgImageOptions.value, (base64Url) => {
        removeWaterMark();

        backgroundImage.value = base64Url;
        watermarkContentRef.value = document.createElement('div');
        setStyle(watermarkContentRef.value, {
          zIndex: props.zIndex,
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          backgroundSize: `${gapX.value + props.width}px`,
          pointerEvents: 'none',
          backgroundRepeat: backgroundRepeat.value,
          backgroundImage: `url('${backgroundImage.value}')`,
          animation: props.movable ? `watermark infinite ${(props.moveInterval * 4) / 60}s` : 'none',
        });
        watermarkRef.value?.append(watermarkContentRef.value);
      });

      if (props.movable) {
        const keyframesStyle = randomMovingStyle();
        injectStyle(keyframesStyle);
      }
    };
    watch(() => [props, fontColor.value], injectWaterMark, { deep: true });
    onMounted(() => {
      injectWaterMark();

      useMutationObserver(
        parent.value,
        (mutations) => {
          if (props.removable) return;
          mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
              const removeNodes = mutation.removedNodes;
              removeNodes.forEach((node) => {
                const element = node as HTMLElement;
                if (element === watermarkRef.value) {
                  parent.value.appendChild(element);
                }
                if (element === watermarkContentRef.value) {
                  watermarkRef.value.appendChild(element);
                }
              });
            }
          });
        },
        {
          attributes: true,
          childList: true,
          characterData: true,
          subtree: true,
        },
      );
    });

    return {
      gapX,
      gapY,
      backgroundRepeat,
      backgroundImage,
      watermarkRef,
      watermarkContentRef,
    };
  },
  render() {
    const COMPONENT_NAME = usePrefixClass('watermark');
    const renderContent = useContent();

    return (
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
        }}
        class={COMPONENT_NAME.value}
        ref="watermarkRef"
      >
        {renderContent('default', 'content')}
      </div>
    );
  },
});

import {
  defineComponent, computed, ref, onMounted,
} from '@vue/composition-api';
import generateBase64Url from '../_common/js/watermark/generateBase64Url';
import randomMovingStyle from '../_common/js/watermark/randomMovingStyle';
import injectStyle from '../_common/js/utils/injectStyle';
import { usePrefixClass } from '../hooks/useConfig';
import { useContent } from '../hooks/tnode';
import { useMutationObserver } from './hooks';
import props from './props';

export default defineComponent({
  name: 'TWatermark',
  props,
  setup(props) {
    const backgroundImage = ref('');
    const watermarkRef = ref<HTMLElement>();
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

    useMutationObserver(
      watermarkRef,
      (mutations) => {
        if (props.removable) return;
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            const removeNodes = mutation.removedNodes;
            removeNodes.forEach((node) => {
              watermarkRef.value.appendChild(node);
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

    onMounted(() => {
      generateBase64Url(
        {
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
        },
        (base64Url) => {
          backgroundImage.value = base64Url;
        },
      );
      parent.value = watermarkRef.value?.parentElement;
      const keyframesStyle = randomMovingStyle();
      injectStyle(keyframesStyle);
    });

    return {
      gapX,
      gapY,
      backgroundRepeat,
      backgroundImage,
    };
  },
  render() {
    const COMPONENT_NAME = usePrefixClass('watermark');
    const watermarkRef = ref<HTMLElement>();
    const renderContent = useContent();

    return (
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
        }}
        class={COMPONENT_NAME.value}
        ref={watermarkRef}
      >
        {renderContent('default', 'content')}
        <div
          style={{
            zIndex: this.zIndex,
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            backgroundSize: `${this.gapX + this.width}px`,
            pointerEvents: 'none',
            backgroundRepeat: this.backgroundRepeat,
            backgroundImage: `url('${this.backgroundImage}')`,
            animation: props.movable ? `watermark infinite ${(this.moveInterval * 4) / 60}s` : 'none',
          }}
        />
      </div>
    );
  },
});

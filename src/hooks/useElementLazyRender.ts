import {
  onBeforeUnmount, onMounted, Ref, ref, watch,
} from '@vue/composition-api';
import observe from '../_common/js/utils/observe';

export function useElementLazyRender(labelRef: Ref<HTMLElement>, lazyLoad: Ref<boolean>) {
  const ioObserver = ref<IntersectionObserver>();
  const showElement = ref(!lazyLoad.value);

  const handleLazyLoad = () => {
    if (!lazyLoad.value || !labelRef.value || ioObserver.value) return;
    showElement.value = false;
    const io = observe(
      labelRef.value,
      null,
      () => {
        showElement.value = true;
      },
      10,
    );
    ioObserver.value = io;
  };

  onMounted(handleLazyLoad);

  lazyLoad.value && watch([lazyLoad, labelRef], handleLazyLoad);

  onBeforeUnmount(() => {
    if (!lazyLoad.value) return;
    ioObserver.value?.unobserve?.(labelRef.value);
  });

  return {
    showElement,
  };
}

export default useElementLazyRender;

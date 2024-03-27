import { ref, ComputedRef } from '@vue/composition-api';
import { ImageScale } from './type';
import { DEFAULT_IMAGE_SCALE } from './const';

interface InitTransform {
  translateX: number;
  translateY: number;
}

export function useDrag(initTransform: InitTransform) {
  const transform = ref(initTransform);

  const mouseDownHandler = (e: MouseEvent) => {
    const { pageX: startX, pageY: startY } = e;
    const { translateX, translateY } = transform.value;
    const mouseMoveHandler = (e: MouseEvent) => {
      const { pageX, pageY } = e;
      transform.value = {
        translateX: translateX + pageX - startX,
        translateY: translateY + pageY - startY,
      };
    };
    const mouseUpHandler = () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  const resetTransform = () => {
    transform.value = { ...initTransform };
  };

  return { transform, mouseDownHandler, resetTransform };
}

export function useMirror() {
  const mirror = ref(1);
  const onMirror = () => {
    mirror.value *= -1;
  };
  const resetMirror = () => {
    mirror.value = 1;
  };

  return { mirror, onMirror, resetMirror };
}

export function useScale(imageScale: ComputedRef<ImageScale>) {
  const {
    max = DEFAULT_IMAGE_SCALE.max,
    min = DEFAULT_IMAGE_SCALE.min,
    defaultScale = DEFAULT_IMAGE_SCALE.defaultScale,
  } = imageScale.value;
  const scaleVal = Math.min(Math.max(defaultScale, min), max);
  const scale = ref(scaleVal);

  const setScale = (newScale: number) => {
    const { max = DEFAULT_IMAGE_SCALE.max, min = DEFAULT_IMAGE_SCALE.min } = imageScale.value;
    let value = newScale;
    if (newScale < min) {
      value = min;
    }
    if (newScale > max) {
      value = max;
    }
    scale.value = value;
  };

  const onZoomIn = () => {
    const { step = DEFAULT_IMAGE_SCALE.step } = imageScale.value;
    setScale(scale.value + step);
  };
  const onZoomOut = () => {
    const { step = DEFAULT_IMAGE_SCALE.step } = imageScale.value;
    setScale(scale.value - step);
  };
  const resetScale = () => {
    scale.value = scaleVal;
  };

  return {
    scale,
    onZoomIn,
    onZoomOut,
    resetScale,
  };
}

export function useRotate() {
  const rotate = ref(0);
  const ROTATE_DEG = 90;

  const onRotate = () => {
    rotate.value += ROTATE_DEG;
  };
  const resetRotate = () => {
    rotate.value = 0;
  };

  return { rotate, onRotate, resetRotate };
}

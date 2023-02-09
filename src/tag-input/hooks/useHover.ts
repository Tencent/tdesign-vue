import { ref, SetupContext } from '@vue/composition-api';

export interface UseHoverParams {
  readonly: boolean;
  disabled: boolean;
  onMouseenter: (context: { e: MouseEvent }) => void;
  onMouseleave: (context: { e: MouseEvent }) => void;
}

export default function useHover(props: UseHoverParams, { emit }: SetupContext) {
  const {
    disabled, readonly, onMouseenter, onMouseleave,
  } = props;
  const isHover = ref<boolean>(false);

  const addHover = (context: { e: MouseEvent }) => {
    if (readonly || disabled) return;
    isHover.value = true;
    onMouseenter?.(context);
    emit('mouseenter', context);
  };

  const cancelHover = (context: { e: MouseEvent }) => {
    if (readonly || disabled) return;
    isHover.value = false;
    onMouseleave?.(context);
    emit('mouseleave', context);
  };

  return { isHover, addHover, cancelHover };
}

import { ref, SetupContext, Ref } from '@vue/composition-api';

export interface UseHoverParams {
  readonly: Ref<boolean>;
  disabled: Ref<boolean>;
  onMouseenter: (context: { e: MouseEvent }) => void;
  onMouseleave: (context: { e: MouseEvent }) => void;
}

export default function useHover(props: UseHoverParams, { emit }: SetupContext) {
  const {
    disabled, readonly, onMouseenter, onMouseleave,
  } = props;
  const isHover = ref<boolean>(false);

  const addHover = (context: { e: MouseEvent }) => {
    if (readonly.value || disabled.value) return;
    isHover.value = true;
    onMouseenter?.(context);
    emit('mouseenter', context);
  };

  const cancelHover = (context: { e: MouseEvent }) => {
    if (readonly.value || disabled.value) return;
    isHover.value = false;
    onMouseleave?.(context);
    emit('mouseleave', context);
  };

  return { isHover, addHover, cancelHover };
}

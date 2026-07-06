import { ref } from '@vue/composition-api';
import type { PopupProps, PopupVisibleChangeContext } from '../../popup';

export interface UsePopupVisibleChangeParams {
  readonly?: boolean;
  popupProps?: PopupProps;
}

// 兼容模板 kebab-case 写法（与 Popup / Dropdown 一致）
type KebabPopupProps = PopupProps & { 'on-visible-change'?: PopupProps['onVisibleChange'] };

/**
 * 统一通知 popupProps.onVisibleChange 并完成受控关闭。
 * 底层 Popup 仅在用户交互时 emit visible-change，程序化关闭不会触发，故此处主动补发，保持单选/范围一致。
 * popupVisible 由本 hook 内部持有（closePopup 直接改写），避免外部传入 ref 后被重新赋值；
 * 程序化关闭无对应 PopupTriggerSource，不伪造 trigger，仅在确有真实事件时透传 e。
 */
export default function usePopupVisibleChange({ readonly, popupProps }: UsePopupVisibleChangeParams) {
  // popupVisible 由本 hook 持有，供调用方读写（打开面板、受控同步等）
  const popupVisible = ref(false);

  /**
   * 通知 popupProps.onVisibleChange
   * @param visible 当前是否可见
   * @param context 触发上下文
   */
  const notifyPopupVisibleChange = (visible: boolean, context?: PopupVisibleChangeContext) => {
    if (readonly) return;
    // 兼容模板 kebab-case 写法（与 Popup / Dropdown 一致），优先 camelCase
    const kebabHandler = (popupProps as KebabPopupProps | undefined)?.['on-visible-change'];
    const handler = popupProps?.onVisibleChange ?? kebabHandler;
    handler?.(visible, context);
  };

  /**
   * 关闭面板
   * @param context 触发上下文，用于通知 popupProps.onVisibleChange
   */
  const closePopup = (context?: PopupVisibleChangeContext) => {
    if (!popupVisible.value || readonly) return;
    notifyPopupVisibleChange(false, context ?? {});
    popupVisible.value = false;
  };

  return { popupVisible, notifyPopupVisibleChange, closePopup };
}

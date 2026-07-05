import { ref } from '@vue/composition-api';
import type { PopupVisibleChangeContext } from '../../popup/type';

/**
 * 统一处理 popupProps.onVisibleChange 的通知与受控关闭。
 * 由于底层 Popup 仅在自身交互（点触发元素/点外部/ESC/hover）时才会 emit visible-change，
 * 组件内程序化关闭（直接修改 popupVisible）不会触发，因此需要此处主动通知，保持单选/范围一致。
 *
 * 返回的 popupVisible 由本 hook 内部创建并持有，closePopup 关闭面板时直接修改该 ref，
 * 避免在调用方之间传递 ref 作为参数后再被重新赋值（no-param-reassign）。
 *
 * 注意：选日期/确认/预设/清除等属于“组件内程序化关闭”，没有对应的 PopupTriggerSource，
 * 因此不伪造 trigger，仅在确有真实触发事件时透传 e；消费方可通过 trigger 是否存在来区分
 * “程序化关闭”与“用户点击外部/ESC 等原生关闭”。
 */
export default function usePopupVisibleChange(props: any) {
  // popupVisible 由本 hook 持有，供调用方读写（打开面板、受控同步等）
  const popupVisible = ref(false);

  // 统一通知 popupProps 中的 visible 变化回调
  const notifyPopupVisibleChange = (visible: boolean, context?: PopupVisibleChangeContext) => {
    if (props.readonly) return;
    props.popupProps?.onVisibleChange?.(visible, context);
    // 兼容模板 kebab-case 写法
    // @ts-ignore
    props.popupProps?.['on-visible-change']?.(visible, context);
  };

  // 受控关闭面板，并主动触发 onVisibleChange
  const closePopup = (context?: PopupVisibleChangeContext) => {
    if (!popupVisible.value || props.readonly) return;
    notifyPopupVisibleChange(false, context ?? {});
    popupVisible.value = false;
  };

  return { popupVisible, notifyPopupVisibleChange, closePopup };
}

import {
  ref, toRefs, computed, getCurrentInstance,
} from '@vue/composition-api';
import isObject from 'lodash/isObject';
import isFunction from 'lodash/isFunction';
import { TdPopupProps, PopupVisibleChangeContext } from '../popup';
import { TdSelectInputProps } from './type';
import { Styles } from '../common';

export type overlayInnerStyleProps = Pick<
  TdSelectInputProps,
  'popupProps' | 'autoWidth' | 'readonly' | 'onPopupVisibleChange' | 'disabled' | 'allowInput' | 'popupVisible'
>;

// 单位：px
const MAX_POPUP_WIDTH = 1000;

export default function useOverlayInnerStyle(
  props: overlayInnerStyleProps,
  extra?: {
    afterHidePopup?: (ctx: PopupVisibleChangeContext) => void;
  },
) {
  const instance = getCurrentInstance();

  const { popupProps, autoWidth } = toRefs(props);
  const innerPopupVisible = ref(false);

  const matchWidthFunc = (triggerElement: HTMLElement, popupElement: HTMLElement) => {
    // 避免因滚动条出现文本省略，预留宽度 8
    const SCROLLBAR_WIDTH = popupElement.scrollHeight > popupElement.offsetHeight ? 8 : 0;
    const width = popupElement.offsetWidth + SCROLLBAR_WIDTH >= triggerElement.offsetWidth
      ? popupElement.offsetWidth
      : triggerElement.offsetWidth;
    let otherOverlayInnerStyle: Styles = {};
    if (
      popupProps.value
      && typeof popupProps.value.overlayInnerStyle === 'object'
      && !popupProps.value.overlayInnerStyle.width
    ) {
      otherOverlayInnerStyle = popupProps.value.overlayInnerStyle;
    }
    return {
      width: `${Math.min(width, MAX_POPUP_WIDTH)}px`,
      ...otherOverlayInnerStyle,
    };
  };

  const onInnerPopupVisibleChange = (visible: boolean, ctx: PopupVisibleChangeContext) => {
    if (props.disabled || props.readonly) return;
    // 如果点击触发元素（输入框）且为可输入状态，则继续显示下拉框
    const newVisible = ctx.trigger === 'trigger-element-click' && props.allowInput ? true : visible;
    // 重复点击触发元素时，下拉框展示状态不变，不重复触发事件
    if (props.popupVisible !== newVisible) {
      innerPopupVisible.value = newVisible;
      props.onPopupVisibleChange?.(newVisible, ctx);
      instance.emit('popup-visible-change', newVisible, ctx);
      if (!newVisible) {
        extra?.afterHidePopup?.(ctx);
      }
    }
  };

  const tOverlayInnerStyle = computed(() => {
    let result: TdPopupProps['overlayInnerStyle'] = {};
    const overlayInnerStyle = popupProps.value?.overlayInnerStyle || {};
    if (isFunction(overlayInnerStyle) || (isObject(overlayInnerStyle) && overlayInnerStyle.width)) {
      result = overlayInnerStyle;
    } else if (!autoWidth.value) {
      result = matchWidthFunc;
    }
    return result;
  });

  return {
    tOverlayInnerStyle,
    innerPopupVisible,
    onInnerPopupVisibleChange,
  };
}

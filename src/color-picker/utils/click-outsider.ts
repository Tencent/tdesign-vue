import { ComponentPublicInstance } from '@vue/composition-api';
import { VNode } from 'vue';
import { prefix } from '../../config';
import { on } from '../../utils/dom';

type Handler = (...args: unknown[]) => unknown;

interface ElementHandler {
  elements: HTMLElement[];
  handler: Handler;
}

type FlushList = Map<number, ElementHandler>;

const POPUP_SELECTOR = `.${prefix}-popup`;
const nodeList: FlushList = new Map();

let startClick: MouseEvent;

let uid = 0;

if (window && window.document) {
  on(document, 'mousedown', (e: MouseEvent) => (startClick = e));
  on(document, 'mouseup', (e: MouseEvent) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const { handler } of nodeList.values()) {
      handler(e);
    }
  });
}

type NodeElement = HTMLElement | VNode | ComponentPublicInstance;

const createDocumentHandler = (elements: HTMLElement[], handler: Handler, includePopup = true) => (e: MouseEvent) => {
  if (includePopup) {
    document.querySelectorAll(POPUP_SELECTOR).forEach((ele: Element) => {
      elements.push(ele as HTMLElement);
    });
  }
  const elementList = Array.from(new Set(elements));
  const mouseUpTarget = e.target as Node;
  const mouseDownTarget = startClick?.target as Node;
  const isTargetUnExists = !mouseUpTarget || !mouseDownTarget;
  if (isTargetUnExists) {
    return;
  }
  const isContained = elementList.some((el) => {
    const isSelf = el === mouseUpTarget;
    const isContainedByEl = el.contains(mouseUpTarget) || el.contains(mouseDownTarget);
    return isSelf || isContainedByEl;
  });
  if (isContained) {
    return;
  }
  handler();
};

/**
 * 元素外面点击
 *
 * @example
 *  onMounted(() => {
 *    // 确保元素已挂载
 *    addClickOutsider(refs.value, () => {
 *      visible.value = false
 *    });
 *  });
 *
 *  onBeforeUnmount(() => removeClickOutsider);
 */
export const useClickOutsider = () => {
  uid += 1;
  const clickOutsiderId = uid;
  const addClickOutsider = (els: NodeElement[], handler: Handler) => {
    const elements = Array.from(new Set(els.filter((el) => el))).map((el: any) => {
      const node = (el.el || el.$el || el) as HTMLElement;
      return node;
    });
    const documentHandler = createDocumentHandler(elements, handler, true);
    nodeList.set(clickOutsiderId, {
      elements,
      handler: documentHandler,
    });
  };

  const removeClickOutsider = () => {
    nodeList.has(clickOutsiderId) && nodeList.delete(clickOutsiderId);
  };
  return {
    clickOutsiderId,
    addClickOutsider,
    removeClickOutsider,
  };
};

export default useClickOutsider;

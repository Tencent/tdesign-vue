import { DirectiveBinding } from 'vue/types/options';
import { getAttach } from './dom';

const TransferDom = {
  inserted(el: HTMLElement, binding: DirectiveBinding) {
    if (!binding.value) return;
    const parentNode = getAttach(binding.value);
    parentNode?.appendChild(el);
  },
  unbind(el: HTMLElement) {
    el.parentNode?.removeChild(el);
  },
};

export default TransferDom;

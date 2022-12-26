import type { DirectiveBinding } from 'vue/types/options';
import { TdLoadingProps } from './type';
import produceLoading from './plugin';

const INSTANCE_KEY = Symbol('TdLoading');

const createInstance = (el: HTMLElement, binding: DirectiveBinding) => {
  const { fullscreen, inheritColor } = binding.modifiers;
  const options: TdLoadingProps = {
    attach: () => el,
    fullscreen: fullscreen ?? false,
    inheritColor: inheritColor ?? false,
    loading: binding.value,
  };

  // eslint-disable-next-line no-param-reassign
  el[INSTANCE_KEY] = {
    options,
    instance: produceLoading(options),
  };
};

const vLoading = {
  inserted(el: HTMLElement, binding: DirectiveBinding) {
    if (binding.value) {
      createInstance(el, binding);
    }
  },
  update(el: HTMLElement, binding: DirectiveBinding) {
    const instance = el[INSTANCE_KEY];
    const { value, oldValue } = binding;
    if (!!oldValue !== !!value) {
      if (value) {
        createInstance(el, binding);
      } else {
        instance?.instance.hide();
      }
    }
  },
};

export default vLoading;

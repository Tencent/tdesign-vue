import type { DirectiveBinding, DirectiveOptions } from 'vue/types/options';
import { mapKeys, isEqual, isObject } from 'lodash-es';
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

  if (isObject(binding.value)) {
    mapKeys(binding.value, (value, key) => {
      options[key] = value;
    });
  }

  // eslint-disable-next-line no-param-reassign
  el[INSTANCE_KEY] = {
    options,
    instance: produceLoading(options),
  };
};

const vLoading: DirectiveOptions = {
  inserted(el: HTMLElement, binding: DirectiveBinding) {
    if (binding.value) {
      createInstance(el, binding);
    }
  },
  update(el: HTMLElement, binding: DirectiveBinding) {
    const instance = el[INSTANCE_KEY];
    const { value, oldValue } = binding;
    if (!isEqual(value, oldValue)) {
      const loading = value?.loading ?? value;
      if (loading) {
        createInstance(el, binding);
      } else {
        instance?.instance.hide();
      }
    }
  },
  unbind(el) {
    el[INSTANCE_KEY]?.instance.hide();
  },
};

export default vLoading;

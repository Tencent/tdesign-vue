import { VNode } from 'vue';
import { TdOptionProps } from './type';

// eslint-disable-next-line import/prefer-default-export
export function parseOptions(vnodes: VNode[]): TdOptionProps[] {
  if (!vnodes) return [];
  return vnodes.reduce((options, vnode) => {
    const { componentOptions } = vnode;
    if (componentOptions?.tag === 't-option') {
      const propsData = componentOptions.propsData as any;
      return options.concat({
        label: propsData.label,
        value: propsData.value,
        disabled: propsData.disabled,
        content: componentOptions.children ? () => componentOptions.children : propsData.content,
        default: propsData.default,
      });
    }
    if (componentOptions?.tag === 't-option-group') {
      return options.concat(parseOptions(componentOptions.children));
    }
    return options;
  }, []);
}

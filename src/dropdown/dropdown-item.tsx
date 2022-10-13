import { defineComponent, ref, PropType } from '@vue/composition-api';
import { TdDropdownProps } from '../dropdown/type';
import dropdownItemProps from './dropdown-item-props';
import { useTNodeJSX } from '../hooks/tnode';
import { usePrefixClass } from '../hooks/useConfig';
import { pxCompat } from '../utils/helper';
import ripple from '../utils/ripple';
import { getKeepAnimationMixins } from '../config-provider/config-receiver';
import { AnimationType } from '../config-provider/type';

const keepAnimationMixins = getKeepAnimationMixins();

export default defineComponent({
  name: 'TDropdownItem',
  mixins: [keepAnimationMixins],
  directives: {
    ripple,
  },
  props: {
    ...dropdownItemProps,
    maxColumnWidth: {
      type: [String, Number] as PropType<TdDropdownProps['maxColumnWidth']>,
      default: 100,
    },
    minColumnWidth: {
      type: [String, Number] as PropType<TdDropdownProps['minColumnWidth']>,
      default: 10,
    },
    isSubmenu: Boolean,
  },
  setup(props, { emit }) {
    const itemRef = ref<HTMLElement>();

    const dropdownItemClass = usePrefixClass('dropdown__item');
    const handleItemClick = (e: MouseEvent) => {
      props.onClick?.(props.value, {
        e,
      });
      emit('click', props.value, {
        e,
      });
    };

    return {
      itemRef,
      dropdownItemClass,
      handleItemClick,
    };
  },
  render() {
    const classes = [
      this.dropdownItemClass,
      `${this.dropdownItemClass}--theme-${this.theme}`,
      {
        [`${this.dropdownItemClass}--active`]: this.active,
        [`${this.dropdownItemClass}--disabled`]: this.disabled,
      },
    ];
    const renderTNodeJSX = useTNodeJSX();
    const prefixIcon = renderTNodeJSX('prefixIcon');

    return (
      <li
        class={classes}
        onClick={this.handleItemClick}
        style={{
          maxWidth: pxCompat(this.maxColumnWidth),
          minWidth: pxCompat(this.minColumnWidth),
        }}
        v-ripple={!this.isSubmenu && (this.keepAnimation as Record<AnimationType, boolean>).ripple}
        ref={this.itemRef}
      >
        {this.prefixIcon ? <div class={`${this.dropdownItemClass}-icon`}>{prefixIcon}</div> : null}
        {renderTNodeJSX('default')}
      </li>
    );
  },
});

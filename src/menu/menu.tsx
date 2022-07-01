import {
  defineComponent, ref, computed, watchEffect, provide, watch, onMounted,
} from '@vue/composition-api';
import { prefix } from '../config';
import props from './props';
import { MenuValue } from './type';
import { TdMenuInterface, TdOpenType } from './const';
import { renderContent, renderTNodeJSX } from '../utils/render-tnode';
import VMenu from './v-menu';

export default defineComponent({
  name: 'TMenu',
  props: { ...props },
  model: {
    prop: 'value',
    event: 'change',
  },
  setup(props, ctx) {
    const mode = ref(props.expandType);
    const theme = computed(() => props.theme);
    const isMutex = computed(() => props.expandMutex);
    const menuClass = computed(() => [
      `${prefix}-default-menu`,
      `${prefix}-menu--${props.theme}`,
      {
        [`${prefix}-is-collapsed`]: props.collapsed,
      },
    ]);
    const innerClasses = computed(() => [
      `${prefix}-menu`,
      { [`${prefix}-menu--scroll`]: mode.value !== 'popup' },
      'narrow-scrollbar',
    ]);
    const expandWidth = computed(() => {
      const { width } = props;
      const format = (val: string | number) => (typeof val === 'number' ? `${val}px` : val);
      if (Array.isArray(width)) return width.map((item) => format(item));

      return [format(width), '64px'];
    });
    const styles = computed(() => ({
      height: '100%',
      width: props.collapsed ? expandWidth.value[1] : expandWidth.value[0],
    }));
    const activeValue = ref(props.defaultValue || props.value);
    const activeValues = ref([]);
    const expandValues = ref(props.expanded || []);
    const deliver = (evt: string) => {
      const func = `on${evt[0].toUpperCase() + evt.slice(1)}`;
      return (val: any) => {
        if (typeof props[func] === 'function') {
          props[func](val);
        }
        ctx.emit(evt, val);
      };
    };
    const emitChange = deliver('change');
    const emitExpand = deliver('expand');

    watchEffect(() => {
      mode.value = props.collapsed ? 'popup' : props.expandType;
    });

    const vMenu = new VMenu({ isMutex: isMutex.value, expandValues: expandValues.value });
    provide<TdMenuInterface>('TdMenu', {
      activeValue,
      activeValues,
      expandValues,
      mode,
      theme,
      isHead: false,
      vMenu,
      select: (value: MenuValue) => {
        emitChange(value);
      },
      open: (value: MenuValue, type: TdOpenType) => {
        let expanded = [...expandValues.value];

        if (mode.value === 'normal') {
          expanded = vMenu.expand(value);
        } else {
          const index = expanded.indexOf(value);

          if (type === 'add') {
            if (index === -1) {
              // 可能初始expanded里包含了该value
              expanded.push(value);
            }
          } else if (type === 'remove') {
            expanded.splice(index, 1);
          }
        }
        emitExpand(expanded);
      },
    });

    // watch
    watch(
      () => props.expanded,
      (value) => {
        expandValues.value = value;
        vMenu.expandValues = new Set(value);
      },
    );
    const updateActiveValues = (value: MenuValue) => {
      activeValue.value = value;
      activeValues.value = vMenu.select(value);
    };
    watch(() => props.value, updateActiveValues);
    watch(() => props.defaultValue, updateActiveValues);

    // lifecycle
    onMounted(() => {
      activeValues.value = vMenu.select(activeValue.value);
    });

    return {
      styles,
      menuClass,
      innerClasses,
      activeValue,
      activeValues,
      expandValues,
    };
  },
  render() {
    if (this.$slots.options) {
      console.warn('TDesign Warn: `options` slot is going to be deprecated, please use `operations` for slot instead.');
    }
    const operations = renderContent(this, 'operations', 'options');
    const logo = renderTNodeJSX(this, 'logo');
    return (
      <div class={this.menuClass} style={this.styles}>
        <div class={`${prefix}-default-menu__inner`}>
          {logo && <div class={`${prefix}-menu__logo`}>{logo}</div>}
          <ul class={this.innerClasses}>{renderContent(this, 'default', 'content')}</ul>
          {operations && <div class={`${prefix}-menu__operations`}>{operations}</div>}
        </div>
      </div>
    );
  },
});

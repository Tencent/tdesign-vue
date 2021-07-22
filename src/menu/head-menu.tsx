import { defineComponent, computed, provide, ref, reactive, watch } from '@vue/composition-api';
import { prefix } from '../config';
import props from './head-menu-props';
import { MenuValue } from './type';
import { TdMenuInterface, TdMenuItem } from './const';
import { Tabs, TabPanel } from '../tabs';
import { renderContent, renderTNodeJSX } from '../utils/render-tnode';

const name = `${prefix}-head-menu`;

export default defineComponent({
  name,
  props,
  model: {
    prop: 'value',
    event: 'change',
  },
  components: { Tabs, TabPanel },
  setup(props, ctx) {
    const activeIndexValue = ref(props.defaultValue || props.value || '');
    const expandedArray = ref(props.defaultExpanded || props.expanded || []);
    const theme = computed(() => props.theme);
    const menuClass = computed(() => [
      `${prefix}-menu`,
      `${prefix}-head-menu`,
      `${prefix}-menu-mode__${props.expandType}`,
      `${prefix}-menu--${props.theme}`,
    ]);
    const openedNames = computed(() => props.expanded);
    const mode = ref(props.expandType);
    const submenu = reactive([]);
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

    provide<TdMenuInterface>('TdMenu', {
      mode,
      theme,
      isHead: true,
      expandedArray,
      activeIndexValue,
      select: (val: MenuValue) => {
        emitChange(val);
      },
      selectSubMenu: (menuItems: TdMenuItem[]) => {
        submenu.length = 0;
        submenu.push(...menuItems);
      },
      open: (val: MenuValue) => {
        const index = expandedArray.value.indexOf(val);

        expandedArray.value.splice(0, 1);
        if (index === -1) {
          expandedArray.value.push(val);
          emitExpand(expandedArray.value);
          return true;
        }
        emitExpand(expandedArray.value);
        return false;
      },
    });

    // methods
    const handleTabChange = (val: MenuValue) => {
      emitChange(val);
    };

    // watch
    watch(
      () => props.expanded,
      (value) => {
        expandedArray.value = value;
      },
    );
    watch(
      () => props.value,
      (value) => {
        activeIndexValue.value = value;
      },
    );

    return {
      mode,
      menuClass,
      openedNames,
      expandedArray,
      activeIndexValue,
      submenu,
      handleTabChange,
    };
  },
  methods: {
    renderNormalSubmenu() {
      if (this.submenu.length === 0) return null;
      return (
        <ul class={[`${prefix}-head-menu__submenu`, `${prefix}-submenu`]}>
          {
            <t-tabs value={this.activeIndexValue} onChange={this.handleTabChange}>
              { this.submenu.map(item => (
                <t-tab-panel value={item.value} label={item.label[0].text} />
              ))}
            </t-tabs>
          }
        </ul>
      );
    },
  },
  render() {
    if (this.$slots.options) {
      console.warn('TDesign Warn: `options` slot is going to be deprecated, please use `operations` for slot instead.');
    }
    const operations = renderContent(this, 'operations', 'options');
    const logo = renderTNodeJSX(this, 'logo');
    return (
      <div class={this.menuClass}>
        <div class={`${prefix}-head-menu__inner`}>
          {logo && <div class={`${prefix}-menu__logo`}>{logo}</div>}
          <ul class={`${prefix}-menu`}>
            {renderContent(this, 'default', 'content')}
          </ul>
          {operations && <div class={`${prefix}-menu__options`}>{operations}</div>}
        </div>
        {this.mode === 'normal' && this.renderNormalSubmenu()}
      </div>
    );
  },
});

import Vue, { VNode, VueConstructor } from 'vue';
import kebabCase from 'lodash/kebabCase';
import props from './props';
import { prefix } from '../config';
import TTabPanel from './tab-panel';
import TTabNav from './tab-nav';
import { TabValue, TdTabsProps } from './type';
import { emitEvent } from '../utils/event';

interface TabVue extends Vue {
  listPanels?: Array<VNode>;
}

export default (Vue as VueConstructor<TabVue>).extend({
  name: 'TTabs',
  model: {
    prop: 'value',
    event: 'change',
  },

  components: {
    TTabPanel,
    TTabNav,
  },

  ...{ listPanels: null as Array<VNode> },

  props: { ...props },

  provide(): { parent: TabVue } {
    return {
      parent: this,
    };
  },

  data() {
    return {
      panels: [] as Array<InstanceType<typeof TTabPanel>>,
    };
  },

  watch: {
    list: {
      handler() {
        this.listPanels = this.createListPanels();
      },
      deep: true,
    },
  },

  mounted() {
    this.updatePanels();
  },

  updated() {
    this.$nextTick(() => {
      this.updatePanels();
    });
  },

  methods: {
    updatePanels({ force = false } = {}) {
      if (!this.listPanels) {
        this.panels = this.panels || [];
        return;
      }
      const newPanels = this.listPanels
        .map((panel: VNode) => panel.componentInstance as InstanceType<typeof TTabPanel>)
        .filter(Boolean)
        .filter((child) => kebabCase(child?.$vnode?.tag).endsWith(`${prefix}-tab-panel`));
      const isUnchanged = () => newPanels.length === this.panels.length && this.panels.every((panel, index) => panel === newPanels[index]);
      if (isUnchanged() && !force) return;
      this.panels = newPanels;
    },
    onAddTab(e: MouseEvent) {
      emitEvent<Parameters<TdTabsProps['onAdd']>>(this, 'add', { e });
    },
    onChangeTab(value: TabValue) {
      emitEvent<Parameters<TdTabsProps['onChange']>>(this, 'change', value);
    },
    onRemoveTab({ e, value, index }: Parameters<TdTabsProps['onRemove']>[0]) {
      const panel = this.panels[index];
      const eventData = {
        value,
        index,
        e,
      };
      emitEvent<Parameters<TdTabsProps['onRemove']>>(this, 'remove', eventData);
      if (!panel) return;
      emitEvent<Parameters<TdTabsProps['onRemove']>>(panel, 'remove', eventData);
    },
    renderHeader() {
      const tabNavProps = {
        theme: this.theme,
        value: this.value,
        size: this.size,
        disabled: this.disabled,
        placement: this.placement,
        addable: this.addable,
        panels: this.panels,
      };
      return (
        <div
          class={{
            [`${prefix}-tabs__header`]: true,
            [`${prefix}-is-${this.placement}`]: true,
          }}
        >
          <TTabNav
            props={tabNavProps}
            onChange={this.onChangeTab}
            onAdd={this.onAddTab}
            onRemove={this.onRemoveTab}
          ></TTabNav>
        </div>
      );
    },
    createListPanels() {
      return this.list.map((item) => <TTabPanel props={{ ...item }} onRemove={this.onRemoveTab}></TTabPanel>);
    },
    renderList(): VNode[] {
      if (!this.listPanels) {
        return this.createListPanels();
      }
      return this.listPanels;
    },
    renderContent() {
      // default 的函数可能返回null，此时为了防止 panels 的更新失败，默认用空数组
      this.listPanels = this.list ? this.renderList() : this.$scopedSlots.default?.({}) || [];
      return <div class={[`${prefix}-tabs__content`]}>{this.listPanels}</div>;
    },
  },

  render() {
    return (
      <div class={[`${prefix}-tabs`]}>
        {this.placement !== 'bottom'
          ? [this.renderHeader(), this.renderContent()]
          : [this.renderContent(), this.renderHeader()]}
      </div>
    );
  },
});

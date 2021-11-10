import Vue, { VNode } from 'vue';
import kebabCase from 'lodash/kebabCase';
import props from './props';
import { prefix } from '../config';
import TTabPanel from './tab-panel';
import TTabNav from './tab-nav';
import { TabValue, TdTabsProps } from './type';
import { emitEvent } from '../utils/event';

export default Vue.extend({
  name: 'TTabs',
  model: {
    prop: 'value',
    event: 'change',
  },

  components: {
    TTabPanel,
    TTabNav,
  },

  props: { ...props },

  data() {
    return {
      panels: [] as Array<InstanceType<typeof TTabPanel>>,
      listPanels: null as Array<VNode>,
    };
  },

  watch: {
    list() {
      this.updateListPanels();
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
    updatePanels() {
      const newPanels = (this.$children as Array<InstanceType<typeof TTabPanel>>).filter((child) => kebabCase(child?.$vnode?.tag).endsWith(`${prefix}-tab-panel`));
      const isUnchange = () => newPanels.length === this.panels.length && this.panels.every((panel, index) => panel === newPanels[index]);
      if (isUnchange()) return;
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
          <TTabNav props={tabNavProps} onChange={this.onChangeTab} onAdd={this.onAddTab} onRemove={this.onRemoveTab}></TTabNav>
        </div>
      );
    },
    updateListPanels() {
      this.listPanels = this.list.map((item) => (
        <TTabPanel props={{ ...item }} onRemove={this.onRemoveTab}></TTabPanel>
      ));
    },
    renderList(): VNode[] {
      if (!this.listPanels) {
        this.updateListPanels();
      }
      return this.listPanels;
    },
    renderContent() {
      return (
        <div class={[`${prefix}-tabs__content`]}>
          { this.list ? this.renderList() : this.$scopedSlots.default?.({}) }
        </div>
      );
    },
  },

  render() {
    return (
      <div class={[`${prefix}-tabs`]}>
        { this.placement !== 'bottom' ? [this.renderHeader(), this.renderContent()] : [this.renderContent(), this.renderHeader()] }
      </div>
    );
  },
});

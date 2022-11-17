import { ChevronRightIcon as TdChevronRightIcon } from 'tdesign-icons-vue';
import Tooltip from '../tooltip/index';
import props from './breadcrumb-item-props';
import { isNodeOverflow } from '../utils/dom';
import { TNodeReturnValue } from '../common';
import { getClassPrefixMixins, getGlobalIconMixins } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';
import { renderTNodeJSX } from '../utils/render-tnode';

const classPrefixMixins = getClassPrefixMixins('breadcrumb');

export interface LocalTBreadcrumb {
  separator: Function | string;
  theme: string;
  $slots: {
    separator: TNodeReturnValue;
  };
  maxItemWidth: string;
}
const localTBreadcrumbOrigin: LocalTBreadcrumb = {
  separator: '',
  theme: 'light',
  $slots: { separator: '' },
  maxItemWidth: undefined,
};
export default mixins(classPrefixMixins, getGlobalIconMixins()).extend({
  name: 'TBreadcrumbItem',

  props: {
    ...props,
  },

  inject: ['tBreadcrumb'],

  data() {
    return {
      localTBreadcrumb: localTBreadcrumbOrigin,
      themeClassName: '',
      $router: null,
      isCutOff: false,
    };
  },

  components: {
    Tooltip,
  },

  computed: {
    maxWithStyle() {
      const { localTBreadcrumb } = this;
      const { maxItemWidth } = localTBreadcrumb;
      const maxWith: string = this.maxWidth || maxItemWidth || '120';
      return { 'max-width': `${maxWith}px` };
    },
  },

  watch: {
    tBreadcrumb: {
      immediate: true,
      handler(v): void {
        this.localTBreadcrumb = v;
      },
    },
  },

  created() {
    const tBreadcrumb = this.localTBreadcrumb;
    this.themeClassName = tBreadcrumb.theme;
  },
  mounted() {
    this.isCutOff = isNodeOverflow(this.$refs.breadcrumbText);
  },
  beforeUpdate() {
    this.isCutOff = isNodeOverflow(this.$refs.breadcrumbText);
  },
  methods: {
    bindEvent() {
      const { to } = this;
      const router = this.router || this.$router;
      if (to && router) {
        this.replace ? router.replace(to) : router.push(to);
      }
    },
  },

  render() {
    const {
      localTBreadcrumb, href, target, to, disabled,
    } = this;
    const { ChevronRightIcon } = this.useGlobalIcon({ ChevronRightIcon: TdChevronRightIcon });
    const { separator } = localTBreadcrumb;
    const separatorSlot = localTBreadcrumb.$slots.separator;
    const separatorPropContent = typeof separator === 'function' ? separator() : separator;
    const separatorContent = separatorPropContent || separatorSlot || <ChevronRightIcon />;
    const itemClass = [`${this.componentName}__item`, this.themeClassName];
    const textClass = [`${this.componentName}--text-overflow`];

    if (disabled) {
      textClass.push(`${this.classPrefix}-is-disabled`);
    }

    if (this.$listeners.click) {
      textClass.push(`${this.classPrefix}-gestureClass`);
    }

    const clickEvent = to && !disabled ? { on: { click: this.bindEvent } } : {};
    const textContent = (
      <span class={`${this.componentName}__inner`} style={this.maxWithStyle}>
        {renderTNodeJSX(this, 'icon')}
        <span ref="breadcrumbText" class={`${this.componentName}__inner-text`}>
          {this.$slots.default}
        </span>
      </span>
    );
    let itemContent = (
      <span class={textClass} {...{ on: this.$listeners }} {...clickEvent}>
        {textContent}
      </span>
    );

    if (href && !disabled) {
      textClass.push(`${this.classPrefix}-link`);
      itemContent = (
        <a class={textClass} href={href} target={target} {...{ on: this.$listeners }}>
          {textContent}
        </a>
      );
    }
    return (
      <div class={itemClass}>
        {this.isCutOff ? <Tooltip content={() => this.$slots.default}>{itemContent}</Tooltip> : itemContent}
        <span class={`${this.componentName}__separator`}>{separatorContent}</span>
      </div>
    );
  },
});

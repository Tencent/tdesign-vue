import Vue from 'vue';
import { ChevronRightIcon } from 'tdesign-icons-vue';
import { prefix } from '../config';
import Tooltip from '../tooltip/index';
import props from './breadcrumb-item-props';
import { isNodeOverflow } from '../utils/dom';
import { TNodeReturnValue } from '../common';

const name = `${prefix}-breadcrumb__item`;
const separatorClass = `${prefix}-breadcrumb__separator`;
const disableClass = `${prefix}-is-disabled`;
const linkClass = `${prefix}-link`;
const maxLengthClass = `${prefix}-breadcrumb__inner`;
const textFlowClass = `${prefix}-breadcrumb--text-overflow`;
const gestureClass = `${prefix}-gestureClass`;

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
export default Vue.extend({
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
    const { separator } = localTBreadcrumb;
    const separatorSlot = localTBreadcrumb.$slots.separator;
    const separatorPropContent = typeof separator === 'function' ? separator() : separator;
    const separatorContent = separatorPropContent || separatorSlot || <ChevronRightIcon />;
    const itemClass = [name, this.themeClassName];
    const textClass = [textFlowClass];

    if (disabled) {
      textClass.push(disableClass);
    }

    if (this.$listeners.click) {
      textClass.push(gestureClass);
    }

    const clickEvent = to && !disabled ? { on: { click: this.bindEvent } } : {};
    const textContent = (
      <span ref="breadcrumbText" class={maxLengthClass} style={this.maxWithStyle}>
        {this.$slots.default}
      </span>
    );
    let itemContent = (
      <span class={textClass} {...{ on: this.$listeners }} {...clickEvent}>
        {textContent}
      </span>
    );

    if (href && !disabled) {
      textClass.push(linkClass);
      itemContent = (
        <a class={textClass} href={href} target={target} {...{ on: this.$listeners }}>
          {textContent}
        </a>
      );
    }
    return (
      <div class={itemClass}>
        {this.isCutOff ? <Tooltip content={() => this.$slots.default}>{itemContent}</Tooltip> : itemContent}
        <span class={separatorClass}>{separatorContent}</span>
      </div>
    );
  },
});

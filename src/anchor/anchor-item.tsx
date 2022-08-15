import Vue, { VueConstructor } from 'vue';
import { ScopedSlotReturnValue } from 'vue/types/vnode';
import { ANCHOR_SHARP_REGEXP } from './utils';
import props from './anchor-item-props';
import { getClassPrefixMixins } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';

const classPrefixMixins = getClassPrefixMixins('anchor');

export interface Anchor extends Vue {
  tAnchor: {
    active: string;
    handleScrollTo(target: string): void;
    registerLink(href: string): void;
    unregisterLink(href: string): void;
    handleLinkClick(link: { href: string; title: string; e: MouseEvent }): void;
  };
}

export default mixins(Vue as VueConstructor<Anchor>, classPrefixMixins).extend({
  name: 'TAnchorItem',
  props: {
    ...props,
    href: {
      type: String,
      required: true,
      validator(v: string): boolean {
        return ANCHOR_SHARP_REGEXP.test(v);
      },
    },
  },

  inject: {
    tAnchor: { default: undefined },
  },

  watch: {
    href: {
      immediate: true,
      handler() {
        this.unregister();
        this.register();
      },
    },
  },
  destroyed() {
    this.unregister();
  },
  methods: {
    register(): void {
      this.tAnchor.registerLink(this.href);
    },
    unregister(): void {
      const { href } = this;
      if (!href) return;
      this.tAnchor.unregisterLink(href);
    },
    handleClick(e: MouseEvent): void {
      const { href, tAnchor, title } = this;
      tAnchor.handleScrollTo(href);
      tAnchor.handleLinkClick({
        href,
        title: typeof title === 'string' ? title : undefined,
        e,
      });
    },
    /**
     * 更加props和slot渲染title
     *
     * @returns
     */
    renderTitle() {
      const { title, $scopedSlots } = this;
      const { title: titleSlot } = $scopedSlots;
      let titleVal: ScopedSlotReturnValue;
      if (typeof title === 'string') {
        titleVal = title;
      } else if (typeof title === 'function') {
        titleVal = title(this.$createElement);
      } else if (titleSlot) {
        titleVal = titleSlot(null);
      }
      return titleVal;
    },
  },
  render() {
    const {
      href, target, $scopedSlots, tAnchor,
    } = this;
    const { default: children, title: titleSlot } = $scopedSlots;
    const title = this.renderTitle();
    const titleAttr = typeof title === 'string' ? title : null;
    const isActive = tAnchor.active === href;
    const wrapperClass = {
      [`${this.componentName}__item`]: true,
      [this.commonStatusClassName.active]: isActive,
    };
    const titleClass = {
      [`${this.componentName}__item-link`]: true,
    };
    return (
      <div class={wrapperClass}>
        <a href={href} title={titleAttr} class={titleClass} target={target} onClick={this.handleClick}>
          {titleSlot ? titleSlot(null) : title}
        </a>
        {children && children(null)}
      </div>
    );
  },
});

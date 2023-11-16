import Vue, { VueConstructor } from 'vue';
import { ScopedSlotReturnValue } from 'vue/types/vnode';
import isEmpty from 'lodash/isEmpty';
import { VNode } from 'vue/types/umd';
import { ANCHOR_SHARP_REGEXP } from './utils';
import props from './anchor-item-props';
import { getClassPrefixMixins } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';

const classPrefixMixins = getClassPrefixMixins('anchor');

export interface Anchor extends Vue {
  tAnchor: {
    active: string;
    registerLink(href: string): void;
    unregisterLink(href: string): void;
    handleLinkClick(link: { href: string; title: string; e: MouseEvent }): void;
  };
}

export default mixins(Vue as VueConstructor<Anchor>, classPrefixMixins).extend({
  name: 'TAnchorItem',
  props: {
    ...props,
    _level: {
      type: Number,
      default: 0,
    },
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
  render(h) {
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

    const newLevel = this.$props._level + 1;

    // 这样处理是为了兼容普通节点和组件
    const h5Tags: VNode[] = [];
    const anchorItems: VNode[] = [];
    if (children) {
      children(null).forEach((child) => {
        if (isEmpty(child.componentOptions)) {
          h5Tags.push(h(child.tag, child.data, child.children));
        } else {
          anchorItems.push(
            h(
              child.componentOptions?.Ctor,
              {
                props: {
                  ...child.componentOptions?.propsData,
                  _level: newLevel,
                },
              },
              child?.componentOptions?.children,
            ),
          );
        }
      });
    }

    return (
      <div style={{ display: 'contents' }}>
        <div class={wrapperClass} style={{ '--level': newLevel }}>
          <a href={href} title={titleAttr} class={titleClass} target={target} onClick={this.handleClick}>
            {titleSlot ? titleSlot(null) : title}
          </a>
          {h5Tags}
        </div>
        {anchorItems}
      </div>
    );
  },
});

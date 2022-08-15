import Vue, { VueConstructor } from 'vue';
import { ScopedSlotReturnValue } from 'vue/types/vnode';
import { ANCHOR_SHARP_REGEXP, ANCHOR_CONTAINER, getOffsetTop } from './utils';
import {
  on, off, getScroll, scrollTo, getScrollContainer,
} from '../utils/dom';
import props from './props';
import { renderTNodeJSX } from '../utils/render-tnode';
import { getClassPrefixMixins } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';

import Affix from '../affix';

const classPrefixMixins = getClassPrefixMixins('anchor');

export interface Anchor extends Vue {
  scrollContainer: ANCHOR_CONTAINER;
  // 执行scrollTo设置的flag, 用来禁止执行handleScroll
  handleScrollLock: boolean;
}
export default mixins(Vue as VueConstructor<Anchor>, classPrefixMixins).extend({
  name: 'TAnchor',

  props: {
    ...props,
  },
  provide(): any {
    return {
      tAnchor: this,
    };
  },
  data() {
    return {
      links: [] as string[],
      active: '',
      activeLineStyle: false as boolean | { top: string; height: string; opacity: number },
    };
  },
  watch: {
    attach() {
      // 清空上一个container的事件监听
      if (this.scrollContainer) {
        off(this.scrollContainer, 'scroll', this.handleScroll);
      }
      this.getScrollContainer();
    },
  },
  methods: {
    /**
     * 获取滚动容器
     * 1. 如果是string则通过id获取
     * 2. 如果是method则获取方法返回值
     */
    getScrollContainer(): void {
      const { container } = this;
      this.scrollContainer = getScrollContainer(container) as HTMLElement;
      on(this.scrollContainer, 'scroll', this.handleScroll);
      this.handleScroll();
    },
    /**
     * 获取锚点对应的target元素
     *
     * @param {string} link
     */
    getAnchorTarget(link: string): HTMLElement {
      const matcher = link.match(ANCHOR_SHARP_REGEXP);
      if (!matcher) {
        return;
      }
      const anchor = document.getElementById(matcher[1]);
      if (!anchor) {
        return;
      }
      return anchor;
    },
    /**
     * 注册锚点
     *
     * @param {string} link
     */
    registerLink(link: string): void {
      const { links } = this;
      if (!ANCHOR_SHARP_REGEXP.test(link) || links.indexOf(link) !== -1) {
        return;
      }
      links.push(link);
    },
    /**
     * 注销锚点
     *
     * @param {string} link
     */
    unregisterLink(link: string): void {
      this.links = this.links.filter((each) => each !== link);
    },
    /**
     * 设置当前激活状态锚点
     *
     * @param {string} link
     */
    async setCurrentActiveLink(link: string): Promise<void> {
      const { active } = this;
      if (active === link) {
        return;
      }
      this.active = link;
      this.emitChange(link, active);
      await Vue.nextTick();
      this.updateActiveLine();
    },
    /**
     * 计算active-line所在的位置
     * 当前active-item的top + height, 以及ANCHOR_ITEM_PADDING修正
     */
    updateActiveLine(): void {
      const ele = this.$el.querySelector(`.${this.commonStatusClassName.active}>a`) as HTMLAnchorElement;
      if (!ele) {
        this.activeLineStyle = false;
        return;
      }
      const { offsetTop: top, offsetHeight: height } = ele;
      this.activeLineStyle = {
        top: `${top}px`,
        height: `${height}px`,
        opacity: 1,
      };
    },
    /**
     * 触发onchange事件或者props
     *
     * @param {string} currentLink
     * @param {string} prevLink
     */
    emitChange(currentLink: string, prevLink: string) {
      this.$emit('change', currentLink, prevLink);
      if (this.onChange) {
        this.onChange(currentLink, prevLink);
      }
    },
    /**
     * 监听AnchorLink点击事件
     * @param {{ href: string; title: string , e: MouseEvent }} link
     */
    handleLinkClick(link: { href: string; title: string; e: MouseEvent }): void {
      this.$emit('click', link);
      if (this.onClick) {
        this.onClick(link);
      }
    },
    /**
     * 滚动到指定锚点
     *
     * @param {string} link
     */
    async handleScrollTo(link: string): Promise<void> {
      const anchor = this.getAnchorTarget(link);
      this.setCurrentActiveLink(link);
      if (!anchor) return;
      this.handleScrollLock = true;
      const { scrollContainer, targetOffset } = this;
      const scrollTop = getScroll(scrollContainer);
      const offsetTop = getOffsetTop(anchor, scrollContainer);
      const top = scrollTop + offsetTop - targetOffset;
      await scrollTo(top, {
        container: scrollContainer,
      });
      this.handleScrollLock = false;
    },
    /**
     * 监听滚动事件
     */
    handleScroll(): void {
      if (this.handleScrollLock) return;
      const { links, bounds, targetOffset } = this;
      const filters: { top: number; link: string }[] = [];
      let active = '';
      // 找出所有当前top小于预设值
      links.forEach((link) => {
        const anchor = this.getAnchorTarget(link);
        if (!anchor) {
          return;
        }
        const top = getOffsetTop(anchor, this.scrollContainer);
        if (top < bounds + targetOffset) {
          filters.push({
            link,
            top,
          });
        }
      });
      // 找出小于预设值集合中top最大的
      if (filters.length) {
        const latest = filters.reduce((prev, cur) => (prev.top > cur.top ? prev : cur));
        active = latest.link;
      }
      this.setCurrentActiveLink(active);
    },
    renderCursor() {
      const titleContent: ScopedSlotReturnValue = renderTNodeJSX(this, 'cursor');
      return titleContent || <div class={`${this.componentName}__line-cursor`}></div>;
    },
  },

  async mounted() {
    const { active } = this;
    this.getScrollContainer();
    if (active) {
      await Vue.nextTick();
      this.handleScrollTo(active);
    }
  },

  destroyed() {
    if (!this.scrollContainer) return;
    off(this.scrollContainer, 'scroll', this.handleScroll);
  },

  render() {
    const {
      $scopedSlots: { default: children },
      size,
      affixProps,
      activeLineStyle,
    } = this;
    const className = [this.componentName, this.commonSizeClassName[size]];
    const content = (
      <div class={className}>
        <div class={`${this.componentName}__line`}>
          <div class={`${this.componentName}__line-cursor-wrapper`} style={activeLineStyle}>
            {this.renderCursor()}
          </div>
        </div>
        {children && children(null)}
      </div>
    );

    if (affixProps) {
      return <Affix {...{ props: affixProps }}>{content}</Affix>;
    }
    return content;
  },
});

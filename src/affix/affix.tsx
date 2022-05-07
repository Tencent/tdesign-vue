import Vue, { VueConstructor } from 'vue';
import isFunction from 'lodash/isFunction';
import { prefix } from '../config';
import { on, off, getScrollContainer } from '../utils/dom';
import affixProps from './props';
import { ScrollContainerElement } from '../common';

const name = `${prefix}-affix`;
export interface Affix extends Vue {
  scrollContainer: ScrollContainerElement;
  ticking: boolean;
  containerHeight: number;
  affixed: boolean;
  fixedTop: number;
}

export default (Vue as VueConstructor<Affix>).extend({
  name: 'TAffix',
  props: {
    ...affixProps,
  },
  data() {
    return {
      affixed: false,
      oldWidthHeight: { width: '0px', height: '0px' },
    };
  },
  watch: {
    offsetTop() {
      this.calcInitValue();
    },
    offsetBottom() {
      this.calcInitValue();
    },
    zIndex() {
      this.calcInitValue();
    },
  },
  methods: {
    handleScroll() {
      const {
        scrollContainer, containerHeight, offsetTop, offsetBottom,
      } = this;
      const { affixWrap, affix } = this.$refs as { affixWrap: HTMLElement; affix: HTMLElement };
      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          const { top = 0 } = (affixWrap as HTMLElement).getBoundingClientRect(); // top = 节点到页面顶部的距离，包含 scroll 中的高度

          let containerTop = 0; // containerTop = 容器到页面顶部的距离
          if (scrollContainer instanceof HTMLElement) {
            containerTop = scrollContainer.getBoundingClientRect().top;
          }

          let fixedTop: number | false;
          const calcTop = top - containerTop; // 节点顶部到 container 顶部的距离
          const calcBottom = containerTop + containerHeight - offsetBottom; // 计算 bottom 相对应的 top 值

          if (offsetTop !== undefined && calcTop <= offsetTop) {
            // top 的触发
            fixedTop = containerTop + offsetTop;
          } else if (offsetBottom !== undefined && top >= calcBottom) {
            // bottom 的触发
            fixedTop = calcBottom;
          } else {
            fixedTop = false;
          }

          if (affix) {
            this.affixed = fixedTop !== false;

            if (this.affixed) {
              affix.className = name;
              affix.style.top = `${fixedTop}px`;
              affix.style.width = this.oldWidthHeight.width;
              affix.style.zIndex = `${this.zIndex}`;
            } else {
              affix.removeAttribute('class');
              affix.removeAttribute('style');
            }

            this.$emit('fixedChange', this.affixed, { top: fixedTop });
            if (isFunction(this.onFixedChange)) this.onFixedChange(this.affixed, { top: Number(fixedTop) });
          }

          this.ticking = false;
        });
        this.ticking = true;
      }
    },
    calcInitValue() {
      const { scrollContainer } = this;
      // 获取当前可视的高度
      const containerHeight = scrollContainer[scrollContainer instanceof Window ? 'innerHeight' : 'clientHeight'];
      // 需要减掉当前节点的高度，对比的高度应该从 border-top 比对开始
      this.containerHeight = containerHeight - this.$el.clientHeight;
      // 被包裹的子节点宽高
      const { clientWidth, clientHeight } = this.$refs.affixWrap as HTMLElement;
      this.oldWidthHeight = { width: `${clientWidth}px`, height: `${clientHeight}px` };
      this.handleScroll();
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.scrollContainer = getScrollContainer(this.container);
      this.calcInitValue();
      on(this.scrollContainer, 'scroll', this.handleScroll);
      on(window, 'resize', this.calcInitValue);
    });
  },
  destroyed() {
    if (!this.scrollContainer) return;
    off(this.scrollContainer, 'scroll', this.handleScroll);
    off(window, 'resize', this.calcInitValue);
  },
  render() {
    const {
      $slots: { default: children },
      oldWidthHeight,
    } = this;

    return (
      <div ref="affixWrap">
        <div ref="affix">{children}</div>
        {this.affixed ? <div style={oldWidthHeight}></div> : ''}
      </div>
    );
  },
});

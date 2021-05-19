import Vue, { VueConstructor } from 'vue';
import { prefix } from '../config';
import { on, off, getScrollContainer } from '../utils/dom';
import affixProps from '../../types/affix/props';
import isFunction from 'lodash/isFunction';

export interface Affix extends Vue {
  scrollContainer: ScrollContainerElement;
}

export default (Vue as VueConstructor<Affix>).extend({
  name: `${prefix}-affix`,
  props: {
    ...affixProps,
  },
  data() {
    return {
      fixedTop: false as false | number,
      oldStyle: { width: '0px', height: '0px' },
      containerHeight: 0,
      ticking: false,
    };
  },
  watch: {
    offsetTop() {
      this.handleScroll();
    },
    offsetBottom() {
      this.handleScroll();
    },
  },
  methods: {
    handleScroll() {
      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          // top = 节点到页面顶部的距离，包含 scroll 中的高度
          const { top } = this.$el.getBoundingClientRect();
          // containerTop = 容器到页面顶部的距离
          let containerTop = 0;
          if (this.scrollContainer instanceof HTMLElement) {
            containerTop = this.scrollContainer.getBoundingClientRect().top;
          }
          // 节点顶部到 container 顶部的距离
          const calcTop = top - containerTop;
          if (this.offsetTop !== undefined && calcTop <= this.offsetTop) {
            this.fixedTop = containerTop + this.offsetTop;
          } else if (
            this.offsetBottom !== undefined
            && top >= this.containerHeight + containerTop - this.offsetBottom
          ) {
            this.fixedTop = containerTop + this.containerHeight - this.offsetBottom;
          } else {
            this.fixedTop = false;
          }
          this.ticking = false;

          // 要考虑数值为 0 的情况
          this.$emit('fixedChange', this.fixedTop !== false, { top: this.fixedTop });
          if (isFunction(this.onFixedChange)) this.onFixedChange(this.fixedTop !== false, { top: this.fixedTop });
        });
        this.ticking = true;
      }
    },
    getContainerHeight() {
      // 获取当前可视的高度
      let containerHeight = 0;
      if (this.scrollContainer instanceof Window) {
        containerHeight = this.scrollContainer.innerHeight;
      } else {
        containerHeight = this.scrollContainer.clientHeight;
      }

      // 需要减掉当前节点的高度，对比的高度应该从 border-top 比对开始
      this.containerHeight = containerHeight - this.$el.clientHeight;
    },
  },
  async mounted() {
    await this.$nextTick();

    this.scrollContainer = getScrollContainer(this.container);

    this.getContainerHeight();

    this.oldStyle = { width: `${this.$el.clientWidth}px`, height: `${this.$el.clientHeight}px` };

    on(this.scrollContainer, 'scroll', this.handleScroll);

    on(window, 'scroll', this.handleScroll);

    this.handleScroll();
  },
  destroyed() {
    if (!this.scrollContainer) return;

    off(this.scrollContainer, 'scroll', this.handleScroll);

    off(window, 'scroll', this.handleScroll);
  },
  render() {
    const {
      $slots: { default: children },
      oldStyle,
      fixedTop,
    } = this;

    if (fixedTop !== false) {
      return (
        <div>
          <div style={oldStyle}></div>
          <div
            className={`${prefix}-affix`}
            style={{ position: 'fixed', zIndex: 11, top: `${fixedTop}px`, ...oldStyle }}
          >
            {children}
          </div>
        </div>
      );
    }

    return <div>{children}</div>;
  },
});

import Vue from 'vue';
import raf from 'raf';
import { PropType } from '@vue/composition-api';
import isFunction from 'lodash/isFunction';
import { getAttach, removeDom } from '../utils/dom';
import { TdPopupProps } from './type';

function isContentRectChanged(rect1: DOMRectReadOnly, rect2: DOMRectReadOnly) {
  if (!rect1 || !rect2) return;
  if (['width', 'height', 'x', 'y'].some((k) => rect1[k] !== rect2[k])) {
    return true;
  }
  return false;
}

function observeResize(elm: Element, cb: (rect: DOMRectReadOnly) => void) {
  if (!window?.ResizeObserver || !elm) return;
  let prevContentRect = null as DOMRectReadOnly;
  const ro = new ResizeObserver((entries = []) => {
    const { contentRect } = entries[0] || {};
    if (isContentRectChanged(contentRect, prevContentRect)) {
      prevContentRect = contentRect;
      cb(contentRect);
      return;
    }
    // omit initial change
    if (!prevContentRect) {
      prevContentRect = contentRect;
    }
  });

  ro.observe(elm);
  return function () {
    ro.unobserve(elm);
  };
}

const Trigger = Vue.extend({
  data() {
    return {
      contentRect: null as DOMRectReadOnly,
    };
  },
  mounted() {
    if (!this.$el || (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test')) return;
    this.$on(
      'hook:destroyed',
      observeResize(this.$el, (ev) => {
        this.$emit('resize', ev);
      }),
    );
  },
  render() {
    const children = this.$slots.default || [];
    if (children.length > 1 || !children[0]?.tag) {
      return <span>{children}</span>;
    }
    return children[0];
  },
});

export default Vue.extend({
  props: {
    parent: Object,
    visible: Boolean,
    // support attach to current node when current is equal to `CURRENT_NODE`
    attach: [Function] as PropType<
      () => {
        attach: TdPopupProps['attach'];
        current: HTMLElement;
      }
    >,
  },
  data() {
    return {
      content: null as Vue,
    };
  },
  mounted() {
    if (this.visible) {
      raf(this.mountContent);
    }
    this.$watch('visible', (visible) => {
      if (visible) {
        this.mountContent();
      }
    });
  },
  destroyed() {
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') return;
    this.unmountContent();
  },
  methods: {
    mountContent() {
      if (this.content) return;
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const parent = this;
      const elm = document.createElement('div');
      elm.style.cssText = 'position: absolute; top: 0px; left: 0px; width: 100%';
      elm.appendChild(document.createElement('div'));
      this.content = new (this.$root.constructor as any)({
        parent,
        render() {
          return parent.$slots.content;
        },
        mounted() {
          parent.$emit('contentMounted');
          const content = this.$el.children[0];
          if (content) {
            this.$on(
              'hook:destroyed',
              observeResize(content, () => {
                parent.$emit('resize');
              }),
            );
          }
        },
        destroyed() {
          parent.content = null;
          removeDom(elm);
        },
      });
      const { attach, current } = this.attach();
      const currentAttach = attach === 'CURRENT_NODE' ? current : attach;
      // @ts-ignore
      getAttach(currentAttach, this.$refs?.triggerRef?.$el).appendChild(elm);
      this.content.$mount(elm.children[0]);
    },
    unmountContent() {
      if (isFunction(this.content?.$destroy)) {
        this.content.$destroy();
      }
    },
    updateContent() {
      this.content?.$forceUpdate();
    },
  },
  render() {
    return (
      <Trigger ref="triggerRef" onResize={() => this.$emit('resize')}>
        {this.$slots.default}
      </Trigger>
    );
  },
});

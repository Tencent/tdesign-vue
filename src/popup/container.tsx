import Vue from 'vue';
import { getAttach, removeDom } from '../utils/dom';
import props from './props';

function isContentRectChanged(rect1: DOMRectReadOnly, rect2: DOMRectReadOnly) {
  if (!rect1 || !rect2) return;
  if (['width', 'height', 'x', 'y'].some((k) => rect1[k] !== rect2[k])) {
    return true;
  }
  return false;
}

const Ref = Vue.extend({
  data() {
    return {
      contentRect: null as DOMRectReadOnly,
    };
  },
  mounted() {
    if (window?.ResizeObserver && this.$el) {
      const el = this.$el;
      const vm = this as any;
      const ro = new ResizeObserver((entries = []) => {
        const { contentRect } = entries[0] || {};
        if (isContentRectChanged(contentRect, vm.contentRect)) {
          vm.contentRect = contentRect;
          vm.$emit('resize', { ...contentRect });
          return;
        }
        // omit initial change
        if (!vm.contentRect) {
          vm.contentRect = contentRect;
        }
      });
      ro.observe(el);
      this.$on('hook:destroyed', () => {
        ro.unobserve(el);
      });
    }
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
    attach: props.attach,
  },
  data() {
    return {
      content: null as Vue,
    };
  },
  mounted() {
    if (this.visible) {
      this.mountContent();
    }
    this.$watch('visible', (visible) => {
      if (visible) {
        this.mountContent();
      }
    });
  },
  destroyed() {
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
          return <div>{parent.$slots.content}</div>;
        },
        mounted() {
          parent.$emit('mounted');
        },
        destroyed() {
          parent.content = null;
          removeDom(elm);
        },
      });
      getAttach(this.attach).appendChild(elm);
      this.content.$mount(elm.children[0]);
    },
    unmountContent() {
      this.content?.$destroy();
    },
    updateContent() {
      this.content?.$forceUpdate();
    },
  },
  render() {
    return <Ref onResize={(ev: DOMRectReadOnly) => this.$emit('refResize', ev)}>{this.$slots.default}</Ref>;
  },
});

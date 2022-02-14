import Vue from 'vue';
import { getAttach } from '../utils/dom';
import props from './props';

const Ref = Vue.extend({
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
          elm.remove();
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
    return <Ref>{this.$slots.default}</Ref>;
  },
});

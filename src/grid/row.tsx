import Vue, { VNode } from 'vue';
import debounce from 'lodash/debounce';
import isObject from 'lodash/isObject';
import { prefix } from '../config';
import props from './row-props';
import { ClassName } from '../common';
import { calcSize } from '../utils/responsive';
import { TdRowProps } from './type';

const name = `${prefix}-row`;

export default Vue.extend({
  name,

  props: { ...props },

  data() {
    return {
      size: calcSize(window.innerWidth),
    };
  },

  provide(): { rowContext: any } {
    return {
      rowContext: {
        gutter: this.gutter,
        size: this.size,
      },
    };
  },

  computed: {
    classes(): ClassName {
      const { justify, align } = this;
      return [
        name,
        {
          [`${name}-${justify}`]: justify,
          [`${name}-${align}`]: align,
        },
      ];
    },
  },

  mounted() {
    window.addEventListener('resize', this.updateSize);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.updateSize);
  },

  methods: {
    updateSize: debounce(function (this: any) {
      this.size = calcSize(window.innerWidth);
    }, 50),

    calcRowMargin(gutter: TdRowProps['gutter'], currentSize: string): string {
      let margin = '';
      if (typeof gutter === 'number') {
        margin = `0 -${gutter / 2}px`;
      } else if (Array.isArray(gutter) && gutter.length) {
        margin = `0 -${gutter[0] as any / 2}px`;
      } else if (isObject(gutter) && gutter[currentSize]) {
        if (Array.isArray(gutter[currentSize])) {
          margin = `0 -${gutter[currentSize][0] / 2}px`;
        } else {
          margin = `0 -${gutter[currentSize] / 2}px`;
        }
      }
      return margin;
    },
  },

  render(): VNode {
    const { tag, classes } = this;

    const rowStyle = {
      margin: this.calcRowMargin(this.gutter, this.size),
    };

    return <tag class={classes} style={rowStyle}>{this.$slots.default}</tag>;
  },
});

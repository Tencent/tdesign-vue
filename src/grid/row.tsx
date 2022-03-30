import Vue, { VNode } from 'vue';
import isObject from 'lodash/isObject';
import { prefix } from '../config';
import props from './row-props';
import { ClassName, Styles } from '../common';
import { calcSize } from '../utils/responsive';
import { TdRowProps } from './type';
import { getIEVersion } from '../_common/js/utils/helper';

const name = `${prefix}-row`;

export interface RowHTMLTagAttributes {
  class: ClassName;
  style: Styles;
  attrs?: {
    'row-gap'?: number;
  };
}

export default Vue.extend({
  name: 'TRow',

  props: { ...props },

  data() {
    return {
      size: 'md',
    };
  },

  provide(): { rowContext: any } {
    return {
      rowContext: {
        gutter: this.gutter,
      },
    };
  },

  computed: {
    classes(): ClassName {
      const { justify, align } = this;
      return [
        name,
        {
          [`${name}--${justify}`]: justify,
          [`${name}--${align}`]: align,
        },
      ];
    },
  },

  mounted() {
    this.updateSize();
    this.handleIE();
    window.addEventListener('resize', this.updateSize);
  },

  watch: {
    gutter() {
      this.handleIE();
    },

    size() {
      this.handleIE();
    },
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.updateSize);
  },

  methods: {
    updateSize() {
      this.size = calcSize(window.innerWidth);
    },

    handleIE() {
      if (getIEVersion() <= 11) {
        const rowGap = this.rowGap(this.gutter, this.size);
        if (rowGap) {
          this.$el.setAttribute('row-gap', `${rowGap}`);
        }
      }
    },

    calcRowStyle(gutter: TdRowProps['gutter'], currentSize: string): Styles {
      const rowStyle = {};
      if (typeof gutter === 'number') {
        Object.assign(rowStyle, {
          marginLeft: `${gutter / -2}px`,
          marginRight: `${gutter / -2}px`,
        });
      } else if (Array.isArray(gutter) && gutter.length) {
        if (typeof gutter[0] === 'number') {
          Object.assign(rowStyle, {
            marginLeft: `${gutter[0] / -2}px`,
            marginRight: `${gutter[0] / -2}px`,
          });
        }
        if (typeof gutter[1] === 'number') {
          Object.assign(rowStyle, { rowGap: `${gutter[1]}px` });
        }

        if (isObject(gutter[0]) && gutter[0][currentSize] !== undefined) {
          Object.assign(rowStyle, {
            marginLeft: `${gutter[0][currentSize] / -2}px`,
            marginRight: `${gutter[0][currentSize] / -2}px`,
          });
        }
        if (isObject(gutter[1]) && gutter[1][currentSize] !== undefined) {
          Object.assign(rowStyle, { rowGap: `${gutter[1][currentSize]}px` });
        }
      } else if (isObject(gutter) && gutter[currentSize]) {
        if (Array.isArray(gutter[currentSize]) && gutter[currentSize].length) {
          Object.assign(rowStyle, {
            marginLeft: `${gutter[currentSize][0] / -2}px`,
            marginRight: `${gutter[currentSize][0] / -2}px`,
          });
          Object.assign(rowStyle, { rowGap: `${gutter[currentSize][1]}px` });
        } else {
          Object.assign(rowStyle, {
            marginLeft: `${gutter[currentSize] / -2}px`,
            marginRight: `${gutter[currentSize] / -2}px`,
          });
        }
      }
      return rowStyle;
    },

    rowGap(gutter: TdRowProps['gutter'], currentSize: string): number {
      let rowGap;
      if (Array.isArray(gutter) && gutter.length) {
        if (typeof gutter[1] === 'number') {
          [, rowGap] = gutter;
        }
        if (isObject(gutter[1]) && gutter[1][currentSize] !== undefined) {
          rowGap = gutter[1][currentSize];
        }
      } else if (isObject(gutter) && gutter[currentSize]) {
        if (Array.isArray(gutter[currentSize]) && gutter[currentSize].length) {
          [, rowGap] = gutter[currentSize];
        }
      }
      return rowGap;
    },
  },

  render(): VNode {
    const { tag, classes } = this;

    const rowStyle = this.calcRowStyle(this.gutter, this.size);

    const attributes: RowHTMLTagAttributes = {
      class: classes,
      style: rowStyle,
      attrs: {},
    };
    return <tag {...attributes}>{this.$slots.default}</tag>;
  },
});

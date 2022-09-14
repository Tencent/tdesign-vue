import { VNode } from 'vue';
import isObject from 'lodash/isObject';
import { calcSize } from '../utils/responsive';
import props from './col-props';
import { ClassName } from '../common';
import { TdColProps, TdRowProps } from './type';
import { renderTNodeJSX } from '../utils/render-tnode';
import { getClassPrefixMixins } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';

const classPrefixMixins = getClassPrefixMixins('col');

export default mixins(classPrefixMixins).extend({
  name: 'TCol',

  props: { ...props },

  inject: ['rowContext'],

  data() {
    return {
      size: 'md',
    };
  },

  computed: {
    classes(): ClassName {
      const {
        span, order, offset, push, pull,
      } = this;

      const allSizes = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
      const sizeClasses = allSizes.reduce((acc, currSize) => {
        const sizeProp = this[currSize];
        let sizeObject: any = {};
        if (typeof sizeProp === 'number') {
          sizeObject.span = sizeProp;
        } else if (isObject(sizeProp)) {
          sizeObject = sizeProp || {};
        }

        return {
          ...acc,
          [`${this.componentName}-${currSize}-${sizeObject.span}`]: sizeObject.span !== undefined,
          [`${this.componentName}-${currSize}-order-${sizeObject.order}`]: parseInt(sizeObject.order, 10) >= 0,
          [`${this.componentName}-${currSize}-offset-${sizeObject.offset}`]: parseInt(sizeObject.offset, 10) >= 0,
          [`${this.componentName}-${currSize}-push-${sizeObject.push}`]: parseInt(sizeObject.push, 10) >= 0,
          [`${this.componentName}-${currSize}-pull-${sizeObject.pull}`]: parseInt(sizeObject.pull, 10) >= 0,
        };
      }, {});

      return {
        [`${this.componentName}`]: true,
        [`${this.componentName}-${span}`]: span !== undefined,
        [`${this.componentName}-order-${order}`]: order,
        [`${this.componentName}-offset-${offset}`]: offset,
        [`${this.componentName}-push-${push}`]: push,
        [`${this.componentName}-pull-${pull}`]: pull,
        ...sizeClasses,
      };
    },
  },

  mounted() {
    this.updateSize();
    window.addEventListener('resize', this.updateSize);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.updateSize);
  },

  methods: {
    updateSize() {
      this.size = calcSize(window.innerWidth);
    },

    parseFlex(flex: TdColProps['flex']): string {
      if (typeof flex === 'number') {
        return `${flex} ${flex} 0`;
      }
      if (/^\d+(\.\d+)?(px|r?em|%)$/.test(flex)) {
        return `0 0 ${flex}`;
      }
      return flex;
    },
    calcColPadding(gutter: TdRowProps['gutter'], currentSize: string) {
      const paddingObj = {};
      if (typeof gutter === 'number') {
        Object.assign(paddingObj, {
          paddingLeft: `${gutter / 2}px`,
          paddingRight: `${gutter / 2}px`,
        });
      } else if (Array.isArray(gutter) && gutter.length) {
        if (typeof gutter[0] === 'number') {
          Object.assign(paddingObj, {
            paddingLeft: `${gutter[0] / 2}px`,
            paddingRight: `${gutter[0] / 2}px`,
          });
        }

        if (isObject(gutter[0]) && gutter[0][currentSize]) {
          Object.assign(paddingObj, {
            paddingLeft: `${gutter[0][currentSize] / 2}px`,
            paddingRight: `${gutter[0][currentSize] / 2}px`,
          });
        }
      } else if (isObject(gutter) && gutter[currentSize]) {
        Object.assign(paddingObj, {
          paddingLeft: `${gutter[currentSize] / 2}px`,
          paddingRight: `${gutter[currentSize] / 2}px`,
        });
      }
      return paddingObj;
    },
  },

  render(): VNode {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { flex, tag, classes } = this;

    const colStyle: any = {};
    flex && (colStyle.flex = this.parseFlex(flex));

    const { rowContext }: any = this;
    if (rowContext) {
      const { gutter: rowGutter } = rowContext;
      Object.assign(colStyle, this.calcColPadding(rowGutter, this.size));
    }

    return (
      <tag class={classes} style={colStyle}>
        {renderTNodeJSX(this, 'default')}
      </tag>
    );
  },
});

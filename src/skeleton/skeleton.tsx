import Vue from 'vue';
import isNumber from 'lodash/isNumber';
import { prefix } from '../config';
import { renderContent } from '../utils/render-tnode';
import props from './props';
import { SkeletonRowCol, SkeletonRowColObj, TdSkeletonProps } from './type';
import { ClassName, Styles } from '../common';

const name = `${prefix}-skeleton`;

const ThemeMap: Record<TdSkeletonProps['theme'], SkeletonRowCol> = {
  text: [1],
  avatar: [{ type: 'circle', size: '56px' }],
  paragraph: [1, 1, { width: '70%' }],
  'avatar-text': [[{ type: 'circle' }, { type: 'text', height: '32px' }]],
  tab: [{ height: '30px' }, { height: '200px' }],
  article: [
    { type: 'rect', height: '30px', width: '100%' },
    { type: 'rect', height: '200px', width: '100%' },
    [
      { type: 'text', height: '30px' },
      { type: 'text', height: '30px' },
      { type: 'text', height: '30px' },
    ],
    [
      { type: 'text', height: '30px' },
      { type: 'text', height: '30px' },
    ],
    [
      { type: 'text', height: '30px' },
      { type: 'text', height: '30px' },
    ],
    [
      { type: 'text', height: '30px' },
      { type: 'text', height: '30px' },
    ],
  ],
};

export default Vue.extend({
  name: 'TSkeleton',

  props: { ...props },

  data() {
    return {
      delayShowLoading: this.delay <= 0 ? this.loading : false,
      delayTimer: 0,
    };
  },

  watch: {
    loading: {
      handler(val: boolean) {
        if (this.delay <= 0) {
          this.delayShowLoading = this.loading;
          return;
        }
        this.handleDelay(val);
      },
      immediate: true,
    },
  },

  methods: {
    handleDelay(loading: boolean) {
      if (loading) {
        clearTimeout(this.delayTimer);
        this.delayTimer = window.setTimeout(() => {
          this.delayShowLoading = this.loading;
        }, this.delay);
      } else {
        this.delayShowLoading = loading;
      }
    },

    renderCols(_cols: Number | SkeletonRowColObj | Array<SkeletonRowColObj>) {
      const getColItemClass = (obj: SkeletonRowColObj): ClassName => [
        `${name}__col`,
        `${name}--type-${obj.type || 'text'}`,
        { [`${name}--animation-${this.animation}`]: this.animation },
      ];

      const getColItemStyle = (obj: SkeletonRowColObj): Styles => {
        const styleName = [
          'width',
          'height',
          'marginRight',
          'marginLeft',
          'margin',
          'size',
          'background',
          'backgroundColor',
        ];
        const style: Styles = {};
        styleName.forEach((name) => {
          if (name in obj) {
            const px = isNumber(obj[name]) ? `${obj[name]}px` : obj[name];
            if (name === 'size') {
              [style.width, style.height] = [px, px];
            } else {
              style[name] = px;
            }
          }
        });
        return style;
      };

      let cols: Array<SkeletonRowColObj> = [];
      if (Array.isArray(_cols)) {
        cols = _cols;
      } else if (isNumber(_cols)) {
        cols = new Array(_cols).fill({ type: 'text' });
      } else {
        cols = [_cols as SkeletonRowColObj];
      }

      return cols.map((obj) => (
        <div class={getColItemClass(obj)} style={getColItemStyle(obj)}>
          {typeof obj.content === 'function' ? obj.content(this.$createElement) : obj.content}
        </div>
      ));
    },

    renderRowCol(_rowCol?: SkeletonRowCol) {
      const rowCol: SkeletonRowCol = _rowCol || this.rowCol;

      const getBlockClass = (): ClassName => [`${name}__row`];

      return rowCol.map((item) => <div class={getBlockClass()}>{this.renderCols(item)}</div>);
    },
  },

  render() {
    const content = renderContent(this, 'default', 'content');

    if (this.$scopedSlots.default && !this.delayShowLoading) {
      return <div>{content}</div>;
    }
    if (!this.delayShowLoading) {
      return;
    }

    const children = [];
    if (this.theme) {
      children.push(this.renderRowCol(ThemeMap[this.theme]));
    }
    if (this.rowCol) {
      children.push(this.renderRowCol(this.rowCol));
    }
    if (!this.theme && !this.rowCol) {
      // 什么都不传时，传入默认 rowCol
      children.push(this.renderRowCol([1, 1, 1, { width: '70%' }]));
    }

    return <div class={name}>{children}</div>;
  },
});

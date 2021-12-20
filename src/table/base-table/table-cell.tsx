import Vue, { VNode } from 'vue';
import { prefix } from '../../config';
import Popup from '../../popup';
import { isNodeOverflow } from '../../utils/dom';
import { TdInstance } from '../util/interface';
import { getRecord } from '../util/common';

const overlayStyle = {
  width: '100%',
  maxWidth: '400px',
  wordBreak: 'break-all',
};

export default Vue.extend({
  name: `${prefix}-table-cell`,
  props: {
    cellData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      offsetLeft: 0,
      isBoundary: false,
      isCutOff: false,
    };
  },
  methods: {
    init() {
      const { fixed } = this.cellData?.col;
      const { $children: children } = this.$parent;
      // 计算当前固定列偏移的宽度
      if (fixed) {
        let offsetLeft = 0;
        const fixedColumns = children.filter((el: TdInstance) => (el?.cellData?.col?.fixed === fixed));
        const indexInFixedColumns = fixedColumns.findIndex((el: Vue) => (el === this));
        fixedColumns.forEach((el: any, cur) => {
          if ((fixed === 'right' && cur > indexInFixedColumns) || (fixed === 'left' && cur < indexInFixedColumns)) {
            const { width } = el.cellData?.col;
            const { clientWidth } = el.$el;
            offsetLeft += width > 0 ? width : clientWidth;
          }
        });
        this.isBoundary = fixed === 'left'
          ? indexInFixedColumns === fixedColumns.length - 1
          : indexInFixedColumns === 0;
        this.offsetLeft = offsetLeft;
      }
      this.isCutOff = isNodeOverflow(this.$el);
    },
  },
  render(h) {
    const { cellData } = this;
    const {
      col, colIndex, row, rowIndex, customData, customRender, withoutBorder, withBorder,
    } = cellData;
    const {
      colKey, attrs, align, ellipsis, width, className, title, fixed,
    } = col;

    // 固定列 单元格属性
    const style: Record<string, any> = {
      ...col.attrs?.style,
    };
    const fixedClass = [];
    // 普通样式
    const attrClass = attrs?.class || [];
    if (fixed) {
      style.position = 'sticky';
      style[fixed] = `${this.offsetLeft}px`;
      fixedClass.push(`${prefix}-table__cell--fixed-${fixed}`);
      if (this.isBoundary) {
        fixedClass.push(`${prefix}-table__cell--fixed-${fixed}-${fixed === 'left' ? 'last' : 'first'}`);
      }
    }
    if (align) {
      attrClass.push(`align-${align}`);
    }
    if (width && !fixed) {
      style.overflow = 'hidden';
    }
    if (withoutBorder === true) {
      style.borderLeftWidth = '0px';
    }
    if (withBorder === true) {
      style.borderLeftWidth = '1px';
    }

    if (ellipsis === true || typeof ellipsis === 'function') {
      attrClass.push('text-ellipsis');
    }
    if (className) {
      if (typeof className === 'function') {
        attrClass.push(className({
          type: cellData.type, col, colIndex, row, rowIndex,
        }));
      } else {
        attrClass.push(className);
      }
    }
    if (['single', 'multiple'].indexOf(col.type) > -1) {
      attrClass.push(`${prefix}-table__cell--selectable`);
    }
    const record = getRecord(row);
    // 自定义单元格渲染
    let cellContent: VNode;
    if (typeof customRender === 'function') {
      const { type, func } = customData;
      const baseData = {
        col,
        colIndex,
        row,
        rowIndex,
        record,
      };
      if (func === 'title') {
        cellContent = customRender(h, { col, colIndex, type });
      } else if (func === 'cell') {
        cellContent = customRender(h, baseData);
      } else if (func === 'render') {
        cellContent = customRender(h, { type, ...baseData });
      }
    } else {
      cellContent = this.$createElement(title || '');
    }

    const tdAttrs = {
      attrs: {
        ...attrs,
        class: [...fixedClass, ...attrClass].filter((notEmpty) => notEmpty).join(' '),
        key: colKey,
      },
    };
    // 如果被截断给加上 Tooltip 提示
    if (ellipsis && this.isCutOff) {
      let popupCellContent = cellContent;
      if (typeof ellipsis === 'function') {
        popupCellContent = ellipsis(h, {
          row, col, rowIndex, colIndex,
        });
      }
      cellContent = (
        <Popup
          style="display: inline;"
          overlayStyle={overlayStyle}
          placement="bottom-left"
          showArrow={false}
        >
          {cellContent}
          <div slot="content">
            {popupCellContent}
          </div>
        </Popup>
      );
    }
    return <td style={style} {...tdAttrs}>{cellContent}</td>;
  },
  mounted() {
    this.init();
  },
  updated() {
    this.init();
  },
});

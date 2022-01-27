/** 超出省略显示 */
import {
  defineComponent, PropType, ref, onMounted, computed,
} from '@vue/composition-api';
import { TNode } from '../common';
import { prefix } from '../config';
import { renderContent } from '../utils/render-tnode';
import { isNodeOverflow } from '../utils/dom';
import TPopup, { PopupProps } from '../popup';

const ELLIPSIS_CLASS = `${prefix}-table__ellipsis`;
const ELLIPSIS_CLASS_TEXT = `${prefix}-text-ellipsis`;

export default defineComponent({
  name: 'TEllipsis',

  props: {
    /** 内容 */
    content: {
      type: [String, Function] as PropType<string | TNode>,
    },
    /** 内容，同 content */
    default: {
      type: [String, Function] as PropType<string | TNode>,
    },
    /** 内容，同 content，可以单独自定义浮层内容，无需和触发元素保持一致 */
    popupContent: {
      type: [String, Function] as PropType<string | TNode>,
    },
    /** 浮层位置 */
    placement: String as PropType<PopupProps['placement']>,
    /** 透传 Popup 组件属性 */
    popupProps: Object as PropType<PopupProps>,
  },

  setup() {
    const root = ref();
    const isOverflow = ref(false);

    const ellipsisClasses = computed(() => [ELLIPSIS_CLASS, { [ELLIPSIS_CLASS_TEXT]: isOverflow.value }]);

    onMounted(() => {
      const timer = setTimeout(() => {
        isOverflow.value = isNodeOverflow(root.value);
        clearTimeout(timer);
      }, 0);
      return () => {
        clearTimeout(timer);
      };
    });

    return { root, isOverflow, ellipsisClasses };
  },

  render() {
    const cellNode = renderContent(this, 'default', 'content');
    const ellipsisContent = (
      <div ref="root" class={this.ellipsisClasses}>
        {cellNode}
      </div>
    );
    if (this.isOverflow) {
      return (
        <TPopup
          content={this.popupContent || (() => cellNode)}
          destroyOnClose={true}
          placement={this.placement}
          props={this.popupProps}
        >
          {ellipsisContent}
        </TPopup>
      );
    }
    return ellipsisContent;
  },
});

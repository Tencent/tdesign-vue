/** 超出省略显示 */
import {
  defineComponent, PropType, ref, computed,
} from '@vue/composition-api';
import { TNode } from '../common';
import { renderContent } from '../utils/render-tnode';
import { isNodeOverflow } from '../utils/dom';
import TPopup, { PopupProps } from '../popup';
import { useConfig } from '../config-provider/useConfig';

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
      type: [String, Number, Function] as PropType<string | TNode>,
    },
    /** 浮层位置 */
    placement: String as PropType<PopupProps['placement']>,
    /** 透传 Popup 组件属性 */
    popupProps: Object as PropType<PopupProps>,
    zIndex: Number,
  },

  setup() {
    const { classPrefix: prefix } = useConfig();
    const root = ref();
    const isOverflow = ref(false);

    const ellipsisClasses = computed(() => [`${prefix}-table__ellipsis`, `${prefix}-text-ellipsis`]);

    // 鼠标 hover 的时候显示浮层
    const updateIsOverflow = () => {
      if (!root.value) return;
      isOverflow.value = isNodeOverflow(root.value);
    };

    return {
      root, isOverflow, ellipsisClasses, updateIsOverflow,
    };
  },

  render() {
    const cellNode = renderContent(this, 'default', 'content');
    const ellipsisContent = (
      <div ref="root" class={this.ellipsisClasses} onMouseenter={this.updateIsOverflow}>
        {cellNode}
      </div>
    );
    if (this.isOverflow) {
      return (
        <TPopup
          content={this.popupContent || (() => cellNode)}
          destroyOnClose={true}
          zIndex={this.zIndex || 1}
          attach={() => this.root}
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

import { defineComponent, PropType, computed } from '@vue/composition-api';
import { ChevronRightIcon } from 'tdesign-icons-vue';
import { getFullPathLabel } from '../core/helper';
import { getCascaderItemClass, getCascaderItemIconClass } from '../core/className';

// utils
import Checkbox from '../../checkbox/index';
import TLoading from '../../loading';

// type
import { getKeepAnimationMixins } from '../../config-provider/config-receiver';
import { CascaderContextType, TreeNodeValue, TreeNode } from '../interface';
import { usePrefixClass, useCommonClassName } from '../../hooks/useConfig';
import Ripple from '../../utils/ripple';

const keepAnimationMixins = getKeepAnimationMixins();

const props = {
  node: {
    type: Object as PropType<TreeNode>,
    default() {
      return {};
    },
  },
  cascaderContext: {
    type: Object as PropType<CascaderContextType>,
  },
  onChange: Function as PropType<() => void>,
  onClick: Function as PropType<() => void>,
  onMouseenter: Function as PropType<() => void>,
};

export default defineComponent({
  mixins: [keepAnimationMixins],
  directives: { Ripple },
  props: { ...props },
  setup(props) {
    const COMPONENT_NAME = usePrefixClass('cascader__item');
    const classPrefix = usePrefixClass();
    const { STATUS, SIZE } = useCommonClassName();

    const itemClass = computed(() => getCascaderItemClass(classPrefix.value, props.node, SIZE.value, STATUS.value, props.cascaderContext));

    const iconClass = computed(() => getCascaderItemIconClass(classPrefix.value, props.node, STATUS.value, props.cascaderContext));

    return {
      COMPONENT_NAME,
      iconClass,
      itemClass,
    };
  },
  render() {
    const {
      iconClass, cascaderContext, itemClass, node, COMPONENT_NAME, onChange,
    } = this;

    function RenderLabelInner(node: TreeNode, cascaderContext: CascaderContextType) {
      const { inputVal } = cascaderContext;
      const labelText = inputVal ? getFullPathLabel(node) : node.label;
      if (inputVal) {
        const texts = labelText.split(inputVal as string);
        const doms = [];
        for (let index = 0; index < texts.length; index++) {
          doms.push(<span key={index}>{texts[index]}</span>);
          if (index === texts.length - 1) break;
          doms.push(
            <span key={`${index}filter`} class={`${COMPONENT_NAME}-label--filter`}>
              {inputVal}
            </span>,
          );
        }
        return doms;
      }
      return labelText;
    }

    function RenderLabelContent(node: TreeNode, cascaderContext: CascaderContextType) {
      const label = RenderLabelInner(node, cascaderContext);

      const labelCont = (
        <span
          title={cascaderContext.inputVal ? getFullPathLabel(node) : node.label}
          class={[`${COMPONENT_NAME}-label`, `${COMPONENT_NAME}-label--ellipsis`]}
          role="label"
        >
          {label}
        </span>
      );

      return labelCont;
    }

    function RenderCheckBox(node: TreeNode, cascaderContext: CascaderContextType) {
      const {
        checkProps, value, max, inputVal,
      } = cascaderContext;
      const label = RenderLabelInner(node, cascaderContext);
      return (
        <Checkbox
          checked={node.checked}
          indeterminate={node.indeterminate}
          disabled={node.isDisabled() || ((value as TreeNodeValue[]).length >= max && max !== 0)}
          name={node.value}
          title={inputVal ? getFullPathLabel(node) : node.label}
          onChange={(vale: boolean, { e }: { e: MouseEvent }) => {
            e.stopPropagation();
            onChange();
          }}
          {...checkProps}
        >
          {label}
        </Checkbox>
      );
    }

    return (
      <li
        class={itemClass}
        onClick={(e: Event) => {
          e.stopPropagation();
          this.onClick();
        }}
        onMouseenter={(e: Event) => {
          e.stopPropagation();
          this.onMouseenter();
        }}
      >
        {cascaderContext.multiple ? RenderCheckBox(node, cascaderContext) : RenderLabelContent(node, cascaderContext)}
        {node.children
          && (node.loading ? <TLoading class={iconClass} size="small" /> : <ChevronRightIcon class={iconClass} />)}
      </li>
    );
  },
});

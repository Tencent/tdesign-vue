import { PropType } from 'vue';
import isFunction from 'lodash/isFunction';
import { CloseCircleFilledIcon } from 'tdesign-icons-vue';
import { prefix } from '../../config';
import CLASSNAMES from '../../utils/classnames';
import getConfigReceiverMixins, { CascaderConfig } from '../../config-provider/config-receiver';
import mixins from '../../utils/mixins';
import { renderTNodeJSX } from '../../utils/render-tnode';
import { TreeNode, CascaderContextType, InputContentProps } from '../interface';
// component
import Tag from '../../tag';
import TLoading from '../../loading';
import Input, { InputValue } from '../../input';
import FakeArrow from '../../common-components/fake-arrow';

// common logic
import {
  getCloseIconClass,
  getFakeArrowIconClass,
  getCascaderInnerClasses,
  getCloseShow,
  getPlaceholderShow,
  getSingleContent,
  getMultipleContent,
  outerClickListenerEffect,
  closeIconClickEffect,
  handleRemoveTagEffect,
  innerContentClickEffect,
} from '../utils/inputContent';
import { getFullPathLabel } from '../utils/helper';

// type
import { ClassName } from '../../common';
import CascaderProps from '../props';

const name = `${prefix}-cascader`;

interface ComponentComputed {
  closeIconClass: ClassName;
  fakeArrowIconClass: ClassName;
  cascaderInnerClasses: ClassName;
  closeShow: boolean;
  showPlaceholder: boolean;
  singleContent: string;
  multipleContent: TreeNode[];
}
interface ComponentData {
  isHover: boolean;
}

interface ComponentMethods {
  getInputWidth: () => void;
  outerClickListenerFn: (event: MouseEvent | TouchEvent) => void;
  InnerContent: () => JSX.Element;
  renderContent: () => JSX.Element;
  renderSuffixIcon: () => JSX.Element;
}

interface ComponentInstanceType extends ComponentComputed, ComponentData, ComponentMethods {}

const cascaderGlobalConfig = getConfigReceiverMixins<InputContentProps & Vue & ComponentInstanceType, CascaderConfig>(
  'cascader',
);

export default mixins(cascaderGlobalConfig).extend({
  name: `${name}-input-content`,
  props: {
    cascaderContext: {
      type: Object as PropType<CascaderContextType>,
    },
    placeholder: CascaderProps.placeholder,
    listeners: {
      type: Object as PropType<InputContentProps['listeners']>,
    },
    collapsedItems: CascaderProps.collapsedItems,
  },
  components: {
    Tag,
    Input,
    CloseCircleFilledIcon,
  },

  data() {
    return {
      isHover: false,
    };
  },

  computed: {
    closeIconClass(): ClassName {
      return getCloseIconClass(prefix, CLASSNAMES, this.cascaderContext);
    },
    fakeArrowIconClass(): ClassName {
      return getFakeArrowIconClass(prefix, CLASSNAMES, this.cascaderContext);
    },
    cascaderInnerClasses(): ClassName {
      return getCascaderInnerClasses(prefix, CLASSNAMES, this.cascaderContext);
    },
    closeShow(): boolean {
      return getCloseShow(this.isHover, this.cascaderContext);
    },
    singleContent() {
      return getSingleContent(this.cascaderContext);
    },
    multipleContent() {
      return getMultipleContent(this.cascaderContext);
    },
    showPlaceholder() {
      return getPlaceholderShow(this.cascaderContext, this.singleContent, this.multipleContent);
    },
  },
  mounted() {
    document.addEventListener('click', (event) => {
      this.outerClickListenerFn(event);
    });
    setTimeout(() => {
      this.getInputWidth();
    });
  },
  beforeDestroy() {
    document.removeEventListener('click', (event) => {
      this.outerClickListenerFn(event);
    });
  },
  inject: {
    tCascader: {
      default: undefined,
    },
  },
  methods: {
    getInputWidth() {
      const { width } = (this.$refs.inputContent as HTMLElement).getBoundingClientRect();
      const {
        cascaderContext: { setInputWidth },
      } = this;
      setInputWidth(width);
    },
    outerClickListenerFn(event: MouseEvent | TouchEvent) {
      return outerClickListenerEffect(this.$refs.inputContent as HTMLElement, this.cascaderContext, event);
    },
    renderContent() {
      const { placeholder, showPlaceholder } = this;
      const content = !showPlaceholder ? (
        this.InnerContent()
      ) : (
        <span class={`${prefix}-cascader__placeholder`}>{placeholder || this.t(this.global.placeholder)}</span>
      );
      return content;
    },
    InnerContent() {
      const {
        cascaderContext, placeholder, singleContent, multipleContent, listeners, collapsedItems,
      } = this;

      const {
        multiple,
        size,
        disabled,
        filterable,
        setFilterActive,
        visible,
        inputVal,
        setInputVal,
        minCollapsedNum,
        value,
        showAllLevels,
      } = cascaderContext;

      const { onFocus, onBlur, onRemove } = listeners as InputContentProps['listeners'];

      const renderSelfTag = (node: TreeNode, index: number) => (
        <Tag
          closable={!disabled}
          key={index}
          disabled={disabled}
          onClose={(ctx: any) => {
            ctx.e.stopPropagation();
            handleRemoveTagEffect(cascaderContext, node, onRemove);
          }}
          size={size}
        >
          {showAllLevels ? getFullPathLabel(node) : node.label}
        </Tag>
      );
      const renderCollItems = () => {
        const tempList: object[] = [];
        multipleContent.forEach((node: TreeNode) => {
          tempList.push(node.data);
        });
        return tempList;
      };

      const generalContent = !multiple ? (
        <span class={`${prefix}-cascader__content`}>{singleContent}</span>
      ) : (
        <span>
          {minCollapsedNum > 0 && multipleContent.length > minCollapsedNum ? (
            <span>
              {multipleContent
                .slice(0, minCollapsedNum)
                .map((node: TreeNode, index: number) => renderSelfTag(node, index))}
              {collapsedItems || this.$scopedSlots.collapsedItems ? (
                renderTNodeJSX(this, 'collapsedItems', {
                  params: {
                    value: renderCollItems(),
                    collapsedSelectedItems: renderCollItems().slice(minCollapsedNum),
                    count: renderCollItems().length - minCollapsedNum,
                  },
                })
              ) : (
                <Tag size={size} disabled={disabled}>
                  +{multipleContent.length - minCollapsedNum}
                </Tag>
              )}
            </span>
          ) : (
            multipleContent.map((node: TreeNode, index: number) => renderSelfTag(node, index))
          )}
        </span>
      );

      const inputPlaceholder = multiple
        ? multipleContent.map((node: TreeNode) => node.label).join('、')
        : singleContent;

      const filterContent = () => (
        <Input
          size={size}
          placeholder={inputPlaceholder || placeholder || this.t(this.global.placeholder)}
          value={inputVal}
          onChange={(value: string) => {
            setInputVal(value);
            setFilterActive(!!value);
          }}
          onFocus={(v: InputValue, context: { e: FocusEvent }) => isFunction(onFocus) && onFocus({ value, e: context?.e })
          }
          onBlur={(v: InputValue, context: { e: FocusEvent }) => isFunction(onBlur) && onBlur({ value, e: context?.e })}
          autofocus={visible}
        />
      );

      return filterable && visible ? filterContent() : generalContent;
    },
    renderSuffixIcon() {
      const {
        closeShow,
        closeIconClass,
        fakeArrowIconClass,
        cascaderContext: {
          size, visible, disabled, loading,
        },
      } = this;

      const closeIconClick = (context: { e: MouseEvent }) => {
        context.e.stopPropagation();

        closeIconClickEffect(this.cascaderContext);
      };

      if (loading) {
        return (
          <span class={`${prefix}-cascader-icon`}>
            <TLoading size="small" />
          </span>
        );
      }
      if (closeShow) {
        return (
          <transition name={`${prefix}-cascader-close-icon-fade`} appear>
            <CloseCircleFilledIcon class={closeIconClass} size={size} onClick={closeIconClick} />
          </transition>
        );
      }

      return <FakeArrow overlayClassName={fakeArrowIconClass} isActive={visible} disabled={disabled} />;
    },
  },
  render() {
    const { $attrs, cascaderContext } = this;

    return (
      <div
        ref="inputContent"
        class={this.cascaderInnerClasses}
        {...$attrs}
        onMouseenter={() => {
          this.isHover = true;
        }}
        onMouseleave={() => {
          this.isHover = false;
        }}
        onClick={(e: MouseEvent) => {
          e.stopPropagation();
          innerContentClickEffect(cascaderContext);
        }}
      >
        {this.renderContent()}
        {this.renderSuffixIcon()}
      </div>
    );
  },
});

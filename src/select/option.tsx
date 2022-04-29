import Vue, { VNode } from 'vue';
import { ScopedSlotReturnValue } from 'vue/types/vnode';
import get from 'lodash/get';
import { renderContent } from '../utils/render-tnode';
import mixins from '../utils/mixins';
import { scrollSelectedIntoView } from '../utils/dom';
import { prefix } from '../config';
import CLASSNAMES from '../utils/classnames';
import ripple from '../utils/ripple';
import props from './option-props';
import { TdOptionProps } from './type';
import Checkbox from '../checkbox/index';
import { SelectInstance } from './instance';
import { ClassName } from '../common';
import { getKeepAnimationMixins } from '../config-provider/config-receiver';

const keepAnimationMixins = getKeepAnimationMixins<OptionInstance>();

const selectName = `${prefix}-select`;
export interface OptionInstance extends Vue {
  tSelect: SelectInstance;
}

export default mixins(keepAnimationMixins).extend({
  name: 'TOption',
  data() {
    return {
      isHover: false,
      formDisabled: undefined,
    };
  },
  props: { ...props },
  components: {
    TCheckbox: Checkbox,
  },
  directives: { ripple },
  inject: {
    tSelect: {
      default: undefined,
    },
  },
  watch: {
    value() {
      this.tSelect && this.tSelect.getOptions(this);
    },
    label() {
      this.tSelect && this.tSelect.getOptions(this);
    },
    hovering() {
      if (this.hovering) {
        const timer = setTimeout(() => {
          scrollSelectedIntoView(this.tSelect.getOverlayElm(), this.$el as HTMLElement);
          clearTimeout(timer);
        }, this.tSelect.popupOpenTime); // 待popup弹出后再滚动到对应位置
      }
    },
  },
  computed: {
    tDisabled(): boolean {
      return this.formDisabled || this.disabled;
    },
    // 键盘上下按键选中hover样式的选项
    hovering(): boolean {
      return (
        this.tSelect
        && this.tSelect.visible
        && this.tSelect.hoverOptions[this.tSelect.hoverIndex]
        && this.tSelect.hoverOptions[this.tSelect.hoverIndex][this.tSelect.realValue] === this.value
      );
    },
    multiLimitDisabled(): boolean {
      if (this.tSelect && this.tSelect.multiple && this.tSelect.max) {
        if (
          this.tSelect.value instanceof Array
          && this.tSelect.value.indexOf(this.value) === -1
          && this.tSelect.max <= this.tSelect.value.length
        ) {
          return true;
        }
      }
      return false;
    },
    classes(): ClassName {
      return [
        `${prefix}-select-option`,
        {
          [CLASSNAMES.STATUS.disabled]: this.tDisabled || this.multiLimitDisabled,
          [CLASSNAMES.STATUS.selected]: this.selected,
          [CLASSNAMES.SIZE[this.tSelect && this.tSelect.size]]: this.tSelect && this.tSelect.size,
          [`${prefix}-select-option__hover`]: this.hovering,
        },
      ];
    },
    isCreatedOption(): boolean {
      return this.tSelect.creatable && this.value === this.tSelect.searchInput;
    },
    show(): boolean {
      /**
       * 此属性主要用于slots生成options时显示控制，直传options由select进行显示控制
       * create的option，始终显示
       * canFilter只显示待匹配的选项
       */
      if (!this.tSelect) return false;
      if (this.isCreatedOption) return true;
      if (this.tSelect.canFilter && this.tSelect.searchInput !== '') {
        return this.tSelect.filterOptions.some(
          (option: TdOptionProps) => get(option, this.tSelect.realValue) === this.value,
        );
      }
      return true;
    },
    labelText(): string | number {
      return this.label || this.value;
    },
    selected(): boolean {
      let flag = false;
      if (!this.tSelect) return false;
      if (this.tSelect.value instanceof Array) {
        if (this.tSelect.labelInValue) {
          flag = this.tSelect.value.map((item) => get(item, this.tSelect.realValue)).indexOf(this.value) !== -1;
        } else {
          flag = this.tSelect.value.indexOf(this.value) !== -1;
        }
      } else if (typeof this.tSelect.value === 'object') {
        flag = get(this.tSelect.value, this.tSelect.realValue) === this.value;
      } else {
        flag = this.tSelect.value === this.value;
      }
      return flag;
    },
  },
  methods: {
    select(e: MouseEvent | KeyboardEvent) {
      e.stopPropagation();
      if (this.tDisabled || this.multiLimitDisabled) {
        return false;
      }
      const parent = this.$el.parentNode as HTMLElement;
      if (parent && parent.className.indexOf(`${selectName}__create-option`) !== -1) {
        this.tSelect && this.tSelect.createOption(this.value.toString());
      }
      this.tSelect && this.tSelect.onOptionClick(this.value, e);
    },
    mouseEvent(v: boolean) {
      this.isHover = v;
    },
  },
  mounted() {
    this.tSelect && this.tSelect.getOptions(this);
  },
  beforeDestroy() {
    this.tSelect && this.tSelect.hasSlotOptions && this.tSelect.destroyOptions(this);
  },
  render(): VNode {
    const {
      classes, labelText, selected, disabled, multiLimitDisabled, show,
    } = this;
    const children: ScopedSlotReturnValue = renderContent(this, 'default', 'content');
    const optionChild = children || labelText;
    return (
      <li
        v-show={show}
        class={classes}
        onMouseenter={this.mouseEvent.bind(true)}
        onMouseleave={this.mouseEvent.bind(false)}
        onClick={this.select}
        v-ripple={this.keepAnimation.ripple}
      >
        {this.tSelect && this.tSelect.multiple ? (
          <t-checkbox
            checked={selected}
            disabled={disabled || multiLimitDisabled}
            nativeOnClick={(e: MouseEvent) => {
              e.preventDefault();
            }}
          >
            {optionChild}
          </t-checkbox>
        ) : (
          <span>{optionChild}</span>
        )}
      </li>
    );
  },
});

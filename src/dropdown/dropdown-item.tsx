import Vue from 'vue';
import { ChevronRightIcon as TdChevronRightIcon } from 'tdesign-icons-vue';
import TDivider from '../divider';
import itemProps from './dropdown-item-props';
import { DropdownOption } from './type';

import { renderContent } from '../utils/render-tnode';
import { emitEvent } from '../utils/event';
import ripple from '../utils/ripple';
import mixins from '../utils/mixins';
import { getKeepAnimationMixins, getClassPrefixMixins, getGlobalIconMixins } from '../config-provider/config-receiver';

import { TNodeReturnValue } from '../common';

const classPrefixMixins = getClassPrefixMixins('dropdown');

const keepAnimationMixins = getKeepAnimationMixins<DropdownItemInstance>();

export interface DropdownItemInstance extends Vue {
  dropdown: {
    handleMenuClick: (data: DropdownOption, context: { e: MouseEvent }) => void;
  };
}

export default mixins(keepAnimationMixins, classPrefixMixins, getGlobalIconMixins()).extend({
  name: 'TDropdownItem',
  components: {
    TDivider,
  },
  directives: { ripple },
  inject: {
    dropdown: {
      default: undefined,
    },
  },
  props: {
    ...itemProps,
    path: {
      type: String,
      default: '',
    },
    hasChildren: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      focused: false,
    };
  },
  methods: {
    renderSuffix(): TNodeReturnValue {
      const { ChevronRightIcon } = this.useGlobalIcon({ ChevronRightIcon: TdChevronRightIcon });
      return this.hasChildren ? <ChevronRightIcon class={`${this.componentName}__item-icon`} /> : null;
    },
    handleItemClick(e: MouseEvent): void {
      if (!this.hasChildren && !this.disabled) {
        const data = {
          value: this.value,
          path: this.path,
          content: this.content,
        };

        emitEvent(this, 'item-hover', this.path);
        emitEvent(this, 'click', data, { e }); // dropdown item的点击回调
        this.dropdown.handleMenuClick(data, { e });
      }
    },
    handleMouseover(): void {
      emitEvent(this, 'hover', this.path);
    },
  },
  render() {
    const classes = [
      `${this.componentName}__item`,
      {
        [`${this.componentName}--suffix`]: this.hasChildren,
        [this.commonStatusClassName.disabled]: this.disabled,
        [this.commonStatusClassName.active]: this.active,
      },
    ];
    return (
      <div>
        <div
          v-ripple={this.keepAnimation.ripple}
          class={classes}
          onClick={this.handleItemClick}
          onMouseover={this.handleMouseover}
        >
          <div class={`${this.componentName}__item-content`}>
            <span class={`${this.componentName}__item-text`}>{renderContent(this, 'content', 'default')}</span>
          </div>
          {this.renderSuffix()}
        </div>
        {this.divider ? <TDivider /> : null}
      </div>
    );
  },
});

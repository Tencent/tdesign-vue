import { PropType, CreateElement } from 'vue';
import { ChevronRightIcon as TdChevronRightIcon, ChevronLeftIcon as TdChevronLeftIcon } from 'tdesign-icons-vue';
import TButton from '../../button';
import { TNode } from '../../common';
import mixins from '../../utils/mixins';
import { getClassPrefixMixins, getGlobalIconMixins } from '../../config-provider/config-receiver';

const classPrefixMixins = getClassPrefixMixins('transfer');

export default mixins(classPrefixMixins, getGlobalIconMixins()).extend({
  name: 'TTransferOperations',
  props: {
    // 控制左按钮的禁用与否
    leftDisabled: {
      type: Boolean,
      required: true,
    },
    // 控制右按钮的禁用与否
    rightDisabled: {
      type: Boolean,
      required: true,
    },
    operation: {
      type: [String, Array, Function, Boolean] as PropType<
        Array<string | TNode> | TNode<{ direction: 'left' | 'right' }>
      >,
    },
  },
  methods: {
    moveToRight() {
      this.$emit('moveToRight');
    },
    moveToLeft() {
      this.$emit('moveToLeft');
    },
    getIconRight() {
      const { ChevronRightIcon } = this.useGlobalIcon({ ChevronRightIcon: TdChevronRightIcon });
      return <ChevronRightIcon />;
    },
    getIconLeft() {
      const { ChevronLeftIcon } = this.useGlobalIcon({ ChevronLeftIcon: TdChevronLeftIcon });
      return <ChevronLeftIcon />;
    },
    getIcon(direction: 'left' | 'right') {
      if (typeof this.operation === 'function') {
        return null;
      }
      if (direction === 'right' && this.operation && typeof this.operation[0] === 'function') {
        return null;
      }
      if (direction === 'left' && this.operation && typeof this.operation[1] === 'function') {
        return null;
      }

      if (this.$scopedSlots.operation) {
        return null;
      }

      return direction === 'left' ? this.getIconLeft : this.getIconRight;
    },
    // right:去右边，left:去左边
    _renderButton(h: CreateElement, direction: 'left' | 'right') {
      if (typeof this.$scopedSlots.operation === 'function') {
        return this.$scopedSlots.operation({
          direction,
        });
      }
      if (typeof this.operation === 'function') {
        const renderContent = this.operation;
        return renderContent(h, { direction });
      }
      let renderContent: string | TNode;
      if (Array.isArray(this.operation)) {
        const [left, right] = this.operation;
        renderContent = direction === 'right' ? right : left;
      } else {
        renderContent = '';
      }
      return renderContent;
    },
  },
  render(h) {
    const { leftDisabled, rightDisabled } = this.$props;
    return (
      <div class={`${this.componentName}__operations`}>
        <TButton
          variant="outline"
          size="small"
          shape={typeof this.operation?.[1] === 'string' ? 'rectangle' : 'square'}
          key={rightDisabled ? 'right-outline' : 'right-base'}
          disabled={rightDisabled}
          onClick={this.moveToRight}
          icon={this.getIcon('right')}
        >
          {this._renderButton(h, 'right')}
        </TButton>
        <TButton
          variant="outline"
          key={leftDisabled ? 'left-outline' : 'left-base'}
          size="small"
          shape={typeof this.operation?.[0] === 'string' ? 'rectangle' : 'square'}
          disabled={leftDisabled}
          onClick={this.moveToLeft}
          icon={this.getIcon('left')}
        >
          {this._renderButton(h, 'left')}
        </TButton>
      </div>
    );
  },
});

import Vue from 'vue';
import TIconChevronRight from '../icon/chevron-right';
import { prefix } from '../config';
import { STATUS_CLASSNAMES } from '../utils/classnames';
import ripple from '../utils/ripple';
import itemProps from './dropdown-item-props';
import bus from './bus';
import { emitEvent } from '../utils/event';

import { TNodeReturnValue } from '../common';

const name = `${prefix}-dropdown__item`;

export default Vue.extend({
  name,
  components: {
    TIconChevronRight,
  },
  directives: { ripple },
  props: {
    ...itemProps,
    busId: {
      type: String,
      default: '',
    },
    path: {
      type: String,
      default: '',
    },
    hasChildren: {
      type: Boolean,
      default: false,
    },
    maxColumnWidth: {
      type: Number,
      default: 100,
    },
    minColumnWidth: {
      type: Number,
      default: 10,
    },
  },
  data() {
    return {
      focused: false,
    };
  },
  methods: {
    renderSuffix(): TNodeReturnValue {
      return this.hasChildren ? <TIconChevronRight class="children-suffix" /> : '';
    },
    handleItemClick(e: MouseEvent): void {
      if (!this.hasChildren && !this.disabled) {
        bus.$emit(`${this.busId}item-click`, {
          value: this.value,
          path: this.path,
          content: this.content,
        }, e);
        bus.$emit(`${this.busId}submenuShow`, this.path);
        emitEvent(this, 'click', e); // dropdown item的点击回调
      }
    },
    handleMouseover(): void {
      bus.$emit(`${this.busId}submenuShow`, this.path);
    },
  },
  render() {
    const classes = [
      name,
      {
        'has-suffix': this.hasChildren,
        [`${name}_is_divided`]: this.divider,
        [STATUS_CLASSNAMES.disabled]: this.disabled,
        [STATUS_CLASSNAMES.active]: this.active,
      },
    ];

    return (
      <div class={classes}
        onClick={this.handleItemClick}
        onMouseover={this.handleMouseover}
        style={{
          maxWidth: `${this.maxColumnWidth}px`,
          minWidth: `${this.minColumnWidth}px`,
        }}
        v-ripple
      >
        <div class={`${name}__content`} title={this.content}>
          <span class={`${name}__content__text`}>
            {this.content}
          </span>
        </div>
        { this.renderSuffix()}
      </div>
    );
  },
});

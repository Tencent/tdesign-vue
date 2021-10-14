import Vue from 'vue';
import TIconChevronRight from '../icon/chevron-right';
import TDivider from '../divider';
import { prefix } from '../config';
import itemProps from './dropdown-item-props';
import { STATUS_CLASSNAMES } from '../utils/classnames';

import { renderTNodeJSX } from '../utils/render-tnode';
import { emitEvent } from '../utils/event';
import ripple from '../utils/ripple';

import { TNodeReturnValue } from '../common';

const name = `${prefix}-dropdown__item`;

export default Vue.extend({
  name: 'TDropdownItem',
  components: {
    TIconChevronRight, TDivider,
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
      return this.hasChildren ? <TIconChevronRight class="children-suffix" /> : null;
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
      }
    },
    handleMouseover(): void {
      emitEvent(this, 'hover', this.path);
    },
  },
  render() {
    const classes = [
      name,
      {
        'has-suffix': this.hasChildren,
        [STATUS_CLASSNAMES.disabled]: this.disabled,
        [STATUS_CLASSNAMES.active]: this.active,
      },
    ];

    return (
      <div>
      <div
        class={classes}
        onClick={this.handleItemClick}
        onMouseover={this.handleMouseover}
        style={{
          maxWidth: `${this.maxColumnWidth}px`,
          minWidth: `${this.minColumnWidth}px`,
        }}
        v-ripple
      >
        <div class={`${name}__content`} >
          <span class={`${name}__content__text`}>{renderTNodeJSX(this, 'content')}</span>
        </div>
        {this.renderSuffix()}
      </div>
      {this.divider ? <TDivider/> : null}
      </div>
    );
  },
});

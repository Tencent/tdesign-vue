import Vue from 'vue';
import GradientIcon from './icon/gradient';
import { prefix } from '../config';
import { SIZE_CLASSNAMES } from '../utils/classnames';
import { addClass, removeClass } from '../utils/dom';
import { renderTNodeJSX, renderContent } from '../utils/render-tnode';
import TransferDom from '../utils/transfer-dom';
import props from './props';
import { ClassName, Styles } from '../common';

const name = `${prefix}-loading`;
const centerClass = `${prefix}-loading--center`;
const fullscreenClass = `${prefix}-loading__fullscreen`;
const lockClass = `${prefix}-loading--lock`;
const overlayClass = `${prefix}-loading__overlay`;
const relativeClass = `${prefix}-loading__parent`;
const fullClass = `${prefix}-loading--full`;
const inheritColorClass = `${prefix}-loading--inherit-color`;

export default Vue.extend({
  name: 'TLoading',

  props: {
    ...props,
  },

  directives: {
    TransferDom,
  },

  data() {
    return {
      delayShowLoading: false,
    };
  },

  created() {
    this.delay && this.countDelay();
  },

  watch: {
    loading: {
      handler(value) {
        if (value) {
          this.countDelay();
          this.lockFullscreen && addClass(document.body, lockClass);
        } else {
          this.lockFullscreen && removeClass(document.body, lockClass);
        }
      },
      immediate: true,
    },
  },

  computed: {
    styles(): Styles {
      const styles: Styles = {};
      if (this.zIndex !== undefined) {
        styles.zIndex = this.zIndex;
      }
      if (!['small', 'medium', 'large'].includes(this.size)) {
        styles['font-size'] = this.size;
      }
      return styles;
    },
    showText(): boolean {
      return Boolean(this.text || this.$scopedSlots.text);
    },
    baseClasses(): ClassName {
      return [centerClass, SIZE_CLASSNAMES[this.size], { [inheritColorClass]: this.inheritColor }];
    },
    hasContent(): boolean {
      return Boolean(this.default || this.$scopedSlots.default || this.content || this.$scopedSlots.content);
    },
    withContentClasses(): ClassName {
      return this.baseClasses.concat([
        name,
        fullClass,
        {
          [overlayClass]: this.showOverlay,
        },
      ]);
    },
    fullScreenClasses(): ClassName {
      return [name, fullscreenClass, centerClass, overlayClass];
    },
    attachClasses(): ClassName {
      return this.baseClasses.concat([name, fullClass, { [overlayClass]: this.showOverlay }]);
    },
    normalClasses(): ClassName {
      return this.baseClasses.concat([name]);
    },
    lockFullscreen(): boolean {
      return this.preventScrollThrough && this.fullscreen;
    },
    // 延时计时是否完成。用于控制延时计时结束前不能显示加载态
    delayCounted(): boolean {
      return Boolean(!this.delay || (this.delay && this.delayShowLoading));
    },
    showWrapLoading(): boolean {
      return this.hasContent && this.loading && this.delayCounted;
    },
    showFullScreenLoading(): boolean {
      return this.fullscreen && this.loading && this.delayCounted;
    },
    showAttachedLoading(): boolean {
      return this.attach && this.loading && this.delayCounted;
    },
  },

  methods: {
    countDelay() {
      this.delayShowLoading = false;
      const timer = setTimeout(() => {
        this.delayShowLoading = true;
        clearTimeout(timer);
      }, this.delay);
    },
  },

  render() {
    const defaultIndicator = <GradientIcon size={this.size} />;
    const indicator = this.loading && renderTNodeJSX(this, 'indicator', defaultIndicator);
    const text = this.showText && <div class={`${prefix}-loading__text`}>{renderTNodeJSX(this, 'text')}</div>;

    // full screen loading
    if (this.fullscreen) {
      if (!this.showFullScreenLoading) return null;
      return (
        <div class={this.fullScreenClasses} style={this.styles} v-transfer-dom={this.attach}>
          <div class={this.baseClasses}>
            {indicator}
            {text}
          </div>
        </div>
      );
    }

    // Loading is wrapping a HTMLElement.
    if (this.hasContent) {
      return (
        <div class={relativeClass}>
          {renderContent(this, 'default', 'content')}
          {this.showWrapLoading && (
            <div class={this.withContentClasses} style={this.styles}>
              {indicator}
              {text}
            </div>
          )}
        </div>
      );
    }

    // transfer parent node
    if (this.attach) {
      if (!this.showAttachedLoading) return;
      return (
        <div class={this.attachClasses} style={this.styles} v-transfer-dom={this.attach}>
          {indicator}
          {text}
        </div>
      );
    }

    // Normal Loading without overlay or content
    return (
      <div class={this.normalClasses} style={this.styles}>
        {indicator}
        {text}
      </div>
    );
  },
});

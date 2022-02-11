/* eslint-disable linebreak-style */
import Vue from 'vue';
import {
  InfoCircleFilledIcon,
  CheckCircleFilledIcon,
  ErrorCircleFilledIcon,
  HelpCircleFilledIcon,
  CloseIcon,
} from 'tdesign-icons-vue';
import Loading from '../loading';
import { prefix } from '../config';
import { THEME_LIST } from './const';
import { renderTNodeJSX, renderContent } from '../utils/render-tnode';
import props from './props';
import { ClassName } from '../common';

const name = `${prefix}-message`;

export default Vue.extend({
  name: 'TMessage',

  components: {
    InfoCircleFilledIcon,
    CheckCircleFilledIcon,
    ErrorCircleFilledIcon,
    HelpCircleFilledIcon,
    CloseIcon,
    Loading,
  },

  props: { ...props, placement: String }, // todo: 把placement加到配置里

  data() {
    return {
      timer: null,
    };
  },

  computed: {
    classes(): ClassName {
      const status = {};
      THEME_LIST.forEach((t) => {
        status[`${prefix}-is-${t}`] = this.theme === t;
      });
      return [
        name,
        status,
        {
          [`${prefix}-is-closable`]: this.closeBtn || this.$scopedSlots.closeBtn,
        },
      ];
    },
  },

  created() {
    this.duration && this.setTimer();
  },

  mounted() {
    const msgDom = this.$refs.msg as HTMLElement;
    const offsetWidth = msgDom?.offsetWidth || 0;
    const offsetHeight = msgDom?.offsetHeight || 0;
    const fadeInKeyframes: Array<Keyframe> | null = this.getFadeInKeyframes(
      this.$props.placement,
      offsetWidth,
      offsetHeight,
    );
    if (!fadeInKeyframes) return;
    const styleAfterFadeIn = fadeInKeyframes[fadeInKeyframes.length - 1];
    const keys = Object.keys(styleAfterFadeIn);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      msgDom.style[key] = styleAfterFadeIn[key];
    }
    msgDom.animate(fadeInKeyframes, {
      duration: 200,
      easing: 'linear',
    });
  },

  methods: {
    fadeOut(onFinish: Function) {
      const msgDom = this.$refs.msg as HTMLElement;
      const offsetHeight = msgDom?.offsetHeight || 0;
      const fadeOutKeyframes: Array<Keyframe> = this.getFadeOutKeyframes(this.$props.placement, offsetHeight);
      const styleAfterFadeOut = fadeOutKeyframes[fadeOutKeyframes.length - 1];
      const keys = Object.keys(styleAfterFadeOut);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        msgDom.style[key] = styleAfterFadeOut[key];
      }

      const animation = msgDom.animate(fadeOutKeyframes, {
        duration: 200,
        easing: 'linear',
      });
      animation.onfinish = () => {
        msgDom.style.display = 'none';
        onFinish();
      };
    },
    setTimer() {
      if (!this.duration) {
        return;
      }
      this.timer = Number(
        setTimeout(() => {
          this.clearTimer();
          this.fadeOut(() => {
            this.$emit('duration-end');
          });
          if (this.onDurationEnd) {
            this.onDurationEnd();
          }
        }, this.duration),
      );
    },
    clearTimer() {
      this.duration && clearTimeout(this.timer);
    },
    getFadeInKeyframes(placement: string, offsetWidth: Number, offsetHeight: Number): Array<Keyframe> | null {
      if (['top-left', 'left', 'bottom-left'].includes(placement)) {
        return [
          { opacity: 0, marginLeft: `-${offsetWidth}px` },
          { opacity: 1, marginLeft: '0' },
        ];
      }
      if (['top-right', 'right', 'bottom-right'].includes(placement)) {
        return [
          { opacity: 0, marginRight: `-${offsetWidth}px` },
          { opacity: 1, marginRight: '0' },
        ];
      }
      if (['top'].includes(placement)) {
        return [
          { opacity: 0, marginTop: `-${offsetHeight}px` },
          { opacity: 1, marginTop: '0' },
        ];
      }
      if (['center', 'bottom'].includes(placement)) {
        return [
          { opacity: 0, transform: `translate3d(0, ${offsetHeight}px, 0)` },
          { opacity: 1, transform: 'translate3d(0, 0, 0)' },
        ];
      }
      return null;
    },
    getFadeOutKeyframes(placement: string, offsetHeight: Number): Array<Keyframe> | null {
      if (['bottom-left', 'bottom', 'bottom-right'].includes(placement)) {
        const marginOffset = `${offsetHeight}px`;
        return [
          { opacity: 1, marginTop: '0px' },
          { opacity: 0, marginTop: marginOffset },
        ];
      }
      const marginOffset = `-${offsetHeight}px`;
      return [
        { opacity: 1, marginTop: '0px' },
        { opacity: 0, marginTop: marginOffset },
      ];
    },
    close(e?: MouseEvent) {
      this.$emit('close-btn-click', { e });
      if (this.onCloseBtnClick) {
        this.onCloseBtnClick({ e });
      }
    },
    renderClose() {
      const defaultClose = <close-icon />;
      return (
        <span class={`${name}__close`} onClick={this.close}>
          {renderTNodeJSX(this, 'closeBtn', defaultClose)}
        </span>
      );
    },
    renderIcon() {
      if (this.icon === false) return;
      if (typeof this.icon === 'function') return this.icon(this.$createElement);
      if (this.$scopedSlots.icon) {
        return this.$scopedSlots.icon(null);
      }
      const component = {
        info: InfoCircleFilledIcon,
        success: CheckCircleFilledIcon,
        warning: ErrorCircleFilledIcon,
        error: ErrorCircleFilledIcon,
        question: HelpCircleFilledIcon,
        loading: Loading,
      }[this.theme];
      return <component></component>;
    },
  },

  render() {
    return (
      <div ref="msg" class={this.classes} onMouseenter={this.clearTimer} onMouseleave={this.setTimer}>
        {this.renderIcon()}
        {renderContent(this, 'default', 'content')}
        {this.renderClose()}
      </div>
    );
  },
});

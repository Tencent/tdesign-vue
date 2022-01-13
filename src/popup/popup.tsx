import Vue from 'vue';
import { createPopper, Options } from '@popperjs/core';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';
import { prefix } from '../config';
import CLASSNAMES from '../utils/classnames';
import {
  on, off, once, getAttach,
} from '../utils/dom';
import props from './props';
import { renderTNodeJSX, renderContent } from '../utils/render-tnode';
import { getIEVersion } from '../utils/helper';
import { PopupVisibleChangeContext } from './type';
import { Styles, ClassName } from '../common';
import setStyle from '../_common/js/utils/set-style';

const stop = (e: MouseEvent) => e.stopPropagation();
const name = `${prefix}-popup`;
const placementMap = {
  top: 'top',
  'top-left': 'top-start',
  'top-right': 'top-end',
  bottom: 'bottom',
  'bottom-left': 'bottom-start',
  'bottom-right': 'bottom-end',
  left: 'left',
  'left-top': 'left-start',
  'left-bottom': 'left-end',
  right: 'right',
  'right-top': 'right-start',
  'right-bottom': 'right-end',
};

const showTimeout = 250;
const hideTimeout = 150;
const triggers = ['click', 'hover', 'focus', 'context-menu'] as const;

export default Vue.extend({
  name: 'TPopup',

  provide(this: any) {
    return {
      popup: this,
    };
  },

  inject: {
    popup: {
      default: undefined,
    },
  },

  props: {
    ...props,
    expandAnimation: {
      type: Boolean,
    },
  },

  data() {
    return {
      name,
      referenceElm: null,
      resizeSensor: null,
      /** popperjs instance */
      popper: null,
      timeout: null,
      refOverlayElm: null,
      hasDocumentEvent: false,
      presetMaxHeight: null, // 组件自身已设置的maxHeight
    };
  },
  computed: {
    overlayClasses(): ClassName {
      const base = [
        `${name}__content`,
        {
          [`${name}__content--arrow`]: this.showArrow,
          [CLASSNAMES.STATUS.disabled]: this.disabled,
        },
      ] as ClassName;
      return base.concat(this.overlayClassName);
    },
    hasTrigger(): Record<typeof triggers[number], boolean> {
      return triggers.reduce(
        (map, trigger) => ({
          ...map,
          [trigger]: this.trigger.includes(trigger),
        }),
        {} as any,
      );
    },
  },
  watch: {
    visible(val) {
      if (val) {
        this.updatePopper();
        if (!this.hasDocumentEvent && (this.hasTrigger['context-menu'] || this.hasTrigger.click)) {
          on(document, 'mousedown', this.handleDocumentClick);
          this.hasDocumentEvent = true;
        }
        // focus trigger esc 隐藏浮层
        if (this.referenceElm && this.hasTrigger.focus) {
          once(this.referenceElm, 'keydown', (ev: KeyboardEvent) => {
            if (ev.code === 'Escape') {
              this.handleClose({ trigger: 'keydown-esc' });
            }
          });
        }
      } else {
        // destruction is delayed until after animation ends
        off(document, 'mousedown', this.handleDocumentClick);
        this.hasDocumentEvent = false;
      }
    },
    overlayStyle() {
      if (this.popper) {
        this.popper.update();
        this.updateOverlayStyle();
      }
    },
  },
  mounted() {
    if (typeof this.content === 'string') {
      // set 480px max width when the content type is string
      this.setOverlayStyle({ maxWidth: '480px' });
    }

    this.referenceElm = this.referenceElm || this.$el;
    if (!this.referenceElm || !this.$refs.popper) return;

    if (this.visible) {
      this.createPopper();
      this.updateOverlayStyle();
    }

    const reference = this.referenceElm;
    const popperElm = this.$refs.popper as HTMLElement;
    const offEvents: (() => void)[] = [];

    this.$on('hook:beforeDestroy', () => {
      offEvents.forEach((handler) => handler());
    });

    if (this.hasTrigger.click) {
      offEvents.push(
        on(reference, 'click', (e: MouseEvent) => this.handleToggle({ e, trigger: 'trigger-element-click' })),
      );
    }
    if (this.hasTrigger.hover) {
      offEvents.push(on(reference, 'mouseenter', () => this.handleOpen({ trigger: 'trigger-element-hover' })));
      offEvents.push(on(reference, 'mouseleave', () => this.handleClose({ trigger: 'trigger-element-hover' })));
      offEvents.push(on(popperElm, 'mouseenter', () => this.handleOpen({ trigger: 'trigger-element-hover' }, true)));
      offEvents.push(
        on(popperElm, 'mouseleave', (ev: MouseEvent) => {
          const parent = (this as any).popup;
          let closeParent: boolean;
          if (parent?.visible) {
            const parentRect = parent.$refs.popper.getBoundingClientRect();
            // close parent if mouse isn't inside
            closeParent = !(
              ev.x > parentRect.left
              && ev.x < parentRect.right
              && ev.y > parentRect.top
              && ev.y < parentRect.bottom
            );
          }
          this.handleClose({ trigger: 'trigger-element-hover' }, closeParent);
        }),
      );
    }
    if (this.hasTrigger.focus) {
      if (reference.querySelector('input,textarea')) {
        offEvents.push(on(reference, 'focusin', () => this.handleOpen({ trigger: 'trigger-element-focus' })));
        offEvents.push(on(reference, 'focusout', () => this.handleClose({ trigger: 'trigger-element-blur' })));
      } else {
        offEvents.push(on(reference, 'mousedown', () => this.handleOpen({ trigger: 'trigger-element-click' })));
        offEvents.push(on(reference, 'mouseup', () => this.handleClose({ trigger: 'trigger-element-click' })));
      }
    }
    if (this.hasTrigger['context-menu']) {
      reference.oncontextmenu = () => false;
      offEvents.push(
        on(reference, 'mousedown', (e: MouseEvent) => {
          // MouseEvent.button
          // 2: Secondary button pressed, usually the right button
          e.button === 2 && this.handleToggle({ trigger: 'context-menu' });
        }),
      );
    }
  },
  beforeDestroy() {
    if (this.popper && !this.visible) {
      this.popper.destroy();
      this.popper = null;
    }

    const popperElm = this.$refs.popper as HTMLElement;
    if (popperElm && popperElm.parentNode === document.body) {
      popperElm.removeEventListener('click', stop);
      document.body.removeChild(popperElm);
    }
  },
  methods: {
    createPopper() {
      const currentPlacement = this.placement;
      const popperElm = this.$refs.popper as HTMLElement;

      const overlayContainer = getAttach(this.attach);
      overlayContainer.appendChild(popperElm);
      if (this.popper && this.popper.destroy) {
        this.popper.destroy();
      }
      let placement = placementMap[currentPlacement] as any;
      if (this.expandAnimation) {
        // 如果有展开收起动画 需要在beforeEnter阶段设置max-height为0 这导致popperjs无法知道overflow了 所以需要在这里手动判断设置placment
        popperElm.style.display = '';
        this.presetMaxHeight = parseInt(getComputedStyle(this.getContentElm(popperElm)).maxHeight, 10) || Infinity;
        const referenceElmBottom = innerHeight - this.referenceElm.getBoundingClientRect().bottom;
        const referenceElmTop = this.referenceElm.getBoundingClientRect().top;
        if (referenceElmBottom < popperElm.scrollHeight && referenceElmTop >= popperElm.scrollHeight) {
          placement = /left/.test(currentPlacement) ? 'top-start' : 'top-end';
        }
        popperElm.style.display = 'none';
      }
      const popperOptions: Options = {
        placement,
        onFirstUpdate: () => {
          this.$nextTick(this.updatePopper);
        },
        modifiers: [],
        strategy: 'absolute',
      };
      if (getIEVersion() <= 9) {
        popperOptions.modifiers = [
          {
            name: 'computeStyles',
            options: {
              // 默认为 true，即使用 transform 定位，开启 gpu 加速
              // ie9 不支持 transform，需要添加 -ms- 前缀，@popperjs/core 没有添加这个样式，
              // 在 ie9 下则去掉 gpu 优化加速，使用 top, right, bottom, left 定位
              gpuAcceleration: false,
            },
          },
        ];
      }
      this.popper = createPopper(this.referenceElm, popperElm, popperOptions);
      popperElm.addEventListener('click', stop);
      // 监听trigger元素尺寸变化
      this.resizeSensor = new ResizeSensor(this.referenceElm, () => {
        this.popper && this.popper.update();
        this.updateOverlayStyle();
      });
    },

    updatePopper() {
      if (this.popper) {
        this.popper.update();
      } else {
        this.createPopper();
      }
    },

    updateOverlayStyle() {
      const { overlayStyle } = this;
      const referenceElm = this.$el as HTMLElement;
      if (!this.$refs) return;
      const refOverlayElm = this.$refs.overlay as HTMLElement;
      if (typeof overlayStyle === 'function' && referenceElm && refOverlayElm) {
        const userOverlayStyle = overlayStyle(referenceElm);
        this.setOverlayStyle(userOverlayStyle);
      } else if (typeof overlayStyle === 'object' && refOverlayElm) {
        this.setOverlayStyle(overlayStyle);
      }
    },

    setOverlayStyle(styles: Styles) {
      if (!this.$refs) return;
      const refOverlayElm = this.$refs.overlay as HTMLElement;
      if (typeof styles === 'object' && refOverlayElm) {
        // 统一追加内联style方法
        setStyle(refOverlayElm, styles);
      }
    },

    destroyPopper(el: HTMLElement) {
      this.resetExpandStyles(el);
      if (this.popper) {
        this.popper.destroy();
        this.popper = null;
        if (this.destroyOnClose) {
          const popperElm = this.$refs.popper as HTMLElement;
          popperElm.parentNode.removeChild(popperElm);
        }
      }
    },

    handleToggle(context: PopupVisibleChangeContext) {
      this.emitPopVisible(!this.visible, context);
    },
    handleOpen(context: Pick<PopupVisibleChangeContext, 'trigger'>, openParent?: boolean) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(
        () => {
          this.emitPopVisible(true, context);
        },
        this.hasTrigger.click ? 0 : showTimeout,
      );
      // keep parent open (recursively)
      if (openParent) {
        (this as any).popup?.handleOpen(context, true);
      }
    },
    handleClose(context: Pick<PopupVisibleChangeContext, 'trigger'>, closeParent?: boolean) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(
        () => {
          this.emitPopVisible(false, context);
        },
        this.hasTrigger.click ? 0 : hideTimeout,
      );
      // close parent (recursively)
      if (closeParent) {
        (this as any).popup?.handleClose({ trigger: 'trigger-element-hover' }, true);
      }
    },
    handleDocumentClick(e: Event) {
      const popperElm = this.$refs.popper as HTMLElement;
      if (!this.$el || this.$el.contains(e.target as Element) || !popperElm || popperElm.contains(e.target as Node)) return;
      this.emitPopVisible(false, { trigger: 'document' });
    },
    emitPopVisible(val: boolean, context: PopupVisibleChangeContext) {
      this.$emit('visible-change', val, context);
      if (typeof this.onVisibleChange === 'function') {
        this.onVisibleChange(val, context);
      }
    },
    // 以下代码用于处理展开-收起动画相关,
    // 需要使用popup的组件设置非对外暴露的expandAnimation开启 对不需要展开收起动画的其他组件无影响
    getContentElm(el: HTMLElement): HTMLElement {
      if (this.expandAnimation) {
        const content = el.querySelector(`.${name}__content`) as HTMLElement;
        return content;
      }
      return null;
    },
    // 动画结束后 清除展开收起动画相关属性 避免造成不必要的影响
    resetExpandStyles(el: HTMLElement) {
      const content = this.getContentElm(el);
      if (content) {
        content.style.overflow = '';
        if (this.presetMaxHeight !== Infinity) {
          content.style.maxHeight = '';
        }
      }
    },
    // 设置展开动画初始条件
    beforeEnter(el: HTMLElement) {
      const content = this.getContentElm(el);
      if (content) {
        content.style.overflow = 'hidden';
        content.style.maxHeight = '0';
      }
    },
    // 设置max-height,触发展开动画
    enter(el: HTMLElement) {
      const content = this.getContentElm(el);
      if (content) {
        // 对比scrollHeight和组件自身设置的maxHeight 选择小的做展开动画
        const scrollHeight = Math.min(content.scrollHeight, this.presetMaxHeight);
        content.style.maxHeight = `${scrollHeight}px`;
      }
    },
    // 设置max-height为0,触发收起动画
    leave(el: HTMLElement) {
      const content = this.getContentElm(el);
      if (content) content.style.maxHeight = '0';
    },
    // 设置收起动画初始条件
    beforeLeave(el: HTMLElement) {
      const content = this.getContentElm(el);
      if (content) {
        content.style.overflow = 'hidden';
      }
    },
  },

  render() {
    return (
      <div class={`${name}__reference`}>
        <transition
          name={`${name}--animation`}
          appear
          onBeforeEnter={this.beforeEnter}
          onEnter={this.enter}
          onAfterEnter={this.resetExpandStyles}
          onBeforeLeave={this.beforeLeave}
          onLeave={this.leave}
          onAfterLeave={this.destroyPopper}
        >
          <div
            class={name}
            ref="popper"
            v-show={!this.disabled && this.visible}
            role="tooltip"
            aria-hidden={this.disabled || !this.visible ? 'true' : 'false'}
            style={{ zIndex: this.zIndex }}
          >
            <div class={this.overlayClasses} ref="overlay">
              {renderTNodeJSX(this, 'content')}
              {this.showArrow && <div class={`${name}__arrow`}></div>}
            </div>
          </div>
        </transition>
        {renderContent(this, 'default', 'triggerElement')}
      </div>
    );
  },
});

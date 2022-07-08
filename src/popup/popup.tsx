import Vue, { VNodeDirective } from 'vue';
import { createPopper, Placement } from '@popperjs/core';
import { prefix } from '../config';
import commonCls from '../utils/classnames';
import { on, off, once } from '../utils/dom';
import { renderTNodeJSX, renderContent } from '../utils/render-tnode';
import { getIEVersion } from '../utils/helper';
import setStyle from '../_common/js/utils/set-style';
import props from './props';
import { PopupVisibleChangeContext, TdPopupProps } from './type';
import Container from './container';

const prefixCls = `${prefix}-popup`;
const showTimeout = 250;
const hideTimeout = 150;
const triggers = ['click', 'hover', 'focus', 'context-menu'] as const;
const injectionKey = '__T_POPUP';

function getPopperPlacement(placement: TdPopupProps['placement']) {
  return placement.replace(/-(left|top)$/, '-start').replace(/-(right|bottom)$/, '-end') as Placement;
}

function attachListeners(elm: Element) {
  const offs: Array<() => void> = [];
  return {
    add<K extends keyof HTMLElementEventMap>(type: K, listener: (ev: HTMLElementEventMap[K]) => void) {
      on(elm, type, listener);
      offs.push(() => {
        off(elm, type, listener);
      });
    },
    clean() {
      offs.forEach((handler) => handler?.());
      offs.length = 0;
    },
  };
}

export default Vue.extend({
  name: 'TPopup',

  provide(this: any) {
    return {
      [injectionKey]: this,
    };
  },

  inject: {
    popup: {
      from: injectionKey,
      default: undefined,
    },
  },

  props: {
    ...props,
    expandAnimation: {
      type: Boolean,
    },
    updateScrollTop: {
      type: Function,
    },
  },

  data() {
    return {
      /** popperjs instance */
      popper: null as ReturnType<typeof createPopper>,
      /** timeout id */
      timeout: null,
      hasDocumentEvent: false,
      /** if a trusted action (opening or closing) is prevented, increase this flag */
      visibleState: 0,
      mouseInRange: false,
      /** mark popup as clicked when mousedown, reset after mouseup */
      contentClicked: false,
      /**
       * mark trigger element as clicked when click,
       * reset after click event bubbles to document */
      triggerClicked: false,
    };
  },
  computed: {
    overlayClasses(): any {
      return [
        `${prefixCls}__content`,
        {
          [`${prefixCls}__content--text`]: this.content === 'string',
          [`${prefixCls}__content--arrow`]: this.showArrow,
          [commonCls.STATUS.disabled]: this.disabled,
        },
        this.overlayClassName,
      ];
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
    visible(visible) {
      const { hasTrigger, $el: triggerEl } = this;
      if (visible) {
        this.preventClosing(true);
        if (!this.hasDocumentEvent) {
          on(document, 'click', this.handleDocumentClick);
          this.hasDocumentEvent = true;
        }
        // focus trigger esc 隐藏浮层
        if (triggerEl && hasTrigger.focus) {
          once(triggerEl, 'keydown', (ev: KeyboardEvent) => {
            if (ev.code === 'Escape') {
              this.handleClose({ trigger: 'keydown-esc' });
            }
          });
        }
        this.$nextTick(() => {
          this.popupMounted();
        });
      } else {
        this.preventClosing(false);
        // destruction is delayed until after animation ends
        off(document, 'click', this.handleDocumentClick);
        this.hasDocumentEvent = false;
        this.mouseInRange = false;
      }
    },
    overlayStyle() {
      this.updateOverlayStyle();
      this.updatePopper();
    },
    placement() {
      this.popper?.destroy();
      this.popper = null;
      this.updatePopper();
    },
    // sync lock state recursively
    contentClicked(clicked) {
      if ((this as any).popup) {
        (this as any).popup.contentClicked = clicked;
      }
    },
  },
  mounted() {
    const trigger = attachListeners(this.$el);
    const updateTrigger = () => {
      trigger.clean();
      const { hasTrigger } = this;
      if (hasTrigger.hover) {
        trigger.add('mouseenter', () => this.handleOpen({ trigger: 'trigger-element-hover' }));
        trigger.add('mouseleave', () => this.handleClose({ trigger: 'trigger-element-hover' }));
      } else if (hasTrigger.focus) {
        trigger.add('focusin', () => this.handleOpen({ trigger: 'trigger-element-focus' }));
        trigger.add('focusout', () => this.handleClose({ trigger: 'trigger-element-blur' }));
      } else if (hasTrigger.click) {
        trigger.add('click', (e: MouseEvent) => {
          // override nested popups with trigger hover due to higher priority
          this.visibleState = 0;
          this.handleToggle({ e, trigger: 'trigger-element-click' });
          // ie9-10 trigger propagation
          if (getIEVersion() < 11) {
            this.handleDocumentClick();
          }
        });
      } else if (hasTrigger['context-menu']) {
        trigger.add('contextmenu', (e: MouseEvent) => {
          e.preventDefault();
          // MouseEvent.button
          // 2: Secondary button pressed, usually the right button
          e.button === 2 && this.handleToggle({ trigger: 'context-menu' });
        });
      }
      if (!hasTrigger['context-menu']) {
        trigger.add('click', () => {
          this.triggerClicked = true;
        });
      }
    };
    updateTrigger();
    this.$watch('trigger', updateTrigger);
  },
  updated() {
    (this.$refs.container as any)?.updateContent();
  },
  destroyed() {
    this.destroyPopper();
  },
  methods: {
    updatePopper() {
      const { $el: triggerEl } = this;
      const popperEl = this.$refs.popper as HTMLElement;

      if (!popperEl || !this.visible) return;
      if (this.popper) {
        this.popper.update();
        return;
      }

      this.popper = createPopper(triggerEl, popperEl, {
        modifiers:
          getIEVersion() > 9
            ? []
            : [
              {
                name: 'computeStyles',
                options: {
                  // 默认为 true，即使用 transform 定位，开启 gpu 加速
                  // ie9 不支持 transform，需要添加 -ms- 前缀，@popperjs/core 没有添加这个样式，
                  // 在 ie9 下则去掉 gpu 优化加速，使用 top, right, bottom, left 定位
                  gpuAcceleration: false,
                },
              },
            ],
        placement: getPopperPlacement(this.placement),
        onFirstUpdate: () => {
          this.$nextTick(this.updatePopper);
        },
      });
    },

    // popup弹出第一次初始化暴露事件
    popupMounted() {
      // 用于select定位事件
      const overlayEl = this.$refs?.overlay as HTMLElement;
      if (overlayEl) {
        this.updateScrollTop?.(overlayEl);
      }
    },
    updateOverlayStyle() {
      const { overlayStyle } = this;
      const triggerEl = this.$el as HTMLElement;
      const overlayEl = this.$refs?.overlay as HTMLElement;

      if (!triggerEl || !overlayEl) return;
      if (typeof overlayStyle === 'function') {
        setStyle(overlayEl, overlayStyle(triggerEl, overlayEl));
      } else if (typeof overlayStyle === 'object') {
        setStyle(overlayEl, overlayStyle);
      }
    },

    /**
     * destroy popper IF NEEDED
     */
    destroyPopper() {
      if (this.popper) {
        this.popper.destroy();
        this.popper = null;
      }
      if (this.destroyOnClose) {
        (this.$refs.container as any)?.unmountContent();
      }
    },

    handleToggle(context: PopupVisibleChangeContext) {
      this.emitPopVisible(!this.visible, context);
    },
    handleOpen(context: Pick<PopupVisibleChangeContext, 'trigger'>) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(
        () => {
          this.emitPopVisible(true, context);
        },
        this.hasTrigger.click ? 0 : showTimeout,
      );
    },
    handleClose(context: Pick<PopupVisibleChangeContext, 'trigger'>) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(
        () => {
          this.emitPopVisible(false, context);
        },
        this.hasTrigger.click ? 0 : hideTimeout,
      );
    },
    handleDocumentClick() {
      if (this.contentClicked || this.triggerClicked) {
        this.triggerClicked = false;
        // clear the flag if mouseup handler is failed
        setTimeout(() => {
          this.contentClicked = false;
        });
        return;
      }
      this.visibleState = 0;
      this.emitPopVisible(false, { trigger: 'document' });
    },
    emitPopVisible(visible: boolean, context: PopupVisibleChangeContext) {
      if (this.disabled || visible === this.visible) return;
      if (!visible && this.visibleState > 1) return;
      if (visible && this.mouseInRange) return;
      this.$emit('visible-change', visible, context);
      if (typeof this.onVisibleChange === 'function') {
        this.onVisibleChange(visible, context);
      }
    },
    onMouseEnter() {
      this.mouseInRange = true;
      this.handleOpen({});
    },
    onMouseLeave(ev: MouseEvent) {
      // 子元素存在打开的 popup 时，ui 可能重叠，而 dom 节点多是并列关系
      // 需要做碰撞检测去阻止父级 popup 关闭
      if (this.visibleState > 1) {
        const rect = (this.$refs.popper as HTMLElement).getBoundingClientRect();
        if (ev.x > rect.x && ev.x < rect.x + rect.width && ev.y > rect.y && ev.y < rect.y + rect.height) return;
      }
      this.mouseInRange = false;
      this.handleClose({});

      // parent can no longer monitor mouse leave
      const parent = (this as any).popup;
      if (parent?.mouseInRange) {
        parent.onMouseLeave(ev);
      }
    },
    onBeforeEnter() {
      if (this.visible) {
        this.updatePopper();
      }
    },
    onAfterEnter() {
      if (this.visible) {
        this.updatePopper();
      }
    },
    preventClosing(preventing: boolean) {
      const parent = (this as any).popup;
      parent?.preventClosing(preventing);
      if (preventing) {
        this.visibleState += 1;
      } else if (this.visibleState) {
        this.visibleState -= 1;
        if (!this.visibleState) {
          this.emitPopVisible(false, {});
          if (parent?.hasTrigger.hover && !parent?.mouseInRange) {
            parent.emitPopVisible(false, {});
          }
        }
      }
    },
  },

  render(h) {
    const {
      visible, destroyOnClose, hasTrigger, onScroll,
    } = this;
    const ref = renderContent(this, 'default', 'triggerElement');
    const content = renderTNodeJSX(this, 'content');
    const hidePopup = this.hideEmptyPopup && ['', undefined, null].includes(content);

    const overlay = visible || !destroyOnClose
      ? h(
        'div',
        {
          class: prefixCls,
          ref: 'popper',
          style: [hidePopup && { visibility: 'hidden', pointerEvents: 'none' }, { zIndex: this.zIndex }],
          directives: destroyOnClose
            ? undefined
            : [
                    {
                      name: 'show',
                      rawName: 'v-show',
                      value: visible && !hidePopup,
                      expression: 'visible',
                    } as VNodeDirective,
            ],
          on: {
            mousedown: () => {
              this.contentClicked = true;
            },
            mouseup: () => {
              // make sure to execute after document click is triggered
              setTimeout(() => {
                // clear the flag which was set by mousedown
                this.contentClicked = false;
              });
            },
            ...(hasTrigger.hover && {
              mouseenter: this.onMouseEnter,
              mouseleave: this.onMouseLeave,
            }),
          },
        },
        [
          h(
            'div',
            {
              class: this.overlayClasses,
              ref: 'overlay',
              on: onScroll
                ? {
                  scroll(e: WheelEvent) {
                    onScroll({ e });
                  },
                }
                : undefined,
            },
            [content, this.showArrow && h('div', { class: `${prefixCls}__arrow` })],
          ),
        ],
      )
      : null;

    return (
      <Container
        ref="container"
        onContentMounted={() => {
          if (visible) {
            this.updatePopper();
            this.updateOverlayStyle();
          }
        }}
        onResize={() => {
          if (visible) {
            this.updatePopper();
          }
        }}
        parent={this}
        visible={visible}
        attach={this.attach}
      >
        <transition
          slot="content"
          name={this.expandAnimation ? `${prefixCls}--animation-expand` : `${prefixCls}--animation`}
          appear
          onBeforeEnter={this.onBeforeEnter}
          onAfterEnter={this.onAfterEnter}
          onAfterLeave={this.destroyPopper}
        >
          {overlay}
        </transition>
        {ref}
      </Container>
    );
  },
});

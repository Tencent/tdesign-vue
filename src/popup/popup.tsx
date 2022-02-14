import Vue, { VNodeDirective } from 'vue';
import { createPopper, Placement } from '@popperjs/core';
import { prefix } from '../config';
import CLASSNAMES from '../utils/classnames';
import { on, off, once } from '../utils/dom';
import { renderTNodeJSX, renderContent } from '../utils/render-tnode';
import { getIEVersion } from '../utils/helper';
import setStyle from '../_common/js/utils/set-style';
import props from './props';
import { PopupVisibleChangeContext, TdPopupProps } from './type';
import { Styles, ClassName } from '../common';
import Container from './container';

const name = `${prefix}-popup`;
const showTimeout = 250;
const hideTimeout = 150;
const triggers = ['click', 'hover', 'focus', 'context-menu'] as const;

function getPopperPlacement(placement: TdPopupProps['placement']) {
  return placement.replace(/-(left|top)$/, '-start').replace(/-(right|bottom)$/, '-end') as Placement;
}

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
      /** popperjs instance */
      popper: null as ReturnType<typeof createPopper>,
      /** timeout id */
      timeout: null,
      hasDocumentEvent: false,
      /** if a trusted action (opening or closing) is prevented, increase this flag */
      visibleState: 0,
      mouseInRange: false,
      contentClicked: false,
      refClicked: false,
    };
  },
  computed: {
    overlayClasses(): ClassName {
      const base = [
        `${name}__content`,
        {
          [`${name}__content--text`]: this.content === 'string',
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
      const reference = this.$el;
      const { hasTrigger } = this;
      const parent = (this as any).popup;
      if (val) {
        parent?.preventClosing(true);
        this.preventClosing(true);
        if (!this.hasDocumentEvent) {
          on(document, 'click', this.handleDocumentClick);
          this.hasDocumentEvent = true;
        }
        // focus trigger esc 隐藏浮层
        if (reference && hasTrigger.focus) {
          once(reference, 'keydown', (ev: KeyboardEvent) => {
            if (ev.code === 'Escape') {
              this.handleClose({ trigger: 'keydown-esc' });
            }
          });
        }
      } else {
        parent?.preventClosing(false);
        this.preventClosing(false);
        // destruction is delayed until after animation ends
        off(document, 'click', this.handleDocumentClick);
        this.hasDocumentEvent = false;
      }
    },
    overlayStyle() {
      if (this.popper) {
        this.popper.update();
        this.updateOverlayStyle();
      }
    },
    // sync lock state recursively
    contentClicked(clicked) {
      if ((this as any).popup) {
        (this as any).popup.contentClicked = clicked;
      }
    },
  },
  mounted() {
    const reference = this.$el;
    const { hasTrigger } = this;

    if (hasTrigger.hover) {
      on(reference, 'mouseenter', () => this.handleOpen({ trigger: 'trigger-element-hover' }));
      on(reference, 'mouseleave', () => this.handleClose({ trigger: 'trigger-element-hover' }));
    } else if (hasTrigger.focus) {
      on(reference, 'focusin', () => this.handleOpen({ trigger: 'trigger-element-focus' }));
      on(reference, 'focusout', () => this.handleClose({ trigger: 'trigger-element-blur' }));
    } else if (hasTrigger.click) {
      on(reference, 'click', (e: MouseEvent) => {
        this.refClicked = true;
        // override nested popups with trigger hover since higher priority
        this.visibleState = 0;
        this.handleToggle({ e, trigger: 'trigger-element-click' });
      });
    } else if (hasTrigger['context-menu']) {
      on(reference, 'contextmenu', (e: MouseEvent) => {
        e.preventDefault();
        // MouseEvent.button
        // 2: Secondary button pressed, usually the right button
        e.button === 2 && this.handleToggle({ trigger: 'context-menu' });
      });
    }
  },
  updated() {
    (this.$refs.container as any)?.updateContent();
  },
  destroyed() {
    this.destroyPopper();
  },
  methods: {
    createPopper() {
      const reference = this.$el;
      const currentPlacement = this.placement;
      const popperElm = this.$refs.popper as HTMLElement;

      if (!popperElm) return;

      this.popper?.destroy();

      this.popper = createPopper(reference, popperElm, {
        modifiers: getIEVersion() > 9 ? [] : [
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
        placement: getPopperPlacement(currentPlacement),
        onFirstUpdate: () => {
          this.$nextTick(this.updatePopper);
        },
      });
    },

    updatePopper() {
      if (this.popper) {
        this.popper.update();
        return;
      }
      this.createPopper();
    },

    updateOverlayStyle() {
      const { overlayStyle } = this;
      const referenceElm = this.$el as HTMLElement;
      if (!this.$refs) return;
      const refOverlayElm = this.$refs.overlay as HTMLElement;
      if (typeof overlayStyle === 'function' && referenceElm && refOverlayElm) {
        const userOverlayStyle = overlayStyle(referenceElm, refOverlayElm);
        this.setOverlayStyle(userOverlayStyle);
      } else if (typeof overlayStyle === 'object' && refOverlayElm) {
        this.setOverlayStyle(overlayStyle);
      }
    },

    setOverlayStyle(styles: Styles) {
      if (!this.$refs) return;
      const refOverlayElm = this.$refs.overlay as HTMLElement;
      if (typeof styles === 'object' && refOverlayElm) {
        setStyle(refOverlayElm, styles);
      }
    },

    /**
     * destroy popper IF NEEDED
     */
    destroyPopper() {
      this.popper?.destroy();
      this.popper = null;
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
      if (this.contentClicked || this.refClicked) {
        if (this.contentClicked) {
          this.contentClicked = false;
        }
        if (this.refClicked) {
          this.refClicked = false;
        }
        return;
      }
      this.visibleState = 0;
      this.emitPopVisible(false, { trigger: 'document' });
    },
    emitPopVisible(val: boolean, context: PopupVisibleChangeContext) {
      if (this.disabled || val === this.visible) return;
      if (!val && this.visibleState > 1) return;
      if (val && this.mouseInRange) return;
      this.$emit('visible-change', val, context);
      if (typeof this.onVisibleChange === 'function') {
        this.onVisibleChange(val, context);
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
        if (
          ev.x > rect.x && ev.x < rect.x + rect.width
          && ev.y > rect.y && ev.y < rect.y + rect.height
        ) return;
      }
      this.mouseInRange = false;
      this.handleClose({});
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
    preventClosing(enable: boolean) {
      if (enable) {
        this.visibleState += 1;
      } else if (this.visibleState) {
        this.visibleState -= 1;
        if (!this.visibleState) {
          this.emitPopVisible(false, {});
          const parent = (this as any).popup;
          if (parent?.hasTrigger.hover && !parent?.mouseInRange) {
            parent.emitPopVisible(false, {});
          }
        }
      }
      return this.visibleState;
    },
  },

  render(h) {
    const {
      visible, destroyOnClose, hasTrigger, onScroll,
    } = this;
    const ref = renderContent(this, 'default', 'triggerElement');
    const content = renderTNodeJSX(this, 'content');

    if (this.hideEmptyPopup && ['', undefined, null].includes(content)) {
      return ref;
    }

    const overlay = visible || !destroyOnClose ? h('div', {
      class: name,
      ref: 'popper',
      directives: destroyOnClose ? undefined : [{
        name: 'show',
        rawName: 'v-show',
        value: visible,
        expression: 'visible',
      } as VNodeDirective],
      on: {
        mousedown: () => {
          this.contentClicked = true;
        },
        ...hasTrigger.hover && {
          mouseenter: this.onMouseEnter,
          mouseleave: this.onMouseLeave,
        },
      },
    }, [
      h('div', {
        class: this.overlayClasses,
        ref: 'overlay',
        on: onScroll ? { scroll(e: WheelEvent) { onScroll({ e }); } } : undefined,
      },
      [
        content,
        this.showArrow && h('div', { class: `${name}__arrow` }),
      ]),
    ]) : null;

    return (
        <Container ref="container" onMounted={() => {
          if (visible) {
            this.updatePopper();
            this.updateOverlayStyle();
          }
        }} parent={this} visible={visible} attach={this.attach}>
          <transition
            slot="content"
            name={this.expandAnimation ? `${name}--animation-expand` : `${name}--animation`}
            appear
            onBeforeEnter={this.onBeforeEnter}
            onAfterEnter={this.onAfterEnter}
            onAfterLeave={this.destroyPopper}
          >{(visible || !destroyOnClose) && overlay}</transition>
          {ref}
        </Container>
    );
  },
});

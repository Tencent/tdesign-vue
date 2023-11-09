import Vue, { VNode } from 'vue';
import { createPopper, Instance } from '@popperjs/core';
import {
  getAttach, once, on, off,
} from '../utils/dom';
import props from './props';
import { getClassPrefixMixins } from '../config-provider/config-receiver';
import { renderTNodeJSX } from '../utils/render-tnode';
import { getPopperPlacement, triggers } from './utils';
import mixins from '../utils/mixins';
import log from '../_common/js/log';

import type { TNode, ClassName } from '../common';
import type { TdPopupProps } from './type';

export interface PopupPluginApi {
  config: TdPopupProps;
}
const classPrefixMixins = getClassPrefixMixins('popup');

let popperInstance: Instance;
let overlayInstance: HTMLElement;
let timeout: NodeJS.Timeout;
let triggerEl: HTMLElement;

const triggerType = (triggerProps: string): Record<(typeof triggers)[number], boolean> => triggers.reduce(
  (map, trigger) => ({
    ...map,
    [trigger]: triggerProps.includes(trigger),
  }),
    {} as any,
);

const Overlay = mixins(classPrefixMixins).extend({
  name: 'TPopupOverlay',
  data() {
    return {
      visibleState: false,
      contentClicked: false,
    };
  },
  props: {
    ...props,
    triggerEl: {
      validator(value) {
        if (!(value instanceof HTMLElement)) {
          log.warn('Popup', `Invalid value for prop "triggerEl": expected an HTMLElement, but got ${typeof value}.`);
          return false;
        }
        return true;
      },
      required: true,
    },
  },
  computed: {
    hasTrigger(): Record<(typeof triggers)[number], boolean> {
      return triggerType(this.trigger);
    },
    overlayClasses(): ClassName {
      return [
        `${this.componentName}__content`,
        {
          [`${this.componentName}__content--text`]: this.content === 'string',
          [`${this.componentName}__content--arrow`]: this.showArrow,
          [this.commonStatusClassName.disabled]: this.disabled,
        },
        this.overlayInnerClassName,
      ];
    },
  },

  methods: {
    handleDocumentClick(e: Event): void {
      if (triggerEl?.contains(e.target as Node)) return;
      if (this.contentClicked) {
        setTimeout(() => {
          this.contentClicked = false;
        });
      } else {
        if (this.destroyOnClose) {
          this.visibleState = false;
        }
        popperInstance?.destroy();
        popperInstance = null;
        triggerEl = null;
      }
    },
    handleMouseLeave(): void {
      if (this.destroyOnClose) {
        this.visibleState = false;
      }
      popperInstance?.destroy();
      popperInstance = null;
    },
    handleMouseEnter(): void {
      clearTimeout(timeout);
    },
  },
  created() {
    this.visibleState = true;
  },
  mounted() {
    setTimeout(() => {
      on(document, 'click', this.handleDocumentClick);
    });
  },
  beforeDestroy() {
    off(document, 'click', this.handleDocumentClick);
  },
  render(h): VNode {
    const content = renderTNodeJSX(this, 'content');

    const hidePopup = this.hideEmptyPopup && ['', undefined, null].includes(content);
    const {
      handleMouseLeave, handleMouseEnter, visibleState, hasTrigger,
    } = this;
    const renderNode = h(
      'div',
      {
        class: [this.componentName, this.overlayClassName],
        ref: 'popper',
        style: [
          hidePopup && { visibility: 'hidden', pointerEvents: 'none' },
          { zIndex: this.zIndex },
          this.overlayStyle,
        ],
        on: {
          mousedown: () => {
            this.contentClicked = true;
          },
          ...(hasTrigger.hover && {
            mouseenter: handleMouseEnter,
            mouseleave: handleMouseLeave,
          }),
        },
      },
      [
        h(
          'div',
          {
            ref: 'overlay',
            class: this.overlayClasses,
            style: this.overlayInnerStyle,
          },
          [content, this.showArrow && h('div', { class: `${this.componentName}__arrow` })],
        ),
      ],
    );
    return visibleState ? (
      <transition slot="content" name={`${this.componentName}--animation`} appear>
        {renderNode}
      </transition>
    ) : null;
  },
});

const removeOverlayInstance = () => {
  if (overlayInstance) {
    overlayInstance.remove();
    overlayInstance = null;
  }
  if (popperInstance) {
    popperInstance.destroy();
    popperInstance = null;
  }
};

export type PluginMethod = (triggerEl: string | HTMLElement, content: TNode, popupProps?: TdPopupProps) => Instance;

export const createPopupPlugin: PluginMethod = (trigger, content, popupProps) => {
  const hasTrigger = triggerType(popupProps?.trigger || 'hover');
  const currentTriggerEl = getAttach(trigger);
  if (triggerEl && hasTrigger.click) {
    return;
  }
  triggerEl = currentTriggerEl;
  removeOverlayInstance();

  let attach = getAttach(popupProps?.attach || 'body');

  const delay = [].concat(popupProps?.delay ?? [250, 150]);
  const closeDelay = delay[1] ?? delay[0];
  if (attach === document.body) {
    // don't allow mount on body directly
    const popupDom = document.createElement('div');
    document.body.appendChild(popupDom);
    attach = popupDom;
  }

  overlayInstance = new Overlay({
    propsData: {
      ...popupProps,
      content,
      triggerEl,
    },
  }).$mount(attach).$el as HTMLElement;

  if (hasTrigger.hover) {
    const mouseoutEvent = () => {
      timeout = setTimeout(removeOverlayInstance, closeDelay);
    };
    once(triggerEl, 'mouseleave', mouseoutEvent);
  } else if (hasTrigger.focus) {
    const focusoutEvent = () => {
      timeout = setTimeout(removeOverlayInstance, closeDelay);
    };
    once(triggerEl, 'focusout', focusoutEvent);
  }

  popperInstance = createPopper(triggerEl, overlayInstance, {
    placement: getPopperPlacement(popupProps?.placement || ('top' as TdPopupProps['placement'])),
    ...popupProps?.popperOptions,
  });
  return popperInstance;
};

export const PopupPlugin: PluginMethod & Vue.PluginObject<undefined> = createPopupPlugin as any;

PopupPlugin.install = () => {
  Vue.prototype.$popup = createPopupPlugin;
};

export default PopupPlugin;

declare module 'vue/types/vue' {
  interface Vue {
    $popup: PopupPluginApi;
  }
}

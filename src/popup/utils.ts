import { Placement } from '@popperjs/core';
import { TdPopupProps } from './type';
import { on, off } from '../utils/dom';

const triggers = ['click', 'hover', 'focus', 'context-menu'] as const;

const defaultVisibleDelay = [250, 150];

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

export {
  getPopperPlacement, attachListeners, triggers, defaultVisibleDelay,
};

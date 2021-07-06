/**
 * 用法
 * v-ripple
 * v-ripple="动画条的背景色" eg: v-ripple="#808080"
 */

import { DirectiveBinding } from 'vue/types/options';

type TStyle = Record<string, string>;
const setStyle = (el: HTMLElement, style: TStyle) => {
  const keys = Object.keys(style);
  keys.forEach((key) => {
    // eslint-disable-next-line no-param-reassign
    el.style[key] = style[key];
  });
};

const Ripple = {
  startTimeId: null as NodeJS.Timeout,
  finishTimeId: null as NodeJS.Timeout,
  bind(el: HTMLElement, binding: DirectiveBinding) {
    const period = 200;
    const bg = typeof binding.value === 'boolean' ? 'rgba(0, 0, 0, 0.35)' : binding.value;

    el.addEventListener('pointerdown', () => {
      if (el.classList.contains('t-is-active') || el.classList.contains('t-is-disabled')) return;
      const elBorder = parseInt((getComputedStyle(el).borderWidth).replace('px', ''), 10);
      const width  = el.offsetWidth;
      const height = el.offsetHeight;
      const style  = getComputedStyle(el);
      const border = (elBorder > 0) ? elBorder : 0;

      const ripple = document.createElement('div');
      const rippleContainer = document.createElement('div');

      setStyle(ripple, {
        marginTop: '0',
        marginLeft: '0',
        right: `${width + 20}px`,
        width: `${width + 20}px`,
        height: '100%',
        transition: `all ${period}ms cubic-bezier(.38, 0, .24, 1)`,
        transform: 'skewX(-8deg)',
        pointerEvents: 'none',
        position: 'relative',
        zIndex: '0',
        backgroundColor: bg,
      });
      setStyle(rippleContainer, {
        position: 'absolute',
        left: `${0 - border}px`,
        top: `${0 - border}px`,
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: style.borderRadius,
        pointerEvents: 'none',
        overflow: 'hidden',
      });

      // fix zIndex：避免遮盖内部元素
      const elMap = new WeakMap();
      for (let n = el.children.length, i = 0; i < n; ++i) {
        const child = el.children[i];
        if ((child as HTMLElement).style.zIndex === '') {
          (child as HTMLElement).style.zIndex = '1';
          elMap.set(child, true);
        }
      }

      // fix
      const initPosition = el.style.position ? el.style.position : getComputedStyle(el).position;
      if (initPosition === '' || initPosition === 'static') {
        // eslint-disable-next-line no-param-reassign
        el.style.position = 'relative';
      }

      rippleContainer.appendChild(ripple);
      el.appendChild(rippleContainer);

      clearTimeout(Ripple.startTimeId);
      Ripple.startTimeId = setTimeout(() => {
        ripple.style.right  = '10px';
      }, 0);

      const handleClearRipple = () => {
        ripple.style.backgroundColor = 'rgba(0, 0, 0, 0)';

        el.removeEventListener('pointerup', handleClearRipple, false);

        clearTimeout(Ripple.finishTimeId);
        Ripple.finishTimeId = setTimeout(() => {
          rippleContainer.parentNode.removeChild(rippleContainer);
          // eslint-disable-next-line no-param-reassign
          el.style.position = initPosition !== 'static' ? initPosition : '';

          // reset zIndex
          for (let n = el.children.length, i = 0; i < n; ++i) {
            const child: Element = el.children[i];
            if (elMap.has(child)) {
              (child as HTMLElement).style.zIndex = '';
              elMap.delete(child);
            }
          }
        }, period + 100);
      };
      el.addEventListener('pointerup', handleClearRipple, false);
    });
  },
};

export default Ripple;

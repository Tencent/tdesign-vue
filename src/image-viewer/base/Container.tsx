import Vue from 'vue';

import props from '../props';
import { TdImageViewerProps } from '../type';
import { getAttach, removeDom } from '../../utils/dom';

// eslint-disable-next-line no-spaced-func
export default Vue.extend<
  { content: Vue },
  // eslint-disable-next-line func-call-spacing
  { mountContent: () => void; unmountContent: () => void },
  Record<string, any>,
  Readonly<{ mode: TdImageViewerProps['mode']; renderModal: Function; renderViewer: Function }>
    >({
      props: {
        mode: props.mode,
        renderModal: Function,
        renderViewer: Function,
      },
      data() {
        return {
          content: null as Vue,
          timer: null,
        };
      },
      methods: {
        mountContent() {
          clearTimeout(this.timer);
          if (this.content) return;
          // eslint-disable-next-line @typescript-eslint/no-this-alias
          const _this = this;

          const elm = document.createElement('div');
          elm.style.cssText = 'position: absolute; top: 0px; left: 0px; width: 100%';
          this.content = new (this.$root.constructor as any)({
            render() {
              return _this.mode === 'modeless' ? _this.renderModal() : _this.renderViewer();
            },
            destroyed() {
              if (_this.content.$el) {
                removeDom(_this.content.$el as HTMLElement);
              }
              _this.content = null;
            },
          });

          getAttach(document.body).appendChild(elm);
          this.content.$mount(elm);
        },
        unmountContent() {
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            this.content?.$destroy?.();
          }, 200);
        },
      },
      render() {
        const children = this.$slots.default || [];
        if (children.length > 1 || !children[0]?.tag) {
          return <span>{children}</span>;
        }
        return children[0];
      },
    });

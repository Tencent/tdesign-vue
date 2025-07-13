import { defineComponent } from '@vue/composition-api';
import { CheckCircleFilledIcon, RefreshIcon } from 'tdesign-icons-vue';
import Loading from '../../loading';
import { usePrefixClass } from '../../hooks';
import type { StatusRenderInfo } from '../type';
import { QRCodeStatusProps } from './props';

export default defineComponent({
  name: 'QRCodeStatus',
  props: {
    ...QRCodeStatusProps,
  },
  setup() {
    const classPrefix = usePrefixClass();

    return {
      classPrefix,
    };
  },
  methods: {
    renderStatus(info: StatusRenderInfo) {
      const defaultSpin = <Loading size="32px" />;
      const defaultExpiredNode = (
        <div>
          <p class={`${this.classPrefix}-expired__text`}>{this.locale?.expiredText}</p>
          {this?.refresh && (
            <p class={`${this.classPrefix}-expired__button`} onClick={this?.refresh}>
              <RefreshIcon size="16" />
              {this.locale?.refreshText}
            </p>
          )}
        </div>
      );
      const defaultScannedNode = (
        <p class={`${this.classPrefix}-scanned`}>
          <CheckCircleFilledIcon size="16" class={`${this.classPrefix}-scanned__icon`} />
          {this.locale?.scannedText}
        </p>
      );

      const defaultNodes = {
        expired: defaultExpiredNode,
        loading: defaultSpin,
        scanned: defaultScannedNode,
        active: null as any,
      };
      return defaultNodes[info.status];
    },
  },
  render() {
    const p = {
      status: this.status,
      onRefresh: this.refresh,
    };
    return <div>{this?.statusRender?.(p) || this.renderStatus(p)}</div>;
  },
});

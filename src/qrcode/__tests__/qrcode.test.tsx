import { mount } from '@vue/test-utils';
import type { Wrapper } from '@vue/test-utils';
import {
  describe, it, vi, expect, beforeEach,
} from 'vitest';
import { ref } from '@vue/composition-api';
import { QRCode, TdQRCodeProps } from '../index';

describe('QRCode', () => {
  describe('props', () => {
    // 因单测环境下无法获取主题色，若未定义颜色，组件将由默认颜色兜底。所以单测的颜色要为默认颜色。
    // 颜色优先级如下：
    // bgColor：自定义颜色 > 主题色适配 > 透明[transparent]
    // color[fgColor]：自定义颜色 > 主题色适配 > 默认颜色[#000000]
    const defaultBgColor = 'transparent'; // 实际使用时为 rgb(255, 255, 255)
    const defaultFgColor = '#000000'; // 实际使用时为 rgba(0, 0, 0, .9)
    const defaultSize = 160;

    it(':bgColor[string]', async () => {
      const bgColor = 'rgb(7, 193, 96)';
      const wrapper = mount({
        render() {
          return <QRCode bgColor={bgColor} value="https://tdesign.tencent.com/"></QRCode>;
        },
      });
      expect(wrapper.find('.t-qrcode').attributes('style')).eq(
        `background-color: ${bgColor}; width: 160px; height: 160px;`,
      );
    });

    it(':borderless[boolean]', async () => {
      const wrapper = mount({
        render() {
          return <QRCode borderless={true} value="https://tdesign.tencent.com/"></QRCode>;
        },
      });
      expect(wrapper.find('.t-qrcode').classes('t-borderless')).eq(true);
    });

    // color只能测试svg模式下
    it(':color[string]', async () => {
      const color = 'rgb(7, 193, 96)';
      const wrapper = mount({
        render() {
          return <QRCode type="svg" color={color} value="https://tdesign.tencent.com/"></QRCode>;
        },
      });
      // [0] 是背景
      expect(wrapper.find('.t-qrcode').findAll('path').at(1).attributes('fill')).eq(color);
    });

    it(':icon[string]-canvas', async () => {
      const iconSrc = 'https://tdesign.gtimg.com/site/tdesign-logo.png';
      const wrapper = mount({
        render() {
          return <QRCode icon={iconSrc} value="https://tdesign.tencent.com/"></QRCode>;
        },
      });
      expect(wrapper.find('.t-qrcode').find('img').attributes('src')).eq(iconSrc);
    });

    it(':icon[string]-svg', async () => {
      const iconSrc = 'https://tdesign.gtimg.com/site/tdesign-logo.png';
      const wrapper = mount({
        render() {
          return <QRCode type="svg" icon={iconSrc} value="https://tdesign.tencent.com/"></QRCode>;
        },
      });
      expect(wrapper.find('.t-qrcode').find('image').attributes('href')).eq(iconSrc);
    });

    it(':iconSize[number|object]-svg', async () => {});

    const level: TdQRCodeProps['level'][] = ['L', 'M', 'Q', 'H'];
    level.forEach((item) => {
      it(`:level[string]-[${item}]`, async () => {
        const wrapper = mount({
          render() {
            return <QRCode level={item} value="https://tdesign.tencent.com/"></QRCode>;
          },
        });
        expect(wrapper.find('.t-qrcode').attributes('level')).eq(item);
      });
    });

    it(':size[number]', async () => {
      const size = 380;
      const wrapper = mount({
        render() {
          return <QRCode size={size} value="https://tdesign.tencent.com/"></QRCode>;
        },
      });
      expect(wrapper.find('.t-qrcode').attributes('style')).eq(
        `background-color: ${defaultBgColor}; width: ${size}px; height: ${size}px;`,
      );
    });

    const status: TdQRCodeProps['status'][] = ['expired', 'loading', 'scanned'];
    status.forEach((item) => {
      it(`:status[string]-[${item}]`, async () => {
        const wrapper = mount({
          render() {
            return <QRCode status={item} value="https://tdesign.tencent.com/"></QRCode>;
          },
        });
        expect(wrapper.find('.t-qrcode').find('.t-mask').exists()).eq(true);
        expect(wrapper.find('.t-qrcode').find(`.t-${item}`).exists()).eq(true);
      });
    });

    it(':statusRender[Function]', async () => {
      const statusRender = vi.fn();
      const wrapper = mount({
        render() {
          return <QRCode status="expired" value="https://tdesign.tencent.com/" statusRender={statusRender}></QRCode>;
        },
      });
      await wrapper.setProps({ status: 'expired', statusRender });
      expect(statusRender).toBeCalled();
    });
  });
});

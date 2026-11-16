import { mount } from '@vue/test-utils';
import { mockDelay } from '@test/utils';
import { Guide } from '..';
import { getGuideDefaultMount } from './mount';

// 浏览器回退时，引导应该自动关闭（issue #3687）
describe('Guide popstate', () => {
  afterEach(() => {
    document.querySelector('.t-guide__overlay')?.remove();
    document.querySelector('.t-guide__highlight--popup')?.remove();
    document.querySelector('.t-guide__reference')?.remove();
    document.querySelector('.t-guide__highlight--mask')?.remove();
    document.querySelector('.t-popup')?.remove();
    document.body.innerHTML = '';
  });

  it('closes the guide when the browser goes back', async () => {
    const wrapper = getGuideDefaultMount(Guide, {});
    await mockDelay(200);

    const overlayBefore = document.querySelector('.t-guide__overlay');
    console.log('OVERLAY-BEFORE:', Boolean(overlayBefore));
    expect(overlayBefore).toBeTruthy();

    // 模拟浏览器回退
    window.dispatchEvent(new PopStateEvent('popstate', { state: null }));
    await mockDelay(200);

    const overlayAfter = document.querySelector('.t-guide__overlay');
    console.log('OVERLAY-AFTER:', Boolean(overlayAfter));
    expect(overlayAfter).toBeFalsy();

    wrapper.destroy();
  });
});

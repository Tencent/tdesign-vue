import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { Progress } from '../index';

// status 为空字符串时不应触发 prop validator 警告（issue #3470）
const flush = async () => {
  await nextTick();
  await nextTick();
};

describe('Progress status validator', () => {
  it('accepts an empty status without a Vue warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    mount({
      render() {
        return <Progress theme="circle" percentage={50} status="" />;
      },
    });
    await flush();

    const messages = [...warn.mock.calls, ...error.mock.calls].map((c) => String(c[0])).join('\n');
    console.log('WARNINGS:', JSON.stringify(messages.slice(0, 200)));
    console.log('HAS-VALIDATOR-WARN:', messages.includes('Invalid prop'));

    expect(messages.includes('Invalid prop')).toBe(false);
    warn.mockRestore();
    error.mockRestore();
  });

  it('accepts the normal status', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    mount({
      render() {
        return <Progress theme="circle" percentage={50} status="normal" />;
      },
    });
    await flush();

    const messages = [...warn.mock.calls, ...error.mock.calls].map((c) => String(c[0])).join('\n');
    console.log('NORMAL-WARN:', messages.includes('Invalid prop'));

    expect(messages.includes('Invalid prop')).toBe(false);
    warn.mockRestore();
    error.mockRestore();
  });

  it('still rejects an unknown status (control)', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    mount({
      render() {
        return <Progress theme="circle" percentage={50} status="bogus" />;
      },
    });
    await flush();

    const messages = [...warn.mock.calls, ...error.mock.calls].map((c) => String(c[0])).join('\n');
    console.log('BOGUS-WARN:', messages.includes('Invalid prop'));

    expect(messages.includes('Invalid prop')).toBe(true);
    warn.mockRestore();
    error.mockRestore();
  });
});

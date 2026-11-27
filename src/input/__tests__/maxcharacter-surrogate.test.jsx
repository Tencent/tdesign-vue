import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { Input } from '../../input/index';
import { Textarea } from '../../textarea/index';

// getCharacterLength 按 UTF-16 code unit 遍历，遇到代理对时可能从中间切开，
// 留下孤立的高位代理（issue #3945）。
const isWellFormed = (s) => !/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/.test(s);

describe('maxcharacter with surrogate pairs', () => {
  it('Textarea drops the whole emoji instead of splitting it', async () => {
    const wrapper = mount({
      data() {
        return { val: '' };
      },
      render() {
        return (
          <Textarea
            value={this.val}
            maxcharacter={6}
            onChange={(v) => {
              this.val = v;
            }}
          />
        );
      },
    });
    await nextTick();
    const ta = wrapper.find('textarea');
    console.log('TEXTAREA exists:', ta.exists(), 'html:', wrapper.html().slice(0, 200));
    ta.element.value = '你好😀';
    await ta.trigger('input');
    await nextTick();

    expect(wrapper.vm.val).toBe('你好');
    expect(isWellFormed(wrapper.vm.val)).toBe(true);
  });

  it('Input drops the whole emoji instead of splitting it', async () => {
    const wrapper = mount({
      data() {
        return { val: '' };
      },
      render() {
        return (
          <Input
            value={this.val}
            maxcharacter={3}
            onChange={(v) => {
              this.val = v;
            }}
          />
        );
      },
    });
    await nextTick();
    const inp = wrapper.find('input');
    inp.element.value = 'a😀';
    await inp.trigger('input');
    await nextTick();

    expect(wrapper.vm.val).toBe('a');
    expect(isWellFormed(wrapper.vm.val)).toBe(true);
  });
});

import { mount } from '@vue/test-utils';
import { List } from '@/src/list/index.ts';

describe('List', () => {
  let cmp;

  beforeEach(() => {
    cmp = mount(List, {
      propsData: {
        header: 'header',
        footer: 'footer',
        asyncLoading: 'loading',
        size: 'large',
      },
    });
  });

  it('equals header to "header"', () => {
    expect(cmp.vm.header).toEqual('header');
  });
  it('equals footer to "footer"', () => {
    expect(cmp.vm.footer).toEqual('footer');
  });
  it('equals asyncLoading to "loading"', () => {
    expect(cmp.vm.asyncLoading).toEqual('loading');
  });
  it('equals size to "large"', () => {
    expect(cmp.vm.size).toEqual('large');
  });
  // 待设计稿输出
  // it('equals layout to "horizontal"', () => {
  //   expect(cmp.vm.layout).toEqual('horizontal');
  // });
});

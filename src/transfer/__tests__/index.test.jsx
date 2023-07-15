import { mount } from '@vue/test-utils';
import Transfer from '@/src/transfer/index.ts';

const data = [];
(() => {
  for (let i = 0; i < 20; i++) {
    data.push({
      value: i.toString(),
      label: `内容${i + 1}`,
      disabled: i % 3 < 1,
    });
  }
})();

const pagination = {
  pageSize: 20,
  total: 20,
  current: 1,
};
const checkedValue = ['1', '2', '5'];
const targetValue = ['1'];

describe('Transfer', () => {
  // test for props
  it(':checked.sync', async () => {
    const wrapper = mount({
      components: {
        Transfer,
      },
      template: `
        <Transfer :data="data" :checked.sync="checkedValue" />
      `,
      data() {
        return {
          data,
          checkedValue: ['1', '2', '5'],
        };
      },
    });
    await wrapper.vm.$nextTick();
    await wrapper.findAll('.t-checkbox-group input[type="checkbox"]').at(2).setChecked(false);
    expect(wrapper.vm.$data.checkedValue).toEqual(['1', '5']);
  });
});

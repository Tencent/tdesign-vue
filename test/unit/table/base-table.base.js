import { mount } from '@vue/test-utils';
import Table from '@/src/table/index.ts';

const data = new Array(5).fill(null).map((item, index) => ({
  id: index + 100,
  index: index + 100,
  instance: `JQTest${index + 1}`,
  status: index % 2,
  owner: 'jenny;peter',
  description: 'test',
}));

describe('Table', () => {
  describe(':props', () => {
    it(':props.bordered works fine', () => {
      const wrapper = mount({
        render() {
          return <Table rowKey="id" data={data} columns={[{ title: 'index', colKey: 'index' }]}></Table>;
        },
      });
      expect(wrapper.find('.t-table--bordered').exists()).toBeTruthy();
    });
  });
});

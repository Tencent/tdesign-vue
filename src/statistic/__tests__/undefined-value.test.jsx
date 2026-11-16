import { mount } from '@vue/test-utils';
import Statistic from '@/src/statistic/index.ts';

describe('Statistic undefined value', () => {
  it('renders without throwing when value is not provided', () => {
    const wrapper = mount({
      render() {
        return <Statistic title="Total Assets" />;
      },
    });
    expect(wrapper.find('.t-statistic-title').text()).toBe('Total Assets');
    expect(wrapper.find('.t-statistic-content-value').text()).toBe('');
  });

  it('renders without throwing when value is explicitly undefined', () => {
    const wrapper = mount({
      render() {
        return <Statistic title="Total Assets" value={undefined} />;
      },
    });
    expect(wrapper.find('.t-statistic-title').text()).toBe('Total Assets');
  });
});

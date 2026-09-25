// 复现 Issue #3888: DateRangePickerPanel 面板显示 bug
// v-model 设置数组两个值都为当前日期，切换月份后，选择日期面板会跳回当前月份的面板

import { mount } from '@vue/test-utils';
import MockDate from 'mockdate';
import { nextTick } from 'vue';
import DateRangePickerPanel from '@/src/date-picker/DateRangePickerPanel';

// 固定时间为 2026-09-15（Issue 创建日期附近）
MockDate.set('2026-09-15');

describe('Issue #3888: DateRangePickerPanel month/year sync', () => {
  it('should not reset month when value changes after manual navigation', async () => {
    const today = '2026-09-15';
    const wrapper = mount({
      data() {
        return {
          value: [today, today],
        };
      },
      render() {
        return <DateRangePickerPanel value={this.value} />;
      },
    });

    await nextTick();

    const panel = wrapper.findComponent({ name: 'TRangePanel' });
    expect(panel.exists()).toBe(true);

    const initialMonth = panel.props('month');
    const initialYear = panel.props('year');

    // 验证初始状态：左侧 panel 显示 8 月，右侧显示 9 月
    expect(initialMonth[0]).toBe(8);
    expect(initialMonth[1]).toBe(9);
    expect(initialYear[0]).toBe(2026);
    expect(initialYear[1]).toBe(2026);

    // 模拟用户通过 onJumperClick 切换到下一个月
    const jumperClickHandler = panel.props('onJumperClick');
    if (jumperClickHandler) {
      jumperClickHandler({ trigger: 'next', partial: 'start' });
    }

    await nextTick();

    const afterNavMonth = panel.props('month');
    expect(afterNavMonth[0]).toBe(9);
    expect(afterNavMonth[1]).toBe(10);

    // 模拟 value 变化（父组件重新设置相同的值）
    wrapper.setData({ value: [today, today] });
    await nextTick();

    const afterValueChangeMonth = panel.props('month');
    const afterValueChangeYear = panel.props('year');

    // 关键断言：value 未实际变化时，不应覆盖用户手动导航的 month
    expect(afterValueChangeMonth[0]).toBe(9);
    expect(afterValueChangeMonth[1]).toBe(10);
    expect(afterValueChangeYear[0]).toBe(2026);
    expect(afterValueChangeYear[1]).toBe(2026);
  });

  it('should sync year when value changes across years', async () => {
    const value1 = '2025-12-30';
    const value2 = '2026-01-15';

    const wrapper = mount({
      data() {
        return {
          value: [value1, value2],
        };
      },
      render() {
        return <DateRangePickerPanel value={this.value} />;
      },
    });

    await nextTick();

    const panel = wrapper.findComponent({ name: 'TRangePanel' });
    const initialYear = panel.props('year');
    const initialMonth = panel.props('month');

    // 初始：左侧 2025-12，右侧 2026-01
    expect(initialYear[0]).toBe(2025);
    expect(initialYear[1]).toBe(2026);
    expect(initialMonth[0]).toBe(11);
    expect(initialMonth[1]).toBe(0);

    // 用户导航到下一月（start partial）
    const jumperClickHandler = panel.props('onJumperClick');
    if (jumperClickHandler) {
      jumperClickHandler({ trigger: 'next', partial: 'start' });
    }

    await nextTick();

    const afterNavYear = panel.props('year');
    const afterNavMonth = panel.props('month');

    // 导航后：左侧 2026-01，右侧 2026-02
    expect(afterNavYear[0]).toBe(2026);
    expect(afterNavYear[1]).toBe(2026);
    expect(afterNavMonth[0]).toBe(0);
    expect(afterNavMonth[1]).toBe(1);

    // value 变化（相同值）
    wrapper.setData({ value: [value1, value2] });
    await nextTick();

    const afterValueChangeYear = panel.props('year');
    const afterValueChangeMonth = panel.props('month');

    // value 未实际变化时不应覆盖用户导航
    expect(afterValueChangeYear[0]).toBe(2026);
    expect(afterValueChangeYear[1]).toBe(2026);
    expect(afterValueChangeMonth[0]).toBe(0);
    expect(afterValueChangeMonth[1]).toBe(1);
  });
});

// 复现 Issue #3888: DateRangePickerPanel 面板显示 bug
// v-model 设置数组两个值都为当前日期，切换月份后，选择日期面板会跳回当前月份的面板

import { mount } from '@vue/test-utils';
import MockDate from 'mockdate';
import { nextTick } from 'vue';
import dayjs from 'dayjs';
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

    // 获取 RangePanel 组件实例
    const panel = wrapper.findComponent({ name: 'TRangePanel' });
    expect(panel.exists()).toBe(true);

    // 初始月份：两个值都是 9 月，所以左侧应为 8 月（9-1），右侧为 9 月
    // 因为 watch 中有逻辑：同月时 nextMonth[0] -= 1
    const initialMonth = panel.props('month');
    const initialYear = panel.props('year');
    console.log('Initial month:', initialMonth);
    console.log('Initial year:', initialYear);

    // 验证初始状态：左侧 panel 显示 8 月，右侧显示 9 月
    expect(initialMonth[0]).toBe(8); // 9月 - 1 = 8月
    expect(initialMonth[1]).toBe(9); // 9月不变

    // 模拟用户通过 onJumperClick 切换到下一个月
    // 触发 jumper 的 next 操作（partial='start'）
    const jumperClickHandler = panel.props('onJumperClick');
    if (jumperClickHandler) {
      jumperClickHandler({ trigger: 'next', partial: 'start' });
    }

    await nextTick();

    // 导航后月份应该变为 9, 10 (start 从 8 变为 9, end 从 9 变为 10)
    const afterNavMonth = panel.props('month');
    console.log('After navigation month:', afterNavMonth);
    expect(afterNavMonth[0]).toBe(9);
    expect(afterNavMonth[1]).toBe(10);

    // 现在模拟 value 变化（例如父组件重新设置相同的值）
    wrapper.setData({ value: [today, today] });
    await nextTick();

    // Bug: watch(value) 只更新 month 不更新 year
    // 如果 year 没有同步更新，这里 year 可能仍然是旧值
    const afterValueChangeMonth = panel.props('month');
    const afterValueChangeYear = panel.props('year');
    console.log('After value change month:', afterValueChangeMonth);
    console.log('After value change year:', afterValueChangeYear);

    // 关键断言：value 变化后，月份不应该被重置回初始状态
    // 如果 Bug 存在，month 会被重置为 [8, 9]（从 value 重新计算）
    // 预期：month 应保持用户导航后的值 [9, 10] 或至少 year 与 month 一致对应
    expect(afterValueChangeMonth[0]).toBe(9);
    expect(afterValueChangeMonth[1]).toBe(10);
  });

  it('should sync year when value changes', async () => {
    // 测试跨年场景：value 是 2025-12-30 和 2026-01-15
    // 用户导航到 2026 年 2 月，然后 value 变化
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
    console.log('Cross-year initial year:', initialYear);
    console.log('Cross-year initial month:', initialMonth);

    // 初始：左侧 2025-12，右侧 2026-01
    expect(initialYear[0]).toBe(2025);
    expect(initialYear[1]).toBe(2026);
    expect(initialMonth[0]).toBe(11); // December
    expect(initialMonth[1]).toBe(0);  // January

    // 用户导航到下一月（start partial）
    const jumperClickHandler = panel.props('onJumperClick');
    if (jumperClickHandler) {
      jumperClickHandler({ trigger: 'next', partial: 'start' });
    }

    await nextTick();

    const afterNavYear = panel.props('year');
    const afterNavMonth = panel.props('month');
    console.log('After nav year:', afterNavYear);
    console.log('After nav month:', afterNavMonth);

    // 导航后：左侧 2026-01，右侧 2026-02
    expect(afterNavYear[0]).toBe(2026);
    expect(afterNavYear[1]).toBe(2026);
    expect(afterNavMonth[0]).toBe(0);
    expect(afterNavMonth[1]).toBe(1);

    // 现在 value 变化
    wrapper.setData({ value: [value1, value2] });
    await nextTick();

    const afterValueChangeYear = panel.props('year');
    const afterValueChangeMonth = panel.props('month');
    console.log('After value change year:', afterValueChangeYear);
    console.log('After value change month:', afterValueChangeMonth);

    // Bug 断言：如果 watch(value) 修复正确，value 未实际变化时不应覆盖用户导航
    // 用户导航后 year=[2026,2026] month=[0,1]，value 没变，应保持导航状态
    expect(afterValueChangeYear[0]).toBe(2026);
    expect(afterValueChangeYear[1]).toBe(2026);
    expect(afterValueChangeMonth[0]).toBe(0);
    expect(afterValueChangeMonth[1]).toBe(1);
  });
});

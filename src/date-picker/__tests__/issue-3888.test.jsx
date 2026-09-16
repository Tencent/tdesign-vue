import { mount } from '@vue/test-utils';
import MockDate from 'mockdate';
import { nextTick } from 'vue';
import DateRangePickerPanel from '@/src/date-picker/DateRangePickerPanel';

// 固定时间
MockDate.set('2020-12-28');

describe('Issue #3888 - DateRangePickerPanel month jump bug', () => {
  it('should NOT reset month after selecting both dates (two-click scenario)', async () => {
    const wrapper = mount(DateRangePickerPanel, {
      propsData: {
        value: ['2020-06-15', '2020-06-20'],
      },
    });

    await nextTick();

    // Step 1: 初始：左侧6月(5)，右侧7月(6)
    let months = wrapper.vm.panelProps.month;
    console.log('Step 1 - Initial months:', months);
    expect(months[0]).toBe(5);
    expect(months[1]).toBe(6);

    // Step 2: 左侧面板切换到7月
    wrapper.vm.panelProps.onJumperClick({ trigger: 'next', partial: 'start' });
    await nextTick();
    months = wrapper.vm.panelProps.month;
    console.log('Step 2 - After left next month:', months);
    expect(months[0]).toBe(6); // 左侧7月

    // Step 3: 点击左侧7月的日期（第一次选择）
    wrapper.vm.panelProps.onCellClick(new Date(2020, 6, 15), { e: new MouseEvent('click') });
    await nextTick();
    await nextTick();
    months = wrapper.vm.panelProps.month;
    console.log('Step 3 - After first click months:', months);

    // Step 4: 右侧面板切换到8月
    wrapper.vm.panelProps.onJumperClick({ trigger: 'next', partial: 'end' });
    await nextTick();
    months = wrapper.vm.panelProps.month;
    console.log('Step 4 - After right next month:', months);
    expect(months[1]).toBe(8); // 右侧9月

    // Step 5: 点击右侧9月的日期（第二次选择 -> onChange触发）
    wrapper.vm.panelProps.onCellClick(new Date(2020, 8, 10), { e: new MouseEvent('click') });
    await nextTick();
    await nextTick();
    months = wrapper.vm.panelProps.month;
    console.log('Step 5 - After second click months:', months);

    // 期望：左侧7月(6)，右侧9月(8)
    expect(months[0]).toBe(6); // 左侧7月
    expect(months[1]).toBe(8); // 右侧9月
  });

  it('should NOT reset month when both values are the same month (Dec)', async () => {
    const wrapper = mount(DateRangePickerPanel, {
      propsData: {
        value: ['2020-12-28', '2020-12-28'],
      },
    });

    await nextTick();

    // Step 1: 初始：左侧11月(10)，右侧12月(11)
    let months = wrapper.vm.panelProps.month;
    console.log('Dec - Step 1 - Initial months:', months);
    expect(months[0]).toBe(10); // 左侧11月
    expect(months[1]).toBe(11); // 右侧12月

    // Step 2: 左侧面板切换到12月
    wrapper.vm.panelProps.onJumperClick({ trigger: 'next', partial: 'start' });
    await nextTick();
    months = wrapper.vm.panelProps.month;
    console.log('Dec - Step 2 - After left next month:', months);
    expect(months[0]).toBe(11); // 左侧12月

    // Step 3: 点击左侧12月的日期（第一次选择）
    wrapper.vm.panelProps.onCellClick(new Date(2020, 11, 15), { e: new MouseEvent('click') });
    await nextTick();
    await nextTick();
    months = wrapper.vm.panelProps.month;
    console.log('Dec - Step 3 - After first click months:', months);

    // Step 4: 右侧面板切换到1月2021
    wrapper.vm.panelProps.onJumperClick({ trigger: 'next', partial: 'end' });
    await nextTick();
    months = wrapper.vm.panelProps.month;
    console.log('Dec - Step 4 - After right next month:', months);
    // dateCorrection 使右侧从1月跳到2月（保持比左侧大1）
    expect(months[1]).toBe(1); // 右侧2月
    expect(months[0]).toBe(11); // 左侧12月

    // Step 5: 点击右侧2月的日期（第二次选择 -> onChange触发）
    wrapper.vm.panelProps.onCellClick(new Date(2021, 1, 10), { e: new MouseEvent('click') });
    await nextTick();
    await nextTick();
    months = wrapper.vm.panelProps.month;
    console.log('Dec - Step 5 - After second click months:', months);

    // 期望：左侧12月(11)，右侧2月(1)
    expect(months[0]).toBe(11); // 左侧12月
    expect(months[1]).toBe(1);  // 右侧2月
  });

  it('should follow new value month when parent updates value via v-model', async () => {
    // 父组件通过 v-model 更新 value 时，面板应跟随新 value 的月份
    const wrapper = mount(DateRangePickerPanel, {
      propsData: {
        value: ['2020-09-15', '2020-09-15'],
      },
    });

    await nextTick();

    // Step 1: 初始：左侧9月(8)，右侧10月(9)
    let months = wrapper.vm.panelProps.month;
    console.log('VModel - Step 1 - Initial months:', months);
    expect(months[0]).toBe(8); // 左侧9月
    expect(months[1]).toBe(9); // 右侧10月

    // Step 2: 父组件更新 value 到不同月份
    wrapper.setProps({ value: ['2020-06-10', '2020-07-15'] });
    await nextTick();
    await nextTick();
    months = wrapper.vm.panelProps.month;
    console.log('VModel - Step 2 - After value update to different months:', months);

    // 期望：month 跟随新 value 更新为 [5, 6]（6月和7月）
    expect(months[0]).toBe(5); // 左侧6月
    expect(months[1]).toBe(6); // 右侧7月
  });

  it('should update year when value changes', async () => {
    // Issue 描述：手动传入一个日期，年份不会随之改变
    const wrapper = mount(DateRangePickerPanel, {
      propsData: {
        value: ['2020-09-15', '2020-09-15'],
      },
    });

    await nextTick();

    // Step 1: 初始年份
    let years = wrapper.vm.panelProps.year;
    console.log('Year - Step 1 - Initial years:', years);
    expect(years[0]).toBe(2020);
    expect(years[1]).toBe(2020);

    // Step 2: 父组件更新 value 到 2021年
    wrapper.setProps({ value: ['2021-06-15', '2021-08-20'] });
    await nextTick();
    await nextTick();
    years = wrapper.vm.panelProps.year;
    console.log('Year - Step 2 - After value update years:', years);

    // 期望：year 应该更新为新的 value 的年份
    expect(years[0]).toBe(2021);
    expect(years[1]).toBe(2021);
  });

  it('should sync year and month when value changes to different year', async () => {
    // 综合测试：value 变化时 year 和 month 都应同步更新
    const wrapper = mount(DateRangePickerPanel, {
      propsData: {
        value: ['2020-09-15', '2020-09-15'],
      },
    });

    await nextTick();

    // Step 1: 初始
    let years = wrapper.vm.panelProps.year;
    let months = wrapper.vm.panelProps.month;
    console.log('Sync - Step 1 - Initial years:', years, 'months:', months);
    expect(years[0]).toBe(2020);
    expect(years[1]).toBe(2020);
    expect(months[0]).toBe(8); // 9月
    expect(months[1]).toBe(9); // 10月

    // Step 2: 更新 value 到 2021年不同月份
    wrapper.setProps({ value: ['2021-03-10', '2021-05-20'] });
    await nextTick();
    await nextTick();
    years = wrapper.vm.panelProps.year;
    months = wrapper.vm.panelProps.month;
    console.log('Sync - Step 2 - After value update years:', years, 'months:', months);

    // 期望：year 和 month 都同步更新
    expect(years[0]).toBe(2021);
    expect(years[1]).toBe(2021);
    expect(months[0]).toBe(2); // 3月
    expect(months[1]).toBe(4); // 5月（不同月份，不需要修正）
  });
});

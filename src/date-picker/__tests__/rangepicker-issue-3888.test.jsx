import { mount } from '@vue/test-utils';
import MockDate from 'mockdate';
import { nextTick } from 'vue';
import DateRangePickerPanel from '@/src/date-picker/DateRangePickerPanel';

// 复现 #3888：t-date-range-picker-panel 面板显示 bug
// 1) 两个值都为当前日期时，用户手动切换月份后，父组件回写“完全相同”的 value，面板不应跳回当前月份
// 2) value 真正变化时，面板的 year 应跟随同步（手动传入日期后年份随之改变）
MockDate.set('2020-12-28');

// 读取左右两个 TSelect 控件显示的值（年 / 月），顺序为 左月、左年、右月、右年
function readPanelYearMonth(wrapper) {
  return wrapper
    .findAll('.t-input__inner')
    .wrappers.map((input) => input.element.value)
    .filter(Boolean);
}

describe('DateRangePickerPanel #3888', () => {
  it('should NOT reset to the value month when parent re-emits the identical value after manual navigation', async () => {
    const wrapper = mount({
      data() {
        return { val: ['2020-12-28', '2020-12-28'] };
      },
      render() {
        return <DateRangePickerPanel value={this.val} />;
      },
    });
    await nextTick();

    // 两个值同为当前日期：右侧面板比左侧大一个月
    expect(readPanelYearMonth(wrapper)).toEqual(['11 月', '2020', '12 月', '2020']);

    // 手动向前切换左侧面板（回到 10 月）
    await wrapper.findAll('.t-pagination-mini__prev').at(0).trigger('click');
    await nextTick();
    expect(readPanelYearMonth(wrapper)).toEqual(['10 月', '2020', '12 月', '2020']);

    // 父组件回写完全相同的 value，面板不应跳回当前月份
    wrapper.vm.val = ['2020-12-28', '2020-12-28'];
    await nextTick();
    await nextTick();
    expect(readPanelYearMonth(wrapper)).toEqual(['10 月', '2020', '12 月', '2020']);
  });

  it('should keep the navigated month across years after parent re-emits the identical value', async () => {
    const wrapper = mount({
      data() {
        return { val: ['2020-12-28', '2020-12-28'] };
      },
      render() {
        return <DateRangePickerPanel value={this.val} />;
      },
    });
    await nextTick();

    for (let i = 0; i < 3; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await wrapper.findAll('.t-pagination-mini__prev').at(0).trigger('click');
      // eslint-disable-next-line no-await-in-loop
      await nextTick();
    }
    expect(readPanelYearMonth(wrapper)).toEqual(['8 月', '2020', '12 月', '2020']);

    wrapper.vm.val = ['2020-12-28', '2020-12-28'];
    await nextTick();
    await nextTick();
    expect(readPanelYearMonth(wrapper)).toEqual(['8 月', '2020', '12 月', '2020']);
  });

  it('should sync year and month when value actually changes', async () => {
    const wrapper = mount({
      data() {
        return { val: ['2020-12-28', '2020-12-28'] };
      },
      render() {
        return <DateRangePickerPanel value={this.val} />;
      },
    });
    await nextTick();
    expect(readPanelYearMonth(wrapper)).toEqual(['11 月', '2020', '12 月', '2020']);

    // value 真正变化（跨年），面板年份应随之更新
    wrapper.vm.val = ['2019-03-10', '2019-03-10'];
    await nextTick();
    await nextTick();
    expect(readPanelYearMonth(wrapper)).toEqual(['3 月', '2019', '4 月', '2019']);
  });
});

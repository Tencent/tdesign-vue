import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import MockDate from 'mockdate';
import dayjs from 'dayjs';
import Calendar from '../index';

// range 之前只禁用月/年下拉，日期格子完全没判断，
// 范围外的日期照样能点亮并选中（issue #3827）。
describe('Calendar range', () => {
  beforeAll(() => {
    MockDate.set('2026-04-10');
  });
  afterAll(() => {
    MockDate.reset();
  });

  it('marks the dates outside the range', async () => {
    const wrapper = mount({
      render() {
        return <Calendar range={['2026-04-01', '2026-04-18']} value={'2026-04-10'}></Calendar>;
      },
    });
    await nextTick();
    await nextTick();
    await nextTick();

    const calendar = wrapper.findComponent(Calendar).vm;
    const cells = calendar.monthCellsData.flat();
    const byDate = (d) => cells.find((c) => dayjs(c.date).format('YYYY-MM-DD') === d);

    // 范围内的 4 月 5 号不能标记成范围外
    const inRange = byDate('2026-04-05');
    expect(inRange).toBeTruthy();
    expect(inRange.isOutOfRange).toBe(false);

    // 范围外的 4 月 25 号必须标记出来，否则可以选中
    const outOfRange = byDate('2026-04-25');
    expect(outOfRange).toBeTruthy();
    expect(outOfRange.isOutOfRange).toBe(true);
  });
});

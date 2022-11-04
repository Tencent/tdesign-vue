import { mount } from '@vue/test-utils';
import MockDate from 'mockdate';
import { nextTick } from 'vue';
import DatePicker from '@/src/date-picker/index.ts';

// 固定时间，当使用 new Date() 时，返回固定时间，防止“当前时间”的副作用影响，导致 snapshot 变更，mockdate 插件见 https://github.com/boblauer/MockDate
MockDate.set('2020-12-28');

// every component needs four parts: props/events/slots/functions.
describe('DatePicker', () => {
  // test props api
  describe(':props', () => {
    it('', () => {
      const wrapper = mount({
        render() {
          return <DatePicker />;
        },
      });
      expect(wrapper.exists()).toBe(true);
    });
  });

  it(':value', () => {
    const wrapper = mount({
      render() {
        return <DatePicker value={'1998-11-11'} />;
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it(':mode', () => {
    const wrapper = mount({
      render() {
        return <DatePicker mode={'year'} />;
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it(':range', () => {
    const wrapper = mount({
      render() {
        const testRange = [
          '2018-08', // new Date(2017, 7)
          '2028-04', // new Date(2027, 3)
        ];
        return <DatePicker value={testRange} range />;
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('clearable', async () => {
    const wrapper = mount({
      render() {
        return <DatePicker defaultValue={'2022-09-14'} clearable></DatePicker>;
      },
    });
    const input = wrapper.find('.t-input');
    await input.trigger('mouseenter');
    await nextTick();
    expect(wrapper.find('.t-input__suffix-clear').exists()).toBeTruthy();
  });

  it('disabled', () => {
    const wrapper = mount({
      render() {
        return <DatePicker disabled />;
      },
    });
    const inputInner = wrapper.find('.t-input__inner');
    expect(inputInner.element.disabled).toBe(true);
  });

  it('enableTimePicker', async () => {
    const wrapper = mount({
      render() {
        return <DatePicker enableTimePicker />;
      },
    });
    wrapper.find('.t-input').trigger('click');
    await nextTick();
    expect(document.querySelector('.t-date-picker__panel-time')).not.toBe(null);
  });

  it('firstDayOfWeek', async () => {
    const wrapper = mount(DatePicker, {
      propsData: {
        firstDayOfWeek: 3,
      },
    });
    wrapper.find('.t-input').trigger('click');
    await nextTick();
    const weekElement = document.querySelector('.t-date-picker__table table thead tr th');
    expect(weekElement.innerHTML).toEqual('一');
  });

  it('format', async () => {
    // defaultValue
    const wrapper = mount({
      render() {
        return <DatePicker defaultValue={'2022-09-14 16:30:20'} format={'YYYY-MM-DD'} />;
      },
    });
    const inputElement1 = wrapper.find('.t-input__inner');
    expect(inputElement1.element.value).toEqual('2022-09-14');

    // value
    const wrapper2 = mount({
      render() {
        return <DatePicker value={'2022-09-14 16:30:20'} format={'YYYY-MM-DD'} />;
      },
    });
    const inputElement2 = wrapper2.find('.t-input__inner');
    expect(inputElement2.element.value).toEqual('2022-09-14');
  });

  it('inputProps', () => {
    const wrapper = mount(DatePicker, {
      propsData: {
        inputProps: { inputClass: 'test-inputClass' },
      },
    });
    expect(wrapper.find('.t-input').classes()).toContain('test-inputClass');
  });

  it('mode week', async () => {
    const wrapper = mount({
      render() {
        return <DatePicker mode={'week'} value={'2022-37th'} />;
      },
    });
    wrapper.find('.t-input').trigger('click');
    await nextTick();
    expect(document.querySelector('.t-date-picker__panel-week')).not.toBe(null);
  });

  // test slots
  describe('<slot>', () => {
    it('', () => {
      window.console.info('DatePicker test<slot>');
    });
  });

  // test exposure function
  describe('function', () => {
    it('', () => {
      window.console.info('DatePicker test function');
    });
  });
});

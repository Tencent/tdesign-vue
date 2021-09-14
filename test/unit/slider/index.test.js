import { mount } from '@vue/test-utils';
import Vue from 'vue';
import Slider from '@/src/slider/index.ts';
import TInputNumber from '@/src/input-number/index.ts';
// every component needs four parts: props/events/slots/functions.
describe('Slider', () => {
  // test props api
  describe(':props', () => {
    it('', () => {
      const wrapper = mount({
        render() {
          return <Slider></Slider>;
        },
      });
      // 写入快照
      expect(wrapper).toMatchSnapshot();
    });
  });
});
// 测试Slider下的marks传参模板
describe('Slider [marks]', () => {
  const wrapper = mount(Slider, {
    propsData: {
      value: 2,
      marks: {
        0: '0°C',
        8: '8°C',
        12: '12°C',
        37: '37°C',
        // 这里单元测试不支持传递node节点
        // 50: <strong style="color: #1989FA">50°C</strong>,
        // 60: <button style="color: #1989FA">60°C</button>,
      },
    },
  });
    // 渲染是否正确
  it('render right', () => {
    expect(wrapper.html()).toContain('aria-valuetext="2"');
    expect(wrapper.html()).toContain('37°C');
    expect(wrapper).toMatchSnapshot();
  });

  // 输入框输入20
  it('change value on input-number', (done) => {
    // console.log(wrapper.findComponent(TInputNumber).vm);
    Vue.nextTick(() => {
      wrapper.findComponent(TInputNumber).vm.$emit('change', 20);
      done();
    });
  });

  // 检查内部值是否变化
  it('check change value', () => {
    expect(wrapper.vm.prevValue).toBe(20);
  });

  // 检查内部函数是否返回正确
  it('call setValues()', () => {
    expect(wrapper.vm.setValues(1000)).toBe(100);
  });
});

describe('Slider [vertical-marks]', () => {
  const wrapper = mount(Slider, {
    propsData: {
      value: [30, 70],
      layout: 'vertical',
      range: true,
      marks: {
        0: '0°C',
        8: '8°C',
        12: '12°C',
        37: '37°C',
        // 这里单元测试不支持传递node节点
        // 50: <strong style="color: #1989FA">50°C</strong>,
        // 60: <button style="color: #1989FA">60°C</button>,
      },
    },
  });
    // 渲染是否正确
  it('render right', () => {
    expect(wrapper.html()).toContain('aria-valuetext="30-70"');
    expect(wrapper.html()).toContain('37°C');
    expect(wrapper).toMatchSnapshot();
  });
  // 输入框输入20
  // it('change value on input-number', (done) => {
  //   // console.log(wrapper.findComponent(TInputNumber).vm);
  //   Vue.nextTick(() => {
  //     wrapper.findComponent(TInputNumber).vm.$emit('change', 20);
  //     done();
  //   });
  // });

  // 检查内部值是否变化
  // it('check change value', () => {
  //   expect(wrapper.vm.prevValue).toBe(20);
  // });

  // 检查内部函数是否返回正确
  it('call setValues()', () => {
    expect(wrapper.vm.setValues([300, 200])).toEqual([30, 100]);
    expect(wrapper.vm.setValues([-200, -300])).toEqual([0, 100]);
  });
});

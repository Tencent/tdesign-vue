import { mount } from '@vue/test-utils';
import { Select, OptionGroup, Option } from '@/src/select/index.ts';

describe('Select', () => {
  // test props api
  describe(':props', () => {
    it(':disabled', () => {
      const wrapper = mount({
        render() {
          return <Select disabled={true}></Select>;
        },
      });
      expect(wrapper).toMatchSnapshot();
    });
    it(':size', () => {
      const wrapper = mount({
        render() {
          return <Select size="large"></Select>;
        },
      });
      expect(wrapper).toMatchSnapshot();
    });
    it(':clearable', () => {
      const wrapper = mount({
        render() {
          return <Select clearable={true}></Select>;
        },
      });
      expect(wrapper).toMatchSnapshot();
    });
    it(':multiple', () => {
      const wrapper = mount({
        render() {
          return <Select multiple={true}></Select>;
        },
      });
      expect(wrapper).toMatchSnapshot();
    });
    it(':placeholder', () => {
      const wrapper = mount({
        render() {
          return <Select placeholder="please select"></Select>;
        },
      });
      expect(wrapper).toMatchSnapshot();
    });
    it(':creatable', () => {
      const wrapper = mount({
        render() {
          return <Select creatable={true}></Select>;
        },
      });
      expect(wrapper).toMatchSnapshot();
    });
    it(':remote', () => {
      const wrapper = mount({
        render() {
          return <Select remote={true}></Select>;
        },
      });
      expect(wrapper).toMatchSnapshot();
    });
    it(':loading', () => {
      const wrapper = mount({
        render() {
          return <Select loading={true}></Select>;
        },
      });
      expect(wrapper).toMatchSnapshot();
    });
    it(':labelInValue', () => {
      const wrapper = mount({
        render() {
          return <Select labelInValue={false}></Select>;
        },
      });
      expect(wrapper).toMatchSnapshot();
    });
    it(':reserveKeyword', () => {
      const wrapper = mount({
        render() {
          return <Select reserveKeyword={false}></Select>;
        },
      });
      expect(wrapper).toMatchSnapshot();
    });
    it(':bordered', () => {
      const wrapper = mount({
        render() {
          return <Select bordered={true}></Select>;
        },
      });
      expect(wrapper).toMatchSnapshot();
    });
  });
});

describe('Select Option', () => {
  // test props api
  describe(':props', () => {
    it(':value', () => {
      const value = '1';
      const wrapper = mount({
        render() {
          return (
            <Select v-model={value}>
              <Option value={'1'} label={'1'}></Option>
            </Select>
          );
        },
      });
      expect(wrapper).toMatchSnapshot();
    });
    it(':label', () => {
      const value = '1';
      const wrapper = mount({
        render() {
          return (
            <Select v-model={value}>
              <Option value={'1'} label={'1'}></Option>
            </Select>
          );
        },
      });
      expect(wrapper).toMatchSnapshot();
    });
    it(':disabled', () => {
      const value = '1';
      const wrapper = mount({
        render() {
          return (
            <Select v-model={value}>
              <Option value={'1'} label={'1'} disabled={true}></Option>
            </Select>
          );
        },
      });
      expect(wrapper).toMatchSnapshot();
    });
  });
});

describe('Select OptionGroup', () => {
  // test props api
  describe(':props', () => {
    it(':value', () => {
      const value = '1';
      const wrapper = mount({
        render() {
          return (
            <Select v-model={value}>
              <OptionGroup label={'num'}>
                <Option value={'1'} label={'1'}></Option>
              </OptionGroup>
              <OptionGroup label={'abc'}>
                <Option value={'a'} label={'a'}></Option>
              </OptionGroup>
            </Select>
          );
        },
      });
      expect(wrapper).toMatchSnapshot();
    });
  });
});

import { mount } from '@vue/test-utils';
import { createElementById } from '../../../test/utils';

const OPTIONS = [
  { label: 'tdesign-vue', value: 1 },
  {
    label: 'tdesign-react',
    value: 2,
    children: [
      { label: 'tdesign-web-react', value: '2.1' },
      { label: 'tdesign-mobile-react', value: '2.2' },
    ],
  },
  { label: 'tdesign-miniprogram', value: 3 },
  // eslint-disable-next-line
  { label: (h) => <span>tdesign-mobile-react</span>, text: 'tdesign-mobile-react', value: '4' },
  { label: 'tdesign-angular', value: '5' },
  { label: 'tdesign-mobile-vue', value: '6' },
];

// single select
export function getTreeSelectDefaultMount(TreeSelect, props = {}, events) {
  const { scopedSlots } = props;
  // eslint-disable-next-line
  delete props.scopedSlots;

  createElementById();
  return mount(
    {
      render() {
        return <TreeSelect data={OPTIONS} props={props} on={events} scopedSlots={scopedSlots}></TreeSelect>;
      },
    },
    { attachTo: '#focus-dom' },
  );
}

// multiple select
export function getTreeSelectMultipleMount(TreeSelect, props, events) {
  const { scopedSlots } = props;
  // eslint-disable-next-line
  delete props.scopedSlots;

  createElementById();
  const value = [1, 2, 3, '4', '5'];
  return mount(
    {
      render() {
        return (
          <TreeSelect
            value={value}
            data={OPTIONS}
            multiple={true}
            props={props}
            on={events}
            scopedSlots={scopedSlots}
          ></TreeSelect>
        );
      },
    },
    { attachTo: '#focus-dom' },
  );
}

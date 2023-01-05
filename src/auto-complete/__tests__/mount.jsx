import { mount } from '@vue/test-utils';

function createElementById(vue2AttachTo) {
  const div = document.createElement('div');
  div.id = vue2AttachTo;
  document.body.appendChild(div);
}

export function getNormalAutoCompleteMount(AutoComplete, propsData = {}, listeners) {
  const options = [
    'FirstKeyword',
    {
      // eslint-disable-next-line
      label: (h) => <div class="custom-node">TNode SecondKeyword</div>,
      // 用于搜索的纯文本
      text: 'SecondKeyword',
    },
    'ThirdKeyword',
  ];

  // Vue2 触发 focus 等特殊事件，需要 attachTo。
  // trigger 文档：https://v1.test-utils.vuejs.org/api/wrapper/#trigger
  // attachTo 文档：https://v1.test-utils.vuejs.org/api/options.html#attachto
  const id = propsData.vue2AttachTo || 'auto-complete-test';
  createElementById(id);

  // eslint-disable-next-line
  delete propsData.vue2AttachTo;

  return mount(AutoComplete, {
    attachTo: `#${id}`,
    propsData: {
      value: '',
      options,
      ...propsData,
    },
    listeners,
  });
}

export default getNormalAutoCompleteMount;

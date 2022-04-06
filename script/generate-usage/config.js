module.exports = {
  button: {
    configStr: 'import configList from \'./props.json\';',
    importStr: `import { Button as TButton } from 'tdesign-vue';
      const components = { TButton };`,
    renderStr: '<t-button v-bind="configProps">确定</t-button>',
  },
  divider: {
    configStr: 'import configList from \'./props.json\';',
    importStr: `import { Divider as TDivider } from 'tdesign-vue';
      const components = { TDivider };`,
    renderStr: `<div :style="{ width: '200px' }">
      <span>正直</span>
      <t-divider v-bind="configProps">TDesign</t-divider>
      <span>进取</span>
      <t-divider v-bind="configProps">TDesign</t-divider>
      <span>合作</span>
      <t-divider v-bind="configProps">TDesign</t-divider>
      <span>创新</span>
    </div>`,
    usageStr: '<t-divider v-bind="configProps">TDesign</t-divider>',
  },
  alert: {
    configStr: 'import configList from \'./props.json\';',
    importStr: `import { Alert as TAlert } from 'tdesign-vue';
      const components = { TAlert };`,
    renderStr: '<t-alert message="这是一条信息" v-bind="configProps" />',
  },
  anchor: {
    configStr: 'import configList from \'./props.json\';',
    importStr: `import { Anchor as TAnchor } from 'tdesign-vue';
      const components = { TAnchor };`,
    renderStr: `<t-anchor v-bind="configProps">
      <t-anchor-item href="#锚点一" title="基础锚点" />
      <t-anchor-item href="#锚点二" title="多级锚点" />
      <t-anchor-item href="#锚点三" title="指定容器锚点" />
    </t-anchor>`,
  },
  calendar: {
    configStr: 'import configList from \'./props.json\';',
    importStr: `import { Calendar as TCalendar } from 'tdesign-vue';
      const components = { TCalendar };`,
    renderStr: '<t-calendar v-bind="configProps" />',
  },
  'date-picker': {
    configStr: 'import configList from \'./props.json\';',
    importStr: `import { DatePicker as TDatePicker } from 'tdesign-vue';
      const components = { TDatePicker };`,
    renderStr: '<t-date-picker v-bind="configProps" />',
  },
  dropdown: {
    configStr: 'import configList from \'./props.json\';\n',
    importStr: `import { Dropdown as TDropdown, Button as TButton } from 'tdesign-vue';
      const components = { TDropdown, TButton };`,
    renderStr: `<t-dropdown :options="[{ content: '操作一', value: 1 }, { content: '操作二', value: 2 }]" v-bind="configProps">
      <t-button>更多...</t-button>
    </t-dropdown>`,
  },
};

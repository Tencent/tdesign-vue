<template>
  <t-tree-select
    style="width: 300px"
    :data="options"
    v-model="value"
    :popupVisible="popupVisible"
    filterable
    clearable
    placeholder="请选择"
    @blur="onBlurTrigger"
    @change="onChange"
    @popup-visible-change="onVisibleChange"
  />
</template>
<script>
export default {
  data() {
    return {
      value: '',
      popupVisible: false,
      options: [
        {
          label: '广东省',
          value: 'guangdong',
          children: [
            {
              label: '广州市',
              value: 'guangzhou',
            },
            {
              label: '深圳市',
              value: 'shenzhen',
              children: [
                {
                  label: '南山区海天二路33号腾讯滨海大厦',
                  value: 'Tencent',
                },
              ],
            },
          ],
        },
        {
          label: '江苏省',
          value: 'jiangsu',
          disabled: true,
          children: [
            {
              label: '南京市',
              value: 'nanjing',
            },
            {
              label: '苏州市',
              value: 'suzhou',
            },
          ],
        },
      ],
    };
  },
  methods: {
    onBlurTrigger(context) {
      console.log('blur:', context);
    },
    onChange(value, context) {
      console.log('change:', value, context);
    },
    onVisibleChange(v, c) {
      if (c.trigger || c.node?.label !== '广州市') {
        this.popupVisible = v;
      }
    },
  },
};
</script>

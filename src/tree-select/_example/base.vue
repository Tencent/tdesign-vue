<template>
  <t-tree-select
    style="width: 300px"
    :data="options"
    v-model="value"
    @blur="onBlurTrigger"
    filterable
    clearable
    placeholder="请选择"
  />
</template>
<script>
export default {
  data() {
    return {
      value: '',
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
      console.log(context);
    },
  },
};
</script>

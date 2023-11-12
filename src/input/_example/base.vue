<template>
  <t-space direction="vertical" style="max-width: 500px">
    <t-input />
    <t-input v-model="input" placeholder="请输入内容（有默认值）" @enter="onEnter" @change="onChange" />
    <t-input v-model="count" label="价格：" type="number" suffix="元" @change="onNumberChange" @focus="onNumberFocus" />
  </t-space>
</template>
<script>
export default {
  data() {
    return {
      input: '有默认值',
      count: undefined,
    };
  },
  methods: {
    onEnter() {
      console.log('trigger enter');
    },
    onChange(val) {
      console.log('onChange', this.input, val);
    },
    onNumberChange(val) {
      console.log('onNumberChange', this.count, val);
    },
    onNumberFocus(val) {
      console.log(val);
    },
  },
};
</script>

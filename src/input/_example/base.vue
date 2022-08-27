<template>
  <div class="tdesign-demo-block-column" style="max-width: 500px">
    <t-input />

    <t-input v-model="input" placeholder="请输入内容（有默认值）" @enter="onEnter" @change="onChange" />
    <t-input label="价格：" suffix="元" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      input: '有默认值',
    };
  },
  methods: {
    onEnter() {
      console.log('trigger enter');
    },
    onChange(val) {
      console.log(this.input, val);
    },
  },
};
</script>

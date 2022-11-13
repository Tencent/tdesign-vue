<template>
  <div>
    <!-- 使用 options 自定义下拉选项 -->
    <t-auto-complete v-model="value" :options="options" highlightKeyword @change="onChange" />

    <!-- 使用插槽自定义下拉选项 -->
  </div>
</template>

<script>
export default {
  name: 'AutoCompleteBase',

  data() {
    return {
      value: '',
      options: ['第一个默认联想词', '第二个默认联想词', '第三个默认联想词'],
      timer: null,
    };
  },

  methods: {
    // 输入框内容发生变化时进行搜索，200ms 搜索一次
    onChange(value) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        const text = '搜索联想词';
        const pureValue = value.replace(`第一个${text}`, '').replace(`第二个${text}`, '').replace(`第三个${text}`, '');

        this.options = [`${pureValue}第一个${text}`, `${pureValue}第二个${text}`, `${pureValue}第三个${text}`];
        clearTimeout(this.timer);
      }, 200);
    },
  },
};
</script>

<template>
  <div>
    <t-select
      v-model="value"
      creatable
      filterable
      placeholder="支持自定义创建"
      :options="options"
      style="width: 200px;"
      @create="createOptions"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [
        { label: '选项一', value: '1' },
        { label: '选项二', value: '2' },
        { label: '选项三', value: '3' },
      ],
      value: '',
    };
  },
  methods: {
    createOptions(value) {
      this.options.push({
        value,
        label: value,
      });
      console.log('create option:', value);
    },
  },
};
</script>

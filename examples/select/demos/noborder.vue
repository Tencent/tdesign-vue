<template>
  <div>
    <t-select
      v-model="value"
      :bordered="false"
      style="width: 200px"
      placeholder="-请选择-"
      clearable
      auto-width
      :options="options"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [
        {
          label: '已选择的选项',
          value: '1',
        },
        {
          label: '短的选项二',
          value: '2',
        },
        {
          label: '选项内容过长的选择器选项',
          value: '3',
        },
      ],
      value: '1',
    };
  },
};
</script>

<template>
  <div>
    <t-select
      v-model="value"
      placeholder="-请选择-"
      :options="options"
      :popupProps="popupProps"
      style="width: 200px;"
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
          label: '很长很长很很长很长很长的选项三',
          value: '3',
        },
      ],
      popupProps: {
        overlayStyle: {
          width: '300px',
        },
      },
      value: '1',
    };
  },
};
</script>

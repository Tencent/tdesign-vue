<template>
  <div>
    <t-select
      size="small"
      v-model="value1"
      :popupProps="popupProps"
      placeholder="-请选择-"
      style="width: 200px;display: inline-block;margin-right: 20px;"
      clearable
    >
      <t-option
        v-for="(item, index) in options"
        :value="item.value"
        :label="item.label"
        :key="index"
      >
        {{ item.label }}
      </t-option>
    </t-select>
    <t-select
      v-model="value"
      placeholder="-请选择-"
      :options="options"
      size="medium"
      style="width: 200px;display: inline-block;margin-right: 20px;"
    />
    <t-select
      v-model="value2"
      placeholder="-请选择-"
      :options="options"
      size="large"
      style="width: 200px;display: inline-block;"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [
        { label: '上海', value: 'shanghai' },
        { label: '北京', value: 'beijing' },
        { label: '深圳', value: 'shenzhen' },
      ],
      value: '',
      value1: '',
      value2: '',
      popupProps: {
        overlayStyle: {
          width: '300px',
        },
      },
    };
  },
};
</script>

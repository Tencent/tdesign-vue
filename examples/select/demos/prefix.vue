<template>
  <div>
    <t-select
      v-model="value"
      style="width: 200px;"
      :options="options"
      clearable
      placeholder="-请选择-"
    >
      <icon
        name="browse"
        slot="prefixIcon"
      />
    </t-select>
  </div>
</template>

<script>
import { Icon } from 'tdesign-icons-vue';

export default {
  components: {
    Icon,
  },
  data() {
    return {
      options: [
        { label: '上海', value: 'shanghai' },
        { label: '北京', value: 'beijing' },
        { label: '深圳', value: 'shenzhen' },
      ],
      value: '',
    };
  },
};
</script>

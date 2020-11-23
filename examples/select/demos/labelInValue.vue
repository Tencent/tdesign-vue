<template>
  <div>
    <t-select
      v-model="value"
      labelInValue
      class="demo-select-base"
      @change="handleChange"
      @visible-change="visibleChange"
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
      v-model="value2"
      labelInValue
      multiple
      class="demo-select-base"
      @change="handleChange"
      @visible-change="visibleChange"
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [{
        label: '上海',
        value: 'shanghai',
      }, {
        label: '北京',
        value: 'beijing',
      }, {
        label: '深圳',
        value: 'shenzhen',
      }],
      value: {
        value: '上海',
        text: 'shanghai',
      },
      value2: [
        {
          value: '上海',
          text: 'shanghai',
        },
      ],
    };
  },
  methods: {
    handleChange(value) {
      console.log(value);
    },
    visibleChange(val) {
      console.log('visible', val);
    },
  },
};
</script>
<style scoped>
  .demo-select-base {
    width: 200px;
    display: inline-block;
    margin: 0 20px;
  }
</style>

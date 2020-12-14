<template>
  <div class="tdesign-checkbox-group">
    <div>
      <t-checkbox-group
        name="city"
        v-model="value"
        :options="options"
        @change="onChange"
      ></t-checkbox-group>
    </div>

    <div>
      <t-checkbox-group
        :default-value="['bj', 'sz']"
        :options="options"
        @change="onChange"
      ></t-checkbox-group>
    </div>

    <div>
      <t-checkbox-group
        disabled
        :default-value="['gz']"
        :options="optionsWithDisabled"
        @change="onChange"
      ></t-checkbox-group>
    </div>

    <div>
      <t-checkbox-group :default-value="['sz']" @change="onChange">
        <t-checkbox value="bj">北京</t-checkbox>
        <t-checkbox value="sh">上海</t-checkbox>
        <t-checkbox value="gz">广州</t-checkbox>
        <t-checkbox value="sz" disabled>深圳</t-checkbox>
      </t-checkbox-group>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: [],
      options: [
        {
          value: 'bj',
          label: '北京',
        },
        {
          value: 'sh',
          label: '上海',
        },
        {
          value: 'gz',
          label: '广州',
        },
        {
          value: 'sz',
          label: '深圳',
        },
      ],
      optionsWithDisabled: [
        {
          value: 'bj',
          label: '北京',
        },
        {
          value: 'sh',
          label: '上海',
        },
        {
          value: 'gz',
          label: '广州',
        },
        {
          value: 'sz',
          label: '深圳',
          disabled: false,
        },
      ],
    };
  },
  methods: {
    onChange(checkedValues) {
      console.log('checkedValues:', checkedValues);
      console.log('value:', this.value);
    },
  },
};
</script>


<style scoped>
.t-checkbox-group {
  margin-bottom: 16px;
}
</style>

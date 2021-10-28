<template>
  <div class="tdesign-demo-block-column">
    <div>
      <t-radio-group
        name="city"
        v-model="value"
        :options="options"
        @change="onChange"
      ></t-radio-group>
    </div>

    <div>
      <t-radio-group
        default-value="3"
        :options="options"
        @change="onChange"
      ></t-radio-group>
    </div>

    <div>
      <t-radio-group
        disabled
        default-value="1"
        :options="optionsWithDisabled"
        @change="onChange"
      ></t-radio-group>
    </div>

    <div>
      <t-radio-group default-value="1" @change="onChange">
        <t-radio value="1">选项一</t-radio>
        <t-radio value="2">选项二</t-radio>
        <t-radio value="3">选项三</t-radio>
        <t-radio value="4" disabled>选项四</t-radio>
      </t-radio-group>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: '',
      options: [
        {
          value: '1',
          label: '选项一',
        },
        {
          value: '2',
          label: '选项二',
        },
        {
          value: '3',
          label: '选项三',
        },
        {
          value: '4',
          label: () => '选项四',
        },
      ],
      optionsWithDisabled: [
        {
          value: '1',
          label: '选项一',
        },
        {
          value: '2',
          label: '选项二',
        },
        {
          value: '3',
          label: '选项三',
          disabled: false,
        },
        {
          value: '4',
          label: () => '选项四',
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

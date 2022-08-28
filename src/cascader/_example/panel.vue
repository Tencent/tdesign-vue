<template>
  <div class="tdesign-demo-block-row">
    <div class="cascader-demo-panel-container">
      <t-cascader-panel
        v-model="value"
        :options="options"
        :onClick="clickHandle1"
        @click="clickHandle"
        @change="changeHandle"
      />
    </div>
    <div class="cascader-demo-panel-container">
      <t-cascader-panel v-model="value2" :options="options" multiple />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      options: [
        {
          label: '选项一',
          value: '1',
          children: [
            {
              label: '子选项一',
              value: '1.1',
            },
            {
              label: '子选项二',
              value: '1.2',
            },
            {
              label: '子选项三',
              value: '1.3',
            },
          ],
        },
        {
          label: '选项二',
          value: '2',
          children: [
            {
              label: '子选项一',
              value: '2.1',
            },
            {
              label: '子选项二',
              value: '2.2',
            },
          ],
        },
      ],
      value: '',
      value2: [],
    };
  },
  methods: {
    clickHandle(e, node) {
      console.log('click trigger, args: ', e, node);
    },
    clickHandle1(e) {
      console.log('click1 trigger, args: ', e);
    },
    changeHandle(e, ctx) {
      console.log('change trigger, args: ', e, ctx);
    },
  },
};
</script>
<style>
.cascader-demo-panel-container {
  border: 1px solid #eee;
  width: 100%;
}
</style>

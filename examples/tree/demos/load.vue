<template>
  <div class="tdesign-tree-demo">
    <div class="operations">
      <t-form labelWidth="150">
        <t-form-item label="可选">
          <t-switch v-model="checkable" />
        </t-form-item>
      </t-form>
    </div>
    <t-tree
      :data="items"
      hover
      expand-all
      :checkable="checkable"
      v-model="value"
      :load="load"
      :lazy="false"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      checkable: true,
      value: [
        '1.1.1',
      ],
      items: [{
        label: '1',
        value: '1',
        children: true,
      }, {
        label: '2',
        value: '2',
        children: true,
      }],
    };
  },
  methods: {
    load(node) {
      return new Promise((resolve) => {
        setTimeout(() => {
          let nodes = [];
          if (node.level < 2) {
            nodes = [{
              label: `${node.label}.1`,
              value: `${node.value}.1`,
              children: true,
            }, {
              label: `${node.label}.2`,
              value: `${node.value}.2`,
              children: true,
            }];
          }
          resolve(nodes);
        }, 1000);
      });
    },
  },
};
</script>
<style scoped>
@import url('./common/demo.css');
</style>

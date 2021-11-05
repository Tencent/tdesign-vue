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

<style>
.tdesign-tree-demo .t-tree {
  margin-bottom: 20px;
}
.tdesign-tree-demo .title{
  margin-bottom: 10px;
}
.tdesign-tree-demo .tips{
  margin-bottom: 10px;
}
.tdesign-tree-demo .operations{
  margin-bottom: 10px;
}
.tdesign-tree-demo .t-form__item {
  margin-bottom: 5px;
}
.tdesign-tree-demo .t-button{
  margin: 0 10px 10px 0;
}
</style>

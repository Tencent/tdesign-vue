<template>
  <div class="tdesign-tree-demo">
    <div class="operations">
      <t-form labelWidth="120">
        <t-form-item label="节点可高亮">
          <t-switch v-model="activable"/>
        </t-form-item>
        <t-form-item label="节点可多选高亮">
          <t-switch v-model="activeMultiple"/>
        </t-form-item>
        <t-form-item label="整个节点可点击">
          <t-switch v-model="expandOnClickNode"/>
        </t-form-item>
      </t-form>
    </div>
    <t-tree
      :data="items"
      expand-all
      :activable="activable"
      :active-multiple="activeMultiple"
      :expand-on-click-node="expandOnClickNode"
      @click="onClick"
      @active="onActive"
      :onActive="propOnActive"
      hover
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      activable: true,
      activeMultiple: false,
      expandOnClickNode: false,
      items: [{
        label: '1',
        children: [{
          label: '1.1',
        }, {
          label: '1.2',
        }],
      }, {
        label: '2',
        children: [{
          label: '2.1',
        }, {
          label: '2.2',
        }],
      }],
    };
  },
  methods: {
    onClick(context) {
      console.info('onClick', context);
    },
    onActive(value, context) {
      console.info('onActive', value, context);
    },
    propOnActive(value, context) {
      console.info('propOnActive', value, context);
    },
    toggleActivable() {
      this.activable = !this.activable;
    },
    toggleActiveMultiple() {
      this.activeMultiple = !this.activeMultiple;
    },
    toggleExpandOnClickNode() {
      this.expandOnClickNode = !this.expandOnClickNode;
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

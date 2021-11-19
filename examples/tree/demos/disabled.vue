<template>
  <div class="tdesign-tree-demo">
    <div class="operations">
      <t-form>
        <t-form-item label="是否禁用整个 tree" labelWidth="150">
          <t-switch v-model="disabled" />
        </t-form-item>
        <t-form-item label="是否只禁用 checkbox" labelWidth="200">
          <t-switch v-model="disableCheck" />
        </t-form-item>
      </t-form>
    </div>
    <t-tree
      :data="items"
      hover
      checkable
      expand-all
      :disabled="disabled"
      :disableCheck="disableCheck"
    />
    <div class="operations">
      <t-form>
        <t-form-item label="禁用指定节点 checkbox" labelWidth="200">
          <t-switch v-model="disableTarget" />
        </t-form-item>
      </t-form>
    </div>
    <t-tree
      :data="items"
      hover
      checkable
      expand-all
      :disableCheck="fnDisableCheck"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      disabled: true,
      disableCheck: false,
      disableTarget: true,
      items: [{
        label: '1',
        children: [{
          label: '1.1',
          children: [{
            label: '1.1.1',
          }, {
            label: '1.1.2',
          }],
        }, {
          label: '1.2',
          children: [{
            label: '1.2.1',
          }, {
            label: '1.2.2',
          }],
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
    fnDisableCheck(node) {
      const list = [
        '1.1',
        '1.2',
        '2.1',
      ];
      if (list.indexOf(node.label) >= 0) {
        return this.disableTarget;
      }
      return false;
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

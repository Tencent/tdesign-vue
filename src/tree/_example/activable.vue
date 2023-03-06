<template>
  <t-space :size="10" direction="vertical" class="tdesign-tree-demo">
    <!-- <t-space class="operations"> -->
    <t-form labelWidth="120">
      <t-form-item label="节点可高亮">
        <t-switch v-model="activable" />
      </t-form-item>
      <t-form-item label="节点可多选高亮">
        <t-switch v-model="activeMultiple" />
      </t-form-item>
      <t-form-item label="整个节点可点击">
        <t-switch v-model="expandOnClickNode" />
      </t-form-item>
    </t-form>
    <!-- </t-space> -->
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
  </t-space>
</template>

<script>
export default {
  data() {
    return {
      activable: true,
      activeMultiple: false,
      expandOnClickNode: false,
      items: [
        {
          value: 't1',
          label: '1',
          children: [
            {
              value: 't1.1',
              label: '1.1',
            },
            {
              value: 't1.2',
              label: '1.2',
            },
          ],
        },
        {
          value: 't2',
          label: '2',
          children: [
            {
              value: 't2.1',
              label: '2.1',
            },
            {
              value: 't2.2',
              label: '2.2',
            },
          ],
        },
      ],
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

<style scoped>
.tdesign-tree-demo .t-form__item {
  margin-bottom: 5px;
}
</style>

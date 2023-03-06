<template>
  <div class="tdesign-tree-demo tdesign-demo-transition">
    <t-form labelWidth="150" style="max-width: 500px">
      <t-form-item label="展开动画">
        <t-switch v-model="transition" />
      </t-form-item>
      <t-form-item label="显示连线">
        <t-switch v-model="showLine" />
      </t-form-item>
      <t-form-item label="显示图标">
        <t-switch v-model="showIcon" />
      </t-form-item>
    </t-form>

    <t-tree
      :data="items"
      hover
      activable
      checkable
      :transition="transition"
      :expand-on-click-node="false"
      :line="showLine"
      :icon="showIcon"
      :label="label"
    ></t-tree>
  </div>
</template>

<script>
const items = [
  {
    value: 't1',
    children: [
      {
        value: 't1.1',
        children: [
          {
            value: 't1.1.1',
          },
          {
            value: 't1.1.2',
          },
        ],
      },
      {
        value: 't1.2',
        children: [
          {
            value: 't1.2.1',
          },
          {
            value: 't1.2.2',
          },
        ],
      },
    ],
  },
  {
    value: 't2',
    children: [
      {
        value: 't2.1',
      },
      {
        value: 't2.2',
      },
    ],
  },
  {
    value: 't3',
    children: [
      {
        value: 't3.1',
      },
      {
        value: 't3.2',
      },
    ],
  },
];

export default {
  data() {
    return {
      index: 0,
      transition: true,
      showLine: true,
      showIcon: true,
      items,
    };
  },
  methods: {
    label(createElement, node) {
      return `${node.value}`;
    },
  },
};
</script>

<style>
.tdesign-tree-demo .t-tree {
  margin-bottom: 20px;
}
.tdesign-tree-demo .title {
  margin-bottom: 10px;
}
.tdesign-tree-demo .tips {
  margin-bottom: 10px;
}
.tdesign-tree-demo .operations {
  margin-bottom: 10px;
}
.tdesign-tree-demo .t-form__item {
  margin-bottom: 5px;
}
</style>

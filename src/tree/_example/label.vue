<template>
  <t-space direction="vertical" :size="20">
    <h3>render:</h3>
    <t-tree :data="items" expand-all :label="label" style="margin-bottom: 20px"></t-tree>
    <h3>scope slot:</h3>
    <t-tree :data="items" expand-all checkable style="margin-bottom: 20px">
      <template #label="{ node }">
        <font color="blue">label: {{ node.label }}, value: {{ node.value }}</font>
      </template>
    </t-tree>
  </t-space>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          label: '1',
          children: [
            {
              label: '1.1',
            },
            {
              label: '1.2',
            },
          ],
        },
        {
          label: '2',
          children: [
            {
              label: '2.1',
            },
            {
              label: '2.2',
            },
          ],
        },
      ],
      label(createElement, node) {
        return createElement('strong', {
          domProps: {
            innerHTML: `value: ${node.value}, label: ${node.label}`,
          },
        });
      },
    };
  },
};
</script>

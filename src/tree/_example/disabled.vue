<template>
  <t-space direction="vertical" style="width: 90%">
    <t-space>
      <span>是否禁用整个 tree:</span>
      <t-switch v-model="disabled" />
    </t-space>
    <t-tree
      hover
      checkable
      expand-all
      :data="items"
      :label="label"
      :disabled="disabled"
      :disable-check="fnDisableCheck"
      :check-strictly="false"
    >
      <template #operations="{ node }">
        <t-space :size="10">
          <t-button size="small" variant="base" @click="toggleDisable(node)">{{
            node.disabled ? 'enable' : 'disable'
          }}</t-button>
        </t-space>
      </template>
    </t-tree>
  </t-space>
</template>

<script>
// 预期规则:
// 父节点被禁用，所有子节点一并呈现禁用状态，除非 checkStrictly = true
// 父节点操作，不影响被禁用的子节点的原始选中状态。
// 子节点被禁用且未选中，父节点半选状态再次点击可切换为未选中状态。

export default {
  data() {
    return {
      disabled: false,
      disableCheck: false,
      disableTarget: true,
      disabledMap: new Map([['1.1', true]]),
      items: [
        {
          value: '1',
          children: [
            {
              value: '1.1',
              children: [
                {
                  value: '1.1.1',
                },
                {
                  value: '1.1.2',
                },
              ],
            },
            {
              value: '1.2',
              children: [
                {
                  value: '1.2.1',
                },
                {
                  value: '1.2.2',
                },
              ],
            },
          ],
        },
        {
          value: '2',
          children: [
            {
              value: '2.1',
              disabled: true,
              children: [
                {
                  value: '2.1.1',
                },
                {
                  value: '2.1.2',
                },
              ],
            },
            {
              value: '2.2',
              children: [
                {
                  value: '2.2.1',
                },
                {
                  value: '2.2.2',
                },
              ],
            },
          ],
        },
      ],
    };
  },
  computed: {
    disabledList() {
      return this.disabledMap.keys();
    },
  },
  methods: {
    fnDisableCheck(node) {
      const map = this.disabledMap;
      return map.get(node.value);
    },
    label(createElement, node) {
      return node.value;
    },
    toggleDisable(node) {
      const { tree } = this.$refs;
      const map = this.disabledMap;
      if (node.disabled) {
        map.delete(node.value);
        // 移除节点本身的 disabled 属性
        // 如果不移除，该节点仍然被视为禁用状态
        tree.setItem(node.value, {
          disabled: false,
        });
      } else {
        // 交给 disable-check 接管 disabled 属性判断
        map.set(node.value, true);
      }
    },
  },
};
</script>

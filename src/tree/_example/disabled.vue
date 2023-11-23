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
    >
      <template #operations="{ node }">
        <t-space :size="10">
          <t-button size="small" variant="base" @click="disable(node)">{{
            node.disabled ? 'enable' : 'disable'
          }}</t-button>
        </t-space>
      </template>
    </t-tree>
  </t-space>
</template>

<script>
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
            },
            {
              value: '2.2',
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
    disable(node) {
      const map = this.disabledMap;
      if (map.get(node.value)) {
        map.delete(node.value);
      } else {
        map.set(node.value, true);
      }
    },
  },
};
</script>

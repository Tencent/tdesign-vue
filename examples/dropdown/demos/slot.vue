<template>
  <div>
    <t-dropdown :minColumnWidth="88" @click="handleClick" trigger="click">
      <t-button variant="text">下拉菜单</t-button>
      <t-dropdown-menu slot="dropdown">
        <t-dropdown-item :value="1">操作一</t-dropdown-item>
        <t-dropdown-item :value="2">操作二</t-dropdown-item>
      </t-dropdown-menu>
    </t-dropdown>
  </div>
</template>
<script>
export default {
  methods: {
    handleClick(data, { e }) {
      console.log(data);
      e.preventDefault();
    },
  },
};
</script>

<template>
  <div>
    <t-dropdown
      :minColumnWidth="88"
      :maxHeight="120"
      @click="handleClick"
      trigger="click"
      :popupProps="{ showArrow: true, on: { 'visible-change': handleVisibleChange } }"
    >
      <t-button variant="text">下拉菜单</t-button>
      <t-dropdown-menu slot="dropdown">
        <t-dropdown-item :value="1">操作一</t-dropdown-item>
        <t-dropdown-item :value="2">操作二</t-dropdown-item>
        <t-dropdown-item :value="3">操作三</t-dropdown-item>
        <t-dropdown-item :value="4">操作四</t-dropdown-item>
        <t-dropdown-item :value="5">操作五</t-dropdown-item>
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
    handleVisibleChange(visible) {
      console.log(visible, 'on visible change');
    },
  },
};
</script>

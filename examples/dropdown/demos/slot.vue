<template>
  <div>
    <t-dropdown :minColumnWidth="120" @click="handleClick" trigger="click">
      <t-button>点击我试试</t-button>
      <t-dropdown-menu slot="dropdown">
        <t-dropdown-item :value="1">插槽操作项1</t-dropdown-item>
        <t-dropdown-item :value="2">插槽操作项2</t-dropdown-item>
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

<template>
  <t-menu theme="light" active="item2" @change="changeHandler" height="550px">
    <img slot="logo" width="136" class="t-menu__logo--center" src="https://www.tencent.com/img/index/menu_logo_hover.png" alt="logo">
    <t-menu-group title="分组1">
      <t-menu-item value="item1">菜单内容一</t-menu-item>
    </t-menu-group>
    <t-menu-group title="分组2">
      <t-menu-item value="item2">已选内容</t-menu-item>
      <t-menu-item value="item3">菜单内容二很长很长很长很长很长很长很长很长</t-menu-item>
    </t-menu-group>
    <t-menu-group title="分组1">
      <t-menu-item value="item4" :disabled="true">菜单内容三</t-menu-item>
    </t-menu-group>
  </t-menu>
</template>

<script>
export default {
  methods: {
    changeHandler(active) {
      console.log('change', active);
    },
  },
};
</script>

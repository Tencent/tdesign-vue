<template>
  <t-menu theme="light" active="2-1" mode="accordion" height="550px" :collapsed="collapsed">
    <t-menu-item name="item1">
      <t-icon slot="icon" name="user"/>菜单内容一
    </t-menu-item>
    <t-submenu name="2">
      <t-icon slot="icon" name="user" />
      <span slot="title">侧边内容二</span>
      <t-menu-item name="2-1">菜单内容一</t-menu-item>
      <t-menu-item name="2-2">菜单内容二</t-menu-item>
      <t-menu-item name="2-3">菜单内容三</t-menu-item>
    </t-submenu>
    <t-submenu name="3">
      <t-icon slot="icon" name="user" />
      <span slot="title">侧边内容三</span>
      <t-menu-item name="3-1">菜单内容一</t-menu-item>
      <t-menu-item name="3-2">菜单内容二</t-menu-item>
      <t-menu-item name="3-3">菜单内容三</t-menu-item>
    </t-submenu>
    <t-submenu name="4">
      <t-icon slot="icon" name="user" />
      <span slot="title">侧边内容四</span>
      <t-menu-item name="4-1">菜单内容一</t-menu-item>
      <t-menu-item name="4-2">菜单内容二</t-menu-item>
      <t-menu-item name="4-3">菜单内容三</t-menu-item>
    </t-submenu>
    <div slot="options">
      <t-icon name="user" @click.native="changeCollapsed" />
    </div>
  </t-menu>
</template>

<script>
export default {
  data() {
    return {
      disabled: true,
      collapsed: false,
    };
  },
  methods: {
    changeCollapsed() {
      this.collapsed = !this.collapsed;
    },
  },
};
</script>

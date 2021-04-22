<template>
  <t-menu theme="light" active="2-1" :expanded=expanded height="550px" :collapsed="collapsed">
    <t-menu-item value="item1">
      <t-icon slot="icon" name="user"/>菜单内容一
    </t-menu-item>
    <t-submenu value="2">
      <t-icon slot="icon" name="user" />
      <span slot="title">侧边内容二</span>
      <t-menu-item value="2-1">菜单内容一</t-menu-item>
      <t-menu-item value="2-2">菜单内容二</t-menu-item>
      <t-menu-item value="2-3">菜单内容三</t-menu-item>
    </t-submenu>
    <t-submenu value="3">
      <t-icon slot="icon" name="user" />
      <span slot="title">侧边内容三</span>
      <t-menu-item value="3-1">菜单内容一</t-menu-item>
      <t-menu-item value="3-2">菜单内容二</t-menu-item>
      <t-menu-item value="3-3">菜单内容三</t-menu-item>
    </t-submenu>
    <t-submenu value="4">
      <t-icon slot="icon" name="user" />
      <span slot="title">侧边内容四</span>
      <t-menu-item value="4-1">菜单内容一</t-menu-item>
      <t-menu-item value="4-2">菜单内容二</t-menu-item>
      <t-menu-item value="4-3">菜单内容三</t-menu-item>
    </t-submenu>
    <div slot="options">
      <t-icon :name="iconName" @click.native="changeCollapsed" />
    </div>
  </t-menu>
</template>

<script>
export default {
  data() {
    return {
      expanded: ['2', '3'],
      disabled: true,
      collapsed: false,
    };
  },
  computed: {
    iconName() {
      return this.collapsed ? 'chevron-right' : 'chevron-left';
    },
  },
  methods: {
    changeCollapsed() {
      this.collapsed = !this.collapsed;
    },
  },
};
</script>

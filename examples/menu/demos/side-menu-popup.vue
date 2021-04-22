<template>
  <t-menu theme="light" active="2-1" height="550px" :collapsed="collapsed" expandMutex @expand="handleExpand">
    <img slot="logo" width="136" class="t-menu__logo--center" src="https://www.tencent.com/img/index/menu_logo_hover.png" alt="logo">
    <t-menu-item value="item1">
      <t-icon slot="icon" name="user"/>菜单内容一
    </t-menu-item>
    <t-submenu value="2">
      <t-icon slot="icon" name="user" />
      <span slot="title">侧边内容二</span>
      <t-menu-item value="2-1">子菜单内容一</t-menu-item>
      <t-menu-item value="2-2">子菜单内容二</t-menu-item>
      <t-menu-item value="2-3">子菜单内容三</t-menu-item>
    </t-submenu>
    <t-submenu value="3">
      <t-icon slot="icon" name="user" />
      <span slot="title">侧边内容三</span>
      <t-menu-item value="3-1">子菜单内容一</t-menu-item>
      <t-menu-item value="3-2">子菜单内容二</t-menu-item>
      <t-menu-item value="3-3">子菜单内容三</t-menu-item>
    </t-submenu>
    <t-menu-item value="item4" :disabled="disabled">
      <t-icon slot="icon" name="user" />菜单内容四
    </t-menu-item>
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
    handleExpand(names) {
      console.log('receive handleExpand', names);
    },
  },
};
</script>

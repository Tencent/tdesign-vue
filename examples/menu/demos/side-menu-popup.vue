<template>

  <t-menu theme="light" active="2-1" :expanded=expanded :collapsed="collapsed" expandMutex @expand="handleExpand">
    <img slot="logo" :width="collapsed ? 35 : 136" class="t-menu__logo--center" :src="iconUrl" alt="logo">
    <t-menu-item value="item1">
      <t-icon slot="icon" name="dashboard"/>仪表盘
    </t-menu-item>
    <t-submenu value="2">
      <t-icon slot="icon" name="user-circle" />
      <span slot="title">个人中心</span>
      <t-menu-item value="2-1">子菜单内容一</t-menu-item>
      <t-menu-item value="2-2">子菜单内容二</t-menu-item>
      <t-menu-item value="2-3">子菜单内容三</t-menu-item>
    </t-submenu>
    <t-submenu value="3">
      <t-icon slot="icon" name="root-list" />
      <span slot="title">根目录</span>
      <t-menu-item value="3-1">子菜单内容一</t-menu-item>
      <t-menu-item value="3-2">子菜单内容二</t-menu-item>
      <t-menu-item value="3-3">子菜单内容三</t-menu-item>
    </t-submenu>
    <t-menu-item value="item4" :disabled="disabled">
      <t-icon slot="icon" name="resources-list" />资源列表
    </t-menu-item>
    <div slot="options">
      <t-icon name="view-list" @click.native="changeCollapsed" />
    </div>
  </t-menu>
</template>

<script>
export default {
  data() {
    return {
      expanded: ['2'],
      disabled: true,
      collapsed: false,
      iconUrl: 'https://www.tencent.com/img/index/menu_logo_hover.png',
    };
  },
  methods: {
    changeCollapsed() {
      this.collapsed = !this.collapsed;
      this.iconUrl = this.collapsed ? 'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/logo%402x.png' : 'https://www.tencent.com/img/index/menu_logo_hover.png';
    },
    handleExpand(names) {
      console.log('receive handleExpand', names);
    },
  },
};
</script>

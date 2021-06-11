<template>
  <t-menu theme="light" value="2-1" :collapsed="collapsed" height="550px">
    <span slot="logo">LOGO</span>
    <t-menu-item value="item1">
      <t-icon slot="icon" name="dashboard"/>仪表盘
    </t-menu-item>
    <t-submenu value="2" mode="popup">
      <t-icon slot="icon" name="mail" />
      <span slot="title">信息区</span>
      <t-menu-item value="2-1">菜单内容一</t-menu-item>
      <t-menu-item value="2-2">菜单内容二</t-menu-item>
      <t-menu-item value="2-3">菜单内容三</t-menu-item>
    </t-submenu>
    <t-menu-item value="item3"><t-icon slot="icon" name="play-circle" />视频区</t-menu-item>
    <t-menu-item value="item4" :disabled="true"><t-icon slot="icon" name="edit-1" />资源编辑</t-menu-item>
    <div slot="options">
      <t-icon :name="iconName" @click.native="changeCollapsed" />
    </div>
  </t-menu>
</template>

<script>
export default {
  data() {
    return {
      collapsed: true,
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

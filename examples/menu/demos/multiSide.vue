<template>
  <div class="box">
    <t-menu theme="light" value="2-1" :expanded=expanded height="550px" :collapsed="collapsed">
      <t-menu-item value="item1">
        <t-icon slot="icon" name="dashboard"/>仪表盘
      </t-menu-item>
      <t-menu-item value="resource">
        <t-icon slot="icon" name="resources-list"/>资源列表
      </t-menu-item>
      <t-menu-item value="root">
        <t-icon slot="icon" name="root-list"/>根目录
      </t-menu-item>
      <t-submenu value="2">
        <t-icon slot="icon" name="control-platform" />
        <span slot="title">调度平台</span>
        <t-menu-item value="2-1">二级菜单内容</t-menu-item>
        <t-menu-item value="2-2">二级菜单内容</t-menu-item>
        <t-menu-item value="2-3">二级菜单内容</t-menu-item>
      </t-submenu>
      <t-menu-item value="precise-monitor">
        <t-icon slot="icon" name="precise-monitor"/>精准监控
      </t-menu-item>
      <t-submenu value="3">
        <t-icon slot="icon" name="mail" />
        <span slot="title">消息区</span>
        <t-menu-item value="3-1">二级菜单内容</t-menu-item>
        <t-menu-item value="3-2">二级菜单内容</t-menu-item>
        <t-menu-item value="3-3">二级菜单内容</t-menu-item>
      </t-submenu>
      <t-menu-item value="user-circle">
        <t-icon slot="icon" name="user-circle"/>个人中心
      </t-menu-item>
      <t-submenu value="4">
        <t-icon slot="icon" name="play-circle" />
        <span slot="title">视频区</span>
        <t-menu-item value="4-1">二级菜单内容</t-menu-item>
        <t-menu-item value="4-2">二级菜单内容</t-menu-item>
        <t-menu-item value="4-3">二级菜单内容</t-menu-item>
      </t-submenu>
      <t-menu-item value="edit1">
        <t-icon slot="icon" name="edit-1"/>资源编辑
      </t-menu-item>
      <div slot="options">
        <t-icon name="view-list" @click.native="changeCollapsed" />
      </div>
    </t-menu>

    <t-menu theme="dark" value="2-1" style="margin-left: 50px" :expanded="expanded2" height="550px" :collapsed="collapsed2">
      <t-menu-item value="item1">
        <t-icon slot="icon" name="dashboard"/>仪表盘
      </t-menu-item>
      <t-menu-item value="resource">
        <t-icon slot="icon" name="resources-list"/>资源列表
      </t-menu-item>
      <t-menu-item value="root">
        <t-icon slot="icon" name="root-list"/>根目录
      </t-menu-item>
      <t-submenu value="2">
        <t-icon slot="icon" name="control-platform" />
        <span slot="title">调度平台</span>
        <t-menu-item value="2-1">二级菜单内容</t-menu-item>
        <t-menu-item value="2-2">二级菜单内容</t-menu-item>
        <t-menu-item value="2-3">二级菜单内容</t-menu-item>
      </t-submenu>
      <t-menu-item value="precise-monitor">
        <t-icon slot="icon" name="precise-monitor"/>精准监控
      </t-menu-item>
      <t-submenu value="3">
        <t-icon slot="icon" name="mail" />
        <span slot="title">消息区</span>
        <t-menu-item value="3-1">二级菜单内容</t-menu-item>
        <t-menu-item value="3-2">二级菜单内容</t-menu-item>
        <t-menu-item value="3-3">二级菜单内容</t-menu-item>
      </t-submenu>
      <t-menu-item value="user-circle">
        <t-icon slot="icon" name="user-circle"/>个人中心
      </t-menu-item>
      <t-submenu value="4">
        <t-icon slot="icon" name="play-circle" />
        <span slot="title">视频区</span>
        <t-menu-item value="4-1">二级菜单内容</t-menu-item>
        <t-menu-item value="4-2">二级菜单内容</t-menu-item>
        <t-menu-item value="4-3">二级菜单内容</t-menu-item>
      </t-submenu>
      <t-menu-item value="edit1">
        <t-icon slot="icon" name="edit-1"/>资源编辑
      </t-menu-item>
      <div slot="options">
        <t-icon name="view-list" @click.native="changeCollapsed2" />
      </div>
    </t-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      expanded: ['2', '3'],
      expanded2: ['2', '3'],
      disabled: true,
      collapsed: false,
      collapsed2: false,
    };
  },
  methods: {
    changeCollapsed() {
      this.collapsed = !this.collapsed;
    },
    changeCollapsed2() {
      this.collapsed2 = !this.collapsed2;
    },
  },
};
</script>

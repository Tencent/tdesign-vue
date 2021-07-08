<template>
  <div class="tdesign-demo-item--layout">
    <t-layout>
      <t-header>
        <t-head-menu  value="item1" height="120px">
          <img slot="logo" width="136" class="logo" src="https://www.tencent.com/img/index/menu_logo_hover.png" alt="logo">
          <t-menu-item value="item1">已选内容</t-menu-item>
          <t-menu-item value="item2">菜单内容一</t-menu-item>
          <t-menu-item value="item3">菜单内容二</t-menu-item>
          <t-menu-item value="item4" :disabled="true">菜单内容三</t-menu-item>
          <div slot="options">
            <a href="javascript:;"><t-icon name="search"/></a>
            <a href="javascript:;"><t-icon name="notification-filled"/></a>
            <a href="javascript:;"><t-icon name="home"/></a>
          </div>
        </t-head-menu>
      </t-header>
      <t-layout>
        <t-aside>
          <t-menu theme="light" value="dashboard" style="margin-right: 50px" height="550px" >
            <t-menu-item value="dashboard">
              <t-icon slot="icon" name="dashboard"/>仪表盘
            </t-menu-item>
            <t-menu-item value="resource">
              <t-icon slot="icon" name="resources-list"/>资源列表
            </t-menu-item>
            <t-menu-item value="root">
              <t-icon slot="icon" name="root-list"/>根目录
            </t-menu-item>
            <t-menu-item value="control-platform">
              <t-icon slot="icon" name="control-platform"/>调度平台
            </t-menu-item>
            <t-menu-item value="precise-monitor">
              <t-icon slot="icon" name="precise-monitor"/>精准监控
            </t-menu-item>
            <t-menu-item value="mail">
              <t-icon slot="icon" name="mail"/>消息区
            </t-menu-item>
            <t-menu-item value="user-circle">
              <t-icon slot="icon" name="user-circle"/>个人中心
            </t-menu-item>
            <t-menu-item value="play-circle">
              <t-icon slot="icon" name="play-circle"/>视频区
            </t-menu-item>
            <t-menu-item value="edit1">
              <t-icon slot="icon" name="edit-1"/>资源编辑
            </t-menu-item>
          </t-menu>
        </t-aside>
        <t-layout>
          <t-content>
            <div>Content</div>
          </t-content>
          <t-footer>Copyright @ 2019-{{new Date().getFullYear()}} Tencent. All Rights Reserved</t-footer>
        </t-layout>
      </t-layout>
    </t-layout>
  </div>
</template>

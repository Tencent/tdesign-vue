<template>
  <div class="box">
    <t-menu theme="light" value="item1" @change="changeHandler" style="margin-right: 50px" height="550px">
      <img slot="logo" width="136" class="t-menu__logo--center" src="https://www.tencent.com/img/index/menu_logo_hover.png" alt="logo">
      <t-menu-item value="item1">仪表盘</t-menu-item>
      <t-menu-item value="item2">资源列表</t-menu-item>
      <t-menu-item value="item3"><a href="https://www.tencent.com" target="_blank">根目录</a></t-menu-item>
      <t-menu-item value="item4" :disabled="true">调度平台</t-menu-item>
      <t-menu-item value="item5">精准监控</t-menu-item>
      <t-menu-item value="item6">消息区</t-menu-item>
      <t-menu-item value="item7">个人中心</t-menu-item>
      <t-menu-item value="item8">视频区</t-menu-item>
      <t-menu-item value="item9">资源编辑</t-menu-item>
    </t-menu>

    <t-menu theme="light" value="dashboard" style="margin-right: 50px" height="550px" >
      <img slot="logo" width="136" class="t-menu__logo--center" src="https://www.tencent.com/img/index/menu_logo_hover.png" alt="logo">
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

    <t-menu theme="dark" value="dashboard" height="550px" >
      <img slot="logo" width="136" class="t-menu__logo--center" src="https://www.tencent.com/img/index/menu_logo.png" alt="logo">
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
  </div>

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

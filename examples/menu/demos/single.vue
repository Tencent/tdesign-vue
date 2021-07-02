<template>
  <div>
    <t-head-menu theme="light" value="item2" @change="changeHandler">
      <template #logo>
        <img width="136"  src="https://www.tencent.com/img/index/menu_logo_hover.png" alt="logo">
      </template>
      <t-menu-item value="item1">菜单内容一</t-menu-item>
      <t-menu-item value="item2">已选内容</t-menu-item>
      <t-menu-item value="item3"><a href="https://www.tencent.com" target="_blank">菜单内容二</a></t-menu-item>
      <t-menu-item value="item4" :disabled="true">菜单内容三</t-menu-item>
      <template #options>
        <a href="javascript:;"><t-icon name="search"/></a>
        <a href="javascript:;"><t-icon name="mail"/></a>
        <a href="javascript:;"><t-icon name="user"/></a>
        <a href="javascript:;"><t-icon name="ellipsis"/></a>
      </template>
    </t-head-menu>

    <br />

    <t-head-menu theme="dark" value="item1" height="120px">
      <img slot="logo" width="136"  src="https://www.tencent.com/img/index/menu_logo.png" alt="logo">
      <t-menu-item value="item1">已选内容</t-menu-item>
      <t-menu-item value="item2">菜单内容一</t-menu-item>
      <t-menu-item value="item3">菜单内容二</t-menu-item>
      <t-menu-item value="item4" :disabled="true">菜单内容三</t-menu-item>
      <template #options>
        <a href="javascript:;"><t-icon name="search"/></a>
        <a href="javascript:;"><t-icon name="mail"/></a>
        <a href="javascript:;"><t-icon name="user"/></a>
        <a href="javascript:;"><t-icon name="ellipsis"/></a>
      </template>
    </t-head-menu>
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

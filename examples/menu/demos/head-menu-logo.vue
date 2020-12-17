<template>
  <t-head-menu theme="light" active="item2">
    <img slot="logo" width="136" class="t-menu__logo--center" src="https://www.tencent.com/img/index/menu_logo_hover.png" alt="logo">
    <t-menu-item name="item1">菜单内容一</t-menu-item>
    <t-menu-item name="item2">已选内容</t-menu-item>
    <t-menu-item name="item3">菜单内容二</t-menu-item>
    <t-menu-item name="item4" :disabled="true">菜单内容三</t-menu-item>
  </t-head-menu>
</template>

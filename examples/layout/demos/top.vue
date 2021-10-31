<template>
  <div class="tdesign-demo-item--layout">
    <t-layout >
      <t-header>
        <t-head-menu theme="light" value="item1" height="120px">
          <img
            slot="logo"
            width="136"
            class="logo"
            src="https://www.tencent.com/img/index/menu_logo_hover.png"
            alt="logo"
          >
          <t-menu-item value="item1">已选内容</t-menu-item>
          <t-menu-item value="item2">菜单内容一</t-menu-item>
          <t-menu-item value="item3">菜单内容二</t-menu-item>
          <t-menu-item value="item4" :disabled="true">菜单内容三</t-menu-item>
          <template slot="options">
            <span><icon name="search"/></span>
            <span><icon name="home"/></span>
          </template>
        </t-head-menu>
      </t-header>
      <t-content>
        <div>Content</div>
      </t-content>
      <t-footer>
        Copyright @ 2019-{{new Date().getFullYear()}} Tencent. All Rights Reserved
      </t-footer>
    </t-layout>
  </div>
</template>

<script>
import { Icon } from '@tencent/tdesign-icons-vue';

export default {
  components: {
    Icon,
  },
};
</script>

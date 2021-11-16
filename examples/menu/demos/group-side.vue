<template>
  <t-menu theme="light" defaultValue="item2" :collapsed="collapsed" @change="changeHandler" height="550px">
    <template #logo>
      <img :width="collapsed ? 35 : 136"  :src="iconUrl" alt="logo">
    </template>
    <t-menu-group title="分组类型1">
      <t-menu-item value="item1">
        菜单内容
      </t-menu-item>
    </t-menu-group>
    <t-menu-group title="分组类型2">
      <t-menu-item value="item2">菜单内容</t-menu-item>
      <t-menu-item value="item3">菜单内容</t-menu-item>
    </t-menu-group>
    <t-menu-group title="分组类型3">
      <t-menu-item value="item4">菜单内容</t-menu-item>
    </t-menu-group>
    <template #operations>
      <icon class="t-menu__operations-icon" name="view-list" @click.native="changeCollapsed" />
    </template>
  </t-menu>
</template>

<script>
import { Icon } from 'tdesign-icons-vue';

export default {
  components: {
    Icon,
  },
  data() {
    return {
      collapsed: false,
      iconUrl: 'https://www.tencent.com/img/index/menu_logo_hover.png',
    };
  },
  methods: {
    changeHandler(active) {
      console.log('change', active);
    },
    changeCollapsed() {
      this.collapsed = !this.collapsed;
      this.iconUrl = this.collapsed
        ? 'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/logo%402x.png'
        : 'https://www.tencent.com/img/index/menu_logo_hover.png';
    },
  },
};
</script>

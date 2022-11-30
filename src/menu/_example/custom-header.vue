<template>
  <t-head-menu theme="dark" defaultValue="item2">
    <t-menu-item value="item1">菜单1</t-menu-item>
    <t-menu-item value="item2">菜单2</t-menu-item>
    <t-menu-item value="item3">菜单3</t-menu-item>
    <t-menu-item value="item4" :disabled="true">禁用菜单</t-menu-item>
    <template #operations>
      <a href="javascript:;"><icon class="t-menu__operations-icon" name="search" /></a>
      <a href="javascript:;"><icon class="t-menu__operations-icon" name="mail" /></a>
      <a href="javascript:;"><icon class="t-menu__operations-icon" name="user" /></a>
      <a href="javascript:;"><icon class="t-menu__operations-icon" name="ellipsis" /></a>
    </template>
  </t-head-menu>
</template>

<script>
import { Icon } from 'tdesign-icons-vue';

export default {
  components: {
    Icon,
  },
};
</script>

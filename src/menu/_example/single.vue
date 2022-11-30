<template>
  <div>
    <t-head-menu theme="light" v-model="menu1Value" @change="changeHandler">
      <template #logo>
        <img height="28" src="https://tdesign.gtimg.com/site/baseLogo-light.png" alt="logo" />
      </template>
      <t-menu-item value="item1">菜单1</t-menu-item>
      <t-menu-item value="item2">菜单2</t-menu-item>
      <t-menu-item value="item4" :disabled="true">禁用菜单</t-menu-item>
      <template #operations>
        <a href="javascript:;"><icon class="t-menu__operations-icon" name="search" /></a>
        <a href="javascript:;"><icon class="t-menu__operations-icon" name="mail" /></a>
        <a href="javascript:;"><icon class="t-menu__operations-icon" name="user" /></a>
        <a href="javascript:;"><icon class="t-menu__operations-icon" name="ellipsis" /></a>
      </template>
    </t-head-menu>

    <br />

    <t-head-menu theme="dark" v-model="menu2Value" height="120px">
      <img slot="logo" height="28" src="https://tdesign.gtimg.com/site/baseLogo-dark.png" alt="logo" />
      <t-menu-item value="item1">菜单1</t-menu-item>
      <t-menu-item value="item2">菜单2</t-menu-item>
      <t-menu-item value="item4" :disabled="true">禁用菜单</t-menu-item>
      <template #operations>
        <a href="javascript:;"><icon class="t-menu__operations-icon" name="search" /></a>
        <a href="javascript:;"><icon class="t-menu__operations-icon" name="mail" /></a>
        <a href="javascript:;"><icon class="t-menu__operations-icon" name="user" /></a>
        <a href="javascript:;"><icon class="t-menu__operations-icon" name="ellipsis" /></a>
      </template>
    </t-head-menu>
  </div>
</template>

<script>
import { Icon } from 'tdesign-icons-vue';

export default {
  components: {
    Icon,
  },
  data() {
    return {
      menu1Value: 'item2',
      menu2Value: 'item1',
    };
  },
  methods: {
    changeHandler(active) {
      console.log('change', active);
    },
  },
};
</script>

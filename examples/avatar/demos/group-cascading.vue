<template>
  <div class="demo-avatar">
    <div class="demo-avatar-block">
      <t-avatar-group>
        <t-avatar :image="image" ></t-avatar>
        <t-avatar >W</t-avatar>
        <t-avatar :icon="icon"></t-avatar>
      </t-avatar-group>
    </div>

    <div class="demo-avatar-block">
      <t-avatar-group cascading='left-up'>
        <t-avatar :image="image" ></t-avatar>
        <t-avatar >W</t-avatar>
        <t-avatar :icon="icon"></t-avatar>
      </t-avatar-group>
    </div>
  </div>
</template>
<script lang="jsx">
import { UserIcon } from 'tdesign-icons-vue';

export default {
  data() {
    return {
      image: 'https://tdesign.gtimg.com/site/avatar.jpg',
    };
  },
  computed: {
    icon() {
      return () => <UserIcon/>;
    },
  },
};
</script>
<style lang="less" scoped>
   .demo-avatar{
    .demo-avatar-block:first-child{
      margin-bottom: 40px;
    }
  }

</style>

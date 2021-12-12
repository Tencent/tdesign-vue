<template>
  <div class="demo-avatar">
    <div class="demo-avatar-block">
      <t-avatar-group size='large' :max="2"  >
        <t-avatar :image="image" ></t-avatar>
        <t-avatar >Avatar</t-avatar>
        <t-avatar  :image="image"></t-avatar>
      </t-avatar-group>
    </div>
    <div class="demo-avatar-block">
      <t-avatar-group size='large' :max="2" :collapseAvatar="ellipsisIcon">
        <t-avatar :image="image" ></t-avatar>
        <t-avatar >Avatar</t-avatar>
        <t-avatar :icon="icon"></t-avatar>
      </t-avatar-group>
    </div>
    <div class="demo-avatar-block">
      <t-avatar-group size='large' :max="2" collapseAvatar="more">
        <t-avatar  :image="image" ></t-avatar>
        <t-avatar >Avatar</t-avatar>
        <t-avatar :icon="icon"></t-avatar>
      </t-avatar-group>
    </div>
  </div>
</template>
<script lang="jsx">
import { UserIcon, EllipsisIcon } from 'tdesign-icons-vue';

export default {
  data() {
    return {
      image: 'https://tdesign.gtimg.com/site/avatar.jpg',
    };
  },
  computed: {
    ellipsisIcon() {
      return () => <EllipsisIcon />;
    },
    icon() {
      return () => <UserIcon />;
    },
  },
};
</script>
<style lang="less" scoped>
  .demo-avatar{
    &-block:not(:last-child){
       margin-bottom: 40px;
    }
  }
</style>

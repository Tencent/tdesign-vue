<template>
  <div class="demo-avatar">
    <t-avatar :image="image" :hideOnLoadFailed='false'></t-avatar>
    <t-avatar >W</t-avatar>
    <t-avatar :icon="icon"></t-avatar>
    <t-avatar>
      <template #icon>
        <user-icon/>
      </template>
    </t-avatar>
  </div>
</template>
<script lang="jsx">
import { UserIcon } from 'tdesign-icons-vue';

export default {
  components: {
    UserIcon,
  },
  data() {
    return {
      image: 'https://tdesign.gtimg.com/site/avatar.jpg',
    };
  },
  computed: {
    icon() {
      return () => <UserIcon />;
    },
  },
};
</script>
<style lang="less" scoped>
  .demo-avatar{
    .t-avatar {
      margin-right: 40px;
    }
  }
</style>

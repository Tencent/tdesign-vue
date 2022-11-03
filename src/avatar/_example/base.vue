<template>
  <t-space size="large">
    <t-avatar :icon="icon"></t-avatar>
    <t-avatar :image="image" :hideOnLoadFailed="false"></t-avatar>
    <t-avatar>W</t-avatar>
  </t-space>
</template>
<script lang="jsx">
import { UserIcon } from 'tdesign-icons-vue';

export default {
  components: {},
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

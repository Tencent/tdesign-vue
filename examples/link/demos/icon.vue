<template>
  <div class="tdesign-demo-block-row">
    <t-link theme="default" :prefix-icon="renderPrefixIcon" @click="clickLink"> 跳转链接 </t-link>
    <t-link theme="primary" underline href="https://tdesign.tencent.com/" target="_self">
      <link-icon slot="prefix-icon"></link-icon>
      跳转链接
    </t-link>
    <t-link theme="danger" hover="color" href="https://tdesign.tencent.com/" target="_blank">
      <jump-icon slot="suffixIcon" />
      跳转链接
    </t-link>
    <t-link theme="warning" :suffixIcon="renderSuffixIcon" disabled> 跳转链接 </t-link>
  </div>
</template>

<script lang="jsx">
import { LinkIcon, JumpIcon } from 'tdesign-icons-vue';

export default {
  components: {
    LinkIcon,
    JumpIcon,
  },
  data() {
    return {
      renderPrefixIcon: () => <LinkIcon />,
      renderSuffixIcon: () => <JumpIcon />,
    };
  },
  methods: {
    clickLink() {
      console.log('触发');
    },
  },
};
</script>

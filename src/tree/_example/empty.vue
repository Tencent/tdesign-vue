<template>
  <t-space direction="vertical" :size="20">
    <t-tree :data="[]" />
    <t-tree :data="[]" empty="😊 空数据（string）" />
    <t-tree :data="[]" :empty="empty" />
    <t-tree :data="[]">
      <div slot="empty">😊 空数据（slot）</div>
    </t-tree>
  </t-space>
</template>

<script lang="jsx">
export default {
  data() {
    return {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      empty(h) {
        return <div>😊 空数据（ empty props ）</div>;
      },
    };
  },
};
</script>

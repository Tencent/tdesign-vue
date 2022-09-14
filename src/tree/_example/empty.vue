<template>
  <t-space :size="20" direction="vertical">
    <t-tree :data="[]" /><br />
    <t-tree :data="[]" empty="😊 空数据（string）" /><br />
    <t-tree :data="[]" :empty="empty" /><br />
    <t-tree :data="[]"
    ><br />
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

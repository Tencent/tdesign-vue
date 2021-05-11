<template>
  <div class="tag-demo">
    <div class="tdesign-demo-block">
      可删除
      <t-tag
        v-for="(tag, index) in tags"
        :key="index"
        :theme="tag.type"
        :variant="tag.variant"
        :maxWidth="tag.maxWidth"
        :closable="tag.showClose"
        :icon="tag.icon"
        @click="handleClick"
        @close="handleClose(index)"
      >
        {{ tag.name }}
      </t-tag>
    </div>
    <div class="tdesign-demo-block">
      可添加
      <t-tag @click="handleClickAdd">
        <t-icon-add />
        添加标签
      </t-tag>
    </div>
  </div>
</template>

<script>
import TIconAdd from '@tencent/tdesign-vue/lib/icon/add';
import TIconDiscount from '@tencent/tdesign-vue/lib/icon/discount';

export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    TIconAdd,
    // eslint-disable-next-line vue/no-unused-components
    TIconDiscount,
  },
  data() {
    return {
      tags: [
        {
          name: '可删除标签',
          type: 'default',
          showClose: true,
        },
        {
          name: '可删除标签',
          type: 'default',
          icon: () => <t-icon-discount />,
          showClose: true,
        },
      ],
    };
  },
  methods: {
    handleClose(index) {
      this.tags.splice(index, 1);
    },
    handleClick(event) {
      console.log(event);
    },
    handleClickAdd() {
      this.tags.push({ name: Math.random().toString(), type: 'default', showClose: true });
    },
  },
};
</script>

<style lang="less" scoped>
.tag-demo .tdesign-demo-block {
  display: flex;
  > * {
    margin-left: 30px;
  }
}
</style>

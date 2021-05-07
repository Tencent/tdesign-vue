<template>
  <div class="tag-demo">
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
          name: '隐藏叉',
          type: 'default',
          showClose: false,
        },
        {
          name: '显示叉',
          type: 'default',
          showClose: true,
        },
        {
          name: '默认标签',
          type: 'default',
          icon: () => <t-icon-discount />,
          showClose: true,
        },
        {
          name: '默认超过八个字超出部分隐藏',
          type: 'default',
          maxWidth: 150,
          showClose: false,
        },
        {
          name: '添加标签',
          type: 'default',
          icon: () => <t-icon-add />,
          showClose: false,
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
  },
};
</script>

<style lang="less" scoped>
.tag-demo {
  width: 800px;
  display: flex;
  > * {
    margin-right: 30px;
  }
}
</style>

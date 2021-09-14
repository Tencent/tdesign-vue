<template>
  <div class="tag-demo">
    <div class="tdesign-demo-block">
      <t-tag
        v-for="(tag, index) in tags"
        :key="index"
        :theme="tag.type"
        :closable="tag.showClose"
        :icon="tag.icon"
        :disabled="!!tag.disabled"
        :maxWidth="tag.maxWidth"
        @click="handleClick"
        @close="handleClose(index)"
      >
        {{ tag.name }}
      </t-tag>
    </div>
    <div class="tdesign-demo-block editable">
      <t-tag v-if="!inputVisible" @click="handleClickAdd">
        <t-icon-add />
        添加标签
      </t-tag>
      <t-input
        v-else
        ref="input"
        size="small"
        style="width: 94px"
        @blur="handleInputEnter"
        @enter="handleInputEnter"
      />
    </div>
  </div>
</template>

<script>
import TIconAdd from '@tencent/tdesign-vue/lib/icon/add';
import TIconDiscount from '@tencent/tdesign-vue/lib/icon/discount';
import Vue from 'vue';

export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    TIconAdd,
    // eslint-disable-next-line vue/no-unused-components
    TIconDiscount,
  },
  data() {
    return {
      inputVisible: false,
      tags: [
        {
          name: '可删除标签可删除标签',
          type: 'default',
          showClose: true,
          maxWidth: 100,
        },
        {
          name: '可删除标签可删除标签',
          type: 'default',
          icon: () => <t-icon-discount />,
          showClose: true,
          maxWidth: 100,
        },
        {
          name: '可删除标签',
          type: 'default',
          showClose: true,
          disabled: true,
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
    handleInputEnter(val) {
      if (val) {
        this.tags.push({ name: val, type: 'default', showClose: true });
      }
      this.inputVisible = false;
    },
    handleClickAdd() {
      this.inputVisible = true;
      Vue.nextTick(() => {
        this.$refs.input.focus();
      });
    },
  },
};
</script>

<style lang="less" scoped>
.tag-demo .tdesign-demo-block {
  display: flex;
  > * {
    margin-right: 30px;
  }
}

.editable .t-tag {
  cursor: pointer;
}
</style>

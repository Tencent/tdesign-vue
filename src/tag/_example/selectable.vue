<template>
  <t-space size="30px">
    <t-check-tag
      v-for="(tag, index) in tags"
      :key="index"
      :defaultChecked="tag.defaultChecked"
      :disabled="!!tag.disabled"
      @click="handleClick(tag, index)"
      @change="handleChange"
    >
      {{ tag.name }}
    </t-check-tag>
  </t-space>
</template>

<script>
export default {
  data() {
    return {
      tags: [
        {
          name: '选中',
          defaultChecked: true,
        },
        {
          name: '未选',
        },
        {
          name: '禁用',
          disabled: true,
        },
      ],
    };
  },
  methods: {
    handleClick(tag, index) {
      console.log(tag, index);
    },
    handleChange(isChecked) {
      console.log(isChecked);
    },
  },
};
</script>

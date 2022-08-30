<template>
  <!-- 开启虚拟滚动请为select的panel设定好height 通过popupProps进行透传 -->
  <t-select
    v-model="value"
    :options="options"
    placeholder="请选择"
    :style="{ width: '300px' }"
    :scroll="{ type: 'virtual' }"
    :popup-props="{ overlayInnerStyle: { height: '300px' } }"
  />
</template>

<script lang="jsx">
export default {
  data() {
    const options = [];
    for (let i = 0; i < 1000; i++) {
      options.push({ label: `选项${i + 1}`, value: String(i) });
    }
    return {
      value: '',
      options,
    };
  },
};
</script>

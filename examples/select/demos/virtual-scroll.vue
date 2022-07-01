<template>
  <div class="tdesign-demo-select-base">
    <!-- 开启虚拟滚动请为select的panel设定好height 通过popupProps进行透传 -->
    <t-select
      v-model="value"
      :options="options"
      placeholder="请选择"
      :scroll="{ type: 'virtual' }"
      :popup-props="{ overlayStyle: { height: '300px' } }"
    />
  </div>
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

<style scoped>
.tdesign-demo-select-base {
  width: 450px;
  display: flex;
}

.tdesign-demo-select-base .t-select__wrap + .t-select__wrap {
  margin-left: 36px;
}
</style>

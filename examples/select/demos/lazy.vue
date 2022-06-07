<template>
  <div class="tdesign-demo-select-base">
    <!-- 方式一：使用 options 输出下拉选项。优先级高于 t-option-->
    <t-select v-model="value1" :options="options" placeholder="请选择云解决方案" :scroll="{ type: 'virtual' }" :max="2"/>
  </div>
</template>

<script lang="jsx">
export default {
  data() {
    const options = [];
    for (let i = 0; i < 1000; i++) {
      options.push({ label: String(i), value: String(i) });
    }
    return {
      value1: '',
      value2: '',
      options,
      // 如果此处数据字段不是 label 和 value，而是 name 和 id，则可以传入参数 `keys` 定义别名
      // 示例： <t-select :options="options1" :keys="{ label: 'name', value: 'id' }" />
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

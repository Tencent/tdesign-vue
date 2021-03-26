<template>
  <div class="tdesign-checkbox-group">
    <div>
      <t-checkbox v-model="disabled">禁用全部</t-checkbox>
    </div>
    <div>
      <t-checkbox-group v-model="city" :options="options" :disabled="disabled"/>
      <span class='demo-checkbox-row-desc' v-if="city.length">选中值：{{city}}</span>
    </div>
    <div>
      <t-checkbox-group v-model="program" :disabled="disabled">
        <t-checkbox value="Vue">Vue</t-checkbox>
        <t-checkbox value="React">React</t-checkbox>
        <t-checkbox value="Angular">Angular</t-checkbox>
        <t-checkbox value="Miniprogram" disabled>Miniprogram</t-checkbox>
        <span class='demo-checkbox-row-desc' v-if="program.length">选中值：{{program}}</span>
      </t-checkbox-group>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      city: ['北京'],
      program: ['Vue'],
      disabled: false,
      options: [
        {
          value: '北京',
          label: '北京',
        },
        {
          value: '上海',
          label: '上海',
        },
        {
          value: '广州',
          label: '广州',
        },
        {
          value: '深圳',
          // 此处可自定义文本内容
          label: () => '深圳（禁用&自定义文本）',
          // 禁用该选项
          disabled: true,
        },
      ],
    };
  },
};
</script>

<style scoped>
.tdesign-checkbox-group > div {
  margin-bottom: 16px;
}
.demo-checkbox-row-desc {
  color:rgba(0, 0, 0, 0.6);
  padding-left: 24px;
}
</style>

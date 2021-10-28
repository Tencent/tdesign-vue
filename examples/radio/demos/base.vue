<template>
  <div class="tdesign-demo-block-row">
    <t-radio>未选中项</t-radio>
    <t-radio :checked="true">选中项</t-radio>
    <t-radio :checked="true" disabled>选中禁用态</t-radio>
    <t-radio disabled>未选中禁用态</t-radio>
  </div>
</template>

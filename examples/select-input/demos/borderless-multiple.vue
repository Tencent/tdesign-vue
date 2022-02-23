<template>
  <div class="tdesign-demo__select-input-multiple" style="width: 100%">
    <t-select-input
      :value="value"
      :min-collapsed-num="1"
      borderless
      allow-input
      placeholder="select frameworks"
      clearable
      multiple
      @tag-change="onTagChange"
    >
      <template #panel>
        <t-checkbox-group
          :value="checkboxValue"
          :options="options"
          class="tdesign-demo__pannel-options-multiple-borderless"
          @change="onCheckedChange"
        />
      </template>
      <template #suffixIcon>
        <chevron-down-icon />
      </template>
    </t-select-input>
  </div>
</template>
<script>
export default {};
</script>
<style>
.tdesign-demo__pannel-options-multiple-borderless {
  width: 100%;
}
.tdesign-demo__pannel-options-multiple-borderless .t-checkbox {
  display: block;
  margin: 12px;
}
</style>

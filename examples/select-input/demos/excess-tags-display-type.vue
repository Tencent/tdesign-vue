<template>
  <div class="tdesign-demo__select-input-multiple" style="width: 100%">
    <!-- excessTagsDisplayType: 'scroll'，超出时，滚动显示 -->
    <p>第一种呈现方式：超出时滚动显示</p>
    <br />
    <t-select-input
      :value="value"
      :tag-input-props="{ excessTagsDisplayType: 'scroll' }"
      placeholder="请选择"
      allow-input
      clearable
      multiple
      @tag-change="onTagChange"
    >
      <template #panel>
        <t-checkbox-group
          :value="checkboxValue"
          :options="options"
          class="tdesign-demo__pannel-options-excess"
          @change="onCheckedChange"
        />
      </template>
    </t-select-input>

    <br /><br /><br />

    <!-- excessTagsDisplayType: 'scroll'，超出时，换行显示 -->
    <p>第二种呈现方式：超出时换行显示</p>
    <br />
    <t-select-input
      :value="value"
      :tag-input-props="{ excessTagsDisplayType: 'break-line' }"
      placeholder="请选择"
      allow-input
      clearable
      multiple
      @tag-change="onTagChange"
    >
      <template #panel>
        <t-checkbox-group
          :value="checkboxValue"
          :options="options"
          class="tdesign-demo__pannel-options-excess"
          @change="onCheckedChange"
        />
      </template>
    </t-select-input>
  </div>
</template>
<script>
export default {};
</script>
<style>
.tdesign-demo__pannel-options-excess {
  width: 100%;
}
.tdesign-demo__pannel-options-excess .t-checkbox {
  display: block;
  margin: 12px;
}
</style>

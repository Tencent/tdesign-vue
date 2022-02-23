<template>
  <div class="tdesign-demo__select-input-multiple" style="width: 100%">
    <div>
      <t-checkbox v-model="allowInput">是否允许输入</t-checkbox>
      <t-checkbox v-model="creatable">允许创建新选项（Enter 创建）</t-checkbox>
    </div>
    <br />
    <div>
      <t-radio-group
        v-model="excessTagsDisplayType"
        :options="[
          { label: '选中项过多横向滚动', value: 'scroll' },
          { label: '选中项过多换行显示', value: 'break-line' },
        ]"
      />
    </div>
    <br /><br />

    <!-- :popup-props="{ trigger: 'hover' }" -->
    <t-select-input
      :value="value"
      :allow-input="allowInput"
      :placeholder="allowInput ? '请选择或输入' : '请选择'"
      :tag-input-props="{ excessTagsDisplayType }"
      :popup-props="{ overlayStyle: { maxHeight: '280px', overflow: 'auto' } }"
      clearable
      multiple
      @tag-change="onTagChange"
      @input-change="onInputChange"
    >
      <template #panel>
        <t-checkbox-group
          v-if="displayOptions.length"
          :value="checkboxValue"
          :options="displayOptions"
          class="tdesign-demo__pannel-options-multiple"
          @change="onCheckedChange"
        />
        <div v-else class="tdesign-demo__select-empty-multiple">暂无数据</div>
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
.tdesign-demo__select-empty-multiple {
  text-align: center;
  color: var(--td-text-color-disabled);
  line-height: 32px;
}

.tdesign-demo__pannel-options-multiple {
  width: 100%;
}
.tdesign-demo__pannel-options-multiple .t-checkbox {
  display: block;
  margin: 12px;
}
</style>

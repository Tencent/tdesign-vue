<template>
  <div class="tdesign-demo__select-input-multiple" style="width: 100%">
    <br />
    <t-select-input
      :value="value"
      :min-collapsed-num="1"
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
          class="tdesign-demo__pannel-options-collapsed"
          @change="onCheckedChange"
        />
      </template>
    </t-select-input>

    <br /><br /><br />

    <!-- 第一种方式：使用渲染函数 collapsed-items 自定义折叠项 -->
    <t-select-input
      :value="value"
      :min-collapsed-num="2"
      :collapsed-items="renderCollapsedItems"
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
          class="tdesign-demo__pannel-options-collapsed"
          @change="onCheckedChange"
        />
      </template>
    </t-select-input>

    <br /><br /><br />

    <!-- 第二种方式：使用插槽 collapsedItems 自定义折叠项 -->
    <t-select-input
      :value="value"
      :min-collapsed-num="3"
      placeholder="请选择"
      allow-input
      clearable
      multiple
      @tag-change="onTagChange"
    >
      <template #collapsedItems="{ collapsedTags }">
        <t-popup>
          <t-tag>More({{ collapsedTags.length }})</t-tag>
          <template #content>
            <t-tag v-for="item in collapsedTags" :key="item" style="margin: 4px 4px 4px 0">
              {{ item }}
            </t-tag>
          </template>
        </t-popup>
      </template>
      <template #panel>
        <t-checkbox-group
          :value="checkboxValue"
          :options="options"
          class="tdesign-demo__pannel-options-collapsed"
          @change="onCheckedChange"
        />
      </template>
    </t-select-input>
  </div>
</template>
<script lang="jsx">
export default {};
</script>
<style>
.tdesign-demo__pannel-options-collapsed {
  width: 100%;
}
.tdesign-demo__pannel-options-collapsed .t-checkbox {
  display: block;
  margin: 12px;
}
</style>

<template>
  <t-select-input
    :value="selectValue"
    :popup-visible="popupVisible"
    :popup-props="{ overlayInnerStyle: { padding: '6px' } }"
    placeholder="请输入任意关键词"
    allow-input
    clearable
    style="width: 300px"
    @input-change="onInputChange"
    @popup-visible-change="onPopupVisibleChange"
  >
    <template #panel>
      <ul class="tdesign-demo__select-input-ul-autocomplete">
        <li v-for="item in options" :key="item" @click="() => onOptionClick(item)">
          {{ item }}
        </li>
      </ul>
    </template>
    <template #suffixIcon><search-icon /></template>
  </t-select-input>
</template>
<script setup>
import { ref } from 'vue';
import { SearchIcon } from 'tdesign-icons-vue';

const selectValue = ref('');
const popupVisible = ref(false);
const options = ref(['Student A', 'Student B', 'Student C', 'Student D', 'Student E', 'Student F']);
const onOptionClick = (item) => {
  selectValue.value = item;
  popupVisible.value = false;
};
const onInputChange = (keyword) => {
  selectValue.value = keyword;
  options.value = new Array(5).fill(null).map((t, index) => `${keyword} Student ${index}`);
};
const onPopupVisibleChange = (val) => {
  popupVisible.value = val;
};
</script>
<style lang="less">
.tdesign-demo__select-input-ul-autocomplete {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.tdesign-demo__select-input-ul-autocomplete > li {
  display: block;
  border-radius: 3px;
  line-height: 22px;
  cursor: pointer;
  padding: 3px 8px;
  color: var(--td-text-color-primary);
  transition: background-color 0.2s linear;
  white-space: nowrap;
  word-wrap: normal;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tdesign-demo__select-input-ul-autocomplete > li:hover {
  background-color: var(--td-bg-color-container-hover);
}
</style>

<template>
  <t-space direction="vertical" class="t-demo-auto-complete__base">
    <t-auto-complete
      v-model="value"
      :options="options"
      highlightKeyword
      :filterable="false"
      placeholder="请输入关键词搜索"
      clearable
      @change="onChange"
    />

    <!-- 复杂 UI 需求，可参考当前示例完成 -->
    <t-auto-complete
      v-model="value2"
      :options="options"
      placeholder="请输入关键词搜索（右侧搜索按钮可以使用插槽自定义）"
      highlightKeyword
      filterable
      class="t-demo-autocomplete__search"
    >
      <template v-if="value2" #suffix>
        <close-circle-filled-icon class="t-input__suffix-clear" @click="value2 = ''" />
      </template>
      <template #suffixIcon>
        <t-button shape="square"><search-icon /></t-button>
      </template>
    </t-auto-complete>
  </t-space>
</template>

<script setup>
import { ref } from 'vue';
import { SearchIcon, CloseCircleFilledIcon } from 'tdesign-icons-vue';

const value = ref('');
const value2 = ref('');
const options = ref(['第一个默认联想词', '第二个默认联想词', '第三个默认联想词']);
const timer = ref(null);
// 输入框内容发生变化时进行搜索，200ms 搜索一次
const onChange = (value) => {
  clearTimeout(timer.value);
  timer.value = setTimeout(() => {
    const text = '搜索联想词';
    const pureValue = value.replace(`第一个${text}`, '').replace(`第二个${text}`, '').replace(`第三个${text}`, '');
    options.value = [`${pureValue}第一个${text}`, `${pureValue}第二个${text}`, `${pureValue}第三个${text}`];
    clearTimeout(timer.value);
  }, 200);
};
</script>

<style>
.t-demo-autocomplete__search .t-input {
  padding-right: 0;
}
.t-demo-auto-complete__base .t-button svg {
  font-size: 20px;
}
</style>

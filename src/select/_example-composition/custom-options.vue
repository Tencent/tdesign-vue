<template>
  <t-space>
    <!-- 方式一：使用 options 自定义下拉选项内容 -->
    <t-select
      v-model="value1"
      :options="optionsData"
      :popupProps="{ overlayClassName: 'tdesign-demo-select__overlay-option' }"
      placeholder="请选择"
      style="width: 300px"
    />
    <br /><br />

    <!-- 方式二：使用插槽自定义下拉选项内容 -->
    <t-select
      v-model="value2"
      placeholder="请选择"
      :popupProps="{ overlayClassName: 'tdesign-demo-select__overlay-option' }"
      style="width: 300px"
    >
      <t-option v-for="item in options" :value="item.value" :label="item.label" :key="item.value">
        <div class="tdesign-demo__user-option">
          <img src="https://tdesign.gtimg.com/site/avatar.jpg" />
          <div class="tdesign-demo__user-option-info">
            <div>{{ item.label }}</div>
            <div class="tdesign-demo__user-option-desc">{{ item.description }}</div>
          </div>
        </div>
      </t-option>
    </t-select>
  </t-space>
</template>

<script setup lang="jsx">
import { ref, computed } from 'vue';

const value1 = ref('');
const value2 = ref('');
const options = ref([
  {
    label: '用户一',
    value: '1',
    description: '这是一段用户描述信息，可自定义内容',
  },
  {
    label: '用户二',
    value: '2',
    description: '这是一段用户描述信息，可自定义内容',
  },
  {
    label: '用户三',
    value: '3',
    description: '这是一段用户描述信息，可自定义内容',
  },
  {
    label: '用户四',
    value: '4',
    description: '这是一段用户描述信息，可自定义内容',
  },
  {
    label: '用户五',
    value: '5',
    description: '这是一段用户描述信息，可自定义内容',
  },
  {
    label: '用户六',
    value: '6',
    description: '这是一段用户描述信息，可自定义内容',
  },
  {
    label: '用户七',
    value: '7',
    description: '这是一段用户描述信息，可自定义内容',
  },
  {
    label: '用户八',
    value: '8',
    description: '这是一段用户描述信息，可自定义内容',
  },
  {
    label: '用户九',
    value: '9',
    description: '这是一段用户描述信息，可自定义内容',
  },
]);
const optionRender = (h, option) => (
  <div class="tdesign-demo__user-option">
    <img src="https://tdesign.gtimg.com/site/avatar.jpg" />
    <div class="tdesign-demo__user-option-info">
      <div>{option.label}</div>
      <div class="tdesign-demo__user-option-desc">{option.description}</div>
    </div>
  </div>
);
const optionsData = computed(() => options.value.map((item) => ({
  ...item,
  // options 自定义下拉选项关键代码
  content: (h) => optionRender(h, item),
})));
</script>

<style>
.tdesign-demo__user-option {
  display: flex;
}

.tdesign-demo__user-option > img {
  max-width: 40px;
  max-height: 40px;
  border-radius: 50%;
}

.tdesign-demo__user-option-desc {
  font-size: 14px;
  color: var(--td-text-color-secondary);
}

.tdesign-demo__user-option-info {
  margin-left: 16px;
}

.tdesign-demo-select__overlay-option .t-select-option {
  height: 100%;
  padding: 8px;
}
</style>

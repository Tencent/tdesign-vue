<template>
  <div>
    <t-select-input
      :value="selectValue"
      :popup-visible="popupVisible"
      placeholder="请输入任意关键词"
      allow-input
      clearable
      style="width: 300px"
      @input-change="onInputChange"
      @popup-visible-change="onPopupVisibleChange"
    >
      <template #panel>
        <ul class="tdesign-demo__selet-input-ul-autocomplete">
          <li v-for="item in options" :key="item" @click="() => onOptionClick(item)">
            <img src="/favicon.ico" /> {{ item }}
          </li>
        </ul>
      </template>
      <template #suffixIcon><search-icon /></template>
    </t-select-input>
  </div>
</template>
<script>
import { SearchIcon } from 'tdesign-icons-vue';

export default {
  components: {
    SearchIcon,
  },
  data() {
    return {
      selectValue: '',
      popupVisible: false,
      options: ['Student A', 'Student B', 'Student C', 'Student D', 'Student E', 'Student F'],
    };
  },
  methods: {
    onOptionClick(item) {
      this.selectValue = item;
      this.popupVisible = false;
    },
    onInputChange(keyword) {
      this.selectValue = keyword;
      this.options = new Array(5).fill(null).map((t, index) => `${keyword} Student ${index}`);
    },
    onPopupVisibleChange(val) {
      this.popupVisible = val;
    },
  },
};
</script>
<style>
.tdesign-demo__selet-input-ul-autocomplete,
.tdesign-demo__selet-input-ul-autocomplete > li {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tdesign-demo__selet-input-ul-autocomplete > li {
  line-height: 40px;
  min-width: 200px;
  padding: 0 8px;
}

.tdesign-demo__selet-input-ul-autocomplete > li:hover {
  background-color: var(--td-bg-color-container-hover);
}

.tdesign-demo__selet-input-ul-autocomplete > li > img {
  max-width: 20px;
  max-height: 20px;
  vertical-align: middle;
  margin-right: 8px;
}
</style>

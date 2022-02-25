<template>
  <div>
    <t-select-input
      :value="selectValue"
      :popup-visible="popupVisible"
      :suffix-icon="suffixIconRender"
      placeholder="Please Select"
      borderless
      clearable
      @popup-visible-change="onPopupVisibleChange"
      @clear="onClear"
    >
      <template #panel>
        <ul class="tdesign-demo__select-input-ul-borderless">
          <li v-for="item in options" :key="item.value" @click="() => onOptionClick(item)">
            <img src="https://tdesign.gtimg.com/site/avatar.jpg" /> {{ item.label }}
          </li>
        </ul>
      </template>
    </t-select-input>
  </div>
</template>
<script lang="jsx">
export default {};
</script>
<style>
.tdesign-demo__select-input-ul-borderless,
.tdesign-demo__select-input-ul-borderless > li {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tdesign-demo__select-input-ul-borderless > li {
  line-height: 40px;
  min-width: 200px;
  padding: 0 8px;
}

.tdesign-demo__select-input-ul-borderless > li:hover {
  background-color: var(--td-bg-color-container-hover);
}

.tdesign-demo__select-input-ul-borderless > li > img {
  max-width: 20px;
  max-height: 20px;
  vertical-align: middle;
  margin-right: 8px;
}
</style>

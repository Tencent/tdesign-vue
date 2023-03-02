<template>
  <t-sticky-tool :offset="['10%', '10px']" placement="right-center" :popupProps="{ placement: 'right' }" :width="100">
    <t-sticky-item label="添加" popup="666">
      <add-icon slot="icon" />
    </t-sticky-item>
    <t-sticky-item
      label="搜索"
      :icon="renderIcon"
      trigger="click"
      :popup="renderPopup"
      :popupProps="{ placement: 'bottom' }"
    ></t-sticky-item>
    <t-sticky-item :label="renderLabel" :icon="renderIcon"></t-sticky-item>
  </t-sticky-tool>
</template>

<script lang="jsx">
import { AddIcon, SearchIcon } from 'tdesign-icons-vue';

export default {
  components: {
    AddIcon,
  },
  methods: {
    renderIcon() {
      return <SearchIcon />;
    },
    renderLabel() {
      return <div style="color: red">搜索</div>;
    },
    renderPopup() {
      return <img alt="TDesign Logo" width="200" src="https://tdesign.gtimg.com/site/TDesign.png"></img>;
    },
    handleClick() {
      console.log(123);
    },
  },
};
</script>

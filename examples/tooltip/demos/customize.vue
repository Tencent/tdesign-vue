<template>
  <div class="tooltip">
    <t-tooltip content="文字提示仅展示文本内容" :overlayStyle="{ background: '#35CD35' }">
      <t-button>改变背景颜色</t-button>
    </t-tooltip>
    <t-tooltip content="文字提示仅展示文本内容" overlayClassName="custom-tooltip">
      <t-button>改变文字颜色</t-button>
    </t-tooltip>
    <t-tooltip content="文字提示仅展示文本内容" :overlayStyle="{ background: '#FF3E00', color: '#FFAA00' }">
      <t-button>支持class和style方式改变样式</t-button>
    </t-tooltip>
  </div>
</template>
<style>
.custom-tooltip {
	color: #0052D9 !important;
}
</style>

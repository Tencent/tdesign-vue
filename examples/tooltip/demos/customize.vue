<template>
  <div class="tooltip">
    <t-tooltip content="文字提示仅展示文本内容" theme="Tblue" :visibleArrow="true">
      <t-button>Tblue</t-button>
    </t-tooltip>
    <t-tooltip content="文字提示仅展示文本" theme="Tgreen" :visibleArrow="true">
      <t-button>Tgreen</t-button>
    </t-tooltip>
    <t-tooltip content="文字提示仅展示文本内容" theme="Tred" :visibleArrow="true">
      <t-button>Tred</t-button>
    </t-tooltip>
    <t-tooltip content="文字提示仅展示文本内容" theme="Torange" :visibleArrow="true">
      <t-button>Torange</t-button>
    </t-tooltip>
    <t-tooltip content="文字提示仅展示文本内容" theme="#2db7f5" :visibleArrow="true">
      <t-button>自定义主题颜色</t-button>
    </t-tooltip>
  </div>
</template>
<style>
.tooltip {
  display: flex;
}
.tooltip .t-button {
  margin-right: 10px;
}
</style>

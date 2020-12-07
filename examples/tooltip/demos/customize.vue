<template>
  <div class="tooltip">
    <t-tooltip content="文字提示仅展示文本内容" theme="primary" :visibleArrow="true">
      <t-button>primary</t-button>
    </t-tooltip>
    <t-tooltip content="文字提示仅展示文本" theme="success" :visibleArrow="true">
      <t-button>success</t-button>
    </t-tooltip>
    <t-tooltip content="文字提示仅展示文本内容" theme="danger" :visibleArrow="true">
      <t-button>danger</t-button>
    </t-tooltip>
    <t-tooltip content="文字提示仅展示文本内容" theme="warning" :visibleArrow="true">
      <t-button>warning</t-button>
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

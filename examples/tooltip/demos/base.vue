<template>
  <div class="tdesign-tooltip-placement">
    <t-tooltip
      class="placement-top"
      content="文字提示仅展示文本内容"
      placement="top"
      :overlayStyle="{ width: '170px' }"
      showArrow
    >
      <t-button variant="outline">top</t-button>
    </t-tooltip>
    <t-tooltip
      class="placement-top-left"
      content="文字提示仅展示文本内容"
      placement="top-left"
      :overlayStyle="{ width: '170px' }"
      showArrow
    >
      <t-button variant="outline">top-left</t-button>
    </t-tooltip>
    <t-tooltip
      class="placement-top-right"
      content="文字提示仅展示文本内容"
      :overlayStyle="{ width: '170px' }"
      placement="top-right"
      showArrow
    >
      <t-button variant="outline">top-right</t-button>
    </t-tooltip>
    <t-tooltip
      class="placement-bottom"
      content="文字提示仅展示文本内容"
      :overlayStyle="{ width: '170px' }"
      placement="bottom"
      showArrow
    >
      <t-button variant="outline">bottom</t-button>
    </t-tooltip>
    <t-tooltip
      class="placement-bottom-left"
      content="文字提示仅展示文本内容"
      placement="bottom-left"
      :overlayStyle="{ width: '170px' }"
      showArrow
    >
      <t-button variant="outline">bottom-left</t-button>
    </t-tooltip>
    <t-tooltip
      class="placement-bottom-right"
      content="文字提示仅展示文本内容"
      :overlayStyle="{ width: '170px' }"
      placement="bottom-right"
      showArrow
    >
      <t-button variant="outline">bottom-right</t-button>
    </t-tooltip>
    <t-tooltip
      class="placement-left"
      content="文字提示仅展示文本内容"
      :overlayStyle="{ width: '170px' }"
      placement="left"
      showArrow
    >
      <t-button variant="outline">left</t-button>
    </t-tooltip>
    <t-tooltip
      class="placement-left-top"
      content="文字提示仅展示文本内容"
      :overlayStyle="{ width: '170px' }"
      placement="left-top"
      showArrow
    >
      <t-button variant="outline">left-top</t-button>
    </t-tooltip>
    <t-tooltip
      class="placement-left-bottom"
      content="文字提示仅展示文本内容"
      :overlayStyle="{ width: '170px' }"
      placement="left-bottom"
      showArrow
    >
      <t-button variant="outline">left-bottom</t-button>
    </t-tooltip>
    <t-tooltip
      class="placement-right"
      content="文字提示仅展示文本内容"
      :overlayStyle="{ width: '170px' }"
      placement="right"
      showArrow
    >
      <t-button variant="outline">right</t-button>
    </t-tooltip>
    <t-tooltip
      class="placement-right-top"
      content="文字提示仅展示文本内容"
      :overlayStyle="{ width: '170px' }"
      placement="right-top"
      showArrow
    >
      <t-button variant="outline">right-top</t-button>
    </t-tooltip>
    <t-tooltip
      class="placement-right-bottom"
      content="文字提示仅展示文本内容"
      :overlayStyle="{ width: '170px' }"
      placement="right-bottom"
      showArrow
    >
      <t-button variant="outline">right-bottom</t-button>
    </t-tooltip>
  </div>
</template>
<style lange="less" scoped>
.tdesign-tooltip-placement {
  margin: 0 auto;
  width: 500px;
  height: 260px;
  position: relative;
}
.placement-top {
  position: absolute;
  top: 0;
  left: 42%;
}
.placement-top-left {
  position: absolute;
  top: 0;
  left: 70px;
}
.placement-top-right {
  position: absolute;
  top: 0;
  right: 70px;
}
.placement-bottom {
  position: absolute;
  bottom: 0;
  left: 42%;
}
.placement-bottom-left {
  position: absolute;
  bottom: 0;
  left: 70px;
  width: 120px;
}
.placement-bottom-right {
  position: absolute;
  bottom: 0;
  right: 70px;
}
.placement-left {
  position: absolute;
  left: 0;
  top: 42%;
}
.placement-left-top {
  position: absolute;
  left: 0;
  top: 50px;
}
.placement-left-bottom {
  position: absolute;
  left: 0;
  bottom: 50px;
}
.placement-right {
  position: absolute;
  right: 0;
  top: 42%;
}
.placement-right-top {
  position: absolute;
  right: 0;
  top: 50px;
}
.placement-right-bottom {
  position: absolute;
  right: 0;
  bottom: 50px;
}
</style>

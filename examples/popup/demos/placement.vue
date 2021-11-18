<template>
  <div class="container">
    <t-popup
      class="placement-top"
      content="top"
      placement="top"
      showArrow
      destroyOnClose
    >
      <t-button variant='outline'>top</t-button>
    </t-popup>
    <t-popup
      class="placement-top-left"
      content="top-left"
      placement="top-left"
      showArrow
      destroyOnClose
    >
      <t-button variant='outline'>top-left</t-button>
    </t-popup>
    <t-popup
      class="placement-top-right"
      content="top-right"
      placement="top-right"
      showArrow
      destroyOnClose
    >
      <t-button variant='outline'>top-right</t-button>
    </t-popup>
    <t-popup
      class="placement-bottom"
      content="bottom"
      placement="bottom"
      showArrow
      destroyOnClose
    >
      <t-button variant='outline'>bottom</t-button>
    </t-popup>
    <t-popup
      class="placement-bottom-left"
      content="bottom-left"
      placement="bottom-left"
      showArrow
      destroyOnClose
    >
      <t-button variant='outline'>bottom-left</t-button>
    </t-popup>
    <t-popup
      class="placement-bottom-right"
      content="bottom-right"
      placement="bottom-right"
      showArrow
      destroyOnClose
    >
      <t-button variant='outline'>bottom-right</t-button>
    </t-popup>
    <t-popup
      class="placement-left"
      content="left"
      placement="left"
      showArrow
      destroyOnClose
    >
      <t-button variant='outline'>left</t-button>
    </t-popup>
    <t-popup
      class="placement-left-top"
      content="left-top"
      placement="left-top"
      showArrow
      destroyOnClose
    >
      <t-button variant='outline'>left-top</t-button>
    </t-popup>
    <t-popup
      class="placement-left-bottom"
      content="left-bottom"
      placement="left-bottom"
      showArrow
      destroyOnClose
    >
      <t-button variant='outline'>left-bottom</t-button>
    </t-popup>
    <t-popup
      class="placement-right"
      content="right"
      placement="right"
      showArrow
      destroyOnClose
    >
      <t-button variant='outline'>right</t-button>
    </t-popup>
    <t-popup
      class="placement-right-top"
      content="right-top"
      placement="right-top"
      showArrow
      destroyOnClose
    >
      <t-button variant='outline'>right-top</t-button>
    </t-popup>
    <t-popup
      class="placement-right-bottom"
      content="right-bottom"
      placement="right-bottom"
      showArrow
      destroyOnClose
    >
      <t-button variant='outline'>right-bottom</t-button>
    </t-popup>
  </div>
</template>

<style scoped>
.container {
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
  left: -0;
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

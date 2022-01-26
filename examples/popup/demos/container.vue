<template>
  <div>
    <div class='t-popup-demo-block'>
      <t-popup
        id="myPopup"
        content="触发元素的父元素是组件根元素，通过 CSSSelector 定义"
        attach="#myPopup"
        :overlayStyle="triggerElem => ({ width: `${triggerElem.offsetWidth}px`, whiteSpace: 'initial' })"
      >
        <t-button variant='outline'>父元素为组件本身</t-button>
      </t-popup>
    </div>
    <div class='t-popup-demo-block' id='second-popup'>
      <t-popup
        content="触发元素的父元素是组件跟元素，通过 Funnction 定义"
        :attach="getAttach"
      >
        <t-button variant='outline'>父元素为其他元素</t-button>
      </t-popup>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    getAttach: () => document.querySelector('#second-popup'),
  },
};
</script>
<style lang="less" scoped>
.t-popup-demo-block {
  width: 300px;
  margin-right: 30px;
  display: inline-block;
  > :v-deep * {
    overflow: initial;
  }
}
</style>

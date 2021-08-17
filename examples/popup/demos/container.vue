<template>
  <div>
    <div class='t-popup-demo-block'>
      <t-popup
        id="myPopup"
        content="触发元素的父元素是组件跟元素，通过 CSSSelector 定义"
        trigger="click"
        attach="#myPopup"
      >
        <t-button variant='outline'>点击查看我的父元素(CSSSelector)</t-button>
      </t-popup>
    </div>
    <div class='t-popup-demo-block'>
      <t-popup
        id='second-popup'
        content="触发元素的父元素是组件跟元素，通过 Funnction 定义"
        trigger="click"
        :attach="getAttach"
      >
        <t-button variant='outline'>点击查看我的父元素(Function)</t-button>
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
<style scoped>
.t-popup-demo-block {
  width: 300px;
  margin-right: 30px;
  display: inline-block;
}
</style>

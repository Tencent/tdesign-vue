<template>
  <div>
    <t-badge shape="circle" count="2">
      <div class="badge-block"></div>
    </t-badge>
    <t-badge shape="round" count="99">
      <div class="badge-block"></div>
    </t-badge>
  </div>
</template>

<style scoped>
.badge-block {
  width: 40px;
  height: 40px;
  background: #EEEEEE;
  border: 1px solid #DCDCDC;
  box-sizing: border-box;
  border-radius: 3px;
}

.t-badge + .t-badge {
  margin-left: 32px;
}
</style>

<template>
  <div style="width: 100%">
    <t-popup trigger="hover">
      <t-button>Hover me</t-button>
      <template #content>
        <t-qrcode value="https://tdesign.tencent.com/" :size="136" borderless />
      </template>
    </t-popup>
  </div>
</template>

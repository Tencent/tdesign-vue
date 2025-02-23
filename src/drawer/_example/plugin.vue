<template>
  <t-space break-line>
    <t-button theme="primary" @click="onDrawerPlugin">DrawerPlugin</t-button>
  </t-space>
</template>
<script>
import { DrawerPlugin } from 'tdesign-vue';

export default {
  methods: {
    onDrawerPlugin() {
      const confirmDia = DrawerPlugin({
        header: 'Drawer-Confirm-Plugin',
        body: '你确定要删除么?',
        confirmBtn: '确定',
        cancelBtn: '取消',
        onConfirm: ({ e }) => {
          console.log('confirm button has been clicked!');
          console.log('e: ', e);
          confirmDia.hide();
        },
        onClose: ({ e, trigger }) => {
          console.log('e: ', e);
          console.log('trigger: ', trigger);
          confirmDia.hide();
        },
      });
    },
  },
};
</script>

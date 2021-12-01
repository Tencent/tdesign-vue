<template>
  <div>
    <t-button @click="visible = true">异步加载类按钮</t-button>
    <t-dialog
      :visible.sync="visible"
      header="保存"
      body="保存中，请稍后"
      :confirmBtn="{
        content: '保存中...',
        theme: 'primary',
        loading: true
      }"
      :onConfirm="onConfirm"
      :onClose="close"
    >
    </t-dialog>

  </div>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    close() {
      this.visible = false;
    },
    onConfirm() {
      console.log('处理中...');
      this.visible = false;
    },
  },

};
</script>

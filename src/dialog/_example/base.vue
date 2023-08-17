<template>
  <div>
    <t-button theme="primary" @click="visible = true">基础确认对话框</t-button>
    <!-- :onClose="onClose" 和 @close="onClose" 等效 -->
    <!-- :onConfirm="onConfirm" 和 @confirm="onConfirm" 等效 -->
    <!-- :onCancel="onCancel" 和 @cancel="onCancel" 等效 -->
    <!-- :onEscKeydown="onEscKeydown" 和 @escKeydown="onEscKeydown" 等效 -->
    <t-dialog
      header="对话框标题"
      body="对话框内容"
      :visible.sync="visible"
      @confirm="onConfirm"
      :confirmOnEnter="true"
      :onConfirm="onConfirmAnother"
      :onCancel="onCancel"
      :onEscKeydown="onKeydownEsc"
      :onCloseBtnClick="onClickCloseBtn"
      :onOverlayClick="onClickOverlay"
      :onClose="close"
    >
      <t-button theme="primary" @click="visible1 = true">弹窗二</t-button>
    </t-dialog>
    <t-dialog header="对话框标题二" body="对话框内容二" :visible.sync="visible1" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
      visible1: false,
    };
  },
  mounted() {
    // 监听键盘事件
    document.addEventListener('keyup', this.handleKeyup);
  },
  beforeDestroy() {
    // 在组件销毁前移除键盘事件监听
    document.removeEventListener('keyup', this.handleKeyup);
  },
  methods: {
    onConfirm(context) {
      console.log('@confirm与onConfirm任选一种方式即可，其他几个事件类似', context);
      this.visible = false;
    },
    onConfirmAnother(context) {
      console.log('点击了确认按钮', context);
    },
    close(context) {
      console.log('关闭弹窗，点击关闭按钮、按下ESC、点击蒙层等触发', context);
    },
    onCancel(context) {
      console.log('点击了取消按钮', context);
    },
    handleKeyup(event) {
      console.log('初始默认显示弹窗时，按esc走监听事件', event);
      if (event.keyCode === 27) {
        this.visible = false;
      }
    },
    onKeydownEsc(context) {
      console.log('按下了ESC', context);
    },
    onClickCloseBtn(context) {
      console.log('点击了关闭按钮', context);
    },
    onClickOverlay(context) {
      console.log('点击了蒙层', context);
    },
  },
};
</script>

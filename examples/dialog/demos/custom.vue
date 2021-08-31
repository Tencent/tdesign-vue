<template>
  <div>
    <p>弹窗内容自定义</p><br>
    <div>
      <t-button theme="primary" @click="bodyVisible1 = true">隐藏标题</t-button>
      <t-button theme="primary" @click="bodyVisible2 = true">渲染函数定义内容</t-button>
      <t-button theme="primary" @click="bodyVisible3 = true">插槽方式定义内容</t-button>
      <t-dialog :header="false" body="对话框内容" :visible="bodyVisible1" :onClose="bodyClose1" :onClickConfirm="bodyClose1" >
        <div slot="body">
          <div>不需要标题的内容</div>
          <div>我是内容</div>
          <div>我是内容</div>
          <div>我是内容</div>
          <div>我是内容</div>
        </div>
      </t-dialog>

      <t-dialog
        :visible="bodyVisible2"
        header="标题"
        :body="renderDialog2Body"
        :onClose="bodyClose2" :onClickConfirm="bodyClose2"
      >
        <div slot="body">被渲染函数覆盖的插槽内容</div>
      </t-dialog>

      <t-dialog header="对话框标题" :visible="bodyVisible3" :onClose="bodyClose3" :onClickConfirm="bodyClose3" >
        <div slot="body">
          <div>我是内容</div>
          <div>我是内容</div>
          <div>我是内容</div>
          <div>我是内容</div>
          <div>我是内容</div>
          <div>我是内容</div>
        </div>
      </t-dialog>
    </div>
    <br>
    <p>操作按钮自定义</p><br>
    <p>底部按钮有两个控制属性：confirmBtn 和 cancelBtn。属性类型有多种：string | ButtonProps | TNode。也可以通过 footer 来自定义控制</p><br>
    <t-button theme="primary" @click="visible1 = true">按钮文字</t-button>
    <t-button theme="primary" @click="visible2 = true">按钮属性</t-button>
    <t-button theme="primary" @click="visible3 = true">自定义组件</t-button>
    <t-button theme="primary" @click="visible4 = true">隐藏底部</t-button>
    <t-dialog
      :visible.sync="visible1"
      header="提示"
      body="自定义底部按钮，直接传入文字"
      confirmBtn="前往支付"
      cancelBtn="关闭"
      :onConfirm="onConfirm"
      :onClose="close1"
    >
    </t-dialog>

    <t-dialog
      :visible="visible2"
      header="提示"
      body="自定义底部按钮，传入 ButttonProps"
      :confirmBtn="{
        content: '前往购物车',
        variant: 'base',

      }"
      :cancelBtn="{
        content: '我知道了',
        variant: 'outline',
      }"
      :onClose="close2"
    >
    </t-dialog>

    <t-dialog
      :visible="visible3"
      header="提示"
      body="自定义底部按钮，传入自定义组件"
      :confirmBtn="getConfirmBtn"
      cancelBtn="取消"
      :onClose="close3"
    >
    </t-dialog>
    <t-dialog
      :visible="visible4"
      header="提示"
      body="对话框内容"
      :footer="false"
      :onClose="close4" :onClickConfirm="close4"
    >
      <div slot="body">
        <div>不需要底部按钮的内容</div>
        <div>我是内容</div>
        <div>我是内容</div>
        <div>我是内容</div>
        <div>我是内容</div>
      </div>
    </t-dialog>
  </div>
</template>
<script>

export default {
  data() {
    return {
      visible1: false,
      visible2: false,
      visible3: false,
      visible4: false,
      bodyVisible1: false,
      bodyVisible2: false,
      bodyVisible3: false,
    };
  },
  methods: {
    getConfirmBtn() {
      return <t-button theme='primary' disabled>我知道了</t-button>;
    },
    close1() {
      this.visible1 = false;
    },
    close2() {
      this.visible2 = false;
    },
    close3() {
      this.visible3 = false;
    },
    close4() {
      this.visible4 = false;
    },
    onConfirm() {
      this.visible1 = false;
      alert('跳转支付~');
    },

    renderDialog2Body() {
      return this.$createElement('div', [this.$createElement('h1', '参数传递优先于插槽内容'), '这是渲染函数输出结果']);
    },

    bodyClose1() {
      this.bodyVisible1 = false;
    },
    bodyClose2() {
      this.bodyVisible2 = false;
    },
    bodyClose3() {
      this.bodyVisible3 = false;
    },
  },
};
</script>
<style scoped>
.t-button {
  margin-right: 20px;
}
</style>

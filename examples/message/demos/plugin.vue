<template>
  <div>
    <p>组件实例方法调用</p>
    <br>
    <div class='t-demo-message-duration'>
      <t-button @click="$message.info('用户表示普通操作信息提示', 1000)">info</t-button>
      <t-button @click="$message.success({ content: '用户表示操作顺利达成', duration: 2000 })">success</t-button>
      <t-button @click="$message('warning', '用户表示操作引起一定后果')">warning</t-button>
      <t-button @click="$message('error', { content: '用户表示操作引起严重的后果', duration: 4000 })">error</t-button>
      <t-button @click="$message.question('用于帮助用户操作的信息提示', 5000)">question</t-button>
      <!-- 0 表示永远不自动消失 -->
      <t-button @click="$message.loading('用于表示操作正在生效的过程中', 0)">loading</t-button>
    </div>
    <br><br>

    <p>插件方法调用</p>
    <br>
    <div class='t-demo-message-theme'>
      <t-button @click="MessagePlugin.info('用户表示普通操作信息提示')">info</t-button>
      <t-button @click="MessagePlugin('success', '用户表示操作顺利达成')">success</t-button>
      <t-button @click="MessagePlugin('warning', { content: '用户表示操作引起一定后果' })">warning</t-button>
      <t-button @click="MessagePlugin.error({ content: '用户表示操作引起严重的后果' })">error</t-button>
      <t-button @click="MessagePlugin.question('用于帮助用户操作的信息提示')">question</t-button>
      <t-button @click="MessagePlugin.loading('用于表示操作正在生效的过程中')">loading</t-button>
    </div>
    <br><br>
  </div>
</template>

<script>
import { MessagePlugin } from '@tencent/tdesign-vue';

export default {
  data() {
    return {
      MessagePlugin,
    };
  },
  methods: {
    closeBtn(close) {
      return <b class='t-message-close' onClick={close}>x</b>;
    },
    content() {
      return <div>操作有误，<a href='#'>前往查看</a></div>;
    },
  },
};
</script>

<style scoped>
  .t-button + .t-button {
    margin-left: 16px;
  }
</style>

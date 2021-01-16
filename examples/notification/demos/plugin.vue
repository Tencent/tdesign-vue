<template>
  <div>
    <p>组件内调用-主函数：this.$notify('info', { title: '标题名称', content: '用户表示普通操作的消息通知' })</p>
    <br>
    <div>
      <t-button @click="$notify('info', { title: '标题名称',content: '用户表示普通操作的消息通知' })">info</t-button>
      <t-button @click="$notify('success', { title: '标题名称',content: '用户表示操作顺利的消息通知' })">success</t-button>
      <t-button @click="$notify('warning', { title: '标题名称',content: '用户表示操作引起一定后果的消息通知' })">warning</t-button>
      <t-button @click="$notify('error', { title: '标题名称',content: '用户表示操作引起严重后果的消息通知' })">error</t-button>
    </div>
    <br><br>

    <p>组件内调用-主题函数：this.$notify.info({ title: '标题名称', content: '用户表示普通操作的消息通知' })</p>
    <br>
    <div>
      <t-button @click="$notify.info({ title: '标题名称',content: '用户表示普通操作的消息通知' })">info</t-button>
      <t-button @click="$notify.success({ title: '标题名称',content: '用户表示操作顺利的消息通知' })">success</t-button>
      <t-button @click="$notify.warning({ title: '标题名称',content: '用户表示操作引起一定后果的消息通知' })">warning</t-button>
      <t-button @click="$notify.error({ title: '标题名称',content: '用户表示操作引起严重后果的消息通知' })">error</t-button>
    </div>
    <br><br>

    <p>组件内调用-时间设置：this.$notify.info({ title: '标题名称', content: '用户表示普通操作的消息通知', duration: 1000 })</p>
    <br>
    <div>
      <t-button @click="$notify.info({ title: '标题名称',content: '用户表示普通操作的消息通知', duration: 1000 })">1000s</t-button>
      <t-button @click="$notify.success({ title: '标题名称',content: '用户表示操作顺利的消息通知', duration: 2000 })">2000s</t-button>
      <t-button @click="$notify.warning({ title: '标题名称',content: '用户表示操作引起一定后果的消息通知' })">默认时长</t-button>
      <t-button @click="$notify.error({ title: '标题名称',content: '用户表示操作引起严重后果的消息通知', duration: 0, closeBtn: true })">永久显示</t-button>
    </div>
    <br><br>


    <p>组件内调用-自定义内容：this.$notify.info({ title: '标题名称', content: '用户表示普通操作信息提示' })</p>
    <br>
    <div>
      <t-button @click="$notify.info({ title: '标题名称', content: '用户表示普通操作信息提示' })">普通信息</t-button>
      <t-button @click="$notify.success({ title: '标题名称', content: '用户表示操作顺利达成', closeBtn: true })">显示关闭按钮</t-button>
      <t-button @click="$notify.info({ title: '标题名称', content: '用于帮助用户操作的信息提示', closeBtn })">自定义关闭按钮</t-button>
      <t-button @click="$notify.error({ title: '标题名称', content })">自定义内容</t-button>
      <t-button @click="$notify.error({ title: '标题名称', content: '用户表示操作引起严重的后果', footer })">自定义底部内容</t-button>
    </div>
    <br><br>

    <p>按需引入：NotifyPlugin.info({ content: '用户表示普通操作信息提示', duration: 1000 })</p>
    <br>
    <div class='t-demo-message-theme'>
      <t-button @click="NotifyPlugin.info({ title: '标题', content: '用户表示普通操作信息提示' })">info</t-button>
      <t-button @click="NotifyPlugin.success({ title: '标题', content: '用户表示操作顺利达成' })">success</t-button>
      <t-button @click="NotifyPlugin.warning({ title: '标题', content: '用户表示操作引起一定后果' })">warning</t-button>
      <t-button @click="NotifyPlugin.error({ title: '标题', content: '用户表示操作引起严重的后果' })">error</t-button>
    </div>
    <br><br>

  </div>
</template>

<script>
import { NotifyPlugin } from '@/src/notification';
export default {
  data() {
    return {
      NotifyPlugin,
    };
  },
  methods: {
    closeBtn(close) {
      return <b class='t-message-close' onClick={close}>x</b>;
    },
    content() {
      return <div>操作有误，<a href='#'>前往查看</a></div>;
    },
    footer() {
      return (<div class="t-notification__detail">
        <span class="t-notification__detail--item t-is-active">查看详情</span>
      </div>);
    },
  },
};
</script>

<style scoped>
  .t-button + .t-button {
    margin-left: 16px;
  }
</style>

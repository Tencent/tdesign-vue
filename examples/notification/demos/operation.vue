<template>
  <div>
    <t-notification
      theme="info"
      title="超出的文本省略号显示"
      :content="content"
      :footer="footer"
    />
    <t-notification theme="info" title="自定义底部" content="使用 props function 自定义底部内容" :footer="footer2" />
    <t-notification theme="info" :title="title" content="1. 使用 props function 自定义标题；2. 使用插槽自定义底部内容">
      <div slot="footer" class="t-notification__detail">
        <span class="t-notification__detail--item">知道了</span>
      </div>
    </t-notification>
    <t-notification theme="info" content="1. 使用插槽自定义标题 2. 使用插槽自定义底部内容" v-if="visible">
      <div slot='title'>自定义标题 <small>我是副标题</small></div>
      <div slot="footer" class="t-notification__detail">
        <span class="t-notification__detail--item">重启</span>
        <span class="t-notification__detail--item t-is-active" @click="remind">稍后提醒我(10s)</span>
      </div>
    </t-notification>
    <t-notification theme="info" title="自定义内容">
      <div slot='content'>使用插槽自定义内容</div>
      <div slot="footer" class="t-notification__detail">
        <span class="t-notification__detail--item">重启</span>
        <t-dropdown :options="options">
          <t-button variant="text" class="tdesign-demo-dropdown"
          >更多 <t-icon name="chevron-down" class="tdesign-demo-arrow"
          /></t-button>
        </t-dropdown>
      </div>
    </t-notification>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: true,
      options: [
        {
          text: '操作一',
          id: 1,
        },
        {
          text: '操作二',
          id: 2,
        },
        {
          text: '操作三',
          id: 3,
        },
        {
          text: '操作四',
          id: 4,
        },
      ],
    };
  },
  methods: {
    footer() {
      return (
        <div slot="footer" class="t-notification__detail">
          <span class="t-notification__detail--item t-is-active">查看详情</span>
        </div>
      );
    },
    footer2() {
      return (
        <div slot="footer" class="t-notification__detail">
          <span class="t-notification__detail--item t-is-active">查看详情</span>
        </div>
      );
    },
    content() {
      return '文案不限长度，但是展示最大显示三行折行的末尾显示折行末尾显示折行末尾显示折行末尾显示折行末尾显示折行折行末尾显示折行折行末尾显示折行末尾显示折行折行末尾';
    },
    title() {
      return (
        <div>自定义标题 <small>我是副标题</small></div>
      );
    },
    remind() {
      this.visible = false;
      setTimeout(() => {
        this.visible = true;
      }, 10000);
    },
  },
};
</script>

<style scoped>
.t-notification + .t-notification {
  margin-top: 24px;
}
</style>

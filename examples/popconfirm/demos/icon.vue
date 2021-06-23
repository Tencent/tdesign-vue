<template>
  <div class="popconfirm-demo">
    <div class="tdesign-demo-block">
      <div class="demo-item">
        <t-popconfirm content="基础气泡确认框文案示意文字按钮">
          <t-button>默认</t-button>
        </t-popconfirm>
      </div>

      <div class="demo-item">
        <t-popconfirm content="事件通知类型偏向于提示">
          <t-icon name="browse" style="color: #0052d9" slot='icon'/>
          <t-button theme="primary">插槽定义ICON</t-button>
        </t-popconfirm>
      </div>

      <div class="demo-item">
        <t-popconfirm content="事件通知类型偏向于警示" :icon='customIcon'>
          <t-button theme="primary">属性定义ICON</t-button>
        </t-popconfirm>
      </div>

      <div class="demo-item">
        <t-popconfirm theme="warning" content="事件通知类型偏向于提示">
          <t-button theme="danger" variant="outline">警告</t-button>
        </t-popconfirm>
      </div>

      <div class="demo-item">
        <t-popconfirm theme="danger" content="事件通知类型偏向于高危提醒">
          <t-button theme="danger">危险</t-button>
        </t-popconfirm>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    customIcon() {
      return (<t-icon name='browse' style="margin-right: 8px"/>);
    },
  },
};
</script>


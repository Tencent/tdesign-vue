<template>
  <div class="popconfirm-demo">
    <div class="tdesign-demo-block">
      <!-- 使用 props 定义按钮内容 -->
      <t-popconfirm
        theme="default"
        content="您确定要提交吗"
        confirmBtn='确认提交'
        cancelBtn='我再想想'
      >
        <t-button variant="outline">按钮样式（属性-字符串）</t-button>
      </t-popconfirm>

      <!-- 通过透传按钮属性自定义按钮，cancelBtn 和 confirmBtn 值为 null 或 undefined 时表示不显示该按钮 -->
      <t-popconfirm
        theme="default"
        content="您确定要提交吗"
        :confirmBtn="{
          content: '确认提交',
          theme: 'warning'
        }"
        :cancelBtn="{
          content: '我再想想',
          theme: 'default',
          variant: 'outline',
        }"
      >
        <t-button variant="outline">按钮样式（属性-对象）</t-button>
      </t-popconfirm>

      <!-- 使用插槽定义按钮内容 -->
      <t-popconfirm theme="default" content="您确定要提交吗">
        <t-button slot='cancelBtn' style="margin-right:12px">我再想想</t-button>
        <t-button slot='confirmBtn' theme="primary">确定提交</t-button>
        <t-button variant="outline">按钮样式（插槽）</t-button>
      </t-popconfirm>
    </div>
  </div>
</template>

<style scoped>
.popconfirm-demo .tdesign-demo-block {
  display: flex;
  justify-content: space-around;
}
</style>

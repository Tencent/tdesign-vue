<template>
  <div>
    <t-steps :current="1" readonly>
      <t-step-item title="已完成的步骤" content="这里是提示文字"></t-step-item>
      <t-step-item title="进行中的步骤" content="这里是提示文字"></t-step-item>
      <t-step-item title="未进行的步骤" content="这里是提示文字"></t-step-item>
      <t-step-item title="未进行的步骤" content="这里是提示文字"></t-step-item>
    </t-steps>
    <div style="margin: 16px 0"></div>
    <t-steps :current="2" readonly>
      <t-step-item title="已完成的步骤" content="这里是提示文字"></t-step-item>
      <t-step-item title="已完成的步骤" content="这里是提示文字"></t-step-item>
      <t-step-item title="错误的步骤" status="error" content="这里是错误提示文字"></t-step-item>
      <t-step-item title="未进行的步骤" content="这里是提示文字"></t-step-item>
    </t-steps>
  </div>
</template>

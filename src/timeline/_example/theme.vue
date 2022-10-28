<template>
  <div>
    <t-space direction="vertical">
      <t-timeline mode="same">
        <t-timelineItem label="2022-01-01" dotColor="primary"> 已完成的时间 </t-timelineItem>
        <t-timelineItem label="2022-03-01" dotColor="error"> 危险时间 </t-timelineItem>
        <t-timelineItem label="2022-04-01" dotColor="warning"> 告警事件 </t-timelineItem>
        <t-timelineItem label="2022-05-01">默认的时间</t-timelineItem>
        <t-timelineItem label="2022-06-01" dotColor="yellowgreen"> 自定义主题色 </t-timelineItem>
      </t-timeline>
    </t-space>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    handleChange(checkedValue) {
      this.direction = checkedValue;
    },
  },
};
</script>
<style lang="scss" scoped></style>

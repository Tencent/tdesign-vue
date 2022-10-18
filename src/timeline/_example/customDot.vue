<template>
  <div>
    <t-space direction="vertical">
      <t-space>
        <t-radio-group default-value="default" @change="handleChange">
          <t-radio-button value="default">默认样式</t-radio-button>
          <t-radio-button value="dot">Dot样式</t-radio-button>
        </t-radio-group>
      </t-space>
    </t-space>
    <t-timeline mode="same" :theme="docStyle">
      <t-timelineItem label="2022-01-01"
      >事件一
        <loading-icon size="medium" slot="dot" />
      </t-timelineItem>
      <t-timelineItem label="2022-02-01"
      >事件二
        <check-circle-filled-icon size="medium" style="color: red" slot="dot" />
      </t-timelineItem>
      <t-timelineItem label="2022-03-01"
      >事件三
        <check-circle-filled-icon size="medium" style="color: green" slot="dot" />
      </t-timelineItem>
      <t-timelineItem label="2022-04-01"
      >事件四
        <check-circle-filled-icon size="medium" style="color: orange" slot="dot" />
      </t-timelineItem>
    </t-timeline>
  </div>
</template>
<script>
import { LoadingIcon, CloseIcon, CheckCircleFilledIcon } from 'tdesign-icons-vue';

export default {
  components: {
    LoadingIcon,
    CheckCircleFilledIcon,
  },
  data() {
    return {
      docStyle: 'default',
    };
  },
  methods: {
    handleChange(checkedValue) {
      this.docStyle = checkedValue;
    },
  },
};
</script>
<style lang="scss" scoped></style>

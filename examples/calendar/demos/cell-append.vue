<template>
  <t-calendar>
    <div slot="cellAppend" slot-scope="data" v-if="getShow(data)" class="cell-append-demo-outer">
      <t-tag theme="primary" size="small" class="activeTag">{{data.mode == "month" ? '今天' : '本月'}}</t-tag>
    </div>
  </t-calendar>
</template>

<script>
import dayjs from 'dayjs';

export default {
  methods: {
    getShow(data) {
      return data.mode === 'month' ? dayjs().format('YYYY-MM-DD') === data.formattedDate : data.date.getMonth() === new Date().getMonth();
    },
  },
};
</script>

<style lang="less" scoped>
.cell-append-demo-outer {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 16px;
  padding: 0 16px;
}
.activeTag {
  display: block;
  text-align: center;
}
</style>

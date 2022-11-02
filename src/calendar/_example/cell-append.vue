<template>
  <t-calendar>
    <template slot="cellAppend" slot-scope="data">
      <div v-if="getShow(data)" class="cell-append-demo-outer">
        <t-tag theme="primary" size="small" class="activeTag">
          {{ data.mode == 'month' ? '今天' : '本月' }}
        </t-tag>
      </div>
    </template>
  </t-calendar>
</template>

<script>
import dayjs from 'dayjs';

export default {
  methods: {
    getShow(data) {
      return data.mode === 'month'
        ? dayjs().format('YYYY-MM-DD') === data.formattedDate
        : data.date.getMonth() === new Date().getMonth();
    },
  },
};
</script>

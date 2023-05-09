<template>
  <t-space :size="100" breakLine>
    <t-space align="center">
      <t-icon name="chart" class="icon" />
      <t-statistic title="Total Assets" :value="82.76" unit="%" trend="increase" trendPlacement="right" />
    </t-space>

    <t-space align="center">
      <t-statistic title="Total Assets" :value="52.18" unit="%" trend="decrease" />
      <t-icon name="internet" class="icon" />
    </t-space>

    <t-card title="Yesterday traffic" header-bordered>
      <t-space :separator="separator">
        <t-statistic title="Voice duration" :value="789" unit="minute" extra="the day before 9%" />
        <t-statistic title="Total number of voice DAUs" :value="188" color="red">
          <template #extra>
            <t-space>
              the day before
              <t-icon name="arrow-up" style="color: #d54941" />
              9%
            </t-space>
            <t-space>
              last week
              <t-icon name="arrow-down" style="color: #2ba471" />
              9%
            </t-space>
          </template>
        </t-statistic>
        <t-statistic title="Total Assets" :value="52.18" unit="%" trend="decrease" color="green" />
      </t-space>
    </t-card>
  </t-space>
</template>

<script lang="jsx">
export default {
  data() {
    return {
      separator: () => <t-divider layout="vertical" />,
    };
  },
};
</script>
<style>
.icon {
  font-size: 32px;
  color: #0052d9;
  background: #f2f3ffff;
  border-radius: 6px;
  padding: 12px;
}
</style>

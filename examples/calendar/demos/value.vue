<template>
  <div>
    <t-form layout="inline">
      <t-form-item label="自己指定年：">
        <t-input v-model="year" />
      </t-form-item>
      <t-form-item label="自己指定年月：">
        <t-input v-model="month" />
      </t-form-item>
    </t-form>
    <t-calendar :value="value" :year="year" :month="month"></t-calendar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      year: '1998',
      month: '11',
      value: '1998-11-11', // new Date(1998, 10, 11)
    };
  },
};
</script>

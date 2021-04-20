<template>
  <div>
    <t-pagination
      v-model="current"
      :total="100"
      :page-size.sync="pageSize"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      current: 12,
      pageSize: 5,
    };
  },
};
</script>

<template>
  <div>
    <t-pagination
      v-model="current"
      :total="685"
      :page-size.sync="pageSize"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      current: 12,
      pageSize: 10,
    };
  },
};
</script>

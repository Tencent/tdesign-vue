<template>
  <div>
    <t-pagination
      :total="645"
      :page-size.sync="pageSize"
      v-model="current"
      show-jumper
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageSize: 20,
      current: 1,
    };
  },
};
</script>

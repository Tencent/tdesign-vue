<template>
  <div>
    <t-pagination
      :total="645"
      :page-size.sync="pageSize"
      v-model="current"
      @change="onChange"
      @pageSizeChange="onPagesizeChange"
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
  methods: {
    onChange(index, pageInfo) {
      console.log(`转到第${index}页`);
      console.log(pageInfo);
    },
    onPagesizeChange(pageSize, pageInfo) {
      console.log(`${pageSize}`);
      console.log(pageInfo);
    },
  },
};
</script>

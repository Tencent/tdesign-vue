<template>
  <div>
    <t-pagination
      v-model="current"
      :total="49"
      :on-change="onChange"
      @change="onPageChange"
      :page-size="pageSize"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      current: 2,
      pageSize: 10,
      onChange: (index, pageInfo) => {
        console.log('fire on prop');
        console.log(`转到第${index}页`);
        console.log(pageInfo);
      },
    };
  },
  methods: {
    onPageChange(index, pageInfo) {
      console.log(`转到第${index}页`);
      console.log(pageInfo);
    },
  },
};
</script>

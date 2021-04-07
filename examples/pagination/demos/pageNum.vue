<template>
  <div>
    <t-pagination
      :total="645"
      :page-size.sync="pageSize"
      v-model="current"
      :on-page-size-change="onPageSizeChange"
      @pageSizeChange="onPageSizeChange2"
      show-sizer
      :page-size-option="[10,20,30,100,200]"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageSize: 20,
      current: 1,
      onPageSizeChange: (pageSize, pageInfo) => {
        console.log(pageSize, pageInfo);
      },
    };
  },
  methods: {
    onPageSizeChange2(pageSize, pageInfo) {
      console.log(pageSize, pageInfo);
    },
  },
};
</script>

<template>
  <div>
    <t-pagination
      v-model="current"
      :total="49"
      :on-change="onChange"
      @change="onPageChange"
      :page-size="10"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      current: 2,
      onChange: (index, event) => {
        console.log('fire on prop');
        console.log(`转到第${index}页`);
        console.log(event);
      },
    };
  },
  methods: {
    onPageChange(index, event) {
      console.log('fire on event');
      console.log(`转到第${index}页`);
      console.log(event);
    },
  },
};
</script>

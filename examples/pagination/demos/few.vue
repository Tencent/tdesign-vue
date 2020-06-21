<template>
  <div>
    <t-pagination
      v-model="current"
      :total="49"
      @change="onChange"
      :page-size="10"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      current: 2,
    };
  },
  methods: {
    onChange(index, event) {
      console.log(`转到第${index}页`);
      console.log(event);
    },
  },
};
</script>

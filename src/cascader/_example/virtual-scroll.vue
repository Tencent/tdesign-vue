<template>
  <t-cascader
    v-model="value"
    :options="options"
    :scroll="{ type: 'virtual', bufferSize: 5, threshold: 10 }"
    clearable
    multiple
    @change="onChange"
  />
</template>

<script>
export default {
  data() {
    return {
      options: [],
      value: ['20.1.20'],
    };
  },
  mounted() {
    const data = this.initOptions();
    this.options = data;
  },
  methods: {
    onChange(val, context) {
      console.log(this.value, val, context);
    },
    initOptions() {
      const list = [];
      for (let i = 1; i < 50; i++) {
        const children = [];
        for (let j = 1; j < 50; j++) {
          const child = [];
          for (let k = 1; k < 50; k++) {
            child.push({
              label: `子选项${i}.${j}.${k}`,
              value: `${i}.${j}.${k}`,
            });
          }
          children.push({
            label: `子选项${i}.${j}`,
            value: `${i}.${j}`,
            children: child,
          });
        }

        list.push({
          label: `选项${i}`,
          value: `${i}`,
          children,
        });
      }
      return list;
    },
  },
};
</script>

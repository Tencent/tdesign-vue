<template>
  <div>
    <t-cascader class="t-demo-cascader" :keys="{ label: 'name', value: 'code', children: 'items' }" :options="options" v-model="value" clearable placeholder='请选择'></t-cascader>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [
        {
          name: '选项一',
          code: '1',
          items: [
            {
              name: '子选项一',
              code: '1.1',
            },
            {
              name: '子选项二',
              code: '1.2',
            },
            {
              name: '子选项三',
              code: '1.3',
            },
          ],
        },
        {
          name: '选项二',
          code: '2',
          items: [
            {
              name: '子选项一',
              code: '2.1',
            },
            {
              name: '子选项二',
              code: '2.2',
            },
          ],
        },
      ],
      value: '1.1',
    };
  },
};
</script>
<style scoped>
.t-demo-cascader + .t-demo-cascader {
  margin-top: 16px;
}
</style>

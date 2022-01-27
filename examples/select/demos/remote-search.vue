<template>
  <div>
    <t-select
      v-model="value"
      filterable
      placeholder="请选择"
      :onSearch="remoteMethod"
      :loading="loading"
      :options="options"
      style="width: 200px; display: inline-block; margin: 0 20px 20px 0"
    />
    <t-select
      v-model="value2"
      multiple
      filterable
      placeholder="请输入搜索"
      :options="options2"
      @search="remoteMethod2"
      :loading="loading2"
      reserveKeyword
      style="width: 400px; display: inline-block"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [
        { label: '选项一', value: '1' },
        { label: '选项二', value: '2' },
        { label: '选项三', value: '3' },
      ],
      options2: [],
      value: '',
      value2: [],
      loading: false,
      loading2: false,
    };
  },
  methods: {
    handleChange(value) {
      console.log(value);
    },
    remoteMethod(search) {
      console.log('search', search);
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.options = [
          {
            value: `${search}test1`,
            label: `${search}test1`,
          },
          {
            value: `${search}test2`,
            label: `${search}test2`,
          },
          {
            value: `${search}test3`,
            label: `${search}test3`,
          },
        ];
      }, 500);
    },
    remoteMethod2(search) {
      console.log('search2', search);
      this.loading2 = true;
      setTimeout(() => {
        this.loading2 = false;
        this.options2 = [
          {
            value: `${search}test1`,
            label: `${search}test1`,
          },
          {
            value: `${search}test2`,
            label: `${search}test2`,
          },
          {
            value: `${search}test3`,
            label: `${search}test3`,
          },
        ];
      }, 500);
    },
  },
};
</script>

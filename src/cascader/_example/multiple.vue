<template>
  <t-cascader v-model="value" :options="options" multiple clearable />
</template>
<script>
export default {
  data() {
    return {
      options: [
        {
          label: '选项一',
          value: '1',
          children: [
            {
              label: '子选项一',
              value: '1.1',
            },
            {
              label: '子选项二',
              value: '1.2',
            },
            {
              label: '子选项三',
              value: '1.3',
              children: [
                {
                  label: '子选项三/一',
                  value: '1.3.1',
                  disabled: true,
                },
                {
                  label: '子选项三/二',
                  value: '1.3.2',
                  disabled: false,
                },
              ],
            },
            {
              label: '子选项四',
              value: '1.4',
              disabled: true,
            },
          ],
        },
        {
          label: '选项二',
          value: '2',
          children: [
            {
              label: '子选项一',
              value: '2.1',
            },
            {
              label: '子选项二',
              value: '2.2',
            },
          ],
        },
      ],
      value: ['1.1'],
    };
  },
};
</script>

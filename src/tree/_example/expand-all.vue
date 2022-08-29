<template>
  <t-space direction="vertical" :size="10">
    <t-space>
      <t-form labelWidth="150">
        <t-form-item label="切换数据" style="margin-bottom: 5px">
          <t-switch @change="toggleData" />
        </t-form-item>
        <t-form-item label="展开动画">
          <t-switch v-model="transition" style="margin-bottom: 5px" />
        </t-form-item>
      </t-form>
    </t-space>
    <t-tree :data="items" expand-all :transition="transition" />
  </t-space>
</template>

<script>
const data1 = [
  {
    label: '1',
    children: [
      {
        label: '1.1',
        children: [
          {
            label: '1.1.1',
          },
          {
            label: '1.1.2',
          },
        ],
      },
      {
        label: '1.2',
        children: [
          {
            label: '1.2.1',
          },
          {
            label: '1.2.2',
          },
        ],
      },
    ],
  },
  {
    label: '2',
    children: [
      {
        label: '2.1',
      },
      {
        label: '2.2',
      },
    ],
  },
];

const data2 = [
  {
    label: '1',
  },
  {
    label: '2',
  },
  {
    label: '3',
    children: [
      {
        label: '3.1',
      },
      {
        label: '3.2',
      },
    ],
  },
];

export default {
  data() {
    return {
      transition: true,
      items: data1,
    };
  },
  methods: {
    toggleData() {
      this.items = this.items === data1 ? data2 : data1;
    },
  },
};
</script>

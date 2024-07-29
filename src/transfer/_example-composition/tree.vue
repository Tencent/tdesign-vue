<template>
  <t-space direction="vertical">
    <p style="margin: 10px 0">使用插槽</p>
    <t-transfer
      :data="items"
      :search="true"
      v-model="targetValue1"
      :checked.sync="checked1"
      @change="onChange"
      @checked-change="handleCheckedChange"
    >
      <template v-slot:tree="slotProps">
        <t-tree
          :data="slotProps.data"
          v-model="slotProps.value"
          @change="slotProps.onChange"
          checkable
          hover
          expand-all
          transition
        />
      </template>
    </t-transfer>

    <p style="margin: 10px 0">使用属性</p>
    <t-transfer
      :data="items"
      :search="true"
      v-model="targetValue2"
      :checked.sync="checked2"
      :tree="renderTree"
      @change="onChange"
      @checked-change="handleCheckedChange"
    >
    </t-transfer>
  </t-space>
</template>
<script setup lang='jsx'>
import { ref } from 'vue';

const items = ref([
  {
    value: '1',
    label: '1',
    children: [
      {
        value: '1.1',
        label: '1.1',
      },
      {
        value: '1.2',
        label: '1.2',
        children: [
          {
            value: '1.2.1',
            label: '1.2.1',
            children: [
              {
                value: '1.2.1.1',
                label: '1.2.1.1',
              },
              {
                value: '1.2.1.2',
                label: '1.2.1.2',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    value: '2',
    label: '2',
    children: [
      {
        value: '2.1',
        label: '2.1',
      },
      {
        value: '2.2',
        label: '2.2',
      },
    ],
  },
]);
const targetValue1 = ref([]);
const checked1 = ref([]);

const targetValue2 = ref([]);
const checked2 = ref([]);

const handleCheckedChange = ({
  checked, sourceChecked, targetChecked, type,
}) => {
  console.log('handleCheckedChange', {
    checked,
    sourceChecked,
    targetChecked,
    type,
  });
};
const onChange = (newTargetValue) => {
  console.log('onChange', newTargetValue);
};

const renderTree = (h, { data, value, onChange }) => <t-tree data={data} value={value} onChange={onChange} checkable hover expand-all transition></t-tree>;
</script>

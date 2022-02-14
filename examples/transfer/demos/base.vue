<template>
  <div>
    <t-transfer
      :data="list"
      v-model="targetValue"
      :checked.sync="checked"
      @change="onChange"
      @checked-change="handleCheckedChange"
    />
  </div>
</template>
<script>
const list = [];
for (let i = 0; i < 20; i++) {
  list.push({
    value: i.toString(),
    label: `内容${i + 1}`,
    disabled: i % 4 < 1,
  });
}
export default {
  data() {
    return {
      list,
      targetValue: [],
      checked: ['2'],
    };
  },
  methods: {
    handleCheckedChange({
      checked, sourceChecked, targetChecked, type,
    }) {
      console.log('handleCheckedChange', {
        checked,
        sourceChecked,
        targetChecked,
        type,
      });
    },
    onChange(newTargetValue) {
      console.log(newTargetValue);
    },
  },
};
</script>

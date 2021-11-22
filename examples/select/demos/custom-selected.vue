<template>
  <div>

    <!-- 自定义选中项内容，valueDisplay 为渲染函数（function） -->
    <t-select
      v-model="value1"
      :options="options"
      :valueDisplay="valueDisplay"
      placeholder="请选择古代名人"
      multiple
      clearable
    />
    <br/><br/>

    <!-- 自定义选中项内容，valueDisplay 为 插槽(slot) -->
    <t-select
      v-model="value2"
      :options="options"
      placeholder="请选择古代名人"
      multiple
      clearable
    >
      <template #valueDisplay="{ value, onClose }">
        <t-tag
          v-for="(item, index) in value"
          :key="index"
          :closable="true"
          :onClose="() => onClose(index)"
        >
          {{item.label}}({{item.value[0].toUpperCase()}})
        </t-tag>
      </template>
    </t-select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value1: ['zhouyu', 'xiaoqiao', 'liubei'],
      value2: ['machao', 'guanyu', 'zhugeliang', 'simayi'],
      options: [
        { label: '周瑜', value: 'zhouyu' },
        { label: '小乔', value: 'xiaoqiao' },
        { label: '刘备', value: 'liubei' },
        { label: '马超', value: 'machao' },
        { label: '关羽', value: 'guanyu' },
        { label: '张飞', value: 'zhangfei' },
        { label: '诸葛亮', value: 'zhugeliang' },
        { label: '司马懿', value: 'simayi' },
        { label: '司马昭', value: 'simazhao' },
      ],
    };
  },
  methods: {
    valueDisplay(h, { value, onClose }) {
      if (!(value instanceof Array)) return;
      return value.map((item, index) => (
        <t-tag
          key={index}
          closable={true}
          onClose={() => onClose(index)}
        >
          {item.label}({item.value[0].toUpperCase()})
        </t-tag>
      ));
    },
  },
};
</script>

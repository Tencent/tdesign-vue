<template>
  <t-space direction="vertical">
    <t-tree-select
      v-model="value"
      style="width: 300px"
      placeholder="请选择"
      :data="options"
      clearable
      multiple
      :min-collapsed-num="minCollapsedNum"
      :collapsed-items="collapsedItems"
      :size="size"
      :disabled="disabled"
      :readonly="readonly"
    >
    </t-tree-select>
  </t-space>
</template>

<script lang="jsx">
export default {
  data() {
    return {
      value: ['guangzhou', 'shenzhen'],
      options: [
        {
          label: '广东省',
          value: 'guangdong',
          children: [
            {
              label: '广州市',
              value: 'guangzhou',
            },
            {
              label: '深圳市',
              value: 'shenzhen',
            },
          ],
        },
        {
          label: '江苏省',
          value: 'jiangsu',
          children: [
            {
              label: '南京市',
              value: 'nanjing',
            },
            {
              label: '苏州市',
              value: 'suzhou',
            },
          ],
        },
      ],
      size: 'medium',
      disabled: false,
      readonly: false,
      minCollapsedNum: 1,
    };
  },
  methods: {
    collapsedItems(h, { value, onClose }) {
      if (!(value instanceof Array)) return null;
      const count = value.length - this.minCollapsedNum;
      const collapsedTags = value.slice(this.minCollapsedNum, value.length);
      if (count <= 0) return null;
      return (
        <t-popup>
          <div slot="content">
            {collapsedTags.map((item, index) => (
              <t-tag
                key={item}
                style={{ marginRight: '4px' }}
                size={this.size}
                disabled={this.disabled}
                closable={!this.readonly && !this.disabled}
                onClose={(context) => onClose({ e: context.e, index: this.minCollapsedNum + index })}
              >
                {item}
              </t-tag>
            ))}
          </div>
          <t-tag size={this.size} disabled={this.disabled}>
            ({count})
          </t-tag>
        </t-popup>
      );
    },
  },
};
</script>

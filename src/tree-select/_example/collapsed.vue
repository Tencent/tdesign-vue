<template>
  <t-space direction="vertical">
    <h3>default: </h3>
    <t-tree-select
      v-model="value"
      :data="options"
      multiple
      clearable
      placeholder="请选择"
      :minCollapsedNum="1"
      style="width: 300px"
    >
    </t-tree-select>

    <h3>use collapsedItems: </h3>
    <t-space>
      <div>size control:</div>
      <t-radio-group :value="size" :options="['small', 'medium', 'large']" @change="(value) => size = value" />
    </t-space>
    <t-space>
      <span>disabled control:</span>
      <t-checkbox :checked="disabled" @change="(value) => disabled = value" />
    </t-space>
    <t-space>
      <span>readonly control:</span>
      <t-checkbox :checked="readonly" @change="(value) => readonly = value" />
    </t-space>
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
    <t-tree-select
      v-model="value"
      style="width: 300px"
      placeholder="请选择"
      :data="options"
      clearable
      multiple
      :min-collapsed-num="minCollapsedNum"
      :size="size"
      :disabled="disabled"
      :readonly="readonly"
    >
      <template #collapsedItems="{ value, onClose }">
        <SlotCollapsedItems 
          :style="{ marginRight: '4px' }"
          :value="value"
          :min-collapsed-num="minCollapsedNum"
          :size="size"
          :disabled="disabled"
          :closable="!readonly && !disabled"
          @close="onClose"
        />
      </template>
    </t-tree-select>
  </t-space>
</template>

<script lang="jsx">
import SlotCollapsedItems from '../../tag-input/_example/slot-collapsed-items.vue';

export default {
  components: {
    SlotCollapsedItems,
  },
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
          <t-tag size={this.size} disabled={this.disabled}>Function - More({count})</t-tag>
        </t-popup>
      );
    },
  },
};
</script>

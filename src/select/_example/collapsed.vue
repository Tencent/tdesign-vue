<template>
  <t-space direction="vertical">

    <h3>default: </h3>
    <!-- 选项过多时，可折叠 -->
    <t-select v-model="value" placeholder="请选择" multiple :minCollapsedNum="minCollapsedNum" :options="options" />

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
    <!-- 自定义折叠项内容，collapsedItems 为渲染函数 (value, count, collapsedSelectedItems) -->
    <t-select
      v-model="value"
      :options="options"
      multiple
      :min-collapsed-num="minCollapsedNum"
      :collapsed-items="collapsedItems"
      :size="size"
      :disabled="disabled"
      :readonly="readonly"
    />
    <!-- 自定义折叠项内容，collapsedItems 为 插槽(slot) -->
    <t-select
      v-model="value"
      :options="options"
      multiple
      :min-collapsed-num="minCollapsedNum"
      :size="size"
      :disabled="disabled"
      :readonly="readonly"
    >
      <template #collapsedItems="{ value, onClose }">
        <SlotCollapsedItems 
          :value="value"
          :min-collapsed-num="minCollapsedNum"
          :size="size"
          :disabled="disabled"
          :closable="!readonly && !disabled"
          @close="onClose"
        />
      </template>
    </t-select>
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
      options: [
        { label: '选项一', value: '1' },
        { label: '选项二', value: '2' },
        { label: '选项三', value: '3' },
        { label: '选项四', value: '4' },
        { label: '选项五', value: '5' },
        { label: '选项六', value: '6' },
        { label: '选项七', value: '7' },
        { label: '选项八', value: '8' },
        { label: '选项九', value: '9' },
      ],
      value: ['1', '3', '9'],
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

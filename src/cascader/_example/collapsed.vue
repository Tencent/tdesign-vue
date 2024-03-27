<template>
  <t-space direction="vertical">
    <h3>default:</h3>
    <t-cascader v-model="value" :options="options" :on-remove="handleBlur" multiple :min-collapsed-num="1" />

    <h3>use collapsedItems:</h3>
    <t-space>
      <div>size control:</div>
      <t-radio-group :value="size" :options="['small', 'medium', 'large']" @change="(value) => (size = value)" />
    </t-space>
    <t-space>
      <span>disabled control:</span>
      <t-checkbox :checked="disabled" @change="(value) => (disabled = value)" />
    </t-space>
    <t-space>
      <span>readonly control:</span>
      <t-checkbox :checked="readonly" @change="(value) => (readonly = value)" />
    </t-space>
    <t-cascader
      v-model="value"
      :options="options"
      multiple
      :min-collapsed-num="minCollapsedNum"
      :collapsed-items="collapsedItems"
      :size="size"
      :disabled="disabled"
      :readonly="readonly"
    />
    <t-cascader
      v-model="value"
      :options="options"
      multiple
      :min-collapsed-num="minCollapsedNum"
      :size="size"
      :disabled="disabled"
      :readonly="readonly"
    >
      <template #collapsedItems="{ value, onClose }">
        <slot-collapsed-items
          :value="value"
          :min-collapsed-num="minCollapsedNum"
          :size="size"
          :disabled="disabled"
          :closable="!readonly && !disabled"
          @close="onClose"
        />
      </template>
    </t-cascader>
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
      value: ['1.1', '1.2', '1.3'],
      size: 'medium',
      disabled: false,
      readonly: false,
      minCollapsedNum: 1,
    };
  },
  methods: {
    collapsedItems(h, { value, onClose, ...args }) {
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
            Function - More({count})
          </t-tag>
        </t-popup>
      );
    },
    handleBlur(e) {
      console.log(e);
    },
  },
};
</script>

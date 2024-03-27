<template>
  <t-space direction="vertical" style="width: 80%">
    <h3>default:</h3>
    <t-tag-input v-model="tags" :min-collapsed-num="1" />

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
    <!-- 方式一：使用渲染函数自定义折叠项 -->
    <t-tag-input
      v-model="tags"
      multiple
      :min-collapsed-num="minCollapsedNum"
      :collapsed-items="collapsedItems"
      :size="size"
      :disabled="disabled"
      :readonly="readonly"
    />

    <!-- 方式二：使用插槽自定义折叠项 -->
    <t-tag-input
      v-model="tags"
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
    </t-tag-input>
  </t-space>
</template>
<script lang="jsx">
import SlotCollapsedItems from './slot-collapsed-items.vue';

export default {
  components: {
    SlotCollapsedItems,
  },
  data() {
    return {
      tags: ['Vue', 'React', 'Miniprogram', 'Angular', 'Flutter'],
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
            Function - More({count})
          </t-tag>
        </t-popup>
      );
    },
  },
};
</script>

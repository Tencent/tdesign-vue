<template>
  <t-space direction="vertical">
    <h3>default:</h3>
    <!-- 选项过多时，可折叠 -->
    <t-select v-model="value1" placeholder="请选择" multiple :min-collapsed-num="minCollapsedNum" :options="options" />

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
    <!-- 自定义折叠项内容，collapsedItems 为渲染函数 -->
    <t-select
      v-model="value1"
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
      v-model="value1"
      :options="options"
      multiple
      :min-collapsed-num="minCollapsedNum"
      :size="size"
      :disabled="disabled"
      :readonly="readonly"
    >
      <template #collapsedItems="{ value: v, collapsedSelectedItems: collapsedSelectedItemsV, onClose }">
        <collapsed-items-render
          :collapsed-selected-items="collapsedSelectedItemsV"
          :style="{ marginRight: '4px' }"
          :value="v"
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

<script>
import Vue from 'vue';

const options = [
  {
    label: '选项一',
    value: '1',
  },
  {
    label: '选项二',
    value: '2',
  },
  {
    label: '选项三',
    value: '3',
  },
];

export default {
  components: {
    CollapsedItemsRender: Vue.extend({
      name: 'CollapsedItemsRender',
      props: ['value', 'minCollapsedNum', 'collapsedSelectedItems'],
      computed: {
        count() {
          return this.value.length - this.minCollapsedNum;
        },
      },
      methods: {
        handleClose(context, index) {
          this.$emit('close', { e: context.e, index });
        },
      },
      render(h) {
        if (this.count <= 0) return null;
        return h(
          't-popup',
          {
            scopedSlots: {
              content: () => this.collapsedSelectedItems.map((item, index) => h(
                't-tag',
                {
                  key: item.value,
                  attrs: this.$attrs,
                  on: {
                    close: (context) => this.handleClose(context, this.minCollapsedNum + index),
                  },
                },
                item.label,
              )),
            },
          },
          [
            h(
              't-tag',
              {
                attrs: { ...this.$attrs, closable: false },
              },
              `Slot - More(${this.count})`,
            ),
          ],
        );
      },
    }),
  },
  data() {
    return {
      options,
      value1: ['1', '3'],
      size: 'medium',
      disabled: false,
      readonly: false,
      minCollapsedNum: 1,
    };
  },
  methods: {
    collapsedItems(h, { value, onClose, collapsedSelectedItems }) {
      if (!(value instanceof Array)) return null;
      const count = value.length - this.minCollapsedNum;
      if (count <= 0) return null;
      return h(
        't-popup',
        {
          scopedSlots: {
            content: () => collapsedSelectedItems.map((item, index) => h(
              't-tag',
              {
                key: item.value,
                style: { marginRight: '4px' },
                attrs: { size: this.size, disabled: this.disabled, closable: !this.readonly && !this.disabled },
                on: {
                  close: (context) => onClose({ e: context.e, index: this.minCollapsedNum + index }),
                },
              },
              item.label,
            )),
          },
        },
        [
          h(
            't-tag',
            {
              attrs: { size: this.size, disabled: this.disabled },
            },
            `Function - More(${count})`,
          ),
        ],
      );
    },
  },
};
</script>

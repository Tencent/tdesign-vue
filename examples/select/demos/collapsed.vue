<template>
  <div>
    <!-- 选项过多时，可折叠 -->
    <t-select
      v-model="value"
      placeholder="请选择"
      multiple
      :minCollapsedNum="minCollapsedNum"
      :options="options"
    />
    <br/><br/>

    <!-- 自定义折叠项内容，collapsedItems 为渲染函数 (value, count, collapsedSelectedItems) -->
    <t-select
      v-model="value"
      placeholder="请选择"
      multiple
      :minCollapsedNum="minCollapsedNum"
      :collapsedItems="collapsedItems"
      :options="options"
    />
    <br/><br/>

    <!-- 自定义折叠项内容，collapsedItems 为 插槽(slot) { value, count, collapsedSelectedItems }-->
    <t-select
      v-model="value"
      placeholder="请选择"
      multiple
      :minCollapsedNum="minCollapsedNum"
      :options="options"
    >
      <!-- hover展示折叠部分的已选项 -->
      <template #collapsedItems="{ collapsedSelectedItems, count }">
        <t-popup>
          <template #content>
            <p
              v-for="(item, index) in collapsedSelectedItems"
              :key="index"
              style="padding: 10px;"
            >
              {{item.label}}
            </p>
          </template>
          <span v-show="count > 0" style="color: #00A870;">+{{count}}</span>
        </t-popup>
      </template>
    </t-select>
  </div>
</template>

<script lang="jsx">
export default {
  data() {
    return {
      options: [
        { label: '选项一', value: '1' },
        { label: '选项二', value: '2' },
        { label: '选项三', value: '3' },
      ],
      value: ['1', '3'],
      minCollapsedNum: 1,
    };
  },
  methods: {
    collapsedItems(h, { value, count, collapsedSelectedItems }) {
      console.log('collapsedItems: ', value, collapsedSelectedItems, count);
      if (!(value instanceof Array) || !count) return;
      // hover展示全部已选项
      return (
        <t-popup>
          <div slot="content">
          {
            value.map((item) => (
              <p style="padding: 10px;">{item.label}</p>
            ))
          }
          </div>
          <span v-show={count > 0} style="color: #ED7B2F;">
            +{count}
          </span>
        </t-popup>
      );
    },
  },
};
</script>

<template>
  <div>
    <t-select
      v-model="value"
      placeholder="-请选择-"
      multiple
      :options="options"
    />
    <br/><br/>

    <!-- 选项过多时，可折叠 -->
    <t-select
      v-model="value"
      placeholder="-请选择-"
      multiple
      :minCollapsedNum="1"
      :options="options"
    />
    <br/><br/>

    <!-- 自定义折叠项内容，collapsedItems 为 function -->
    <t-select
      v-model="value"
      placeholder="-请选择-"
      multiple
      :minCollapsedNum="1"
      :collapsedItems="collapsedItems"
      :options="options"
    />
    <br/><br/>

    <!-- 自定义折叠项内容，collapsedItems 为 插槽(slot) -->
    <t-select
      v-model="value"
      placeholder="-请选择-"
      multiple
      :minCollapsedNum="1"
      :options="options"
    >
      <template #collapsedItems="{ value, count, size }">
        <t-popup>
          <template #content>
            <p
              v-for="(item, index) in value"
              :key="index"
              style="padding: 10px;"
            >
              {{item.label}}
            </p>
          </template>
          <span style="color: #00A870;">+{{count}}<t-icon :size="size" name="info-circle" /></span>
        </t-popup>
      </template>
    </t-select>
    <br/><br/>

    <!-- 自定义选中项内容，valueDisplay 为 function -->
    <t-select
      v-model="value"
      placeholder="-请选择-"
      multiple
      :valueDisplay="valueDisplay"
      :options="options"
    />
    <br/><br/>

    <!-- 自定义选中项内容，valueDisplay 为 插槽(slot) -->
    <t-select
      v-model="value"
      placeholder="-请选择-"
      multiple
      :options="options"
    >
      <template #valueDisplay="{ value, onClose }">
        <t-tag
          v-for="(item, index) in value"
          :key="index"
          :closable="true"
          :onClose="() => onClose(index)"
          theme="success"
          variant="light"
        >
          {{item.label}}（{{item.value}}）
        </t-tag>
      </template>
    </t-select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [{
        label: '选项一',
        value: '1',
      }, {
        label: '选项二',
        value: '2',
      }, {
        label: '选项三',
        value: '3',
      }],
      value: ['1', '3'],
    };
  },
  methods: {
    valueDisplay(h, { value, onClose }) {
      if (!(value instanceof Array)) return;
      return value.map((item, index) => (
        <t-tag
          key={index}
          theme="warning"
          variant="light"
          closable={true}
          onClose={() => onClose(index)}
        >
          {item.label}（{item.value}）
        </t-tag>
      ));
    },
    collapsedItems(h, { value, count, size }) {
      if (!(value instanceof Array) || !count) return;
      return (
        <t-popup>
          <div slot="content">
          {
            value.map((item) => (
              <p style="padding: 10px;">{item.label}</p>
            ))
          }
          </div>
          <span style="color: #ED7B2F;">
            +{count}<t-icon size={size} name="info-circle" />
          </span>
        </t-popup>
      );
    },
  },
};
</script>

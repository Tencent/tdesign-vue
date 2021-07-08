<template>
  <div>
    <div style="margin-bottom: 10px;">
      columns 中通过定义 scopedSlots 或者 render 方法来实现自定义单元格的渲染。
      其中 key 值为 'title' 时，代表用指定插槽自定义表头。其中 key 值为 'col' 时，代表用指定插槽自定义内容部分的单元格。</div>
    <t-table
      :data="data"
      :columns="columns"
      :rowKey="rowKey"
      :bordered="bordered"
      :hover="hover"
      :stripe="stripe"
    >
      <!-- 自定义表头 支持 slot -->
      <span slot='type'>
        <t-icon-app /> 类型
      </span>
      <!-- 自定义单元格 支持 slot -->
      <span slot='platform' slot-scope='{record}'>
        <t-icon-attach /><a href="#" class="link">{{ record.platform }}</a>
      </span>
      <span slot='default' slot-scope='{record}'>
        未指定 scopedSlots 的插槽会默认用来渲染表格内容单元格。 {{record.default}}
      </span>
    </t-table>
  </div>
</template>
<script>
import TIconApp from '@tencent/tdesign-vue/lib/icon/app';
import TIconAttach from '@tencent/tdesign-vue/lib/icon/attach';
export default {
  components: {
    TIconApp,
    TIconAttach,
  },
  data() {
    return {
      data: [
        {
          platform: '公有',
          property: 'data',
          type: 'any[]',
          default: '[]',
          needed: 'Y',
          description: '数据源',
        },
        {
          platform: '公有',
          property: 'rowkey',
          type: 'String',
          default: '-1',
          needed: 'Y',
          description: '指定rowkey',
        },
      ],
      columns: [
        {
          align: 'left',
          width: '100',
          minWidth: '100',
          className: 'row',
          colKey: 'type',
          scopedSlots: {
            title: 'type',
          },
        },
        {
          align: 'left',
          width: '100',
          minWidth: '100',
          className: 'test',
          colKey: 'platform',
          title: '平台',
          scopedSlots: {
            col: 'platform',
          },
        },
        {
          align: 'left',
          width: '100',
          minWidth: '100',
          className: 'test2',
          colKey: 'property',
          title: '属性名',
          ellipsis: true,
          render({ index, record }) {
            return `render 方法渲染的单元格：${index}: ${record.property}`;
          },
        },
        {
          align: 'left',
          width: '100',
          minWidth: '100',
          className: 'test4',
          colKey: 'default',
          title() {
            return '默认值';
          },
        },
        {
          align: 'left',
          width: '100',
          minWidth: '100',
          className: 'test3',
          colKey: 'needed',
          title: '是否必传',
        },
        {
          align: 'left',
          width: '100',
          minWidth: '100',
          className: 'row',
          colKey: 'description',
          title: '说明',
        },
      ],
      rowKey: 'property',
      bordered: true,
      hover: true,
      stripe: true,
      height: 100,
    };
  },
};
</script>
<style scoped>
.link {
  color: #0052d9;
  text-decoration: none;
}
</style>

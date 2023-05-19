<template>
  <t-space :size="32" direction="vertical" class="tdesign-tree-demo">
    <t-space :size="10" direction="vertical">
      <t-form>
        <t-form-item label="可选">
          <t-switch v-model="checkable" />
        </t-form-item>
        <t-form-item label="严格模式">
          <t-switch v-model="checkStrictly" />
        </t-form-item>
        <t-form-item label="选中值模式">
          <t-radio-group name="value-mode" variant="default-filled" v-model="valueMode">
            <t-radio-button v-for="item in valueOptions" :key="item.value" :value="item.value">{{
              item.label
            }}</t-radio-button>
          </t-radio-group>
        </t-form-item>
        <t-form-item>
          <t-button theme="primary" @click="selectInvert">反选</t-button>
        </t-form-item>
      </t-form>
      <t-tree
        :data="items"
        hover
        expand-all
        :checkable="checkable"
        :check-strictly="checkStrictly"
        :value-mode="valueMode"
        :value="allChecked"
        @change="onChange"
        @click="onClick"
        ref="tree"
      />
    </t-space>
  </t-space>
</template>

<script>
export default {
  data() {
    return {
      valueMode: 'onlyLeaf',
      checkable: true,
      checkStrictly: false,
      allChecked: [],
      valueOptions: [
        {
          value: 'onlyLeaf',
          label: 'onlyLeaf',
        },
        {
          value: 'parentFirst',
          label: 'parentFirst',
        },
        {
          value: 'all',
          label: 'all',
        },
      ],
      items: [
        {
          value: '1',
          label: '1',
          children: [
            {
              value: '1.1',
              label: '1.1',
              children: [
                {
                  value: '1.1.1',
                  label: '1.1.1',
                  children: [
                    {
                      value: '1.1.1.1',
                      label: '1.1.1.1',
                    },
                    {
                      value: '1.1.1.2',
                      label: '1.1.1.2',
                    },
                  ],
                },
                {
                  value: '1.1.2',
                  label: '1.1.2',
                  children: [
                    {
                      value: '1.1.2.1',
                      label: '1.1.2.1',
                    },
                    {
                      value: '1.1.2.2',
                      label: '1.1.2.2',
                    },
                  ],
                },
              ],
            },
            {
              value: '1.2',
              label: '1.2',
              children: [
                {
                  value: '1.2.1',
                  label: '1.2.1',
                  children: [
                    {
                      value: '1.2.1.1',
                      label: '1.2.1.1',
                    },
                    {
                      value: '1.2.1.2',
                      label: '1.2.1.2',
                    },
                  ],
                },
                {
                  value: '1.2.2',
                  label: '1.2.2',
                  children: [
                    {
                      value: '1.2.2.1',
                      label: '1.2.2.1',
                    },
                    {
                      value: '1.2.2.2',
                      label: '1.2.2.2',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          value: '2',
          label: '2',
          children: [
            {
              value: '2.1',
              label: '2.1',
            },
            {
              value: '2.2',
              label: '2.2',
            },
          ],
        },
      ],
    };
  },
  methods: {
    onClick(context) {
      console.info('onClick:', context);
    },
    onChange(checked, context) {
      console.info('onChange:', checked, context);
    },
    propOnChange(checked, context) {
      console.info('propOnChange:', checked, context);
    },
    selectInvert() {
      const { tree } = this.$refs;
      // 取得所有节点
      const items = tree.getItems();
      const revertSelection = [];
      items.forEach((item) => {
        if (!item.checked && !item.indeterminate) {
          // checked 为 true, 为直接选中状态
          // indeterminate 为 true, 为半选状态
          revertSelection.push(item.value);
        }
      });
      this.allChecked = revertSelection;
    },
  },
};
</script>

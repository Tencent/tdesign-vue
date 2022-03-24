<template>
  <div class="tdesign-demo-block-column-large">
    <div class="tdesign-demo-block-column">
      <t-addon prepend="checked:">
        <t-input :value="allChecked" @change="onAllCheckedInput" />
      </t-addon>
      <t-addon prepend="expanded:">
        <t-input :value="allExpanded" @change="onAllExpandedInput" />
      </t-addon>
      <t-addon prepend="activated:">
        <t-input :value="allActivated" @change="onAllActivatedInput" />
      </t-addon>
    </div>
    <t-tree
      :data="items"
      checkable
      activable
      :expand-on-click-node="false"
      :active-multiple="false"
      :expanded.sync="expanded"
      :activated.sync="activated"
      :value.sync="checked"
      :value-mode="valueMode"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      valueMode: 'onlyLeaf',
      checked: ['1.1.1.1', '1.1.1.2'],
      expanded: ['1', '1.1', '1.1.1', '2'],
      activated: ['2'],
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
          checkable: false,
          children: [
            {
              value: '2.1',
              label: '2.1',
              checkable: false,
            },
            {
              value: '2.2',
              label: '2.2',
              checkable: false,
            },
          ],
        },
      ],
    };
  },
  computed: {
    allChecked() {
      let arr = [];
      if (Array.isArray(this.checked)) {
        arr = this.checked;
      }
      return arr.map((val) => `{${val}}`).join(', ');
    },
    allExpanded() {
      let arr = [];
      if (Array.isArray(this.expanded)) {
        arr = this.expanded;
      }
      return arr.map((val) => `{${val}}`).join(', ');
    },
    allActivated() {
      let arr = [];
      if (Array.isArray(this.activated)) {
        arr = this.activated;
      }
      return arr.map((val) => `{${val}}`).join(', ');
    },
  },
  methods: {
    getValueFromString(val) {
      const arr = val.split(',');
      const vals = [];
      arr
        .map((str) => str.trim())
        .forEach((tag) => {
          const match = /^\{([^{}]+)\}$/.exec(tag);
          if (match && match[1]) {
            vals.push(match[1]);
          }
        });
      return vals;
    },
    onAllCheckedInput(val) {
      console.log('checked input on change', val);
      const vals = this.getValueFromString(val);
      this.checked = vals;
    },
    onAllExpandedInput(val) {
      console.log('expanded input on change', val);
      const vals = this.getValueFromString(val);
      this.expanded = vals;
    },
    onAllActivatedInput(val) {
      console.log('activated input on change', val);
      const vals = this.getValueFromString(val);
      this.activated = vals;
    },
  },
};
</script>

<template>
  <td-doc-usage ref="usage" @ConfigChange="onConfigChange">
    <slot :configProps="{ ...defaultProps, ...changedProps }" />
  </td-doc-usage>
</template>

<script>
export default {
  props: {
    code: String,
    configList: Array,
  },

  data() {
    const defaultProps = this.configList.reduce((prev, curr) => {
      if (curr.defaultValue !== undefined) Object.assign(prev, { [curr.name]: curr.defaultValue });
      return prev;
    }, {});
    return {
      defaultProps,
      changedProps: {},
    };
  },

  computed: {
    usageCode() {
      const propsStrs = Object.keys(this.changedProps)
        .map((name) => `${this.stringifyProp(name, this.changedProps[name])}`)
        .filter(Boolean);
      return this.code.replace(
        /(\s+)v-bind="configProps"(\s*)/,
        (m, prefix, suffix) => propsStrs.length ? `\n  ${propsStrs.join('\n  ')}\n` : suffix,
      );
    },
  },
  watch: {
    usageCode: {
      immediate: true,
      handler() {
        if (this.$refs.usage) this.$refs.usage.code = this.usageCode;
      },
    },
  },

  mounted() {
    this.$refs.usage.configList = this.configList;
    this.$refs.usage.code = this.usageCode;
  },

  methods: {
    onConfigChange(e) {
      const { name, value } = e.detail;
      this.$set(this.changedProps, name, value);
    },
    stringifyProp(name, value) {
      if (value === true) return name; // 为 true 只展示 name
      if (value === this.defaultProps[name]) return ''; // 为默认值不展示
      if (value === undefined) return ''; // 为 undefined 不展示
      if (typeof value === 'string') return `${name}="${value}"`;
      return `:${name}="${value}"`;
    },
  },
};
</script>

<template>
  <td-doc-usage ref="usage" :code="code" @ConfigChange="onConfigChange">
    <slot />
  </td-doc-usage>
</template>

<script>
export default {
  props: {
    code: String,
    configList: Array,
  },

  mounted() {
    this.$refs.usage.configList = this.configList;
  },

  methods: {
    onConfigChange(e) {
      const { name, value } = e.detail;
      const changedPropsStr = `:${name}="${value}"`;

      this.$emit('ConfigChange', e, changedPropsStr);
    },
  },
};
</script>

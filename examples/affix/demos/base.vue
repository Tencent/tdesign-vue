<template>
  <div class="affix-base">
    <t-affix
      :offset-top="top"
      :offset-bottom="20"
    >
      <t-button @click="addTop">base</t-button>
    </t-affix>
  </div>
</template>

<script>
export default {
  data() {
    return {
      top: 0,
    };
  },
  methods: {
    addTop() {
      this.top += 10;
    },
  },
};
</script>

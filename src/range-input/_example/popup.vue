<template>
  <t-range-input-popup :panel="panel" />
</template>

<script lang="jsx">
export default {
  data() {
    return {
      panel: () => <div>hello world</div>,
    };
  },
};
</script>

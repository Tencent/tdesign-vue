<template>
  <div>
    <component :is="demo"></component>
  </div>
</template>

<script>
export default {
  props: { demo: Object },
};
</script>

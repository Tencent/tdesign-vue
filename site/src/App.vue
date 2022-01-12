<template>
  <div>
    <router-view />
    <reload-prompt />
  </div>
</template>

<script>
import ReloadPrompt from './components/reload-prompt.vue';

export default {
  components: {
    ReloadPrompt,
  },
};
</script>

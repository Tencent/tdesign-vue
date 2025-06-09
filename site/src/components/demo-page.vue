<template>
  <component v-if="demoComponent" :is="demoComponent"></component>
  <ul class="empty-demo" v-else>
    <li v-for="demoName in demoList[componentName] || []" :key="demoName">
      <router-link :to="{ path: `/vue/demos/${componentName}/${demoName}` }">
        <t-button theme="default" variant="text">{{ demoName }}</t-button>
      </router-link>
    </li>
  </ul>
</template>

<script>
const demoReq = import.meta.globEager('../../../src/**/_example/*.vue');

const demoObject = {};
const demoList = {};
Object.keys(demoReq).forEach((key) => {
  const match = key.match(/([\w-]+)._example.([\w-]+).vue/);
  if (!match) return;

  const [, componentName, demoName] = match;
  demoObject[`${componentName}-${demoName}`] = demoReq[key].default;
  demoList[componentName] = (demoList[componentName] ?? []).concat(demoName);
});

export default {
  name: 'demos',

  data() {
    return {
      demoComponent: null,
      demoList,
    };
  },

  computed: {
    componentName() {
      return this.$route.params.componentName;
    },
    demoKey() {
      const { componentName, demoName } = this.$route.params;
      return componentName && demoName ? `${componentName}-${demoName}` : null;
    },
  },

  watch: {
    '$route.params': {
      handler() {
        this.renderDemo();
      },
      immediate: true,
    },
  },

  methods: {
    renderDemo() {
      this.demoComponent = this.demoKey ? demoObject[this.demoKey] : null;
    },
  },
};
</script>

<style scoped>
.empty-demo {
  margin: 48px 240px;
}
</style>

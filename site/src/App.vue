<template>
  <div>
    <router-view />
    <reload-prompt />
    <t-button variant="outline" class="generator-btn" shape="circle" @click="handleClick">
      <t-icon name="setting"/>
    </t-button>
    <theme-generator />
  </div>
</template>

<script>
import ReloadPrompt from './components/reload-prompt.vue';
import ThemeGenerator from './components/theme-generator.vue'

export default {
  components: {
    ReloadPrompt,
    ThemeGenerator
  },
  data(){
    return {
      visible:false
    }
  },
  methods:{
    handleClick(){
      this.visible = true;
    }
  }
};
</script>

<style lang="less">
div[slot='action'] {
  display: inline-flex;
  column-gap: 8px;
}

.action-online {
  width: 32px;
  height: 32px;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  transition: all 0.2s linear;
  cursor: pointer;
  border-radius: 3px;
  color: var(--text-secondary);

  &:hover {
    color: var(--text-primary);
    background-color: var(--bg-color-demo-hover, rgb(243, 243, 243));
  }
}

.generator-btn {
  position: fixed;
  right: 80px;
  bottom: 100px;
}
</style>

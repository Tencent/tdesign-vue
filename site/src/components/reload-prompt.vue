<template>
  <div class="ReloadPrompt-container">
    <div v-if="offlineReady || needRefresh" class="ReloadPrompt-toast">
      <div class="ReloadPrompt-toast-message">
        <span v-if="offlineReady">App ready to work offline</span>
        <span v-else>New content available, click on reload button to update.</span>
      </div>
      <t-button v-if="needRefresh" size="small" :style="{ 'margin-right': '8px' }" @click="updateServiceWorker(true)">
        Reload
      </t-button>
      <t-button theme="default" size="small" @click="close"> Close </t-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'reload-prompt',

  data() {
    return {
      updateSW: undefined,
      offlineReady: false,
      needRefresh: false,
    };
  },

  async mounted() {
    try {
      const { registerSW } = await import('virtual:pwa-register');
      this.updateSW = registerSW({
        immediate: true,
        onOfflineReady() {
          this.offlineReady = true;
          this.onOfflineReadyFn();
        },
        onNeedRefresh() {
          this.needRefresh = true;
          this.onNeedRefreshFn();
        },
        onRegistered(swRegistration) {
          swRegistration && this.handleSWManualUpdates(swRegistration);
        },
        onRegisterError(e) {
          this.handleSWRegisterError(e);
        },
      });
    } catch {
      console.log('PWA disabled.');
    }
  },

  methods: {
    close() {
      this.offlineReady = false;
      this.needRefresh = false;
    },
    onOfflineReadyFn() {
      console.log('onOfflineReady');
    },
    onNeedRefreshFn() {
      console.log('onNeedRefresh');
    },
    updateServiceWorker() {
      this.updateSW && this.updateSW(true);
    },
    handleSWManualUpdates() {},
    handleSWRegisterError() {},
  },
};
</script>

<style lang="less" scoped>
.ReloadPrompt-container {
  position: fixed;
  right: 24px;
  bottom: 40px;
  z-index: 400;
}

.ReloadPrompt-toast {
  width: 240px;
  padding: 12px;
  border-radius: 3px;
  box-shadow: var(--popup-box-shadow);
  background-color: var(--bg-color-container);
  color: var(--text-primary);
}
.ReloadPrompt-toast-message {
  margin-bottom: 12px;
}
</style>

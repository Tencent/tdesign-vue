<template>
  <t-space>
    <t-switch
      v-model="resolveChecked"
      :loading="loadingResolve"
      :before-change="beforeChangeResolve"
      @change="onChangeResolve"
    />
    <t-switch
      v-model="rejectChecked"
      :loading="loadingReject"
      :before-change="beforeChangeReject"
      @change="onChangeReject"
    />
  </t-space>
</template>

<script>
export default {
  data() {
    return {
      resolveChecked: true,
      rejectChecked: true,
      loadingResolve: false,
      loadingReject: false,
    };
  },
  methods: {
    onChangeResolve(val) {
      console.log('onChangeResolve', val);
    },
    onChangeReject(val) {
      console.log('onChangeReject', val);
    },
    beforeChangeResolve() {
      this.loadingResolve = true;
      return new Promise((resolve) => {
        setTimeout(() => {
          this.loadingResolve = false;
          resolve(true);
        }, 1000);
      });
    },
    beforeChangeReject() {
      this.loadingReject = true;
      return new Promise((_resolve, reject) => {
        setTimeout(() => {
          this.loadingReject = false;
          reject(new Error('reject'));
        }, 1000);
      });
    },
  },
};
</script>

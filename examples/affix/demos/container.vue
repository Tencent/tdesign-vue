<template>
  <div class="affix-container">
    <div
      class="affix-container-demo1"
      ref="affixContainer"
    >
      <div class="background">
        <t-affix
          :z-index="5"
          :offset-top="50"
          :offset-bottom="50"
          :container="getContainer"
          @fixedChange="handleFixedChange"
        >
          <t-button>FixedTop top:{{ fixedTop }}</t-button>
        </t-affix>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fixedTop: 0,
      fixedBottom: 0,
    };
  },
  methods: {
    getContainer() {
      return this.$refs?.affixContainer;
    },
    handleFixedChange(affixed, { top }) {
      this.fixedTop = top;
    },
  },
};
</script>

<style lang="less" scoped>
.affix-container {
  width: 100%;
  &-demo1 {
    border: 1px solid #e7e7e7;
    border-radius: 3px;
    height: 400px;
    overflow: auto;
    overscroll-behavior: none;
    .background {
      height: 1500px;
      padding-top: 700px;
      background:
        -webkit-linear-gradient(top, transparent 19px, #E7E7E7 20px),
        -webkit-linear-gradient(left, transparent 19px, #E7E7E7 20px);
      background-size: 20px 20px;
    }
  }
}
</style>

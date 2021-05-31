<template>
  <div class="affix-container">
    <div
      class="affix-container-demo1"
      ref="affixContainer"
    >
      <div class="background">
        <t-affix
          :offset-top="50"
          :offset-bottom="50"
          :container="getContainer"
          @fixedChange="handleFixedChange"
        >
          <t-button>container1 fixedTop: {{ fixedTop }}</t-button>
        </t-affix>
      </div>
    </div>
    <!-- demo2 -->
    <div class="affix-container-demo2">
      <div class="background">
        <t-affix
          :offset-top="50"
          :offset-bottom="50"
          container=".affix-container-demo2"
        >
          <t-button>container2</t-button>
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
  &-demo1,
  &-demo2 {
    border: 1px solid #e7e7e7;
    border-radius: 3px;
    height: 400px;
    overflow-y: scroll;
    width: 100%;
  }

  &-demo1 {
    margin-bottom: 40px;
    .background {
      padding-top: 300px;
      height: 1000px;
      background-image: #eeeeee;
    }
  }

  &-demo2 {
    .background {
      padding-top: 600px;
      height: 1000px;
      background-image: #eeeeee;
    }
  }
}
</style>

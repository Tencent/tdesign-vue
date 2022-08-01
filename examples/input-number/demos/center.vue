<template>
  <div class="tdesign-demo-block-column-large tdesign-demo__input-number-center">
    <div>
      <t-input-number
        v-model="value"
        theme="row"
        size="medium"
        :max="15"
        :min="-2"
        :disabled="false"
        :tips="tips"
        autoWidth
        @change="handleChange"
        @validate="onValidate"
      ></t-input-number>
    </div>

    <div>
      <t-input-number v-model="decimalValue" :step="0.1" :max="5" autoWidth />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      error: undefined,
      value: 3,
      decimalValue: 3.41,
    };
  },
  computed: {
    tips() {
      if (this.error === 'exceed-maximum') return 'number can not be exceed maximum';
      if (this.error === 'below-minimum') return 'number can not be below minimum';
      return undefined;
    },
  },
  methods: {
    handleChange(v, ctx) {
      console.info('change', v, ctx);
    },
    onValidate({ error }) {
      this.error = error;
    },
    handleFocus(v, ctx) {
      console.info('focus', v, ctx);
    },
    handleBlur(v, ctx) {
      console.info('blur', v, ctx);
    },
    handleKeydownEnter(v, ctx) {
      console.info('enter', v, ctx);
    },
    handleKeydown(v, ctx) {
      console.info('keydown', v, ctx);
    },
    handleKeyup(v, ctx) {
      console.info('keyup', v, ctx);
    },
    handleKeypress(v, ctx) {
      console.info('keypress', v, ctx);
    },
  },
};
</script>

<style>
/** 数字输入框过短换行时，则通过 CSS 调整宽度 */
.tdesign-demo__input-number-center .t-input__tips {
  width: 300px;
}
</style>

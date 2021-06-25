import Vue, { VNode } from 'vue';
import { prefix } from '../config';
import { Locale } from './type';

const name = `${prefix}-locale-provider`;
const LocaleProvider = Vue.extend({
  name,
  props: {
    globalLocale: Object,
  },
  provide(): { globalLocale: Locale } {
    return {
      globalLocale: this.globalLocale,
    };
  },
  render(): VNode {
    if (this.$slots.default.length === 1) {
      return this.$slots.default[0];
    }
    return <div>{this.$slots.default}</div>;
  },
});

export default LocaleProvider;

/* eslint-disable */
import Vue from "vue";
import TDesign from 'tdesign-vue';
import 'tdesign-vue/dist/tdesign.css';
import './index.css';
import Demo from "./demo.vue";

Vue.use(TDesign);
Vue.config.productionTip = false;

new Vue({
  components: { Demo },
  template: '<Demo />',
}).$mount("#app");

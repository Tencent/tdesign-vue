/* eslint-disable */
import Vue from "vue";
import TDesign from 'tdesign-vue';
// 引入组件库全局样式资源
import 'tdesign-vue/es/style/index.css';
import './index.css';
import Demo from "./demo.vue";

Vue.use(TDesign);
Vue.config.productionTip = false;

new Vue({
  components: { Demo },
  template: '<Demo />',
}).$mount("#app");

import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';
import TDesign from '@/src/index';

Vue.config.productionTip = true;
Vue.config.devtools = false;

Vue.use(VueCompositionAPI);
Vue.use(TDesign);

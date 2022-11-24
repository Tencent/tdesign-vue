import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';
import TDesign from '@/src/index';

// https://github.com/nickcolley/jest-axe/issues/147#issuecomment-758804533
// fix error when call computedStyle(elt, pseudoElt)
const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);

Vue.config.productionTip = true;
Vue.config.devtools = false;

Vue.use(VueCompositionAPI);
Vue.use(TDesign);

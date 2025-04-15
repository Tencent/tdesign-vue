import Vue from 'vue';
import TDesign from '@/src/index';

// https://github.com/nickcolley/jest-axe/issues/147#issuecomment-758804533
// fix error when call computedStyle(elt, pseudoElt)
const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);

Vue.use(TDesign);

vi.mock('vue', async () => {
  const vue = await vi.importActual('vue');

  vue.default.config.productionTip = false;
  vue.default.config.devtools = false;
  return vue;
});

import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';
import TDesign from '@/src/index';

// https://github.com/nickcolley/jest-axe/issues/147#issuecomment-758804533
// fix error when call computedStyle(elt, pseudoElt)
const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);

Vue.use(VueCompositionAPI);
Vue.use(TDesign);

vi.mock('vue', async () => {
  const vue = await vi.importActual('vue');

  vue.default.config.productionTip = false;
  vue.default.config.devtools = false;
  return vue;
});

const iconMaskInstancePattern = /(t-icon-[\w-]+-instance-)\d+(?=-overlap-)/g;

expect.addSnapshotSerializer({
  test: (value) => typeof value === 'string' && /t-icon-[\w-]+-instance-\d+-overlap-/.test(value),
  serialize: (value, config, indentation, depth, refs, printer) => printer(value.replace(iconMaskInstancePattern, '$1snapshot'), config, indentation, depth, refs),
});

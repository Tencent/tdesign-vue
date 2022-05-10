import Vue, { VueConstructor } from 'vue';
import VueCompositionApi from '@vue/composition-api';
import * as components from './components';

Vue.use(VueCompositionApi);

function install(Vue: VueConstructor, config?: object) {
  Object.keys(components).forEach((key) => {
    if (components[key]) {
      /plugin/i.test(key) ? Vue.use(components[key]) : Vue.use(components[key], config);
    }
  });
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export * from './components';
export default {
  install,
  version: typeof __VERSION__ === 'undefined' ? '' : __VERSION__, // eslint-disable-line
};

import { VueConstructor } from 'vue';
import VueCompositionAPI from '@vue/composition-api';
import * as components from './components';

function install(Vue: VueConstructor, config?: object) {
  if (Vue._installedPlugins.indexOf(VueCompositionAPI) === -1) {
    Vue.use(VueCompositionAPI);
  }
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

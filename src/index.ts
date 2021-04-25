import { VueConstructor } from 'vue';

import * as plugins from './plugins';
import * as components from './components';

function install(Vue: VueConstructor, config?: object): void {
  Object.keys(components).forEach((key) => {
    if (key.match(/plugin/)) {
      return;
    }
    Vue.use(components[key], config);
  });

  Object.keys(plugins).forEach((key) => {
    Vue.use(plugins[key]);
  });
}

declare const window: {
  [propName: string]: any; // eslint-disable-line
  Vue: VueConstructor;
};

// install
if (false && typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export * from './plugins';
export * from './components';
export default {
  install,
  version: typeof __VERSION__ === 'undefined' ? '' : __VERSION__, // eslint-disable-line
};

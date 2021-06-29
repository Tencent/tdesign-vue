import { VueConstructor } from 'vue';
import * as components from './components';
function install(Vue: VueConstructor, config?: object) {
  Object.keys(components).forEach((key) => {
    /plugin/i.test(key)
      ? Vue.use(components[key])
      : Vue.use(components[key], config);
  });
}

export * from './components';
export default {
  install,
  version: typeof __VERSION__ === 'undefined' ? '' : __VERSION__, // eslint-disable-line
};

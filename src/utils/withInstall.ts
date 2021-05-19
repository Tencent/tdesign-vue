import { VueConstructor, PluginObject } from 'vue';

export function withInstall<T>(name: string, comp: T) {
  const c = comp as any;

  c.install = (Vue: VueConstructor, config?: object) => {
    const defaults = { prefix: 't' };
    const installConfig = { ...defaults, ...config };
    const componentName = installConfig.prefix + name;
    Vue.component(componentName, comp);
  };

  return comp as T & PluginObject<T>;
}

export default withInstall;

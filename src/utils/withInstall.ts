import { VueConstructor, PluginObject } from 'vue';

export function withInstall<T>(comp: T, dep?: PluginObject<any>) {
  const c = comp as any;

  const name = c?.options?.name || c.name;

  c.install = (Vue: VueConstructor, config?: object) => {
    const defaults = { prefix: 't' };
    const installConfig = { ...defaults, ...config };
    const defaultPrefix = defaults.prefix.toLocaleUpperCase();
    // mapprops component is original component
    let componentName = name.replace(defaultPrefix, '').replace('-mapprops', '');
    componentName = installConfig.prefix.toLocaleUpperCase() + componentName;

    Vue.component(componentName, comp);

    if (dep) {
      Vue.use(dep);
    }
  };

  return comp as T & PluginObject<T>;
}

export default withInstall;

import Vue from 'vue';
import DrawerComponent from './drawer';

import { getAttach } from '../utils/dom';
import { globalConfigSymbol } from '../config-provider/config-provider';

import type { DrawerOptions, DrawerMethod, DrawerInstance } from './type';

const createDrawer: DrawerMethod = (props: DrawerOptions) => {
  const options = { ...props };

  const globalOptions = Vue.prototype[globalConfigSymbol];
  const drawer = new DrawerComponent({
    propsData: {
      ...options,
      onClose:
        options.onClose
        || (() => {
          drawer.visible = false;
        }),
      drawerClassName: options.className,
      instanceGlobal: globalOptions?.drawer,
    },
  }).$mount();
  drawer.visible = true;
  if (options.style) {
    (drawer.$el as HTMLElement).style.cssText += options.style;
  }
  const container = getAttach(options.attach);
  if (container) {
    container.appendChild(drawer.$el);
  } else {
    console.error('attach is not exist');
  }

  const drawerNode: DrawerInstance = {
    show: () => {
      drawer.visible = true;
    },
    hide: () => {
      drawer.visible = false;
    },
    update: (options: DrawerOptions) => {
      Object.assign(drawer, options);
    },
    destroy: () => {
      drawer.visible = false;
      container.contains(drawer.$el) && container.removeChild(drawer.$el);
    },
  };
  return drawerNode;
};

export type DrawerPluginType = Vue.PluginObject<undefined> & DrawerMethod;

export const DrawerPlugin: DrawerPluginType = createDrawer as DrawerPluginType;

DrawerPlugin.install = () => {
  Vue.prototype.$drawer = createDrawer;
};

export default DrawerPlugin;

declare module 'vue/types/vue' {
  // Bind to `this` keyword
  interface Vue {
    $drawer: DrawerMethod;
  }
}

import { VNode, PluginObject } from 'vue'; // eslint-disable-line
import { ComponentRenderProxy } from '@vue/composition-api'; // eslint-disable-line
declare global {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Element extends VNode {}
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ElementClass extends ComponentRenderProxy {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
    type IntrinsicAttributes = any;
  }
}

declare module '@vue/composition-api' {
  interface ComponentInternalInstance { // todo
    [x: string]: any;
  }
}

declare module 'vue' {
  interface VueConstructor {
    _installedPlugins: PluginObject<any>[];
  }
}

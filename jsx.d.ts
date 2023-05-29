import { PluginObject } from 'vue'; // eslint-disable-line
declare module 'vue' {
  interface ComponentInternalInstance {
    // todo
    [x: string]: any;
  }

  interface ComponentCustomProps {
    [key: string]: any;
  }
}

declare module 'vue' {
  interface VueConstructor {
    _installedPlugins: PluginObject<any>[];
  }
}

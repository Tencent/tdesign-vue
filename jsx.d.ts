import { PluginObject } from 'vue'; // eslint-disable-line
declare module 'vue' {
  interface ComponentInternalInstance {
    // todo
    [x: string]: any;
  }

  interface ComponentCustomProps {
    onClick?: any;
    props?: any;
    scopedSlots?: any;
    onCancelUpload?: any;
    onPreview?: any;
    size?: any;
    nativeOnClick?: any;
    on?: any;
    onChange?: any;
    id?: any;
    onSelect?: any;
    filterIcon?: any;
  }
}

declare module 'vue' {
  interface VueConstructor {
    _installedPlugins: PluginObject<any>[];
  }
}

import Vue, { VueConstructor } from 'vue';
import defaultConfig from './zh_CN_config';
import { GlobalConfigProvider } from './type';

export type ValueOf<T> = T[keyof T];

export type ComponentConfigType = ValueOf<GlobalConfigProvider>;

export * from './type';

export type ConfigRule<T = any> = string | ((args: T) => string);
export interface Placement {
  [propName: string]: string | number;
}

export interface ConfigComponent extends Vue {
  globalConfig: GlobalConfigProvider;
}

export default function getConfigReceiverMixins<BasicComponent extends Vue, C extends ComponentConfigType>(componentName: string) { // eslint-disable-line
  return (Vue as VueConstructor<ConfigComponent & BasicComponent>).extend({
    name: 'TConfigProvider',
    inject: {
      globalConfig: {
        default: undefined,
      },
    },

    computed: {
      global(): C {
        const defaultData = defaultConfig[componentName];
        if (this.globalConfig && this.globalConfig[componentName]) {
          return {
            ...defaultData,
            ...this.globalConfig[componentName],
          };
        }
        return defaultData;
      },
    },

    methods: {
      t<T>(pattern: T, placement?: Placement): string {
        if (typeof pattern === 'string') {
          if (!placement) return pattern;
          const regx = /\{\s*([\w-]+)\s*\}/g;
          const translated = pattern.replace(regx, (match, key) => {
            if (placement) {
              return String(placement[key]);
            }
            return '';
          });
          return translated;
        }
        if (typeof pattern === 'function') {
          return pattern(placement);
        }
        return '';
      },
    },
  });
}

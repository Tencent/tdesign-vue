import Vue, { VueConstructor } from 'vue';
import mergeWith from 'lodash/mergeWith';
import { defaultGlobalConfig } from './context';
import { GlobalConfigProvider, AnimationType } from './type';

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

export default function getConfigReceiverMixins<BasicComponent extends Vue, C extends ComponentConfigType = null>(
  componentName: string,
) {
  // eslint-disable-line
  return (Vue as VueConstructor<ConfigComponent & BasicComponent>).extend({
    name: 'TConfigProvider',
    inject: {
      globalConfig: {
        default: undefined,
      },
    },

    computed: {
      global(): C {
        const data = this.globalConfig || defaultGlobalConfig;
        return data[componentName];
      },
      classPrefix(): string {
        return this.globalConfig?.classPrefix || defaultGlobalConfig?.classPrefix;
      },
      componentName(): string {
        const classPrefix = this.globalConfig?.classPrefix || defaultGlobalConfig?.classPrefix;
        return `${classPrefix}-${componentName}`;
      },
    },

    methods: {
      t<T>(pattern: T, placement?: Placement): string {
        if (typeof pattern === 'string') {
          if (!placement) return pattern;
          const regexp = /\{\s*([\w-]+)\s*\}/g;
          const translated = pattern.replace(regexp, (match, key) => {
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

export function getKeepAnimationMixins<BasicComponent extends Vue>() {
  return (Vue as VueConstructor<ConfigComponent & BasicComponent>).extend({
    name: 'TKeepAnimation',
    inject: {
      globalConfig: {
        default: undefined,
      },
    },
    computed: {
      keepAnimation() {
        let animationConfig: Record<'include' | 'exclude', Array<AnimationType>> = {
          include: ['ripple', 'expand', 'fade'],
          exclude: [],
        };
        if (this.globalConfig && this.globalConfig.animation) {
          // deal with https://github.com/lodash/lodash/issues/1313
          animationConfig = mergeWith(animationConfig, this.globalConfig.animation, (objValue, srcValue) => {
            if (Array.isArray(objValue)) {
              return srcValue;
            }
          });
        }
        const isKeep = (type: AnimationType) => animationConfig && !animationConfig.exclude.includes(type) && animationConfig.include.includes(type);
        return {
          ripple: isKeep('ripple'),
          expand: isKeep('expand'),
          fade: isKeep('fade'),
        };
      },
    },
  });
}

// 用于非composition api组件使用来自config provider注入的classPrefix使用
export function getClassPrefixMixins(componentName: string) {
  return (Vue as VueConstructor<ConfigComponent>).extend({
    name: 'TClassPrefixProvider',
    inject: {
      globalConfig: {
        default: undefined,
      },
    },
    computed: {
      classPrefix(): string {
        return this.globalConfig?.classPrefix || defaultGlobalConfig.classPrefix;
      },
      componentName(): string {
        const classPrefix = this.globalConfig?.classPrefix || defaultGlobalConfig.classPrefix;
        return `${classPrefix}-${componentName}`;
      },
    },
  });
}

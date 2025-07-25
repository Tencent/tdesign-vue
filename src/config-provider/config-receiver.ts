import Vue, { VueConstructor } from 'vue';
import { mergeWith } from 'lodash-es';
import { GlobalIconConfig } from 'tdesign-icons-vue';
import { defaultGlobalConfig } from './context';
import { GlobalConfigProvider, AnimationType, AttachNodeComponent } from './type';
import { t as commonT } from '../_common/js/global-config/t';

import type { AttachNode } from '../common';

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
      commonSizeClassName(): Record<string, string> {
        return {
          small: `${this.classPrefix}-size-s`,
          medium: `${this.classPrefix}-size-m`,
          large: `${this.classPrefix}-size-l`,
          default: '',
          xs: `${this.classPrefix}-size-xs`,
          xl: `${this.classPrefix}-size-xl`,
          block: `${this.classPrefix}-size-full-width`,
        };
      },
      commonStatusClassName(): Record<string, string> {
        return {
          loading: `${this.classPrefix}-is-loading`,
          loadMore: `${this.classPrefix}-is-load-more`,
          disabled: `${this.classPrefix}-is-disabled`,
          focused: `${this.classPrefix}-is-focused`,
          success: `${this.classPrefix}-is-success`,
          error: `${this.classPrefix}-is-error`,
          warning: `${this.classPrefix}-is-warning`,
          selected: `${this.classPrefix}-is-selected`,
          active: `${this.classPrefix}-is-active`,
          checked: `${this.classPrefix}-is-checked`,
          current: `${this.classPrefix}-is-current`,
          hidden: `${this.classPrefix}-is-hidden`,
          visible: `${this.classPrefix}-is-visible`,
          expanded: `${this.classPrefix}-is-expanded`,
          indeterminate: `${this.classPrefix}-is-indeterminate`,
        };
      },
    },

    methods: {
      t<T>(pattern: T, placement?: Placement | number): string {
        if (typeof pattern === 'function') {
          return pattern(placement);
        }
        return commonT(pattern as string, placement as any);
      },
    },
  });
}

export function getGlobalIconMixins<BasicComponent extends Vue>() {
  return (Vue as VueConstructor<ConfigComponent & BasicComponent>).extend({
    name: 'TGlobalIcon',
    inject: {
      globalConfig: {
        default: undefined,
      },
    },
    methods: {
      useGlobalIcon(tdIcon: Record<string, any>) {
        const iconGlobalData = (this.globalConfig || defaultGlobalConfig).icon;

        const resultIcon: GlobalIconConfig = {};
        Object.keys(tdIcon).forEach((key) => {
          resultIcon[key] = iconGlobalData?.[key] || tdIcon[key];
        });
        return resultIcon;
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
        let animationConfig = mergeWith({}, defaultGlobalConfig.animation) as Record<
          'include' | 'exclude',
          Array<AnimationType>
        >;
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

// 用于非composition api的组件使用来自config provider注入的classPrefix使用
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
      commonSizeClassName(): Record<string, string> {
        return {
          small: `${this.classPrefix}-size-s`,
          medium: `${this.classPrefix}-size-m`,
          large: `${this.classPrefix}-size-l`,
          default: '',
          xs: `${this.classPrefix}-size-xs`,
          xl: `${this.classPrefix}-size-xl`,
          block: `${this.classPrefix}-size-full-width`,
        };
      },
      commonStatusClassName(): Record<string, string> {
        return {
          loading: `${this.classPrefix}-is-loading`,
          loadMore: `${this.classPrefix}-is-load-more`,
          disabled: `${this.classPrefix}-is-disabled`,
          focused: `${this.classPrefix}-is-focused`,
          success: `${this.classPrefix}-is-success`,
          error: `${this.classPrefix}-is-error`,
          warning: `${this.classPrefix}-is-warning`,
          selected: `${this.classPrefix}-is-selected`,
          active: `${this.classPrefix}-is-active`,
          checked: `${this.classPrefix}-is-checked`,
          current: `${this.classPrefix}-is-current`,
          hidden: `${this.classPrefix}-is-hidden`,
          visible: `${this.classPrefix}-is-visible`,
          expanded: `${this.classPrefix}-is-expanded`,
          indeterminate: `${this.classPrefix}-is-indeterminate`,
        };
      },
    },
  });
}

// 用于非 composition api 的组件使用来自 config provider注入的 attach 使用
export function getAttachConfigMixins(componentName: AttachNodeComponent) {
  return (Vue as VueConstructor<ConfigComponent>).extend({
    name: 'TAttachProvider',
    inject: {
      globalConfig: {
        default: undefined,
      },
    },
    methods: {
      globalAttach(): AttachNode {
        const globalConfigAttach = this.globalConfig?.attach;

        if (typeof globalConfigAttach === 'string' || typeof globalConfigAttach === 'function') {
          return globalConfigAttach;
        }

        return globalConfigAttach?.[componentName] || 'body';
      },
    },
  });
}

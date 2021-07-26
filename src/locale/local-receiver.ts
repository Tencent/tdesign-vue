import Vue, { VueConstructor } from 'vue';
import config from '../config';
import { Locale, ComponentLocale, LocalRule } from './type';
import defaultLocale from './zh_CN';

const name = `${config.prefix}-locale-receiver`;

export interface Placement {
  [propName: string]: string | number;
};

export interface LocalComponent extends Vue {
  globalLocale: Locale;
};

export default function getLocalRecevierMixins<BasicComponent extends Vue>(componentName: string) { // eslint-disable-line
  return (Vue as VueConstructor<LocalComponent & BasicComponent>).extend({
    name,
    inject: {
      globalLocale: {
        default: undefined,
      },
    },

    computed: {
      locale(): ComponentLocale {
        const defaultData = defaultLocale[componentName];
        if (this.globalLocale && this.globalLocale[componentName]) {
          return {
            ...defaultData,
            ...this.globalLocale[componentName],
          };
        }
        return defaultData;
      },
    },

    methods: {
      t(pattern: LocalRule<Placement>, placement?: Placement): string {
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

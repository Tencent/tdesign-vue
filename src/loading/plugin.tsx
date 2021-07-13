import Vue from 'vue';
import LoadingComponent from './loading';
import { prefix } from '../config';
import { getAttach, removeClass } from '../utils/dom';
import { TdLoadingProps, LoadingInstance, LoadingMethod } from '../../types/loading/TdLoadingProps';

const lockClass = `${prefix}-loading-lock`;

function createLoading(props: TdLoadingProps): LoadingInstance {
  const loading = new LoadingComponent({
    propsData: { ...props, isService: true },
  }).$mount();

  const container = getAttach(props.attach);
  if (container) {
    container.appendChild(loading.$el);
  } else {
    console.error('attach is not exist');
  }

  const loadingInstance: LoadingInstance = {
    hide: () => {
      loading.loading = false;
      container.contains(loading.$el) && container.removeChild(loading.$el);
      // 清除attach逃逸的loading
      if (loading.attach) {
        while (container.getElementsByClassName('t-loading').length) {
          container.removeChild(container.getElementsByClassName('t-loading')[0]);
        }
      }
    },
  };

  return loadingInstance;
}

function produceLoading(props: boolean | TdLoadingProps): LoadingInstance {
  // 全屏加载
  if (typeof props === 'boolean' && props) {
    return createLoading({
      fullscreen: true,
      loading: true,
    });
  }

  // 销毁全屏实例
  if (typeof props === 'boolean' && !props) {
    removeClass(document.body, lockClass);
    document.body.removeChild(getAttach('body > .t-loading-fullscreen'));
    return;
  }

  // 自定义配置
  const options = { ...(props as TdLoadingProps) };
  return createLoading(options);
}

const _LoadingPlugin: Vue.PluginObject<undefined> = {
  install: () => {
    Vue.prototype.$loading = produceLoading;
  },
};

export const LoadingPlugin: (
  Vue.PluginObject<undefined>
) = _LoadingPlugin as any;

export default LoadingPlugin;

declare module 'vue/types/vue' {
  // Bind to `this` keyword
  interface Vue {
    $loading: LoadingMethod;
  }
};

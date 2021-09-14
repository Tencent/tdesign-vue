import Vue from 'vue';
import NotificationList from './notificationList';
import { getAttach } from '../utils/dom';
import {
  NotificationOptions,
  NotificationInstance,
  NotificationMethod,
  NotificationInfoMethod,
  NotificationWarningMethod,
  NotificationErrorMethod,
  NotificationSuccessMethod,
  NotificationCloseMethod,
  NotificationCloseAllMethod,
} from './type';
import { AttachNodeReturnValue } from '../common';

let seed = 0;
// 存储不同 attach 和 不同 placement 消息列表实例
const instanceMap: Map<AttachNodeReturnValue, object> = new Map();

const NotificationFunction = (options: NotificationOptions): Promise<NotificationInstance> => {
  seed += 1;
  const hackOptions = {
    placement: 'top-right',
    zIndex: 6000,
    attach: 'body',
    id: seed,
    ...options,
  };
  hackOptions.content = options.content ? options.content : '';

  const attachEl = getAttach(hackOptions.attach);
  if (!instanceMap.get(attachEl)) {
    instanceMap.set(attachEl, {});
  }
  let tmpInstance = instanceMap.get(attachEl)[hackOptions.placement];
  if (!tmpInstance) {
    const list = new NotificationList({
      propsData: {
        placement: hackOptions.placement,
      },
    });
    list.add(hackOptions);
    list.$mount();
    instanceMap.get(attachEl)[hackOptions.placement] = list;
    attachEl.appendChild(list.$el);
    tmpInstance = instanceMap.get(attachEl)[hackOptions.placement];
  } else {
    tmpInstance.add(hackOptions);
  }

  return new Promise((resolve) => {
    tmpInstance.$nextTick(() => {
      const list = tmpInstance.$children;
      resolve(list[list.length - 1]);
    });
  });
};

const showThemeNotification: NotificationMethod = (theme, options) => {
  const hackOptions = { ...options, theme };
  return NotificationFunction(hackOptions);
};

interface ExtraApi {
  info: NotificationInfoMethod;
  success: NotificationSuccessMethod;
  warning: NotificationWarningMethod;
  error: NotificationErrorMethod;
  close: NotificationCloseMethod;
  closeAll: NotificationCloseAllMethod;
}

const extraApi: ExtraApi = {
  info: (options) => showThemeNotification('info', options),
  success: (options) => showThemeNotification('success', options),
  warning: (options) => showThemeNotification('warning', options),
  error: (options) => showThemeNotification('error', options),
  close: (promise) => {
    promise.then((instance) => instance.close());
  },
  closeAll: () => {
    instanceMap.forEach((attach) => {
      Object.keys(attach).forEach((placement) => {
        attach[placement].removeAll();
      });
    });
  },
};

export type NotificationPluginType = Vue.PluginObject<undefined> & ExtraApi & NotificationMethod;

export const NotificationPlugin: NotificationPluginType = showThemeNotification as NotificationPluginType;

// 这样定义后，可以通过 NotificationPlugin('success', '消息') 或者 NotificationPlugin.success('消息')调用插件
Object.keys(extraApi).forEach((funcName) => {
  NotificationPlugin[funcName] = extraApi[funcName];
});

NotificationPlugin.install = () => {
  // 这样定义后，可以通过 this.$notify 调用插件
  Vue.prototype.$notify = NotificationPlugin;
  // 这样定义后，可以通过 this.$notification 调用插件
  Vue.prototype.$notification = NotificationPlugin;
};

export const NotifyPlugin = NotificationPlugin;

export default NotifyPlugin;

declare module 'vue/types/vue' {
  // Bind to `this` keyword
  interface Vue {
    $notify: NotificationMethod & ExtraApi;
    $notification: NotificationMethod & ExtraApi;
  }
}

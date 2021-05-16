import NotifyPlugin from './plugin';
import Notification from './notification';
import setInstallFn from '../utils/setInstallFn';
import { TdNotificationProps } from '../../types/notification/TdNotificationProps';

setInstallFn('Notification', Notification);

export * from '../../types/notification/TdNotificationProps';
export type NotificationProps = TdNotificationProps;
export { Notification, NotifyPlugin };
export default Notification;

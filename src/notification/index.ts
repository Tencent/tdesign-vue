import _Notification from './notification';
import withInstall from '../utils/withInstall';
import { TdNotificationProps } from '../../types/notification/TdNotificationProps';

export * from '../../types/notification/TdNotificationProps';
export type NotificationProps = TdNotificationProps;

export { default as NotifyPlugin } from './plugin';
export const Notification = withInstall('Notification', _Notification);
export default Notification;

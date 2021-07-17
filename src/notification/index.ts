import _Notification from './notification';
import withInstall from '../utils/withInstall';
import { TdNotificationProps } from './type';

export * from './type';
export type NotificationProps = TdNotificationProps;

export * from './plugin';
export const Notification = withInstall('Notification', _Notification);
export default Notification;

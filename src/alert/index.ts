import _Alert from './alert';
import withInstall from '../utils/withInstall';
import { TdAlertProps } from './type';

export * from './type';
export type AlertProps = TdAlertProps;

export const Alert = withInstall('Alert', _Alert);
export default Alert;

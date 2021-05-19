import _Alert from './alert';
import withInstall from '../utils/withInstall';
import { TdAlertProps } from '../../types/alert/TdAlertProps';

export * from '../../types/alert/TdAlertProps';
export type AlertProps = TdAlertProps;

export const Alert = withInstall('Alert', _Alert);
export default Alert;

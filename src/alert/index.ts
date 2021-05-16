import Alert from './alert';
import setInstallFn from '../utils/setInstallFn';
import { TdAlertProps } from '../../types/alert/TdAlertProps';

setInstallFn('Alert', Alert);

export type AlertProps = TdAlertProps;
export * from '../../types/alert/TdAlertProps';
export { Alert };
export default Alert;

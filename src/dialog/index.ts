import _Dialog from './dialog';
import withInstall from '../utils/withInstall';
import { TdDialogProps } from './type';

export * from './type';
export type DialogProps = TdDialogProps;

export const Dialog = withInstall('Dialog', _Dialog);
export { default as DialogPlugin } from './plugin';
export default Dialog;

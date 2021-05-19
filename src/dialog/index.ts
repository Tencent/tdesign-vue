import _Dialog from './dialog';
import withInstall from '../utils/withInstall';
import { TdDialogProps } from '../../types/dialog/TdDialogProps';

export * from '../../types/dialog/TdDialogProps';
export type DialogProps = TdDialogProps;

export const Dialog = withInstall('Dialog', _Dialog);
export { default as DialogPlugin } from './plugin';
export default Dialog;

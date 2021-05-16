import Dialog from './dialog';
import DialogPlugin from './plugin';
import setInstallFn from '../utils/setInstallFn';
import { TdDialogProps } from '../../types/dialog/TdDialogProps';

setInstallFn('Dialog', Dialog);

export * from '../../types/dialog/TdDialogProps';
export type DialogProps = TdDialogProps;
export { Dialog, DialogPlugin };
export default Dialog;

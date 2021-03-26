import _Textarea from './textarea';
import mapProps from '../utils/map-props';
import { TdTextareaProps } from '@TdTypes/textarea/TdTextareaProps';
import setInstallFn from '../utils/setInstallFn';

const Textarea = mapProps(['value'])(_Textarea);
setInstallFn('Textarea', Textarea);

export type TextareaProps = TdTextareaProps
export { Textarea };
export default Textarea;

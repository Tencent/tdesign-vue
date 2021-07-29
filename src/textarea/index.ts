import _Textarea from './textarea';
import mapProps from '../utils/map-props';
import setInstallFn from '../utils/withInstall';
import { TdTextareaProps } from './type';

import './style/';

export type TextareaProps = TdTextareaProps
export * from './type';
export const Textarea = setInstallFn('Textarea', mapProps(['value'])(_Textarea));
export default Textarea;

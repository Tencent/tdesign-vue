import _Textarea from './textarea';
import mapProps from '../utils/map-props';
import withInstall from '../utils/withInstall';
import { TdTextareaProps } from './type';

import './style';

export type TextareaProps = TdTextareaProps;
export * from './type';
export const Textarea = withInstall(mapProps(['value'])(_Textarea));
export default Textarea;

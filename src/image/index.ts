import _Image from './image';
import mapProps from '../utils/map-props';
import withInstall from '../utils/withInstall';
import { TdImageProps } from './type';

import './style';

export type ImageProps = TdImageProps;
export * from './type';

export const Image = withInstall(mapProps(['value'])(_Image));
export default Image;

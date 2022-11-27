import _Tag from './tag';
import _CheckTag from './check-tag';
import withInstall from '../utils/withInstall';
import mapProps from '../utils/map-props';
import { TdTagProps, TdCheckTagProps } from './type';

import './style';

export * from './type';

export type TagProps = TdTagProps;
export type CheckTagProps = TdCheckTagProps;

export const Tag = withInstall(_Tag);

export const CheckTag = withInstall(mapProps(['checked'], { model: { prop: 'checked', event: 'change' } })(_CheckTag));

export default Tag;

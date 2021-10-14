import _Tag from './tag';
import _CheckTag from './check-tag';
import withInstall from '../utils/withInstall';
import mapProps from '../utils/map-props';
import { TdTagProps } from './type';

import './style';

export * from './type';

export type TagProps = TdTagProps;

export const Tag = withInstall(_Tag);

export const CheckTag = withInstall(mapProps(
  ['checked'],
  { model: { prop: 'checked', event: 'change' } },
)(_CheckTag));

export default Tag;

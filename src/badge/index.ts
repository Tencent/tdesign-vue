import _Badge from './badge';
import withInstall from '../utils/withInstall';
import { TdBadgeProps } from './type';

import './style';

export * from './type';
export type BadgeProps = TdBadgeProps;

export const Badge = withInstall('Badge', _Badge);
export default Badge;

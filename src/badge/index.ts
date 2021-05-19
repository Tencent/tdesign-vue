import _Badge from './badge';
import withInstall from '../utils/withInstall';

export * from '../../types/badge/TdBadgeProps';

export const Badge = withInstall('Badge', _Badge);
export default Badge;

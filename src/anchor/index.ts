import _Anchor from './anchor';
import _AnchorItem from './anchor-item';
import _AnchorTarget from './anchor-target';
import withInstall from '../utils/withInstall';

export * from '../../types/anchor/TdAnchorProps';

export const Anchor = withInstall('Anchor', _Anchor);
export const AnchorItem = withInstall('AnchorItem', _AnchorItem);
export const AnchorTarget = withInstall('AnchorTarget', _AnchorTarget);

export default Anchor;

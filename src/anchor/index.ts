import Anchor from './anchor';
import AnchorItem from './anchor-item';
import AnchorTarget from './anchor-target';
import setInstallFnc from '../utils/setInstallFn';

setInstallFnc('Anchor', Anchor);
setInstallFnc('AnchorItem', AnchorItem);
setInstallFnc('AnchorTarget', AnchorTarget);

export * from '../../types/anchor/TdAnchorProps';
export { Anchor, AnchorItem, AnchorTarget };
export default Anchor;

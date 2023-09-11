import _TdTree from './td-tree';
import { adaptWithInstall } from './adapt';

import './style';

export const Tree = adaptWithInstall(_TdTree);

export * from './tree-types';
export default Tree;

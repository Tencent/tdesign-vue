import _Col from './col';
import _Row from './row';
import withInstall from '../utils/withInstall';
import { TdRowProps, TdColProps } from './type';

import './style';

export type ColProps = TdColProps;
export type RowProps = TdRowProps;
export * from './type';

export const Col = withInstall(_Col);
export const Row = withInstall(_Row);
export default { Row, Col };

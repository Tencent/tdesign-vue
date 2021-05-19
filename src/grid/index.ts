import _Col from './col';
import _Row from './row';
import withInstall from '../utils/withInstall';

export const Col = withInstall('Col', _Col);
export const Row = withInstall('Row', _Row);
export default { Row, Col };

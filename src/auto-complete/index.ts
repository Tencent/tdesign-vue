import _AutoComplete from './auto-complete';
import withInstall from '../utils/withInstall';

import './style';

export * from './type';

export const AutoComplete = withInstall(_AutoComplete);

export default AutoComplete;

import _DropdownItem from './dropdown-item';
import _Dropdown from './dropdown';
import withInstall from '../utils/withInstall';

import './style';

export const Dropdown = withInstall('Dropdown', _Dropdown);
export const DropdownItem = withInstall('DropdownItem', _DropdownItem);

export default Dropdown;

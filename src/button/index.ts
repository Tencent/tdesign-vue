import Button from './button';
import setInstallFn from '../utils/setInstallFn';
import { TdButtonProps } from '../../types/button/TdButtonProps';

setInstallFn('Button', Button);

export type ButtonProps = TdButtonProps;
export * from '../../types/button/TdButtonProps';
export { Button };
export default Button;

import _Button from './button';
import withInstall from '../utils/withInstall';
import { TdButtonProps } from '../../types/button/TdButtonProps';

export * from '../../types/button/TdButtonProps';
export type ButtonProps = TdButtonProps;

export const Button = withInstall('Button', _Button);
export default Button;

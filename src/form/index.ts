import _Form from './form';
import _FormItem from './form-item';
import withInstall from '../utils/withInstall';
import { TdFormProps } from './type';

export * from './type';
export type FormProps = TdFormProps;

export const Form = withInstall('Form', _Form);
export const FormItem = withInstall('FormItem', _FormItem);
export default Form;

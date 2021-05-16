import Form from './form';
import FormItem from './form-item';
import setInstallFn from '../utils/setInstallFn';
import { TdFormProps } from '../../types/form/TdFormProps';

setInstallFn('Form', Form);
setInstallFn('FormItem', FormItem);

export * from '../../types/form/TdFormProps';
export type FormProps = TdFormProps;
export { Form, FormItem };
export default Form;

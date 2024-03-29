import VueCompositionAPI from '@vue/composition-api';

import _TagInput from './tag-input';
import withInstall from '../utils/withInstall';
import { TdTagInputProps } from './type';

import './style';

export * from './type';
export * from './interface';
export type TagInputProps = TdTagInputProps;

export const TagInput = withInstall(_TagInput, VueCompositionAPI);

export default TagInput;

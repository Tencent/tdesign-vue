import VueCompositionAPI from '@vue/composition-api';
import _Upload from './upload';
import withInstall from '../utils/withInstall';

import './style';

export * from './interface';

export const Upload = withInstall(_Upload, VueCompositionAPI);

export default Upload;

export * from './type';

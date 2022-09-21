import VueCompositionAPI from '@vue/composition-api';
import _Rate from './rate';
import withInstall from '../utils/withInstall';

import './style';

export * from './type';

export const Rate = withInstall(_Rate, VueCompositionAPI);

export default Rate;

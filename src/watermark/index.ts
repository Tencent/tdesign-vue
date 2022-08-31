import VueCompositionAPI from '@vue/composition-api';
import _Watermark from './watermark';

import withInstall from '../utils/withInstall';

export const Watermark = withInstall(_Watermark, VueCompositionAPI);

export default Watermark;

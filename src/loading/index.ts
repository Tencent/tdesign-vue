import vLoading from './directive';
import _Loading from './loading';
import withInstall from '../utils/withInstall';
import { TdLoadingProps } from './type';

import './style';

export type LoadingProps = TdLoadingProps;
export * from './type';
export * from './plugin';

export { default as LoadingPlugin } from './plugin';
export const Loading = withInstall(_Loading, null, { name: 'loading', comp: vLoading });
export default Loading;

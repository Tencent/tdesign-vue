import _Loading from './loading';
import withInstall from '../utils/withInstall';

export { default as LoadingPlugin } from './plugin';
export const Loading = withInstall('Loading', _Loading);
export default Loading;

import _Message from './message';
import withInstall from '../utils/withInstall';
import { TdMessageProps } from './type';

export * from './type';
export type MessageProps = TdMessageProps;

export { default as MessagePlugin } from './plugin';
export const Message = withInstall('Message', _Message);
export default Message;

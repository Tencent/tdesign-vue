import _Message from './message';
import withInstall from '../utils/withInstall';
import { TdMessageProps } from '../../types/message/TdMessageProps';

export * from '../../types/message/TdMessageProps';
export type MessageProps = TdMessageProps;

export { default as MessagePlugin } from './plugin';
export const Message = withInstall('Message', _Message);
export default Message;

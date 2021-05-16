import Message from './message';
import MessagePlugin from './plugin';
import setInstallFn from '../utils/setInstallFn';
import { TdMessageProps } from '../../types/message/TdMessageProps';

setInstallFn('Message', Message);

export * from '../../types/message/TdMessageProps';
export type MessageProps = TdMessageProps;
export {
  Message,
  MessagePlugin,
};

export default Message;

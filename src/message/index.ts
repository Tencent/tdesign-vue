import _Message from './message';
import withInstall from '../utils/withInstall';
import { TdMessageProps } from './type';

export * from './type';
export * from './plugin';
export type MessageProps = TdMessageProps;

export const Message = withInstall('Message', _Message);
export default Message;

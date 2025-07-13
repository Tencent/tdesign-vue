import _QRCode from './QRCode';
import withInstall from '../utils/withInstall';
import { TdQRCodeProps } from './type';

import './style';

export type QRCodeProps = TdQRCodeProps;
export * from './type';

export const Qrcode = withInstall(_QRCode);

export default Qrcode;

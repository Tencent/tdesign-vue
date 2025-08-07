import _QRCode from './qrcode';
import withInstall from '../utils/withInstall';
import { TdQRCodeProps } from './type';

import './style';

export type QRCodeProps = TdQRCodeProps;
export * from './type';

export const QRCode = withInstall(_QRCode, null, null, 'TQrcode');

export default QRCode;

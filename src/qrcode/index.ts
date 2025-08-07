import VueCompositionAPI from '@vue/composition-api';
import _QRCode from './qrcode';
import withInstall from '../utils/withInstall';
import { TdQRCodeProps } from './type';

import './style';

export type QRCodeProps = TdQRCodeProps;
export * from './type';

export const QRCode = withInstall(_QRCode, VueCompositionAPI, null, 'TQrcode');

export default QRCode;

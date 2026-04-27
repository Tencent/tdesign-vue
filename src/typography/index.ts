import _Typography from './typography';
import _Text from './text';
import _Title from './title';
import _Paragraph from './paragraph';
import withInstall from '../utils/withInstall';

import type { TdParagraphProps } from './type';

import './style';

export type TypographyProps = TdParagraphProps;

export * from './type';

export const Typography = withInstall(_Typography, null, null, 'TTypography');
export const Text = withInstall(_Text, null, null, 'TTypographyText');
export const Title = withInstall(_Title, null, null, 'TTypographyTitle');
export const Paragraph = withInstall(_Paragraph, null, null, 'TTypographyParagraph');

export default Typography;

import VueCompositionAPI from '@vue/composition-api';
import _Typography from './typography';
import _Text from './text';
import _Title from './title';
import _Paragraph from './paragraph';
import withInstall from '../utils/withInstall';

import type { TdParagraphProps } from './type';

import './style';

export type TypographyProps = TdParagraphProps;

export * from './type';

export const Typography = withInstall(_Typography, VueCompositionAPI, null, 'TTypography');
export const Text = withInstall(_Text, VueCompositionAPI, null, 'TTypographyText');
export const Title = withInstall(_Title, VueCompositionAPI, null, 'TTypographyTitle');
export const Paragraph = withInstall(_Paragraph, VueCompositionAPI, null, 'TTypographyParagraph');

export default Typography;

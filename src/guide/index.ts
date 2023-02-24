import _Guide from './guide';
import withInstall from '../utils/withInstall';
import { TdGuideProps, GuideStep } from './type';

import './style';

export * from './type';

/**
 * use GuideStep instead
 * @deprecated
 */
export type TdGuideStepProps = GuideStep;

export type GuideProps = TdGuideProps;

export const Guide = withInstall(_Guide);

export default Guide;

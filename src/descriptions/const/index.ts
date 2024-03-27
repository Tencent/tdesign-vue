import type { InjectionKey } from '@vue/composition-api';
import { TdDescriptionsProps } from '../type';

const descriptionsKey: InjectionKey<TdDescriptionsProps> = Symbol('TDescriptions');

export default descriptionsKey;

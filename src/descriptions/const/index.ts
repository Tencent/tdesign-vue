import type { InjectionKey } from 'vue';
import { TdDescriptionsProps } from '../type';

const descriptionsKey: InjectionKey<TdDescriptionsProps> = Symbol('TDescriptions');

export default descriptionsKey;

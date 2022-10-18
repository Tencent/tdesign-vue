import React from 'react';
import { TdTimelineProps } from './type';

const StepsContext = React.createContext<{
  theme: TdTimelineProps['theme'];
  reverse: TdTimelineProps['reverse'];
  itemsStatus: string[];
  layout: TdTimelineProps['layout'];
  globalAlign?: TdTimelineProps['labelAlign'];
  mode?: TdTimelineProps['mode'];
}>({
  theme: 'default',
  reverse: false,
  itemsStatus: [],
  layout: 'vertical',
  mode: 'alternate',
});

export default StepsContext;

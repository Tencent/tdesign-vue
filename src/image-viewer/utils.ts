import { TdImageViewerProps } from './type';

// eslint-disable-next-line import/prefer-default-export
export const getOverlay = (props: TdImageViewerProps) => {
  if (props.showOverlay !== undefined) {
    return props.showOverlay;
  }
  return props.mode === 'modal';
};

export const enum EVENT_CODE {
  left = 'ArrowLeft', // 37
  up = 'ArrowUp', // 38
  right = 'ArrowRight', // 39
  down = 'ArrowDown', // 40
  esc = 'Escape',
}

export const DEFAULT_IMAGE_SCALE = {
  max: 2,
  min: 0.5,
  step: 0.5,
  defaultScale: 1,
};

export default EVENT_CODE;

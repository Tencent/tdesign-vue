export function mockDelay(timeout = 300) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), timeout);
  });
}

export function simulateInputChange(dom, text) {
  // eslint-disable-next-line
  dom.value = text;
  // eslint-disable-next-line
  dom.dispatchEvent(new Event('input'));
}

// Vue2 特有
export function createElementById(vue2AttachTo = 'focus-dom') {
  const div = document.createElement('div');
  div.id = vue2AttachTo;
  document.body.appendChild(div);
}

// event 可选值：load/error
export function simulateImageEvent(dom, event) {
  dom.dispatchEvent(new Event(event));
}

export function simulateKeydownEvent(dom, type) {
  let event;
  switch (type) {
    case 'ArrowDown':
      event = new KeyboardEvent('keydown', { key: 'ArrowDown', code: 'ArrowDown', charCode: 40 });
      break;
    case 'ArrowUp':
      event = new KeyboardEvent('keydown', { key: 'ArrowUp', code: 'ArrowUp', charCode: 38 });
      break;
    case 'ArrowLeft':
      event = new KeyboardEvent('keydown', { key: 'ArrowLeft', code: 'ArrowLeft', charCode: 37 });
      break;
    case 'ArrowRight':
      event = new KeyboardEvent('keydown', { key: 'ArrowRight', code: 'ArrowRight', charCode: 36 });
      break;
    case 'Escape':
      event = new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', charCode: 27 });
      break;
    case 'Enter':
      event = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', charCode: 13 });
      break;
    default:
      console.warn('Event Type is Error');
      break;
  }
  dom.dispatchEvent(event);
}

export default {};

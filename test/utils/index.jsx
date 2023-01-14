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

export default {};

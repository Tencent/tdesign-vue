export function mockDelay(timeout = 300) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), timeout);
  });
}

export default {};

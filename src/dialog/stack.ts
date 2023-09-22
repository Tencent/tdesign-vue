const data: number[] = [];

const push = (value: number) => {
  data.push(value);
};

const pop = (value: number) => {
  if (data.length && data.includes(value)) {
    data.pop();
  }
};

const stack = {
  push,
  pop,
  get top() {
    return data[data.length - 1];
  },
};
export default stack;

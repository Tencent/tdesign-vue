import { getNodeDataByValue } from '../utils';

describe('TreeSelect node lookup', () => {
  it('preserves bigint values and distinguishes them from string values', () => {
    const value = 9007199254740993n;
    const keys = { value: 'value', label: 'label', children: 'children' };
    const bigintNode = { value, label: 'Bigint node' };
    const stringNode = { value: String(value), label: 'String node' };
    expect(getNodeDataByValue([value, String(value)], [stringNode, bigintNode], keys))
      .toEqual([bigintNode, stringNode]);
    expect(getNodeDataByValue([value], [], keys)).toEqual([{ value, label: value }]);
  });
});

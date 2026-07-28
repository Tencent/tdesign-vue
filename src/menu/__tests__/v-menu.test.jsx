import VMenu from '../v-menu';

describe('VMenu', () => {
  it('removes menu items from the tree and cache', () => {
    const menu = new VMenu({});

    menu.add({ value: 'cached-child', parent: 'missing-parent' });
    menu.remove('cached-child');
    expect(menu.cache.size).toBe(0);

    menu.add({ value: 'parent', parent: null });
    menu.add({ value: 'child', parent: 'parent' });
    expect(menu.getChild('parent').map((item) => item.value)).toEqual(['child']);

    menu.remove('child');
    expect(menu.getChild('parent')).toEqual([]);

    menu.remove('parent');
    expect(menu.data.children).toEqual([]);
  });
});

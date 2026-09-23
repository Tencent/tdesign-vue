import { mount } from '@vue/test-utils';
import { Dropdown, DropdownMenu, DropdownItem } from '../index';

// hover item event: https://github.com/Tencent/tdesign-vue/issues/3887
describe('Dropdown hover item event', () => {
  const options = [
    {
      content: '操作一',
      value: 1,
    },
    {
      content: '操作二',
      value: 2,
    },
    {
      content: '操作三',
      value: 3,
    },
  ];

  // Popup renders its overlay into document.body, so previously opened panels stay in the document.
  // Always read the most recently appended panel to keep each assertion scoped to this test.
  const currentPanelItems = () => {
    const menus = document.querySelectorAll('.t-dropdown__menu');
    const menu = menus[menus.length - 1];
    return menu ? menu.querySelectorAll('.t-dropdown__item') : [];
  };

  it('should emit hover event when mouse enters a dropdown item', async () => {
    const onHover = vi.fn();
    const onClick = vi.fn();
    const wrapper = mount({
      render() {
        return <DropdownMenu options={options} onHover={onHover} onClick={onClick}></DropdownMenu>;
      },
    });
    const items = wrapper.findAll('.t-dropdown__item');
    expect(items.length).toBe(3);

    items.at(0).trigger('mouseenter');
    expect(onHover).toHaveBeenCalledTimes(1);

    const [dropdownItem, context] = onHover.mock.calls[0];
    expect(dropdownItem.value).toBe(1);
    expect(context.e).toBeTruthy();

    // mouseleave must not emit hover, and hover must not be treated as a click
    items.at(0).trigger('mouseleave');
    expect(onHover).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();

    // a second item emits its own payload
    items.at(1).trigger('mouseenter');
    expect(onHover).toHaveBeenCalledTimes(2);
    expect(onHover.mock.calls[1][0].value).toBe(2);
  });

  it('should support @hover listener binding', async () => {
    const onHoverFn = vi.fn();
    const wrapper = mount({
      render() {
        return <DropdownMenu options={options} on={{ hover: onHoverFn }}></DropdownMenu>;
      },
    });
    wrapper.find('.t-dropdown__item').trigger('mouseenter');
    expect(onHoverFn).toHaveBeenCalledTimes(1);
    expect(onHoverFn.mock.calls[0][0].value).toBe(1);
    expect(onHoverFn.mock.calls[0][1].e).toBeTruthy();
  });

  it('should not emit hover for disabled item or submenu parent', async () => {
    const onHover = vi.fn();
    const submenuOptions = [
      { content: 'normal', value: 'n' },
      { content: 'disabled', value: 'd', disabled: true },
      { content: 'parent', value: 'p', children: [{ content: 'child', value: 'c' }] },
    ];
    const wrapper = mount({
      render() {
        return <DropdownMenu options={submenuOptions} onHover={onHover}></DropdownMenu>;
      },
    });
    const items = wrapper.findAll('.t-dropdown__item');

    // baseline signal: a normal leaf item does emit
    items.at(0).trigger('mouseenter');
    expect(onHover).toHaveBeenCalledTimes(1);
    expect(onHover.mock.calls[0][0].value).toBe('n');

    items.at(1).trigger('mouseenter');
    expect(onHover).toHaveBeenCalledTimes(1);

    items.at(2).trigger('mouseenter');
    expect(onHover).toHaveBeenCalledTimes(1);
  });

  it('should call each option onHover', async () => {
    const hoverOptions = [
      { content: '操作一', value: 1, onHover: vi.fn() },
      { content: '操作二', value: 2, onHover: vi.fn() },
    ];
    const wrapper = mount({
      render() {
        return <DropdownMenu options={hoverOptions}></DropdownMenu>;
      },
    });
    wrapper.findAll('.t-dropdown__item').trigger('mouseenter');
    hoverOptions.forEach((option) => {
      expect(option.onHover).toHaveBeenCalledTimes(1);
    });
  });

  it('should emit hover through Dropdown component with options', async () => {
    const onHover = vi.fn();
    const wrapper = mount({
      render() {
        return (
          <Dropdown trigger="click" options={options} onHover={onHover}>
            <div>menu</div>
          </Dropdown>
        );
      },
    });
    await wrapper.trigger('click');
    const items = currentPanelItems();
    expect(items.length).toBe(3);

    items[0].dispatchEvent(new Event('mouseenter'));
    expect(onHover).toHaveBeenCalledTimes(1);
    expect(onHover.mock.calls[0][0].value).toBe(1);
  });

  it('should emit hover through Dropdown component by slots', async () => {
    const onHoverFn = vi.fn();
    const wrapper = mount({
      render() {
        return (
          <Dropdown trigger="click" on={{ hover: onHoverFn }}>
            <div>menu</div>
            <DropdownMenu>
              <DropdownItem value={1}>操作一</DropdownItem>
              <DropdownItem value={2}>操作二</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      },
    });
    await wrapper.trigger('click');
    const items = currentPanelItems();
    expect(items.length).toBe(2);

    items[1].dispatchEvent(new Event('mouseenter'));
    expect(onHoverFn).toHaveBeenCalledTimes(1);
    expect(onHoverFn.mock.calls[0][0].value).toBe(2);
  });
});

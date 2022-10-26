import { mount, renderToString, shallowMount } from '@vue/test-utils';
import Popup from '@/src/popup/index.ts';
import Button from '@/src/button/index.ts';

describe('Popup', () => {
  describe(':props', () => {
    /** 制定挂载节点  */
    // it(':attach', () => {
    //   const visible = true;
    //   const wrapper = mount({
    //     render(h) {
    //       return <div id="container">
    //         <Popup trigger='click' attach='#container'>
    //           <Button variant='outline' id="btn">触发</Button>
    //           <template slot='content'>
    //             触发显示
    //           </template>
    //       </Popup>
    //       </div>
    //     }
    //   })
    //   console.log('wrapper.findComponent(Button) :>> ', wrapper.findComponent(Button));
    //   wrapper.findComponent(Button).trigger('click');
    //   console.log(wrapper.html());
    // });
    /** 浮层里面的内容 */
    it(':content', async () => {
      const content = '这里是弹出内容';
      const visible = true;
      const div = document.createElement('div', {});
      div.setAttribute('id', 'container');
      document.body.appendChild(div);
      const wrapper = await mount(Popup, {
        props: {
          content,
          visible,
        },
        // attachTo: document.body
      });
      // console.log('document.body.innerHTML', document.body.innerHTML)
      console.log('document.body', document.body.innerHTML);
    });
    /** 触发元素，同 triggerElement */
    // it(':default', ()=>{
    //   const wrapper = mount({
    //     render(){
    //       let content = '这里是弹出内容'
    //       return <Popup content={content} trigger='click'>
    //         <Button variant="outline" id='btn'>触发</Button>
    //         <template slot='content'>{content}</template>
    //       </Popup>
    //     }
    //   })
    // })
    // /** 延时显示或隐藏覆层，[延迟显示的时间，延迟隐藏的时间]，单位：毫秒。如果只有一个时间，则表示显示和隐藏的延迟时间相同。示例 `'300'` 或者 `[200, 200]`。默认为：[250, 150] */
    // it(':delay', ()=>{
    //   const wrapper = mount({
    //     render(){
    //       let content = '这里是弹出内容'
    //       return <Popup content={content} trigger='click'>
    //         <Button variant="outline" id='btn'>触发</Button>
    //         <template slot='content'>{content}</template>
    //       </Popup>
    //     }
    //   })
    // })
    // /** 是否在关闭浮层时销毁浮层 */
    // it(':destroyOnClose', ()=>{
    //   const wrapper = mount({
    //     render(){
    //       let content = '这里是弹出内容'
    //       return <Popup content={content} trigger='click'>
    //         <Button variant="outline" id='btn'>触发</Button>
    //         <template slot='content'>{content}</template>
    //       </Popup>
    //     }
    //   })
    // })
    // /** 是否禁用组件 */
    // it(':disabled', ()=>{
    //   const wrapper = mount({
    //     render(){
    //       let content = '这里是弹出内容'
    //       return <Popup content={content} trigger='click'>
    //         <Button variant="outline" id='btn'>触发</Button>
    //         <template slot='content'>{content}</template>
    //       </Popup>
    //     }
    //   })
    // })
    // /** 浮层是否隐藏空内容，默认不隐藏 */
    // it(':hideEmptyPopup', ()=>{
    //   const wrapper = mount({
    //     render(){
    //       let content = '这里是弹出内容'
    //       return <Popup content={content} trigger='click'>
    //         <Button variant="outline" id='btn'>触发</Button>
    //         <template slot='content'>{content}</template>
    //       </Popup>
    //     }
    //   })
    // })
    // /** 浮层类名，示例：'name1 name2 name3' 或 `['name1', 'name2']` 或 `[{ 'name1': true }]` */
    // it(':overlayClassName', ()=>{
    //   const wrapper = mount({
    //     render(){
    //       let content = '这里是弹出内容'
    //       return <Popup content={content} trigger='click'>
    //         <Button variant="outline" id='btn'>触发</Button>
    //         <template slot='content'>{content}</template>
    //       </Popup>
    //     }
    //   })
    // })
    // /** 浮层内容部分类名，示例：'name1 name2 name3' 或 `['name1', 'name2']` 或 `[{ 'name1': true }]` */
    // it(':overlayInnerClassName', ()=>{
    //   const wrapper = mount({
    //     render(){
    //       let content = '这里是弹出内容'
    //       return <Popup content={content} trigger='click'>
    //         <Button variant="outline" id='btn'>触发</Button>
    //         <template slot='content'>{content}</template>
    //       </Popup>
    //     }
    //   })
    // })
    // /** 浮层内容部分样式，第一个参数 `triggerElement` 表示触发元素 DOM 节点，第二个参数 `popupElement` 表示浮层元素 DOM 节点 */
    // it(':overlayInnerStyle', ()=>{
    //   const wrapper = mount({
    //     render(){
    //       let content = '这里是弹出内容'
    //       return <Popup content={content} trigger='click'>
    //         <Button variant="outline" id='btn'>触发</Button>
    //         <template slot='content'>{content}</template>
    //       </Popup>
    //     }
    //   })
    // })
    // /** 浮层样式，第一个参数 `triggerElement` 表示触发元素 DOM 节点，第二个参数 `popupElement` 表示浮层元素 DOM 节点 */
    // it(':overlayStyle', ()=>{
    //   const wrapper = mount({
    //     render(){
    //       let content = '这里是弹出内容'
    //       return <Popup content={content} trigger='click'>
    //         <Button variant="outline" id='btn'>触发</Button>
    //         <template slot='content'>{content}</template>
    //       </Popup>
    //     }
    //   })
    // })
    // /** 浮层出现位置 */
    // it(':placement', ()=>{
    //   const wrapper = mount({
    //     render(){
    //       let content = '这里是弹出内容'
    //       return <Popup content={content} trigger='click'>
    //         <Button variant="outline" id='btn'>触发</Button>
    //         <template slot='content'>{content}</template>
    //       </Popup>
    //     }
    //   })
    // })
    // /** 是否显示浮层箭头 */
    // it(':showArrow', ()=>{
    //   const wrapper = mount({
    //     render(){
    //       let content = '这里是弹出内容'
    //       return <Popup content={content} trigger='click'>
    //         <Button variant="outline" id='btn'>触发</Button>
    //         <template slot='content'>{content}</template>
    //       </Popup>
    //     }
    //   })
    // })
    // /** 触发浮层出现的方式 */
    // it(':trigger', ()=>{
    //   const wrapper = mount({
    //     render(){
    //       let content = '这里是弹出内容'
    //       return <Popup content={content} trigger='click'>
    //         <Button variant="outline" id='btn'>触发</Button>
    //         <template slot='content'>{content}</template>
    //       </Popup>
    //     }
    //   })
    // })
    // /** 触发元素 */
    // it(':triggerElement', ()=>{
    //   const wrapper = mount({
    //     render(){
    //       let content = '这里是弹出内容'
    //       return <Popup content={content} trigger='click'>
    //         <Button variant="outline" id='btn'>触发</Button>
    //         <template slot='content'>{content}</template>
    //       </Popup>
    //     }
    //   })
    // })
    // /** 是否显示浮层 */
    // it(':visible', ()=>{
    //   const wrapper = mount({
    //     render(){
    //       let content = '这里是弹出内容'
    //       return <Popup content={content} trigger='click'>
    //         <Button variant="outline" id='btn'>触发</Button>
    //         <template slot='content'>{content}</template>
    //       </Popup>
    //     }
    //   })
    // })
    // /** 是否显示浮层，非受控属性 */
    // it(':defaultVisible', ()=>{
    //   const wrapper = mount({
    //     render(){
    //       let content = '这里是弹出内容'
    //       return <Popup content={content} trigger='click'>
    //         <Button variant="outline" id='btn'>触发</Button>
    //         <template slot='content'>{content}</template>
    //       </Popup>
    //     }
    //   })
    // })
    // /** 组件层级，Web 侧样式默认为 5500，移动端和小程序样式默认为 1500 */
    // it(':zIndex', ()=>{
    //   const wrapper = mount({
    //     render(){
    //       let content = '这里是弹出内容'
    //       return <Popup content={content} trigger='click'>
    //         <Button variant="outline" id='btn'>触发</Button>
    //         <template slot='content'>{content}</template>
    //       </Popup>
    //     }
    //   })
    // })
    // /** 下拉选项滚动事件 */
    // it(':onScroll', ()=>{
    //   const wrapper = mount({
    //     render(){
    //       let content = '这里是弹出内容'
    //       return <Popup content={content} trigger='click'>
    //         <Button variant="outline" id='btn'>触发</Button>
    //         <template slot='content'>{content}</template>
    //       </Popup>
    //     }
    //   })
    // })
    // /** 当浮层隐藏或显示时触发，`trigger=document` 表示点击非浮层元素触发；`trigger=context-menu` 表示右击触发 */
    // it(':onVisibleChange', ()=>{
    //   const wrapper = mount({
    //     render(){
    //       let content = '这里是弹出内容'
    //       return <Popup content={content} trigger='click'>
    //         <Button variant="outline" id='btn'>触发</Button>
    //         <template slot='content'>{content}</template>
    //       </Popup>
    //     }
    //   })
    // })
  });
  describe('@event', () => {
    it('onScroll', () => {});

    it('onVisibleChange', () => {});
  });
  let cmp;

  beforeEach(() => {
    cmp = mount(Popup, {
      propsData: {
        disabled: true,
        placement: 'top-left',
        visible: false,
        trigger: 'click',
        content: 'txt',
        showArrow: true,
        destroyOnClose: true,
      },
    });
  });

  it('equals disabled to true', () => {
    expect(cmp.vm.disabled).toEqual(true);
  });
});

describe('Test Icon', () => {
  const iconfontClassName = 't-iconfont-stylesheet--unique-class';
  const svgClassName = 't-icon-svg-js--unique-class';
  const defaultIconfontUrl = 'https://tdesign.gtimg.com/icon/0.0.3/fonts/index.css';
  const defaultSvgUrl = 'https://tdesign.gtimg.com/icon/default-demo/index.js';
  const anotherIconfontUrl = 'https://tdesign.gtimg.com/icon/default-demo/index.css';
  const anotherSvgUrl = 'https://tdesign.gtimg.com/icon/default-demo/index.js';

  beforeEach(() => {
    cy.visit('/#/components/icon');
    // cy.document().then((doc) => {
    //   const doms = doc.head.querySelectorAll(`.${iconfontClassName}`);
    //   for (let index = 0, len = doms.length; index < len; index++) {
    //     doc.head.removeChild(doms[index]);
    //   }
    // });
  });
  it('page should load a default iconfont url, another iconfont url has been loaded as well.', () => {
    cy.document().then((doc) => {
      const doms = doc.head.querySelectorAll(`.${iconfontClassName}`);
      expect(doms.length).to.equal(2);
      expect(doms[0].getAttribute('href')).to.equal(defaultIconfontUrl);
      expect(doms[1].getAttribute('href')).to.equal(anotherIconfontUrl);
      cy.log('iconfont urls have been loaded');
    });
  });
  it('page should load a default svg url, another svg url has been loaded as well.', () => {
    cy.document().then((doc) => {
      const doms = doc.body.querySelectorAll(`.${svgClassName}`);
      expect(doms.length).to.equal(2);
      expect(doms[0].getAttribute('src')).to.equal(defaultSvgUrl);
      expect(doms[1].getAttribute('src')).to.equal(anotherSvgUrl);
      cy.log('icon svg urls have been loaded');
    });
  });
});

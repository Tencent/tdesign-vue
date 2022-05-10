import Vue from 'vue';

export default Vue.extend({
  name: 'render-component',
  functional: true,
  props: {
    render: Function,
  },
  render(h, ctx) {
    return ctx.props.render(h, ctx.data.attrs);
  },
});

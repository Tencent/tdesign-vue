import circleAdapter from '../../_common/js/loading/circle-adapter';
import { getClassPrefixMixins } from '../../config-provider/config-receiver';
import mixins from '../../utils/mixins';

const classPrefixMixins = getClassPrefixMixins('loading');

export default mixins(classPrefixMixins).extend({
  name: 'TLoadingGradient',
  mounted() {
    this.$nextTick(() => {
      this.updateColor();
    });
  },
  updated() {
    this.updateColor();
  },
  methods: {
    updateColor() {
      // @ts-ignore
      const circleElem = this.$refs.circle as HTMLElement;
      circleAdapter(circleElem);
    },
  },
  render() {
    const classes = [`${this.classPrefix}-loading__gradient`, `${this.classPrefix}-icon-loading`];
    return (
      <svg
        class={classes}
        viewBox="0 0 14 14"
        version="1.1"
        width="1em"
        height="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <foreignObject x="1" y="1" width="12" height="12">
          <div class={`${this.classPrefix}-loading__gradient-conic`} ref="circle" />
        </foreignObject>
      </svg>
    );
  },
});

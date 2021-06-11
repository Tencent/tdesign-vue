import Vue from 'vue';
import { prefix } from '../../config';
const name = `${prefix}-gradient-icon`;
const classname = `${prefix}-icon-loading`;
const iconSizeConfig = {
  small: '14px',
  medium: '36px',
  large: '56px',
};

export default Vue.extend({
  name,

  props: {
    size: {
      type: String,
      default: 'medium',
    },
  },

  data() {
    return {
      classname,
    };
  },

  computed: {
    defaultSize() {
      return iconSizeConfig.medium;
    },
  },

  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg"  width={iconSizeConfig[this.size] || this.defaultSize} height={iconSizeConfig[this.size] || this.defaultSize} style="display: inline-block;vertical-align: middle;" viewBox="0 0 200 200" class={`${classname}`}>
        <g id="load">
          <linearGradient id="right" gradientUnits="userSpaceOnUse" x1="150" y1="20" x2="150" y2="180">
            <stop  offset="0" style="stop-color:#0151D9"/>
            <stop  offset="1" style="stop-color:#80A8EC"/>
          </linearGradient>
          <path class="right" style="fill:url(#right);" d="M100,0v20c44.1,0,80,35.9,80,80c0,44.1-35.9,80-80,80v20c55.2,0,100-44.8,100-100S155.2,0,100,0z"/>
          <linearGradient id="left" gradientUnits="userSpaceOnUse" x1="50" y1="0" x2="50" y2="180">
            <stop  offset="0" style="stop-color:#FFFFFF"/>
            <stop  offset="1" style="stop-color:#80A8EC"/>
          </linearGradient>
            <path class="left" style="fill:url(#left)" d="M20,100c0-44.1,35.9-80,80-80V0C44.8,0,0,44.8,0,100s44.8,100,100,100v-20C55.9,180,20,144.1,20,100z"/>
            <circle class="top" style="fill:#0151D9;" cx="100" cy="10" r="10"/>
        </g>
      </svg>
    );
  },
});


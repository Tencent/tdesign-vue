<template>
  <div class="theme-generator">
    <t-button variant="outline" class="generator-btn" shape="circle" @click="handleClick">
      <t-icon name="setting" />
    </t-button>
    <t-drawer :visible.sync="visible" :header="false" :closeBtn="false" :preventScrollThrough="false">
      <p class="theme-generator__title">主题色</p>
      <t-row :gutter="[16, 16]">
        <t-col v-for="(theme, idx) in themes" :key="idx" :span="4">
          <div
            class="theme-generator__block"
            :style="{ 'background-color': theme.value }"
            @click="generateNewTheme(theme.value)"
          >
            {{ theme.name }}
          </div>
        </t-col>
      </t-row>
      <t-divider />
      <p class="theme-generator__subtitle"><t-button />品牌色</p>
      <div
        class="theme-generator__horizontal-list"
        v-for="(color, idx) in lightColorPalette"
        :key="idx"
        :style="{ background: color }"
      />
      <t-divider />
      <t-row class="theme-generator__vertical-list">
        <t-button :style="{ background: lightColorPalette[0] }" />
        <span>Light</span>
      </t-row>
      <t-row class="theme-generator__vertical-list">
        <t-button :style="{ background: lightColorPalette[1] }" />
        <span>Focus</span>
      </t-row>
      <t-row class="theme-generator__vertical-list">
        <t-button :style="{ background: lightColorPalette[2] }" />
        <span>Disabled</span>
      </t-row>
      <t-row class="theme-generator__vertical-list">
        <t-button :style="{ background: lightColorPalette[6] }" />
        <span>Hover</span>
      </t-row>
      <t-row class="theme-generator__vertical-list">
        <t-button :style="{ background: lightColorPalette[8] }" />
        <span>Click</span>
      </t-row>
      <t-divider />
      <p class="theme-generator__subtitle"><t-button :style="{ background: otherColor.error }" />错误色</p>
      <t-divider />
      <p class="theme-generator__subtitle"><t-button :style="{ background: otherColor.warning }" />警告色</p>
      <t-divider />
      <p class="theme-generator__subtitle"><t-button :style="{ background: otherColor.success }" />成功色</p>
      <div slot="footer" class="theme-generator__footer">
        <t-tooltip content="将导出的css文件配置在项目中">
          <t-button theme="default" variant="outline">导出配置</t-button>
        </t-tooltip>
      </div>
    </t-drawer>
  </div>
</template>

<script>
import { Color } from 'tvision-color';
export default {
  components: {},
  data() {
    return {
      themes: [
        {
          name: '腾讯蓝',
          value: '#0052D9',
        },
        {
          name: '微信绿',
          value: '#1aad19',
        },
        {
          name: '中国红',
          value: '#c8102e',
        },
        {
          name: '粉色系',
          value: '#ed49b4',
        },
        {
          name: '暖日橙',
          value: '#ed7b2f',
        },
      ],
      lightColorPalette: [''],
      darkColorPalette: [''],
      currentThemeColor: '#0052D9',
      visible: false,
      otherColor: {
        error: '',
        warning: '',
        success: '',
      },
    };
  },
  mounted() {
    this.lightColorPalette = this.getCurrentPalette();
    this.otherColor = this.getOtherColor();
  },
  watch: {
    currentThemeColor() {
      this.lightColorPalette = this.getCurrentPalette();
      this.otherColor = this.getOtherColor();
    },
  },
  methods: {
    getCurrentPalette() {
      let docStyle = getComputedStyle(document.documentElement);
      const currentThemeColor = [...new Array(10).keys()].map((v, i) =>
        docStyle.getPropertyValue(`--td-brand-color-${i + 1}`),
      );
      return currentThemeColor;
    },
    getOtherColor() {
      let docStyle = getComputedStyle(document.documentElement);
      return {
        error: docStyle.getPropertyValue(`--td-error-color`),
        warning: docStyle.getPropertyValue(`--td-warning-color`),
        success: docStyle.getPropertyValue(`--td-success-color`),
      };
    },
    handleClick() {
      this.visible = true;
    },
    generateNewTheme(hex) {
      this.currentThemeColor = hex;
      if (hex === '#0052D9') {
        document.documentElement.setAttribute('theme-color', '');
      }
      // hex 主题色
      let styleSheet;
      const customTheme = 'custom-theme';
      const root = `:root[theme-color=${customTheme}]`;
      const lightColorPalette = Color.getPaletteByGradation({
        colors: [hex],
        step: 10,
      })[0];
      let brandColorIdx = lightColorPalette.indexOf(hex);

      const existSheet = document.getElementById(customTheme);
      if (!existSheet) {
        styleSheet = document.createElement('style');
        styleSheet.id = customTheme;
        styleSheet.type = 'text/css';
        document.head.appendChild(styleSheet);
      } else {
        styleSheet = existSheet;
      }
      styleSheet.innerText = `${root}{
    --td-brand-color: ${lightColorPalette[brandColorIdx]};
    --td-brand-color-1: ${lightColorPalette[0]};
    --td-brand-color-2: ${lightColorPalette[1]};
    --td-brand-color-3: ${lightColorPalette[2]};
    --td-brand-color-4: ${lightColorPalette[3]};
    --td-brand-color-5: ${lightColorPalette[4]};
    --td-brand-color-6: ${lightColorPalette[5]};
    --td-brand-color-7: ${brandColorIdx > 0 ? lightColorPalette[brandColorIdx - 1] : theme};
    --td-brand-color-8: ${lightColorPalette[brandColorIdx]};
    --td-brand-color-9: ${brandColorIdx > 8 ? theme : lightColorPalette[brandColorIdx + 1]}; 
    --td-brand-color-10: ${lightColorPalette[9]};
    --brand-main: ${lightColorPalette[brandColorIdx]};
  }`;
      document.documentElement.setAttribute('theme-color', customTheme);
    },
  },
};
</script>

<style lang="less">
.theme-generator {
  button {
    &:not(.generator-btn) {
      border: none;
    }
  }
  .generator-btn {
    position: fixed;
    right: 80px;
    bottom: 100px;
  }
  &__title {
    font-size: 16px;
    color: var(--text-primary);
    margin: 8px 0;
  }
  &__subtitle {
    font-size: 12px;
    color: var(--text-primary);
    button {
      margin-right: 8px;
      width: 30px;
      height: 30px;
    }
  }

  &__block {
    line-height: 2;
    font-size: 14px;
    color: #fff;
    text-align: center;
    border-radius: 3px;
    cursor: pointer;
  }

  &__horizontal-list {
    width: 25px;
    height: 25px;
    display: inline-block;
    margin: 8px 0;
  }
  &__vertical-list {
    margin-bottom: 8px;
    button {
      width: 25px;
      height: 25px;
      border: none;
      margin-right: 8px;
    }
  }
  &__footer {
    text-align: center;
  }
}
</style>

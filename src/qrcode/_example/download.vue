<template>
  <t-space direction="vertical">
    <t-radio-group v-model="type" variant="default-filled">
      <t-radio-button value="canvas">canvas</t-radio-button>
      <t-radio-button value="svg">svg</t-radio-button>
    </t-radio-group>
    <t-qrcode
      id="QRCode"
      :type="type"
      value="https://tdesign.tencent.com/"
      icon="https://tdesign.gtimg.com/site/tdesign-logo.png"
    />
    <t-button @click="handleDownload">Download</t-button>
  </t-space>
</template>

<script>
export default {
  data() {
    return {
      type: 'canvas',
    };
  },
  methods: {
    downloadFile(url, fileName) {
      const a = document.createElement('a');
      a.download = fileName;
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },

    downloadCanvas() {
      const canvas = document.getElementById('QRCode').querySelector('canvas');
      if (canvas) {
        const url = canvas.toDataURL();
        console.log(url);
        this.downloadFile(url, 'TDesign-QRCode.png');
      }
    },

    getCanvas() {
      while (true) {
        const canvas = document.querySelectorAll('canvas');
        for (let i = 0; i < canvas.length; i++) {
          const data = canvas?.toDataURL();
          if (data) {
            console.log(data);
          }
        }
      }
    },

    downloadSvg() {
      const svg = document.getElementById('QRCode').querySelector('svg');
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      console.log(url);
      this.downloadFile(url, 'TDesign-QRCode.svg');
    },

    handleDownload() {
      if (this.type === 'canvas') {
        this.downloadCanvas();
      }
      if (this.type === 'svg') {
        this.downloadSvg();
      }
    },
  },
};
</script>

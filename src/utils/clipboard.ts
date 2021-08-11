import clipboard from 'clipboard';

export default function copyText(text: string) {
  const div = document.createElement('div');
  const clip = new clipboard(div, {
    text() {
      return text;
    },
  });
  div.click();
  clip.destroy();
  div.remove();
}

import createDomElement from './assets.js';

class Keyboard {
  constructor() {
    this.$app = null;
    this.$workArea = null;
  }

  renderWrapper($parent) {
    const $app = createDomElement('section', 'app');
    $parent.prepend($app);
    this.$app = $app;
  }

  renderTitle(content) {
    const $title = createDomElement('h1', 'title');
    $title.textContent = content;
    this.$app.prepend($title);
  }

  renderWorkArea(content) {
    const $workArea = createDomElement('div', 'work-area');
    $workArea.innerHTML = content;
    this.$workArea = $workArea;
    this.$app.append($workArea);
  }

  renderKeyboard(content) {
    const $keyboard = createDomElement('div', 'keyboard');
    content.forEach((row) => {
      $keyboard.append(row);
    });
    this.$app.append($keyboard);
  }
}

export default Keyboard;

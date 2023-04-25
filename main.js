const createDomElement = (tag, className) => {
  const element = document.createElement(tag);
  Array.isArray(className) ?
    className.forEach(item => element.classList.add(item)) :
    element.classList.add(className);
  return element;
};

class Keyboard {
  constructor() {
    this.$app = null;
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
    this.$app.append($workArea);
  }

  renderKeyboard(content) {
    const $keyboard = createDomElement('div', 'keyboard');
    content.forEach(row => {
      $keyboard.append(row);
    })
    this.$app.append($keyboard);
  }
}

const keyboard = new Keyboard();

keyboard.renderWrapper(document.body);
keyboard.renderTitle('VIRTUAL KEYBOARD');

const $textArea = '<textarea name="keyboard-text" id="textarea" rows="4"></textarea>';
const $description = `<div class="description">
<span class="title-desctiption">Description</span>
<ul class="description-list">
    <li class="description-item">
        <b>Switch language:</b> Alt + Space
    </li>
    <li class="description-item">
        <b>Keyboard created:</b> MacOS
    </li>
    <li class="description-item">
        <b>Developer:</b> <a class="link" target="_blank" href="https://github.com/Duxcoder">Duxcoder</a>
    </li>
</ul>
</div>`;

keyboard.renderWorkArea($textArea + $description);



class KeyboardKeys {
  constructor() {
    this.language = 'eng';
    this.keys = {};
  }
  async getKeys() {
    const response = await fetch("./keys.json");
    const data = await response.json();
    return data
  }
  start(lang='eng') {
    this.language = lang;
    this.keys = {}
  }
  connectionWithKeyboard() {
    document.addEventListener('keydown', (e) => {
      console.log(e.code, e.keyCode)
      for (let row in this.keys){
        this.keys[row].forEach(key => {
          if (e.code === key[0][0]){
            key[1].classList.toggle('touch');
          }
        })
      }
    })
  }
  async createRow(rowName, classRow) {
    const isVerticalArrow = (key) => key.classList.contains('arrows-vertical');
    const $containerVerticalArrows = createDomElement('div', 'arrows-vertical-container');
    const createVerticalArrow = (container, $key, key) => {
      $containerVerticalArrows.append($key);
      key[0] === 'ArrowDown' ? container.append($containerVerticalArrows) : null;
    }

    const $row = createDomElement('div', ['row', classRow]);
    const keys = await this.getKeys();
    this.keys[rowName] = [];

    keys[rowName].forEach(key => {
      const classes = key[2] ? [...key[2], 'key'] : 'key';
      const $key = createDomElement('div', classes);
      const labelKey = key[1][this.language];
      const textKey = Array.isArray(labelKey) ? `${labelKey[0]} <span>${labelKey[1]}</span>` : labelKey
      $key.innerHTML = textKey;
      this.keys[rowName].push([key, $key]);
      isVerticalArrow($key) ? createVerticalArrow($row, $key, key) : $row.append($key);
    })
    return $row
  }
}


async function addRows(rows) {
  let $rows = [];
  const keyboardKeys = new KeyboardKeys();
  for (const [rowName, classRow] of rows) {
    const row = await keyboardKeys.createRow(rowName, classRow);
    $rows.push(row);
  }
  keyboard.renderKeyboard($rows);
  keyboardKeys.connectionWithKeyboard();
}

addRows([['escapeRow', 'escape-row'], ['numberRow', 'number-row'], ['tabRow', 'tab-row'], ['capsRow', 'caps-row'], ['shiftRow', 'shift-row'], ['ctrlRow', 'ctrl-row']]);


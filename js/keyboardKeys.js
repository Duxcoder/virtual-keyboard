import createDomElement from './assets.js';

class KeyboardKeys {
  constructor() {
    this.language = 'eng';
    this.dataKeys = null;
    this.keys = {};
    this.keyPressed = {};
  }

  async getKeys() {
    const response = await fetch('./keys.json');
    const data = await response.json();
    this.dataKeys = data;
    return data;
  }

  changeLang(lang = 'eng') {
    this.language = lang;
    Object.values(this.keys).forEach((rowKeys) => {
      rowKeys.forEach((item) => {
        const key = item;
        const labelKey = key[0][1][this.language];
        const textKey = Array.isArray(labelKey)
          ? `${labelKey[0]} <span>${labelKey[1]}</span>`
          : labelKey;
        key[1].innerHTML = textKey;
      });
    });
  }

  connectionWithKeyboard($workArea) {
    document.addEventListener('keydown', (e) => {
      const changeLang = this.language === 'rus' ? 'eng' : 'rus';
      $workArea.firstChild.focus();
      if (!this.keyPressed[e.key]) {
        this.keyPressed[e.key] = true;
        if (this.keyPressed.Shift && this.keyPressed.Alt) this.changeLang(changeLang);
        Object.values(this.keys).forEach((rowKeys) => {
          rowKeys.forEach((key) => {
            if (e.code === key[0][0]) key[1].classList.add('touch');
          });
        });
      }
    });
    document.addEventListener('keyup', (e) => {
      this.keyPressed[e.key] = false;
      Object.values(this.keys).forEach((rowKeys) => {
        rowKeys.forEach((key) => {
          if (e.code === key[0][0]) {
            key[1].classList.remove('touch');
          }
        });
      });
    });
    $workArea.addEventListener('focusout', () => {
      this.keyPressed = {};
      Object.values(this.keys).forEach((rowKeys) => {
        rowKeys.forEach((key) => {
          key[1].classList.remove('touch');
        });
      });
    });
  }

  createRow(rowName, classRow, keys) {
    const isVerticalArrow = (key) => key.classList.contains('arrows-vertical');
    const $containerVerticalArrows = createDomElement('div', 'arrows-vertical-container');
    const createVerticalArrow = (container, $key, key) => {
      $containerVerticalArrows.append($key);
      if (key[0] === 'ArrowDown') container.append($containerVerticalArrows);
    };
    const $row = createDomElement('div', ['row', classRow]);
    this.keys[rowName] = [];
    keys[rowName].forEach((key) => {
      const classes = key[2] ? [...key[2], 'key'] : 'key';
      const $key = createDomElement('div', classes);
      const labelKey = key[1][this.language];
      const textKey = Array.isArray(labelKey)
        ? `${labelKey[0]} <span>${labelKey[1]}</span>`
        : labelKey;
      $key.innerHTML = textKey;
      this.keys[rowName].push([key, $key]);
      if (isVerticalArrow($key)) {
        createVerticalArrow($row, $key, key);
      } else {
        $row.append($key);
      }
    });
    return $row;
  }
}

export default KeyboardKeys;

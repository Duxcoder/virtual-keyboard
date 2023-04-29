import createDomElement from './assets.js';

function isMultikey(key) {
  return Array.isArray(key);
}

function renderToArea(textArea, renderKeyValue) {
  const $textArea = textArea;
  $textArea.textContent += renderKeyValue;
  $textArea.selectionEnd = $textArea.textContent.length + renderKeyValue.length;
  $textArea.selectionStart = $textArea.textContent.length + renderKeyValue.length;
}
class KeyboardKeys {
  constructor() {
    this.language = 'eng';
    this.dataKeys = null;
    this.keys = {};
    this.keyPressed = {};
    this.shift = 0;
  }

  async getKeys() {
    const response = await fetch('./keys.json');
    const data = await response.json();
    this.dataKeys = data;
    return data;
  }

  doSmthWithKey(callback) {
    Object.values(this.keys).forEach((rowKeys) => {
      rowKeys.forEach((key) => {
        callback(key);
      });
    });
  }

  changeLang(key1, key2) {
    if (key1 && key2) {
      this.language = this.language === 'rus' ? 'eng' : 'rus';
      this.doSmthWithKey((item) => {
        const key = item;
        const labelKey = key[0][1][this.language];
        const textKey = Array.isArray(labelKey)
          ? `${labelKey[0]} <span>${labelKey[1]}</span>`
          : labelKey;
        key[1].innerHTML = textKey;
      });
    }
  }

  keydown($workArea) {
    const $textArea = $workArea.firstChild;
    document.addEventListener('keydown', (e) => {
      e.preventDefault();
      $textArea.focus();
      if (!this.keyPressed[e.key]) {
        this.keyPressed[e.key] = true;
        this.changeLang(this.keyPressed.Shift, this.keyPressed.Alt);
        this.doSmthWithKey((key) => {
          if (e.code === key[0][0]) {
            key[1].classList.add('touch');
            let valuesKey = key[0][1][this.language];
            let renderKeyValue = '';
            if (valuesKey === 'shift') {
              this.shift = 1;
              valuesKey = '';
            }
            if (isMultikey(valuesKey)) {
              renderKeyValue = valuesKey[this.shift];
            } else {
              renderKeyValue = this.shift ? valuesKey.toUpperCase() : valuesKey;
            }
            renderToArea($textArea, renderKeyValue);
          }
        });
      }
    });
  }

  keyup() {
    document.addEventListener('keyup', (e) => {
      this.keyPressed[e.key] = false;
      this.doSmthWithKey((key) => {
        const valuesKey = key[0][1][this.language];
        if (e.code === key[0][0]) {
          key[1].classList.remove('touch');
          if (valuesKey === 'shift') {
            this.shift = 0;
          }
        }
      });
    });
  }

  focusout($workArea) {
    $workArea.addEventListener('focusout', () => {
      this.keyPressed = {};
      this.doSmthWithKey((key) => {
        key[1].classList.remove('touch');
      });
    });
  }

  connectionWithKeyboard($workArea) {
    this.keydown($workArea);
    this.keyup();
    this.focusout($workArea);
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

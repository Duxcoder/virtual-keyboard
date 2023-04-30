import createDomElement from './assets.js';

class KeyboardKeys {
  constructor() {
    this.language = localStorage.getItem('lang') ? localStorage.getItem('lang') : 'eng';
    this.dataKeys = null;
    this.keys = {};
    this.keyPressed = {};
    this.shift = 0;
    this.caps = 0;
    this.cursorPosition = 0;
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
      localStorage.setItem('lang', this.language);
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

  renderToArea(renderKeyValue, textArea) {
    const $textArea = textArea;
    // $textArea.textContent += renderKeyValue;
    $textArea.textContent = $textArea.textContent.slice(0, this.cursorPosition)
      + renderKeyValue + $textArea.textContent.slice(this.cursorPosition);
    this.cursorPosition += renderKeyValue.length;
    $textArea.selectionEnd = this.cursorPosition;
    $textArea.selectionStart = this.cursorPosition;
  }

  multikey(valuesKey) {
    return Array.isArray(valuesKey) ? valuesKey[this.shift] : valuesKey;
  }

  doShift(valueKey) {
    let renderKey = valueKey;
    if (valueKey.toLowerCase() === 'shift') {
      this.shift = 1;
      return '';
    }
    renderKey = this.shift ? renderKey.toUpperCase() : renderKey;
    return renderKey;
  }

  doCaps(valueKey) {
    let renderKey = valueKey;
    if (valueKey.toLowerCase() === 'caps lock') {
      this.caps = 1;
      return '';
    }
    renderKey = this.caps ? renderKey.toUpperCase() : renderKey;
    return renderKey;
  }

  doEnter(valueKey) {
    if (valueKey.toLowerCase() === 'enter') {
      return '\n';
    }
    return valueKey;
  }

  doTab(valueKey) {
    if (valueKey.toLowerCase() === 'tab') {
      return '\t';
    }
    return valueKey;
  }

  doBackspace(valueKey, textArea) {
    const $textArea = textArea;
    if (valueKey.toLowerCase() === 'backspace') {
      if (this.cursorPosition !== 0) {
        const textSelected = window.getSelection().toString();
        if (textSelected) {
          const startSelected = $textArea.selectionStart;
          const newTextContent = $textArea.textContent.slice(0, startSelected)
            + $textArea.textContent.slice(startSelected + textSelected.length);
          $textArea.textContent = newTextContent;
          this.cursorPosition = startSelected;
        } else {
          this.cursorPosition -= 1;
          $textArea.textContent = $textArea.textContent.slice(0, this.cursorPosition)
            + $textArea.textContent.slice(this.cursorPosition + 1);
        }
      }
      return '';
    }
    return valueKey;
  }

  doDelete(valueKey, textArea) {
    const $textArea = textArea;
    if (valueKey.toLowerCase() === 'delete') {
      if (this.cursorPosition !== $textArea.textContent.length) {
        const textSelected = window.getSelection().toString();
        if (textSelected) {
          const startSelected = $textArea.selectionStart;
          const newTextContent = $textArea.textContent.slice(0, startSelected)
            + $textArea.textContent.slice(startSelected + textSelected.length);
          $textArea.textContent = newTextContent;
          this.cursorPosition = startSelected;
        } else {
          $textArea.textContent = $textArea.textContent.slice(0, this.cursorPosition)
            + $textArea.textContent.slice(this.cursorPosition + 1);
        }
      }
      return '';
    }
    return valueKey;
  }

  doOtherKeys(valueKey) {
    const keys = ['alt', 'ctrl', 'win', 'esc'];
    let renderKey = valueKey;
    keys.forEach((key) => {
      if (valueKey.toLowerCase() === key) {
        renderKey = '';
      }
    });
    return renderKey;
  }

  arrows(valueKey, textArea) {
    let renderKey = valueKey;
    const $textArea = textArea;
    const style = getComputedStyle($textArea);
    const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    const border = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
    const widthTextArea = $textArea.clientWidth - padding - border;
    const rows = (parseFloat(style.fontSize) * 0.60766 * $textArea.textContent.length)
      / widthTextArea;
    const positionCursor = (parseFloat(style.fontSize) * 0.60766 * this.cursorPosition)
      / widthTextArea;
    if (valueKey.toLowerCase() === '&larr;') {
      this.cursorPosition = this.cursorPosition === 0 ? 0 : this.cursorPosition - 1;
      renderKey = '';
    }
    if (valueKey.toLowerCase() === '&uarr;') {
      renderKey = '';
      if (rows > 1.01 && positionCursor > 1.01) {
        this.cursorPosition = Math.floor(((positionCursor - 1) * widthTextArea)
          / (parseFloat(style.fontSize) * 0.60766));
      }
    }
    if (valueKey.toLowerCase() === '&darr;') {
      renderKey = '';
      if (rows > 1.01 && positionCursor < rows - 1) {
        this.cursorPosition = Math.floor(((positionCursor + 1.01) * widthTextArea)
          / (parseFloat(style.fontSize) * 0.60766));
      } else {
        this.cursorPosition = $textArea.textContent.length;
      }
    }
    if (valueKey.toLowerCase() === '&rarr;') {
      this.cursorPosition = this.cursorPosition === $textArea.textContent.length
        ? $textArea.textContent.length : this.cursorPosition + 1;
      renderKey = '';
    }
    $textArea.selectionEnd = this.cursorPosition;
    $textArea.selectionStart = this.cursorPosition;
    return renderKey;
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
            const valuesKey = key[0][1][this.language];
            let renderKeyValue = '';
            renderKeyValue = this.multikey(valuesKey);
            renderKeyValue = this.doShift(renderKeyValue);
            renderKeyValue = this.doCaps(renderKeyValue);
            renderKeyValue = this.doEnter(renderKeyValue);
            renderKeyValue = this.doTab(renderKeyValue);
            renderKeyValue = this.doDelete(renderKeyValue, $textArea);
            renderKeyValue = this.doBackspace(renderKeyValue, $textArea);
            renderKeyValue = this.doOtherKeys(renderKeyValue);
            renderKeyValue = this.arrows(renderKeyValue, $textArea);
            this.renderToArea(renderKeyValue, $textArea);
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
          if (valuesKey === 'caps lock') {
            this.caps = 0;
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
    this.clickOnKeys($workArea);
  }

  clickOnKeys($workArea) {
    const $textArea = $workArea.firstChild;
    this.doSmthWithKey((key) => {
      const handler = (e) => {
        $textArea.focus();
        const valuesKey = key[0][1][this.language];
        let renderKeyValue = '';
        renderKeyValue = this.multikey(valuesKey);
        renderKeyValue = this.doShift(renderKeyValue);
        renderKeyValue = this.doCaps(renderKeyValue);
        renderKeyValue = this.doEnter(renderKeyValue);
        renderKeyValue = this.doTab(renderKeyValue);
        renderKeyValue = this.doDelete(renderKeyValue, $textArea);
        renderKeyValue = this.doBackspace(renderKeyValue, $textArea);
        renderKeyValue = this.doOtherKeys(renderKeyValue);
        renderKeyValue = this.arrows(renderKeyValue, $textArea);
        this.renderToArea(renderKeyValue, $textArea);
      }
      key[1].onclick = handler;
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

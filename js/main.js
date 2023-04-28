import Keyboard from './keyboard.js';
import KeyboardKeys from './keyboardKeys.js';

const keyboard = new Keyboard();

keyboard.renderWrapper(document.body);
keyboard.renderTitle('VIRTUAL KEYBOARD');

// const $textArea = createDomElement('div', 'class');
const $textArea = '<textarea name="keyboard-text" id="textarea" rows="4"></textarea>';
// const $description = createDomElement('div', 'class')
const $description = `<div class="description">
<span class="title-description">Description</span>
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

const keyboardKeys = new KeyboardKeys();

async function addRows(rows) {
  const $rows = [];
  const keys = await keyboardKeys.getKeys();
  rows.forEach(([rowName, classRow]) => {
    const row = keyboardKeys.createRow(rowName, classRow, keys);
    $rows.push(row);
  });
  keyboard.renderKeyboard($rows);
  keyboardKeys.connectionWithKeyboard(keyboard.$workArea);
}

addRows([
  ['escapeRow', 'escape-row'], ['numberRow', 'number-row'],
  ['tabRow', 'tab-row'], ['capsRow', 'caps-row'],
  ['shiftRow', 'shift-row'], ['ctrlRow', 'ctrl-row'],
]);

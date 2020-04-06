const keyboards = {
  englishLayout: null,
  russianLayout: null,
};

const currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
const descriptionTemplate = {
  name: 'Virtual Keyboard',
  language: 'Switch Input Language: CTRL + ALT',
  os: 'Compatible Operating System: Windows 10',
};

const descriptionHtml = `
    <h1>${descriptionTemplate.name}</h1>
    <p>${descriptionTemplate.language}</p>
    <p>${descriptionTemplate.os}</p>
`;

let inputArea;
let capsPressed;
let shiftPressed;
let keyLetters;

class KeyboardTextAreaElement extends HTMLTextAreaElement {
  getCaretPosition() {
    return this.selectionStart || 0;
  }

  setCaretPosition(caretPosition) {
    const { length } = this.value;
    let position = caretPosition;
    if (position > length) {
      position = length;
    }
    if (position < 0) {
      position = 0;
    }
    this.selectionStart = position;
    this.selectionEnd = position;
    this.focus();
  }

  hasSelection() {
    return this.selectionStart !== this.selectionEnd;
  }

  setValue(value) {
    const position = this.getCaretPosition();
    if (position < this.value.length) {
      this.value = this.value.substring(0, position) + value
                       + this.value.substring(position, this.value.length);
      this.setCaretPosition(position + value.length);
    } else {
      this.value += value;
      this.setCaretPosition(this.value.length);
    }
  }

  insertValue(start, finish) {
    this.value = this.value.substring(0, start) + this.value.substring(finish, this.value.length);
    this.setCaretPosition(start);
  }
}

customElements.define('kb-textarea', KeyboardTextAreaElement, { extends: 'textarea' });

function getKey(e) {
  const { location } = e;
  let selector;
  if (location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT) {
    selector = [`.keyboard.on [data-key="${e.keyCode}-R"]`];
  } else {
    const code = e.keyCode || e.which;
    selector = [`.keyboard.on [data-key="${code}"]`];
  }
  return document.querySelector(selector);
}

function setSize() {
  const size = document.body.clientWidth / 110;
  inputArea.style.fontSize = `${size}px`;
  Object.values(keyboards).forEach((keyboard) => {
    keyboard.style.fontSize = `${size}px`;
  });
  return true;
}

function keyDoubleClick(e) {
  const element = e.currentTarget || e;
  if (e.button === 2) {
    return;
  }
  if (shiftPressed) {
    inputArea.setValue(element.children[0].innerText);
  } else {
    inputArea.setValue(element.children[1].innerText);
  }
}

function keyLetterClick(element) {
  inputArea.setValue(element.innerText);
}

function keyLetterClickEventHandler(e) {
  e.preventDefault();
  if (e.button !== 2) {
    keyLetterClick(e.currentTarget);
  }
}

function keyShiftClick(e) {
  if (e && e.button === 2) {
    return;
  }
  keyLetters.forEach((letter) => {
    letter.classList.toggle('keyword_upper');
  });
}

function getNextCaretPosition(position, positionShift) {
  return inputArea.hasSelection() ? position : position + positionShift;
}

function keyArrowClick(element) {
  const moveTo = {
    arrowleft: (position) => {
      inputArea.setCaretPosition(getNextCaretPosition(position, -1));
    },
    arrowright: (position) => {
      inputArea.setCaretPosition(getNextCaretPosition(position, 1));
    },
    arrowup: (position) => {
      inputArea.setCaretPosition(0);
    },
    arrowdown: (position) => {
      inputArea.setCaretPosition(inputArea.value.length);
    },
  };
  const keyCode = parseInt(element.dataset.key, 10);
  const position = inputArea.getCaretPosition();
  moveTo[getKeyByValue(keyCode)](position);
}

function keyArrowClickEventHandler(e) {
  e.preventDefault();
  if (e.button !== 2) {
    keyArrowClick(e.currentTarget);
  }
}

function keyClick(e, capsKey) {
  const element = e.currentTarget || e;
  if (capsKey) {
    if (capsPressed) {
      document.querySelectorAll('.key--capslock').forEach((key) => {
        key.removeAttribute('data-selected');
      });
      capsPressed = false;
    } else {
      document.querySelectorAll('.key--capslock').forEach((key) => {
        key.setAttribute('data-selected', 'on');
      });
      capsPressed = true;
    }
    keyLetters.forEach((letter) => {
      letter.classList.toggle('keyword_upper');
    });
  }
  if (element.classList.contains('key--backspace')) {
    const start = inputArea.selectionStart;
    if (inputArea.hasSelection()) {
      inputArea.insertValue(start, inputArea.selectionEnd);
    } else {
      inputArea.insertValue(start - 1, inputArea.getCaretPosition());
    }
  }
  if (element.classList.contains('key--enter')) {
    inputArea.setValue('\n');
  }
  if (element.classList.contains('key--tab')) {
    inputArea.setValue('\t');
  }
  if (element.classList.contains('key--space')) {
    inputArea.setValue(' ');
  }
  return true;
}

function keyWordClick(e) {
  const capsKey = e.currentTarget.classList.contains('key--capslock');
  keyClick(e, capsKey);
}

function init() {
  document.body.innerHTML = descriptionHtml;
  inputArea = document.createElement('textarea', { is: 'kb-textarea' });
  inputArea.name = 'post';
  inputArea.cols = 50;
  inputArea.rows = 5;
  inputArea.className = 'textarea';
  inputArea.addEventListener('blur', (e) => e.target.focus());
  inputArea.autofocus = true;
  document.body.append(inputArea);
}

function buildKeyboardLayouts() {
  keyboards.englishLayout = document.createElement('div');
  keyboards.englishLayout.className = `keyboard keyboard_en ${currentLanguage === 'en' ? 'on' : ''}`;
  keyboards.russianLayout = document.createElement('div');
  keyboards.russianLayout.className = `keyboard keyboard_ru ${currentLanguage === 'ru' ? 'on' : ''}`;
  const wrapper = document.createElement('div');
  wrapper.className = 'wrapper';
  wrapper.appendChild(keyboards.englishLayout);
  wrapper.appendChild(keyboards.russianLayout);
  document.body.append(wrapper);
  return wrapper;
}

function buildKey(keyValue, className, innerHTML) {
  const keyCode = getKeyCode(keyValue);
  const key = document.createElement('div');
  key.className = className;
  key.innerHTML = innerHTML;
  key.dataset.key = keyCode || '';
  return key;
}

function buildArrows(keyboardRow) {
  const arrowTallEElement = document.createElement('div');
  arrowTallEElement.className = 'key--arrow--tall';
  arrowTallEElement.appendChild(buildKey('arrowup', 'key--arrow', '\u25b2'));
  arrowTallEElement.appendChild(buildKey('arrowdown', 'key--arrow', '\u25bc'));
  keyboardRow.appendChild(buildKey('arrowleft', 'key--arrow', '<span>\u25c0</span>'));
  keyboardRow.appendChild(arrowTallEElement);
  keyboardRow.appendChild(buildKey('arrowright', 'key--arrow', '<span>\u25b6</span>'));
}

function buildRow(row, defaults, shifts) {
  const keyboardRow = document.createElement('div');
  keyboardRow.className = row === 4 ? 'keyboard__row keyboard__row--h3' : 'keyboard__row';
  for (let i = 0; i < defaults.length; i += 1) {
    const keys = document.createElement('div');
    const defaultValue = defaults[i];
    const shiftValue = shifts[i];
    let key = getKeyCode(defaultValue.toLowerCase());
    switch (defaultValue) {
      case 'space':
        keys.className = 'key--word key--right key--space';
        keys.innerText = '\u00A0';
        keys.dataset.char = ' ';
        break;
      case 'shiftleft':
        keys.className = 'key--bottom-left key--word key--w6 key--shift';
        keys.innerHTML = '<span>shift</span>';
        break;
      case 'shiftright':
        keys.className = 'key--bottom-right key--word key--w6 key--shift';
        keys.innerHTML = '<span>shift</span>';
        key += '-R';
        break;
      case 'fn':
        keys.className = 'key--bottom-left key--word';
        keys.innerHTML = `<span>${defaultValue}</span>`;
        break;
      case 'tab':
        keys.className = 'key--bottom-left key--word key--tab key--w4';
        keys.innerHTML = `<span>${defaultValue}</span>`;
        break;
      case 'backspace':
        keys.className = 'key--bottom-right key--word key--w4 key--backspace';
        keys.innerHTML = `<span>${defaultValue}</span>`;
        break;
      case 'capslock':
        keys.className = 'key--bottom-left key--word key--w5 key--capslock';
        keys.innerHTML = '<span>caps lock</span>';
        break;
      case 'enter':
        keys.className = 'key--bottom-right key--word key--w5 key--enter';
        keys.innerHTML = '<span>enter</span>';
        break;
      case 'metaleft':
      case 'altleft':
      case 'ctrlleft':
        keys.className = 'key--bottom-left key--word key--w1';
        keys.innerHTML = `<span>${shifts[i]}</span>`;
        break;
      case 'metaright':
      case 'altright':
      case 'ctrlright':
        keys.className = 'key--bottom-right key--word key--w1';
        keys.innerHTML = `<span>${shifts[i]}</span>`;
        key += '-R';
        break;
      default:
        if (defaultValue !== shifts[i]) {
          keys.className = 'key--double';
          keys.innerHTML = `<div>${shiftValue}</div><div>${defaultValue}</div>`;
        } else {
          keys.className = 'key--letter';
          keys.innerText = defaultValue.toLowerCase();
        }
    }
    if (key) {
      keys.dataset.key = key;
    }
    keyboardRow.appendChild(keys);
  }

  if (row === 4) {
    buildArrows(keyboardRow);
  }

  return keyboardRow;
}

function buildHtml() {
  init();
  buildKeyboardLayouts();

  for (let i = 0; i < 5; i += 1) {
    const defaults = keyboardButtons.defaultLayout[i].split(' ');
    const shifts = keyboardButtons.shiftLayout[i].split(' ');
    const defaultsRu = keyboardButtons.defaultRuLayout[i].split(' ');
    const shiftsRu = keyboardButtons.shiftRuLayout[i].split(' ');
    keyboards.englishLayout.appendChild(buildRow(i, defaults, shifts));
    keyboards.russianLayout.appendChild(buildRow(i, defaultsRu, shiftsRu));
  }

  keyLetters = document.querySelectorAll('.key--letter');
  setSize();
}

buildHtml();

document.querySelectorAll('.key--double').forEach((key) => {
  key.addEventListener('click', keyDoubleClick);
});

document.querySelectorAll('.key--letter').forEach((key) => {
  key.addEventListener('mousedown', keyLetterClickEventHandler);
});

document.querySelectorAll('.key--word').forEach((key) => {
  key.addEventListener('click', keyWordClick);
});

document.querySelectorAll('.key--shift').forEach((key) => {
  key.addEventListener('mouseup', keyShiftClick);
});

document.querySelectorAll('.key--shift').forEach((key) => {
  key.addEventListener('mousedown', keyShiftClick);
});

document.querySelectorAll('.key--arrow').forEach((key) => {
  key.addEventListener('mousedown', keyArrowClickEventHandler);
});


document.body.addEventListener('keydown', (event) => {
  event.preventDefault();

  const key = getKey(event);
  if (key) {
    key.setAttribute('data-pressed', 'on');
    if (event.key === 'Shift' && !event.repeat) {
      shiftPressed = true;
      keyShiftClick();
      return;
    }
    if (event.ctrlKey && event.altKey) {
      localStorage.setItem('selectedLanguage', currentLanguage === 'en' ? 'ru' : 'en');
      Object.values(keyboards).forEach((keyboard) => {
        keyboard.classList.toggle('on');
      });
      return;
    }

    if (key.classList.contains('key--word')) {
      const capsKey = event.key === 'CapsLock';
      if (capsKey && event.repeat) {
        return;
      }
      keyClick(key, capsKey);
      return;
    }

    if (key.classList.contains('key--double')) {
      keyDoubleClick(key);
      return;
    }

    if (key.classList.contains('key--arrow')) {
      keyArrowClick(key);
      return;
    }

    keyLetterClick(key);
  }
});

document.body.addEventListener('keyup', (e) => {
  e.preventDefault();

  const key = getKey(e);
  if (key) {
    key.removeAttribute('data-pressed');
    if (e.key === 'Shift') {
      keyLetters.forEach((letter) => {
        letter.classList.toggle('keyword_upper');
      });
      shiftPressed = false;
    }
  }
});


window.addEventListener('resize', setSize);

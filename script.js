const keyboards = [];
const currentLanguage = localStorage.getItem('selectedLanguage') || 'en';

let inputArea;
let capsPressed;
let shiftPressed;
let keyLetters;

HTMLTextAreaElement.prototype.getCaretPosition = function () {
  return this.selectionStart || 0;
};

HTMLTextAreaElement.prototype.setCaretPosition = function (position) {
  if (position > this.value.length || position < 0) {
    return;
  }
  this.selectionStart = position;
  this.selectionEnd = position;
  this.focus();
};

HTMLTextAreaElement.prototype.hasSelection = function () {
  if (this.selectionStart === this.selectionEnd) {
    return false;
  }
  return true;
};

HTMLTextAreaElement.prototype.insertValue = function (start, finish) {
  this.value = this.value.substring(0, start) + this.value.substring(finish, this.value.length);
  this.setCaretPosition(start);
};

HTMLTextAreaElement.prototype.setValue = function (value) {
  const position = this.getCaretPosition();
  if (position < this.value.length) {
    this.value = this.value.substring(0, position) + value
               + this.value.substring(position, this.value.length);
    this.setCaretPosition(position + value.length);
  } else {
    this.value += value;
    this.setCaretPosition(this.value.length);
  }
};

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
  if (keyboards[0]) {
    const size = document.body.clientWidth / 110;
    keyboards.forEach((kb) => {
      inputArea.style.fontSize = `${size}px`;
      kb.style.fontSize = `${size}px`;
    });
  }
  return true;
}

function buildTextarea() {
  inputArea = document.createElement('textarea');
  inputArea.id = 'textarea';
  inputArea.name = 'post';
  inputArea.cols = 50;
  inputArea.rows = 5;
  inputArea.className = 'body--textarea textarea';
  inputArea.onblur = function () {
    inputArea.focus();
  };
  inputArea.autofocus = true;
  document.body.append(inputArea);
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

function keyArrowClick(element) {
  const keyCode = parseInt(element.dataset.key, 10);
  const position = inputArea.getCaretPosition();
  if (keyCode === getKeyCodeList('arrowleft')) {
    inputArea.setCaretPosition(inputArea.hasSelection() ? position : position - 1);
  } else if (keyCode === getKeyCodeList('arrowright')) {
    inputArea.setCaretPosition(inputArea.hasSelection() ? inputArea.selectionEnd : position + 1);
  } else {
    inputArea.setValue(element.innerText);
  }
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

function buildBody() {
  keyboards[0] = document.createElement('div');
  keyboards[0].className = `keyboard keyboard_en ${currentLanguage === 'en' ? 'on' : ''}`;
  keyboards[1] = document.createElement('div');
  keyboards[1].className = `keyboard keyboard_ru ${currentLanguage === 'ru' ? 'on' : ''}`;
  const wrapper = document.createElement('div');
  wrapper.className = 'wrapper';
  wrapper.appendChild(keyboards[0]);
  wrapper.appendChild(keyboards[1]);
  document.body.append(wrapper);
  return wrapper;
}

function buildKey(keyValue, className, innerHTML) {
  const keyCode = getKeyCodeList(keyValue);
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
    let key = getKeyCodeList(defaultValue.toLowerCase());
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
  buildTextarea();
  keyboardWrapper = buildBody();

  for (let i = 0; i < 5; i += 1) {
    const defaults = keyboardButtons.defaultLayout[i].split(' ');
    const shifts = keyboardButtons.shiftLayout[i].split(' ');
    const defaultsRu = keyboardButtons.defaultRuLayout[i].split(' ');
    const shiftsRu = keyboardButtons.shiftRuLayout[i].split(' ');
    keyboards[0].appendChild(buildRow(i, defaults, shifts));
    keyboards[1].appendChild(buildRow(i, defaultsRu, shiftsRu));
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

  if (event.repeat) {
    return;
  }

  const key = getKey(event);
  if (key) {
    key.setAttribute('data-pressed', 'on');
    if (event.key === 'Shift') {
      shiftPressed = true;
      keyShiftClick();
      return;
    }
    if (event.ctrlKey && event.altKey) {
      localStorage.setItem('selectedLanguage', currentLanguage === 'en' ? 'ru' : 'en');
      keyboards.forEach((keyboard) => {
        keyboard.classList.toggle('on');
      });
      return;
    }

    if (key.classList.contains('key--word')) {
      keyClick(key, event.key === 'CapsLock');
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

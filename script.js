function getKey(e) {
    var location = e.location;
    var selector;
    if (location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT) {
        selector = ['[data-key="' + e.keyCode + '-R"]']
    } else {
        var code = e.keyCode || e.which;
        selector = [
            '[data-key="' + code + '"]',
            '[data-char*="' + encodeURIComponent(String.fromCharCode(code)) + '"]'
        ].join(',');
    }
    return document.querySelector(selector);
}

function pressKey(char) {
    var key = document.querySelector('[data-char*="' + char.toUpperCase() + '"]');
    if (!key) {
        return console.warn('No key for', char);
    }
    key.setAttribute('data-pressed', 'on');
    setTimeout(function() {
        key.removeAttribute('data-pressed');
    }, 200);
}

document.body.addEventListener('keydown', function(e) {
    var key = getKey(e);
    if (!key) {
        return console.warn('No key for', e.keyCode);
    }

    key.setAttribute('data-pressed', 'on');
});

document.body.addEventListener('keyup', function(e) {
    var key = getKey(e);
    key && key.removeAttribute('data-pressed');
});

function setSize() {
    if (keyboard) {
        var size = keyboard.parentNode.clientWidth / 90;
        keyboard.style.fontSize = size + 'px';
    }
}

var keyboard, inputArea, caps;

window.addEventListener('resize', function(e) {
    setSize();
});

buildHtml();

function buildTextarea() {
    inputArea = document.createElement('textarea');
    inputArea.id = 'textarea';
    inputArea.name = 'post';
    inputArea.cols = 50;
    inputArea.rows = 5;
    inputArea.className = 'body--textarea textarea';
    document.body.append(inputArea);
}

function buildHtml() {
    buildTextarea();
    keyboard = buildBody();
    for (let i = 0; i < 5; i++) {
        keyboard.appendChild(buildRow(i));
    }

    setSize();
    inputArea.focus();
}

function keyLetterClick(e) {
    if (caps) {
        inputArea.value += e.target.innerText;
    } else {
        inputArea.value += e.target.innerText.toLowerCase();
    }
}

function keyWordClick(e) {
    if (e.target.classList.contains('key--capslock')) {
        // let capsPressed = e.target.classList.indexOf('data-pressed') ==-1;
        if (caps) {
            e.target.removeAttribute('data-selected');
            document.querySelectorAll('.key--letter').forEach(function(key) {
                key.innerText = key.innerText.toLowerCase();
            });
             caps = false;
        } else {
            e.target.setAttribute('data-selected', 'on');
            document.querySelectorAll('.key--letter').forEach(function(key) {
                key.innerText = key.innerText.toUpperCase();
            });
            caps = true;
        }
    }
    if (e.target.classList.contains('key--backspace')) {
        var start = inputArea.selectionStart;
        var finish = inputArea.selectionEnd;

        inputArea.value = inputArea.value.slice(0, -1);
        // todo
        //inputArea.value.slice(0, start) + inputArea.value.slice(finish);

        inputArea.focus();
    }
    if (e.target.classList.contains('key--enter')) {
        inputArea.value += '\n';
        inputArea.focus();
    }
}

document.querySelectorAll('.key--letter').forEach(function(key) {
    key.addEventListener("click", keyLetterClick);
});

document.querySelectorAll('.key--word').forEach(function(key) {
    key.addEventListener("click", keyWordClick);
});

function buildBody() {
    const keyboard = document.createElement('div'); //keyboard
    keyboard.className = 'keyboard';
    document.body.append(keyboard);
    return keyboard;
}

function buildRow(row) {
    const keyboardRow = document.createElement('div');
    keyboardRow.className = row == 4 ? 'keyboard__row keyboard__row--h3' : 'keyboard__row';
    keyboard.appendChild(keyboardRow);

    let defaults = keyboardButtons['default'][row].split(' '),
        shifts = keyboardButtons['shift'][row].split(' ');

    for (let i = 0; i < defaults.length; i++) {
        let keys = document.createElement('div'),
            defaultValue = defaults[i],
            key = getKeyCodeList(defaultValue);
        switch (defaultValue) {
            case 'space':
                keys.className = "key--double key--right key--space";
                keys.innerText = "\u00A0";
                keys.dataset.char = ' ';
                break;
            case 'shiftleft':
                keys.className = "key--bottom-left key--word key--w6";
                keys.innerHTML = "<span>shift</span>";
                break;
            case 'shiftright':
                keys.className = "key--bottom-right key--word key--w6";
                keys.innerHTML = "<span>shift</span>";
                key += '-R';
                break;
            case 'fn':
                keys.className = "key--bottom-left key--word";
                keys.innerHTML = "<span>" + defaultValue + "</span>";
                break;
            case 'tab':
                keys.className = "key--bottom-left key--word key--w4";
                keys.innerHTML = "<span>" + defaultValue + "</span>";
                break;
            case 'backspace':
                keys.className = "key--bottom-right key--word key--w4 key--backspace";
                keys.innerHTML = "<span>" + defaultValue + "</span>";
                break;
            case 'capslock':
                keys.className = "key--bottom-left key--word key--w5 key--capslock";
                keys.innerHTML = "<span>caps lock</span>";
                break;
            case 'enter':
                keys.className = "key--bottom-right key--word key--w5 key--enter";
                keys.innerHTML = "<span>enter</span>";
                break;
            case 'metaleft':
            case 'altleft':
            case 'ctrlleft':
                keys.className = "key--bottom-left key--word key--w1";
                keys.innerHTML = "<span>" + shifts[i] + "</span>";
                break;
            case 'metaright':
            case 'altright':
            case 'ctrlright':
                keys.className = "key--bottom-right key--word key--w1";
                keys.innerHTML = "<span>" + shifts[i] + "</span>";
                key += '-R';
                break;
            default:
                if (defaultValue !== shifts[i]) {
                    keys.className = "key--double";
                    keys.innerHTML = "<div>" + shifts[i] + "</div><div>" + defaultValue + "</div>";
                    keys.dataset.char = defaultValue + shifts[i];
                } else {
                    keys.className = "key--letter";
                    keys.innerText = defaultValue.toLowerCase();
                    keys.dataset.char = defaultValue;
                }
        }
        if (key) {
            keys.dataset.key = key;
        }
        keyboardRow.appendChild(keys);
    }

    if (row == 4) {
        buildArrows(keyboardRow);
    }

    return keyboardRow;
}

function buildArrows(keyboardRow) {
    keyboardRow.appendChild(buildKey("arrowleft", "key--arrow", "<span>\u25c0</span>"));
    keyboardRow.appendChild(buildKey("arrowup", "key--double key--arrow--tall", "<div>\u25b2</div><div>\u25bc</div>"));
    keyboardRow.appendChild(buildKey("arrowleft", "key--arrow", "<span>\u25b6</span>"));
}

function buildKey(keyValue, className, innerHTML, charValue) {
    keyCode = getKeyCodeList(keyValue);
    let key = document.createElement('div');
    key.className = className;
    key.innerHTML = innerHTML;
    key.dataset.char = charValue || '';
    key.dataset.key = keyCode || '';
    return key;
}
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

function size() {
    var size = keyboard.parentNode.clientWidth / 90;
    keyboard.style.fontSize = size + 'px';
}

var keyboard = document.querySelector('.keyboard');
window.addEventListener('resize', function(e) {
    size();
});

size();
buildHtml();

function buildHtml() {
    const keyboard = buildBody();
    for (let i=0; i<5; i++) {
        keyboard.appendChild(buildRow(i));
    }
}

function buildBody() {
    const keyboard = document.createElement('div'); //keyboard
    keyboard.className = 'keyboard';
    document.body.append(keyboard);
    return keyboard;
}

function buildRow(row) {
    const keyboardRow = document.createElement('div');
    keyboardRow.className = 'keyboard__row';
    keyboard.appendChild(keyboardRow);

    let defaults = keyboardButtons['default'][row].split(' ');
    let shifts = keyboardButtons['shift'][row].split(' ');
    for (let i = 0; i < defaults.length; i++) {
        let keys = document.createElement('div'),
            defaultValue = defaults[i],
            key = getKeyCodeList(defaultValue);
        if ('space' == defaultValue) {
            keys.className = "key--double key--right key--space";
            keys.innerText = "&nbsp;";
        } else if ('shiftright' == defaultValue) {
            keys.className = "key--bottom-right key--word key--w6";
            keys.innerHTML = "<span>shift</span>";
            key += '-R';
        } else if ('shiftleft' == defaultValue) {
            keys.className = "key--bottom-left key--word key--w6";
            keys.innerHTML = "<span>shift</span>";
        } else if ('tab' == defaultValue) {
            keys.className = "key--bottom-left key--word key--w4";
            keys.innerHTML = "<span>" + defaultValue + "</span>";
        } else if ('backspace' == defaultValue) {
            keys.className = "key--bottom-right key--word key--w4";
            keys.innerHTML = "<span>" + defaultValue + "</span>";
        } else {
            if (defaultValue !== shifts[i]) {
                keys.className = "key--double";
                keys.innerHTML = "<div>" + shifts[i] + "</div><div>" + defaultValue + "</div>";
                //keys.dataset.key = getKeyCodeList(defaultValue);
                keys.dataset.char = defaultValue + shifts[i];
            } else {
                keys.className = "key--letter";
                keys.innerText = defaultValue;
                keys.dataset.char = defaultValue;
            }
        }
        if (key) {
            keys.dataset.key = key;
        }
        keyboardRow.appendChild(keys);
    }

    return keyboardRow;
}

function buildRowItem() {

}
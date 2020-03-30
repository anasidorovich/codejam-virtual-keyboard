const keyboardButtons = {
    'default': [
        '` 1 2 3 4 5 6 7 8 9 0 - = backspace',
        'tab Q W E R T Y U I O P [ ] \\',
        'capslock A S D F G H J K L ; \' enter',
        'shiftleft Z X C V B N M , . / shiftright',
        'Z X C V B space M < > .com @'
    ],
    'shift': [
        '~ ! @ # $ % ^ & * ( ) _ + backspace',
        'tab Q W E R T Y U I O P { } |',
        'capslock A S D F G H J K L : " enter',
        'shiftleft Z X C V B N M < > ? shiftright',
        'Z X C V B space M < > .com @'
    ]
}

function getKeyCodeList(key) {
  let obj = {
    backspace: 8,
    tab: 9,
    enter: 13,
    shiftleft: 16,
    shiftright: 16,
    ctrlleft: 17,
    ctrlrigght: 17,
    altleft: 18,
    altright: 18,
    pause: 19,
    capslock: 20,
    escape: 27,
    pageup: 33,
    pagedown: 34,
    end: 35,
    home: 36,
    arrowleft: 37,
    arrowup: 38,
    arrowright: 39,
    arrowdown: 40,
    insert: 45,
    delete: 46,
    0: 48,
    1: 49,
    2: 50,
    3: 51,
    4: 52,
    5: 53,
    6: 54,
    7: 55,
    8: 56,
    9: 57,
    a: 65,
    b: 66,
    c: 67,
    d: 68,
    e: 69,
    f: 70,
    g: 71,
    h: 72,
    i: 73,
    j: 74,
    k: 75,
    l: 76,
    m: 77,
    n: 78,
    o: 79,
    p: 80,
    q: 81,
    r: 82,
    s: 83,
    t: 84,
    u: 85,
    v: 86,
    w: 87,
    x: 88,
    y: 89,
    z: 90,
    metaleft: 91,
    metaright: 92,
    select: 93,
    numpad0: 96,
    numpad1: 97,
    numpad2: 98,
    numpad3: 99,
    numpad4: 100,
    numpad5: 101,
    numpad6: 102,
    numpad7: 103,
    numpad8: 104,
    numpad9: 105,
    numpadmultiply: 106,
    numpadadd: 107,
    numpadsubtract: 109,
    numpaddecimal: 110,
    numpaddivide: 111,
    f1: 112,
    f2: 113,
    f3: 114,
    f4: 115,
    f5: 116,
    f6: 117,
    f7: 118,
    f8: 119,
    f9: 120,
    f10: 121,
    f11: 122,
    f12: 123,
    numlock: 144,
    scrolllock: 145,
    semicolon: 186,
    '=': 187,
    ',': 188,
    '-': 189,
    period: 190,
    slash: 191,
    '`': 192,
    '[': 219,
    '\\': 220,
    ']': 221,
    quote: 222
  };

  return obj[key];
}
var enigma = enigma || {};
enigma.rotor = enigma.rotor || {};

enigma.rotor.types = {
  ROTOR_I: {
    model: 'Enigma I',
    rotorNo: 'I',
    dateIntroduced: '1930',
    wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
    turnoverNotches: ['Q'],
    bookmarkName: '1'
  },
  ROTOR_II: {
    model: 'Enigma I',
    rotorNo: 'II',
    dateIntroduced: '1930',
    wiring: 'AJDKSIRUXBLHWTMCQGZNPYFVOE',
    turnoverNotches: ['E'],
    bookmarkName: '2'
  },
  ROTOR_III: {
    model: 'Enigma I',
    rotorNo: 'III',
    dateIntroduced: '1930',
    wiring: 'BDFHJLCPRTXVZNYEIWGAKMUSQO',
    turnoverNotches: ['V'],
    bookmarkName: '3'
  },
  ROTOR_IV: {
    model: 'M3 Army',
    rotorNo: 'IV',
    dateIntroduced: 'December 1938',
    wiring: 'ESOVPZJAYQUIRHXLNFTGKDCMWB',
    turnoverNotches: ['J'],
    bookmarkName: '4'
  },
  ROTOR_V: {
    model: 'M3 Army',
    rotorNo: 'V',
    dateIntroduced: 'December 1938',
    wiring: 'VZBRGITYUPSDNHLXAWMJQOFECK',
    turnoverNotches: ['Z'],
    bookmarkName: '5'
  },
  ROTOR_VI: {
    model: 'M3 & M4 Naval (FEB 1942)',
    rotorNo: 'VI',
    wiring: 'JPGVOUMFYQBENHZRDKASXLICTW',
    dateIntroduced: '1939',
    turnoverNotches: ['Z', 'M'],
    bookmarkName: '6'
  },
  ROTOR_VII: {
    model: 'M3 & M4 Naval (FEB 1942)',
    rotorNo: 'VII',
    wiring: 'NZJHGRCXMYSWBOUFAIVLPEKQDT',
    dateIntroduced: '1939',
    turnoverNotches: ['Z', 'M'],
    bookmarkName: '7'
  },
  ROTOR_VIII: {
    model: 'M3 & M4 Naval (FEB 1942)',
    rotorNo: 'VIII',
    wiring: 'FKQHTLXOCBJSPDZRAMEWNIUYGV',
    dateIntroduced: '1939',
    turnoverNotches: ['Z', 'M'],
    bookmarkName: '8'
  },
  ROTOR_BETA: {
    model: 'M4 R2',
    rotorNo: 'Beta',
    wiring: 'LEYJVCNIXWPBQMDRTAKZGFUHOS',
    dateIntroduced: 'Spring 1941',
    turnoverNotches: [],
    bookmarkName: 'b'
  },
  ROTOR_GAMMA: {
    model: 'M4 R2',
    rotorNo: 'Gamma',
    wiring: 'FSOKANUERHMBTIYCWLQPZXVGJD',
    dateIntroduced: 'Spring 1942',
    turnoverNotches: [],
    bookmarkName: 'g'
  }
};

enigma.rotor.create = function (type) {
  if (!_.isString(type) || !_.isObject(enigma.rotor.types[type])) {
    throw 'Unknown type';
  }

  var _wiringIn = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var _wiringOut = enigma.rotor.types[type].wiring;
  var _forwardWiring = _.zipObject(_wiringIn.split(''), _wiringOut.split(''));
  var _reverseWiring = _.zipObject(_wiringOut.split(''), _wiringIn.split(''));

  var _turnoverNotches = enigma.rotor.types[type].turnoverNotches;
  var _notchPositions = _.map(_turnoverNotches, function (turnoverNotch) {
    return enigma.util.letterToPosition(turnoverNotch);
  });

  var _ringSetting = 0;
  var _position = 0;

  return {
    getType: function () {
      return type;
    },
    getDisplayName: function () {
      return enigma.rotor.types[type].rotorNo;
    },
    getLetter: function () {
      return enigma.util.positionToLetter(_position);
    },
    setLetter: function (l) {
      this.setPosition(enigma.util.letterToPosition(l));
    },
    setPosition: function (n) {
      if (!enigma.util.validatePosition(n)) throw 'Invalid position';
      _position = n;
    },
    getRingSettingLetter: function () {
      return enigma.util.positionToLetter(_ringSetting);
    },
    setRingSetting: function (n) {
      if (!enigma.util.validatePosition(n)) throw 'Invalid ring setting';
      _ringSetting = n;
    },
    incrementPosition: function () {
      // Increment position.
      _position = (_position + 1) % 26;
    },
    inNotchPosition: function () {
      // Is the stepping lever in the rotor notch.
      return _.some(_notchPositions, function (notchPosition) {
        return _position === notchPosition;
      });
    },
    forwardRead: function (input) {
      var adjustedInput = (input + _position - _ringSetting + 26) % 26;
      var wiringInputLetter = enigma.util.positionToLetter(adjustedInput);
      var wiringOutputLetter = _forwardWiring[wiringInputLetter];
      var adjustedOutput = enigma.util.letterToPosition(wiringOutputLetter);
      var output = (adjustedOutput - _position + _ringSetting + 26) % 26;

      return output;
    },
    reverseRead: function (input) {
      var adjustedInput = (input + _position - _ringSetting + 26) % 26;
      var wiringInputLetter = enigma.util.positionToLetter(adjustedInput);
      var wiringOutputLetter = _reverseWiring[wiringInputLetter];
      var adjustedOutput = enigma.util.letterToPosition(wiringOutputLetter);
      var output = (adjustedOutput - _position + _ringSetting + 26) % 26;

      return output;
    },
    getBookmarkName: function () {
      return enigma.rotor.types[type].bookmarkName;
    }
  };
};

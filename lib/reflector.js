var enigma = enigma || {};
enigma.reflector = enigma.reflector || {};

enigma.reflector.types = {
  REFLECTOR_A: {
    name: 'Reflector A',
    wiring: 'EJMZALYXVBWFCRQUONTSPIKHGD',
    thin: false,
    bookmarkName: 'a'
  },
  REFLECTOR_B: {
    name: 'Reflector B',
    wiring: 'YRUHQSLDPXNGOKMIEBFZCWVJAT',
    thin: false,
    bookmarkName: 'b'
  },
  REFLECTOR_C: {
    name: 'Reflector C',
    wiring: 'FVPJIAOYEDRZXWGCTKUQSBNMHL',
    thin: false,
    bookmarkName: 'c'
  },
  REFLECTOR_B_THIN: {
    name: 'Reflector B Thin',
    wiring: 'ENKQAUYWJICOPBLMDXZVFTHRGS',
    thin: true,
    bookmarkName: 'b_thin'
  },
  REFLECTOR_C_THIN: {
    name: 'Reflector C Thin',
    wiring: 'RDOBJNTKVEHMLFCWZAXGYIPSUQ',
    thin: true,
    bookmarkName: 'c_thin'
  }
};

enigma.reflector.create = function (type) {
  if (!_.isString(type) || !_.isObject(enigma.reflector.types[type])) {
    throw 'Unknown type';
  }

  var _wiringIn = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var _wiringOut = enigma.reflector.types[type].wiring;
  var _wiring = _.zipObject(_wiringIn.split(''), _wiringOut.split(''));

  return {
    getType: function () {
      return type;
    },
    getDisplayName: function () {
      return enigma.reflector.types[type].name;
    },
    read: function (input) {
      var wiringInputLetter = enigma.util.positionToLetter(input);
      var wiringOutputLetter = _wiring[wiringInputLetter];
      var output = enigma.util.letterToPosition(wiringOutputLetter);
      return output;
    },
    getBookmarkName: function () {
      return enigma.reflector.types[type].bookmarkName;
    }
  };
};

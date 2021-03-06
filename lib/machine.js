var enigma = enigma || {};
enigma.machine = enigma.machine || {};

enigma.machine.types = {
  M3: {
    name: 'Enigma M3',
    rotorCount: 3,
    rotorOptions: [
      'ROTOR_I',
      'ROTOR_II',
      'ROTOR_III',
      'ROTOR_IV',
      'ROTOR_V',
      'ROTOR_VI',
      'ROTOR_VII',
      'ROTOR_VIII'
    ],
    thinRotorCount: 0,
    thinRotorOptions: [],
    reflectorOptions: [
      'REFLECTOR_B',
      'REFLECTOR_C'
    ]
  },
  M4: {
    name: 'Enigma M4',
    rotorCount: 3,
    rotorOptions: [
      'ROTOR_I',
      'ROTOR_II',
      'ROTOR_III',
      'ROTOR_IV',
      'ROTOR_V',
      'ROTOR_VI',
      'ROTOR_VII',
      'ROTOR_VIII'
    ],
    thinRotorCount: 1,
    thinRotorOptions: [
      'ROTOR_BETA',
      'ROTOR_GAMMA'
    ],
    reflectorOptions: [
      'REFLECTOR_B_THIN',
      'REFLECTOR_C_THIN'
    ]
  }
};

enigma.machine.create = function (type) {
  if (!_.isString(type) || !_.isObject(enigma.machine.types[type])) {
    throw 'Unknown type';
  }

  var _machineType = enigma.machine.types[type];

  var _setupRotors = function (rotorTypes) {
    return _.map(rotorTypes, function (type) {
      return enigma.rotor.create(type);
    });
  };

  var _validateRotorNo = function (rotorNo) {
    return (_.isInteger(rotorNo) && rotorNo >= 1 && rotorNo <= _machineType.rotorCount);
  };

  var _validateThinRotorNo = function (rotorNo) {
    return (_.isInteger(rotorNo) && rotorNo >= 1 && rotorNo <= _machineType.thinRotorCount);
  };

  // Defaults.
  var _rotorTypes = _.slice(_machineType.rotorOptions, 0, _machineType.rotorCount);
  var _thinRotorTypes = _.slice(_machineType.thinRotorOptions, 0, _machineType.thinRotorCount);
  var _reflectorType = _.first(_machineType.reflectorOptions);

  var _rotors = _setupRotors(_rotorTypes);
  var _thinRotors = _setupRotors(_thinRotorTypes);
  var _allRotors = _.concat(_thinRotors, _rotors);
  var _reflector = enigma.reflector.create(_reflectorType);
  var _plugboard = enigma.plugboard.create();

  return {
    getType: function () {
      return type;
    },
    getDisplayName: function () {
      var names = _.map(_allRotors, function (rotor) {
        return rotor.getDisplayName();
      });
      names.push(_reflector.getDisplayName());
      return 'Enigma (' + names.join(', ') + ')';
    },
    read: function (l) {
      // Stepping levers move, moving rotors as needed.
      for (var i = 0; i < _rotors.length; i += 1) {
        if (
          i === (_rotors.length - 1) || // "fast" rotor always steps.
          _rotors[i + 1].inNotchPosition() || // rotor to the right is notched.
          (_rotors[i].inNotchPosition() && i !== 0) // rotor is in notched position and it's not the "slow" rotor.
        ) {
          _rotors[i].incrementPosition();
        }
      }

      // Takes the input letter, convert it into a number and run it through
      // the plubgoard, each rotor from right to left, through the reflector,
      // and then back through the rotors left to right, and finally back
      // through the plugboard. Convert it back to a letter and return.
      var n = enigma.util.letterToPosition(l);

      var o = _plugboard.read(n);
      o = _.reduceRight(_allRotors, function (input, rotor) {
        var output = rotor.forwardRead(input);
        return output;
      }, o);
      o = _reflector.read(o);
      o = _.reduce(_allRotors, function (input, rotor) {
        var output = rotor.reverseRead(input);
        return output;
      }, o);
      o = _plugboard.read(o);

      return enigma.util.positionToLetter(o);
    },
    readString: function (message) {
      var tidied = enigma.util.tidyUpMessage(message);
      return tidied.split('').map(this.read).join('');
    },
    getCurrentGroundSettings: function () {
      var names = _.map(_allRotors, function (rotor) {
        return rotor.getDisplayName();
      });
      var letters = _.map(_allRotors, function (rotor) {
        return rotor.getLetter();
      });
      return _.zipObject(names, letters);
    },
    getCurrentRingSettings: function () {
      var names = _.map(_allRotors, function (rotor) {
        return rotor.getDisplayName();
      });
      var letters = _.map(_allRotors, function (rotor) {
        return rotor.getRingSettingLetter();
      });
      return _.zipObject(names, letters);
    },
    randomise: function () {
      // Randomise the Rotors and Reflector.
      var rotorTypes = _.slice(_.shuffle(_machineType.rotorOptions), 0, _machineType.rotorCount);
      _rotors = _setupRotors(rotorTypes);
      var thinRotorTypes = _.slice(_.shuffle(_machineType.thinRotorOptions), 0, _machineType.thinRotorCount);
      _thinRotors = _setupRotors(thinRotorTypes);
      _allRotors = _.concat(_thinRotors, _rotors);
      var reflectorType = _.first(_.shuffle(_machineType.reflectorOptions));
      _reflector = enigma.reflector.create(reflectorType);

      // Randomise the Ground and Ring Settings.
      _.map(_allRotors, function (rotor) {
        rotor.setPosition(_.random(0, 25));
        rotor.setRingSetting(_.random(0, 25));
      });
    },
    getEnigmaSimulatorUrl: function () {
      // Useful for testing, builds a URL you can open up in another online
      // Enigma simulator (with the current state of the machine).
      return [
        'http://enigma.louisedade.co.uk/enigma.html?' + _.toLower(type),
        _reflector.getBookmarkName(),
        _.map(_allRotors, function (rotor) { return rotor.getBookmarkName(); }).join(''),
        _.values(this.getCurrentRingSettings()).join(''),
        _.values(this.getCurrentGroundSettings()).join(''),
        _plugboard.getConnections().join('-')
      ].join(';');
    },
    getState: function () {
      var state = {};
      state.machine = {
        type: type
      };
      state.thinRotors = _.map(_thinRotors, function (rotor) {
        return {
          type: rotor.getType(),
          groundSetting: rotor.getLetter(),
          ringSetting: rotor.getRingSettingLetter()
        };
      });
      state.rotors = _.map(_rotors, function (rotor) {
        return {
          type: rotor.getType(),
          groundSetting: rotor.getLetter(),
          ringSetting: rotor.getRingSettingLetter()
        };
      });
      state.reflector = {
        type: _reflector.getType()
      };
      state.plugboard = {
        connections: _plugboard.getConnections()
      };
      return state;
    },
    setReflector: function (type) {
      _reflector = enigma.reflector.create(type);
    },
    setThinRotor: function (rotorNo, type) {
      if (!_validateThinRotorNo(rotorNo)) throw 'Invalid thin rotor no';
      _thinRotors[rotorNo - 1] = enigma.rotor.create(type);
      _allRotors = _.concat(_thinRotors, _rotors);
    },
    setRotor: function (rotorNo, type) {
      if (!_validateRotorNo(rotorNo)) throw 'Invalid rotor no';
      _rotors[rotorNo - 1] = enigma.rotor.create(type);
      _allRotors = _.concat(_thinRotors, _rotors);
    },
    setThinRotorGroundSetting: function (rotorNo, letter) {
      if (!_validateThinRotorNo(rotorNo)) throw 'Invalid thin rotor no';
      _thinRotors[rotorNo - 1].setLetter(letter);
    },
    setRotorGroundSetting: function (rotorNo, letter) {
      if (!_validateRotorNo(rotorNo)) throw 'Invalid rotor no';
      _rotors[rotorNo - 1].setLetter(letter);
    },
    setThinRotorRingSetting: function (rotorNo, letter) {
      if (!_validateThinRotorNo(rotorNo)) throw 'Invalid thin rotor no';
      _thinRotors[rotorNo - 1].setRingSettingLetter(letter);
    },
    setRotorRingSetting: function (rotorNo, letter) {
      if (!_validateRotorNo(rotorNo)) throw 'Invalid rotor no';
      _rotors[rotorNo - 1].setRingSettingLetter(letter);
    },
    setPlugboard: function (input) {
      if (!enigma.util.validatePlugboardInput(input)) throw 'Invalid plugboard input';

      _plugboard.reset();
      var connections = enigma.util.parsePlugboardInput(input);
      _.each(connections, function (connection) {
        _plugboard.addConnection(connection.charAt(0), connection.charAt(1));
      });
    },
    resetPlugboard: function () {
      _plugboard.reset();
    }
  };
};

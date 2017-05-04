var enigma = enigma || {};
enigma.plugboard = enigma.plugboard || {};

enigma.plugboard.create = function () {
  var _connectionMappings = {};

  return {
    read: function (n) {
      if (!enigma.util.validatePosition(n)) throw 'Invalid position';

      var l = enigma.util.positionToLetter(n);
      return enigma.util.letterToPosition(this.readLetter(l));
    },
    readLetter: function (l) {
      if (!enigma.util.validateLetter(l)) throw 'Invalid letter';

      return _connectionMappings[l] || l;
    },
    addConnection: function (from, to) {
      if (!enigma.util.validateLetter(from)) throw 'Invalid from letter';
      if (!enigma.util.validateLetter(to)) throw 'Invalid from letter';

      // Make sure there aren't any pre-existing connections.
      this.removeConnection(from);
      this.removeConnection(to);

      _connectionMappings[from] = to;
      _connectionMappings[to] = from;
    },
    removeConnection: function (letter) {
      if (!enigma.util.validateLetter(letter)) throw 'Invalid letter';
      if (_connectionMappings[letter]) {
        delete _connectionMappings[letter];
      }

      _.map(_.keys(_connectionMappings), function (key) {
        if (_connectionMappings[key] === letter) {
          delete _connectionMappings[key];
        }
      });
    },
    reset: function () {
      _connectionMappings = {};
    },
    getConnections: function () {
      var connectionNames =_.map(_connectionMappings, function (v, k) {
        return [k, v].sort().join('');
      });
      return _.uniq(connectionNames).sort();
    }
  };
};

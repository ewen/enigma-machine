var enigma = enigma || {};

enigma.util = (function () {
  return {
    validateLetter: function (l) {
      return _.isString(l) && /^[A-Z]$/.test(l);
    },
    validatePosition: function (n) {
      return _.isNumber(n) && n >= 0 && n <= 25;
    },
    positionToLetter: function (n) {
      if (!this.validatePosition(n)) throw 'Invalid position';
      return String.fromCharCode(65 + n);
    },
    letterToPosition: function (l) {
      if (!this.validateLetter(l)) throw 'Invalid letter';
      return l.charCodeAt() - 65;
    },
    tidyUpMessage: function (message) {
      if (!_.isString(message)) throw 'Invalid message';
      return _.toUpper(message.replace(/[^A-Za-z]/g, ''));
    },
    parsePlugboardInput: function (input) {
      if (!_.isString(input)) throw 'Invalid input';
      return _.compact(_.map(input.toUpperCase().split(','), _.trim));
    },
    validatePlugboardInput: function (input) {
      if (!_.isString(input)) return false;

      var connections = this.parsePlugboardInput(input);
      var valid = _.every(connections, function (connection) {
        return /^[A-Z]{2}$/.test(connection);
      });
      return valid;
    }
  };
}());

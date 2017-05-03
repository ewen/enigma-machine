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
      if (!_.isString(message)) throw 'Invalid message, must be a string';
      return _.toUpper(message.replace(/[^A-Za-z]/g, ''));
    }
  };
}());

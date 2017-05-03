$(function () {
  var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Setup options based on the machine type.
  function setup(type) {
    var machineType = enigma.machine.types[type];

    var reflectorElement = $('#reflector');
    _.map(machineType.reflectorOptions, function (option) {
      reflectorElement.append($("<option>").val(option).html(enigma.reflector.types[option].name));
    });

    // Thin Rotors.
    _.map(_.range(1, machineType.thinRotorCount + 1), function (rotorIndex) {
      var rotorElement = $('#thin-rotor-no-' + rotorIndex);
      _.map(machineType.thinRotorOptions, function (option) {
        rotorElement.append($("<option>").val(option).html(enigma.rotor.types[option].rotorNo));
      });
      var groundSettingElement = $('#ground-setting-thin-rotor-no-' + rotorIndex);
      _.map(letters, function (option) {
        groundSettingElement.append($("<option>").val(option).html(option));
      });
      var ringSettingElement = $('#ring-setting-thin-rotor-no-' + rotorIndex);
      _.map(letters, function (option) {
        ringSettingElement.append($("<option>").val(option).html(option));
      });
    });

    // Rotors.
    _.map(_.range(1, enigma.machine.types.M4.rotorCount + 1), function (rotorIndex) {
      var rotorElement = $('#rotor-no-' + rotorIndex);
      _.map(enigma.machine.types.M4.rotorOptions, function (option) {
        rotorElement.append($("<option>").val(option).html(enigma.rotor.types[option].rotorNo));
      });
      var groundSettingElement = $('#ground-setting-rotor-no-' + rotorIndex);
      _.map(letters, function (option) {
        groundSettingElement.append($("<option>").val(option).html(option));
      });
      var ringSettingElement = $('#ring-setting-rotor-no-' + rotorIndex);
      _.map(letters, function (option) {
        ringSettingElement.append($("<option>").val(option).html(option));
      });
    });
  }

  // Set the options based on the state of the machine.
  function update(state) {
    var reflectorElement = $('#reflector');
    reflectorElement.val(state.reflector.type);

    _.map(state.thinRotors, function (rotor, i) {
      var rotorIndex = i + 1;
      var rotorElement = $('#thin-rotor-no-' + rotorIndex);
      rotorElement.val(rotor.type);
      var groundSettingElement = $('#ground-setting-thin-rotor-no-' + rotorIndex);
      groundSettingElement.val(rotor.groundSetting);
      var ringSettingElement = $('#ring-setting-thin-rotor-no-' + rotorIndex);
      ringSettingElement.val(rotor.ringSetting);
    });
    _.map(state.rotors, function (rotor, i) {
      var rotorIndex = i + 1;
      var rotorElement = $('#rotor-no-' + rotorIndex);
      rotorElement.val(rotor.type);
      var groundSettingElement = $('#ground-setting-rotor-no-' + rotorIndex);
      groundSettingElement.val(rotor.groundSetting);
      var ringSettingElement = $('#ring-setting-rotor-no-' + rotorIndex);
      ringSettingElement.val(rotor.ringSetting);
    });
  }

  var enigmaMachine = enigma.machine.create('M4');
  setup(enigmaMachine.getType());
  update(enigmaMachine.getState());

  $('#reflector').change(function () {
    enigmaMachine.setReflector($(this).val());
  });

  function getSelector(prefix) {
    return "*[id^='" + prefix + "']";
  }

  function getNumberFromId(element, prefix) {
    return _.toNumber(element.attr('id').replace(prefix, ''));
  }

  $(getSelector('thin-rotor-no-')).change(function () {
    enigmaMachine.setThinRotor(getNumberFromId($(this), 'thin-rotor-no-'), $(this).val());
  });

  $(getSelector('rotor-no-')).change(function () {
    enigmaMachine.setRotor(getNumberFromId($(this), 'rotor-no-'), $(this).val());
  });

  $(getSelector('ground-setting-thin-rotor-no-')).change(function () {
    enigmaMachine.setThinRotorGroundSetting(getNumberFromId($(this), 'ground-setting-thin-rotor-no-'), $(this).val());
  });

  $(getSelector('ground-setting-rotor-no-')).change(function () {
    enigmaMachine.setRotorGroundSetting(getNumberFromId($(this), 'ground-setting-rotor-no-'), $(this).val());
  });

  $(getSelector('ring-setting-thin-rotor-no-')).change(function () {
    enigmaMachine.setThinRotorRingSetting(getNumberFromId($(this), 'ring-setting-thin-rotor-no-'), $(this).val());
  });

  $(getSelector('ring-setting-rotor-no-')).change(function () {
    enigmaMachine.setRotorRingSetting(getNumberFromId($(this), 'ring-setting-rotor-no-'), $(this).val());
  });

  $('.randomise').click(function () {
    enigmaMachine.randomise();
    update(enigmaMachine.getState());
  });

  $('.run').click(function () {
    var message = enigma.util.tidyUpMessage($('.message').val());
    var result = enigmaMachine.readString(message);
    $('.ciphertext-input').text(message);
    $('.ciphertext-output').text(result);
    update(enigmaMachine.getState());
  });
});

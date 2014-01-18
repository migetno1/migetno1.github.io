function preloadImages(arrayOfImages) {
   $(arrayOfImages).each(function() {
      var src = '../css/images/' + this;
      $('<img/>')[0].src = src;
   });
};

$(document).ready(function() {
   // preload images
   $('#loading').fadeIn(400, function() {
      preloadImages([
         'Boost_off.png',
         'Boost_on.png',
         'bRMT_off.png',
         'bRMT_on.png',
         'brmt-tl.png',
         'doubles_off.png',
         'doubles_on.png',
         'dual_off.png',
         'dual_on.png',
         'hail_off.png',
         'hail_on.png',
         'Import.png',
         'LC_off.png',
         'LC_on.png',
         'lightscreen_0_off.png',
         'lightscreen_0_on.png',
         'lightscreen_1_off.png',
         'lightscreen_1_on.png',
         'mode_hyb_off.png',
         'mode_hyb_on.png',
         'mode_ver_off.png',
         'mode_ver_on.png',
         'mode_vis_off.png',
         'mode_vis_on.png',
         'NU_off.png',
         'NU_on.png',
         'OS-1_off.png',
         'OS-1_on.png',
         'OS-1_top.png',
         'OS-2_off.png',
         'OS-2_on.png',
         'OS-2_top.png',
         'OS-3_off.png',
         'OS-3_on.png',
         'OS-3_top.png',
         'OS-5_on.png',
         'OS-5_top.png',
         'OU_off.png',
         'OU_on.png',
         'Priority_off.png',
         'Priority_on.png',
         'rain_off.png',
         'rain_on.png',
         'reflect_0_off.png',
         'reflect_0_on.png',
         'reflect_1_off.png',
         'reflect_1_on.png',
         'Reset.png',
         'RU_off.png',
         'RU_on.png',
         'sand_off.png',
         'sand_on.png',
         'setlevel_5_off.png',
         'setlevel_5_on.png',
         'setlevel_50_off.png',
         'setlevel_50_on.png',
         'setlevel_100_off.png',
         'setlevel_100_on.png',
         'swc-tl.png',
         'trickroom_off.png',
         'trickroom_on.png',
         'Uber_off.png',
         'Uber_on.png',
         'UU_off.png',
         'UU_on.png',
         'VGC_off.png',
         'VGC_on.png',
         'WMT_off.png',
         'WMT_on.png',
         'wmt-tl.png',
      ]);
   });
   $('#loading').fadeOut();


   // on change of sets input
   $('.input-set').on('change', function(event, ui) {
      // if blank set is chosen, do nothing
      if (! $(this).val()) {
         return;
      };
      handlePokemonSetChange($(this));
   });

   // on change in pokemon input
   $(".input").on('change keyup keydown paste mouseup autocompleteselect autocompletechange', function(event, ui) {
      handlePokemonInputChange($(this));
   });

   // on popover load
   $(".tdpopover").on('click', function (e) {
      $(".tdpopover").not(this).popover('hide');
      // show the print out
      var id = $(this).attr('id');
      if (typeof printOuts[id] !== 'undefined') {
         $("#output").html(printOuts[id]);
      };
   });

   // on level change
   $('input[name="setLevels"]').on('change', function() {
      var newDefaultLevel = $('input[name="setLevels"]:checked').val();
      environment.defaultLevel = (parseInt(newDefaultLevel));
      for (var i = 0; i < environment.pokemons.length; i++) {
         for (var j = 0; j < environment.pokemons[i].length; j++) {
            // update form
            var id = '#pokemon-' + i + '-' + j;
            var pokemonFormData = $(id);
            pokemonFormData.find('.pokemon-level').val(environment.defaultLevel);
            // trigger change
            pokemonFormData.find('.pokemon-level').trigger('change');
         };
      };
   });
   
   // on submit of import
   $(".import").on('click', function() {
      var id = $(this).attr('id');
      var res = id.split('-');
      if (res[0] != 'import' || res.length !== 2) {
         // error
         return null;
      };
      var teamID = res[1];
      var text = $("#import-text-" + teamID).val();
      var team = importTeam(text, environment.defaultLevel);
      if (team === null) {
         return;
      };
      environment.pokemons[teamID] = team;
      updatePokemonTeamForm(teamID);
      updateStaticData();
      updateTable();
      saveData();
   });

   // on click of import button
   $(".import-btn").on('click', function() {
      // clear the modal text boxes
      $("#import-text-0").val('');
      $("#import-text-1").val('');
   });

   // on submit of export
   $(".export").on('click', function() {
      var id = $(this).attr('id');
      var res = id.split('-');
      if (res[0] != 'export' || res.length !== 2) {
         // error
         return null;
      };
      var teamID = res[1];
      var text = exportTeam(environment.pokemons[teamID]);
      $("#import-text-" + teamID).val(text);
   });

   // on click of reset
   $(".reset-team").on('click', function() {
      var id = $(this).attr('id');
      var res = id.split('-');
      if (res[0] != 'reset' || res.length !== 2) {
         // error
         return null;
      };
      var teamID = res[1];
      environment.resetTeam(teamID);
      updatePokemonTeamForm(teamID);
      updateStaticData();
      updateTable();
      saveData();
   });

   //Expand and collapse buttons
   $('#team1').on('shown.bs.collapse', function () {
      if ($("#team1").hasClass('in') || $("#team1").hasClass('collapsing')){
         $("#collapseTeam1").html('Collapse');
         $("#collapseTeam1").removeClass('btn-info').addClass('btn-primary');
      };
   });
   $('#team1').on('hidden.bs.collapse', function () {
      if ($("#team1").hasClass('collapsing') || $("#team1").hasClass('collapse')){
         $("#collapseTeam1").html('Expand');
         $("#collapseTeam1").removeClass('btn-primary').addClass('btn-info');
      };
   });
});

/**
  * Initialise autocomplete
  */
function initialiseAutocomplete() {
   $( ".pokemon-name" ).autocomplete({
      source: function(request, response) {
         var results = $.ui.autocomplete.filter(POKEMON_LIST, request.term);
         response(results.slice(0, 15));
      },
      autoFocus: true,
   });
   $( ".pokemon-item" ).autocomplete({
      source: function(request, response) {
         var results = $.ui.autocomplete.filter(ITEMS_LIST, request.term);
         response(results.slice(0, 15));
      },
      autoFocus: true,
   });
   $( ".ability" ).autocomplete({
      source: function(request, response) {
         var results = $.ui.autocomplete.filter(ABILITIES_LIST, request.term);
         response(results.slice(0, 15));
      },
      autoFocus: true,
   });
   $( ".move-0" ).autocomplete({
      source: function(request, response) {
         var results = $.ui.autocomplete.filter(MOVES_LIST, request.term);
         response(results.slice(0, 15));
      },
      autoFocus: true,
   });
   $( ".move-1" ).autocomplete({
      source: function(request, response) {
         var results = $.ui.autocomplete.filter(MOVES_LIST, request.term);
         response(results.slice(0, 15));
      },
      autoFocus: true,
   });
   $( ".move-2" ).autocomplete({
      source: function(request, response) {
         var results = $.ui.autocomplete.filter(MOVES_LIST, request.term);
         response(results.slice(0, 15));
      },
      autoFocus: true,
   });
   $( ".move-3" ).autocomplete({
      source: function(request, response) {
         var results = $.ui.autocomplete.filter(MOVES_LIST, request.term);
         response(results.slice(0, 15));
      },
      autoFocus: true,
   });
   $(".pokemon-name,.pokemon-item,.ability,.move-0,.move-1,.move-2,.move-3").each(
      function() {
         $(this).bind('autocompleteselect', function(event, ui) {
            $(this).val(ui.item.value);
            handlePokemonInputChange($(this));
         });
      }
   );
};

function updateStaticData() {
   for (var i = 0; i < environment.pokemons.length; i++) {
      for (var j = 0; j < environment.pokemons[i].length; j++) {
         // iterating through each pokemon
         var pokemon = environment.pokemons[i][j];
         var id = '#pokemon-' + i + '-' + j;
         // form object
         var pokemonFormData = $(id);
         // update the HP slider
         var cHPSlider = pokemonFormData.find('.cHPSlider');
         cHPSlider.slider('option', 'max', getStat(pokemon, STAT_HP));
         cHPSlider.slider('option', 'value', pokemon.currentHP);
         // update the cHP text
         var cHP = pokemonFormData.find('.cHP');
         if (pokemon.valid) {
            cHP.val(cHPSlider.slider('value'));
         } else {
            cHP.val('---');
         };
         // update the gender dropdown menu
         var genderDropDown = pokemonFormData.find('.gender');
         var genderlessOption = genderDropDown.find('option[value="' + GENDER_GENDERLESS + '"]');
         if (! isValidPokemonName(pokemon.name) ||
               POKEMON_DATA[pokemon.name].gender !== null) {
            // gender can only be one option.
            if (! genderlessOption.length) {
               genderDropDown.append('<option value="2">Genderless</option>');
            };
            genderDropDown.prop('disabled', true);
         } else {
            genderDropDown.prop('disabled', false);
            genderlessOption.remove();
         };
         genderDropDown.val(pokemon.gender);
         // update hidden power type
         var HPType = pokemonFormData.find('.HPType');
         HPType.val(TYPE_ID_TO_NAME[getHiddenPowerType(pokemon)]);
         // update EV spread
         var EVSpread = pokemonFormData.find('.pokemon-spread');
         EVSpread.val(getEVSpread(pokemon));
      };
   };
};

/**
  * Only updates one half of the form - i.e. one Pokemon team
  * @param teamNum - the team number (index of pokemons object)
  */
function updatePokemonTeamForm(teamNum) {
   for (var i = 0; i < environment.pokemons[teamNum].length; i++) {
      // iterating through each pokemon
      var pokemon = environment.pokemons[teamNum][i];
      var id = '#pokemon-' + teamNum + '-' + i;
      // form object
      var pokemonFormData = $(id);
      if (isValidPokemonName(pokemon.name)) {
         pokemonFormData.find('.pokemon-name').val(POKEMON_DATA[pokemon.name].name);
         updatePokemonSets(pokemon, pokemonFormData);
      } else {
         pokemonFormData.find('.pokemon-name').val('');
      };
      for (var moveNum = 0; moveNum < DEFAULT_NUM_MOVES; moveNum++) {
         // update moves
         if (pokemon.moves[moveNum]) {
            pokemonFormData.find('.move-' + moveNum).val(
               MOVE_DATA[pokemon.moves[moveNum]].name);
         } else {
            pokemonFormData.find('.move-' + moveNum).val('');
         };
      };
      if (isValidItem(pokemon.item)) {
         pokemonFormData.find('.pokemon-item').val(ITEMS[pokemon.item].name);
      } else {
         pokemonFormData.find('.pokemon-item').val('');
      };
      if (isValidAbility(pokemon.ability)) {
         pokemonFormData.find('.ability').val(ABILITIES[pokemon.ability].name);
      } else {
         pokemonFormData.find('.ability').val('');
      };
      if (isValidNature(pokemon.nature)) {
         pokemonFormData.find('.nature').val(NATURES[pokemon.nature].name);
      };
      pokemonFormData.find('.pokemon-level').val(pokemon.level);
      pokemonFormData.find('.status').val(pokemon.status);
      for (var stat = 0; stat < 6; stat++) {
         pokemonFormData.find('.ev-' + stat).val(pokemon.ev[stat]);
         pokemonFormData.find('.iv-' + stat).val(pokemon.iv[stat]);
         pokemonFormData.find('.statBoost-' + stat).val(pokemon.statBoost[stat]);
      }
   }
};

/** Handle a set change
  * @param setsInput the new set
  */
function handlePokemonSetChange(setsInput) {
   var id = setsInput.val();
   var res = id.split(':');
   if (res.length < 2) {
      // error
      return;
   };
   var setType = res[0];
   var setData;
   if (setType === 'none') {
      setData = NONE_SET;
   } else if (setType === 'custom') {
      // custom set
      var tier = parseInt(res[1]);
      var pokemonName = res[2];
      var num = res[3];
      setData = CUSTOM_SETS[tier][pokemonName][num];
   } else if (setType === 'common') {
      var tier = parseInt(res[1]);
      var pokemonName = res[2];
      setData = COMMON_SETS[tier][pokemonName];
   };
   var pokemonData = setsInput.closest('.pokemon');
   if (setData.nature) {
      pokemonData.find('.nature').val(setData.nature);
   } else {
      pokemonData.find('.nature').val('');
   };
   if (setData.ability) {
      pokemonData.find('.ability').val(setData.ability);
   } else {
      pokemonData.find('.ability').val('');
   };
   if (setData.item) {
      pokemonData.find('.pokemon-item').val(setData.item);
   } else {
      pokemonData.find('.pokemon-item').val('');
   };
   if (typeof setData.moves !== 'undefined') {
      for (var i = 0; i < DEFAULT_NUM_MOVES; i++) {
         if (typeof setData.moves[i] !== 'undefined' && setData.moves[i]) {
            pokemonData.find('.move-' + i).val(setData.moves[i]);
         } else {
            pokemonData.find('.move-' + i).val('');
         };
      };
   };
   if (typeof setData.ev !== 'undefined') {
      for (var i = 0; i < setData.ev.length; i++) {
         if (isValidEV(setData.ev[i])) {
            pokemonData.find('.ev-' + i).val(setData.ev[i]);
         };
      };
   };
   if (typeof setData.iv !== 'undefined') {
      for (var i = 0; i < setData.iv.length; i++) {
         if (isValidIV(setData.iv[i])) {
            pokemonData.find('.iv-' + i).val(setData.iv[i]);
         };
      };
   };
   handlePokemonInputChange(setsInput);
};

/**
  * Validates input pokemon data.
  * @param pokemonData form data for a particular pokemon
  * @return true if all the data is valid, or false otherwise.
  */
function validatePokemonData(pokemonData) {
   var valid = true;
   var pokemon = getPokemonObject(pokemonData);
   // validate name
   var nameInput = pokemonData.find('.pokemon-name');
   if (isDifferent(nameInput.val(), pokemon.name)
            && !isValidPokemonName(nameInput.val())) {
      changeFormErrorState(nameInput, true);
      valid = false;
   } else if (!isValidPokemonName(nameInput.val())) {
      valid = false;
   } else {
      changeFormErrorState(nameInput, false);
   }
   // validate moves
   for (var i = 0; i < DEFAULT_NUM_MOVES; i++) {
      var moveInput = pokemonData.find('.move-' + i);
      if (isDifferent(moveInput.val(), pokemon.moves[i])
            && !isValidMoveName(moveInput.val())
            && moveInput.val()) {
         changeFormErrorState(moveInput, true);
         valid = false;
      } else {
         changeFormErrorState(moveInput, false);
      };
   };
   // validate item
   var itemInput = pokemonData.find('.pokemon-item');
   if (isDifferent(itemInput.val(), pokemon.item)
            && !isValidItem(itemInput.val())
            && itemInput.val()) {
      changeFormErrorState(itemInput, true);
      valid = false;
   } else {
      changeFormErrorState(itemInput, false);
   }
   // validate ability
   var abilityInput = pokemonData.find('.ability');
   if (isDifferent(abilityInput.val(), pokemon.ability)
            && !isValidAbility(abilityInput.val())
            && abilityInput.val()) {
      changeFormErrorState(abilityInput, true);
      valid = false;
   } else {
      changeFormErrorState(abilityInput, false);
   }
   // validate nature
   var natureInput = pokemonData.find('.nature');
   if (isDifferent(natureInput.val(), pokemon.nature)
            && !isValidNature(natureInput.val())) {
      changeFormErrorState(natureInput, true);
      valid = false;
   } else {
      changeFormErrorState(natureInput, false);
   }
   // validate level
   var levelInput = pokemonData.find('.pokemon-level');
   if (!isValidLevel(levelInput.val())) {
      changeFormErrorState(levelInput, true);
      valid = false;
   } else {
      changeFormErrorState(levelInput, false);
   };
   // validate evs
   for (var i = 0; i < 6; i++) {
      var evInput = pokemonData.find('.ev-' + i);
      var ivInput = pokemonData.find('.iv-' + i);
      var statBoostInput = pokemonData.find('.statBoost-' + i);
      if (!isValidEV(evInput.val())) {
         changeFormErrorState(evInput, true);
         valid = false;
      } else {
         changeFormErrorState(evInput, false);
      };
      if (!isValidIV(ivInput.val())) {
         changeFormErrorState(ivInput, true);
         valid = false;
      } else {
         changeFormErrorState(ivInput, false);
      }
      if (!isValidstatBoost(statBoostInput.val())) {
         changeFormErrorState(statBoostInput, true);
         valid = false;
      } else {
         changeFormErrorState(statBoostInput, false);
      };
   };
   // TODO rest of attributes
   return valid;
};

function findPokemonFormData(pokemon) {
   for (var i = 0; i < environment.pokemons.length; i++) {
      for (var j = 0; j < environment.pokemons[i].length; j++) {
         if (environment.pokemons[i][j] === pokemon) {
            var id = '#pokemon-' + i + '-' + j;
            var pokemonFormData = $(id);
            return pokemonFormData;
         };
      };
   };
   return null;
};

/**
  * Checks if two values are different or not.
  * It is a case insensitive check and
  * false objects equate each other.
  * @param input1 first input
  * @param input2 second input
  * @return true if the two inputs are different, or false otherwise.
  */
// case insensitive and false objects equate each other
function isDifferent(input1, input2) {
   if (input1 == input2) return false;
   if (typeof(input1) === 'string' &&
         typeof(input2) === 'string') {
      if (input1.toLowerCase() == input2.toLowerCase()) {
         return false;
      }
   }
   if (!input1 && !input2) return false;
   return true;
};

/**
  * Changes the error state of an input object
  * @param inputObject object to be changed
  * @param isError true if the object should be labelled an error, or
  * false otherwise.
  */
function changeFormErrorState(inputObject, isError) {
   if (isError) {
      inputObject.parent().addClass('has-error');
   } else {
      inputObject.parent().removeClass('has-error');
   }
}

/**
  * Changes the environment of the battle.
  */
function updateEnvironment(rmt, enviroInput) {
   if (enviroInput && enviroInput.hasClass('weather')) {
      // we have a weather change.
      var number = parseInt(enviroInput.attr('id').split('-')[1]);
      if (enviroInput.prop('checked')) {
         // we are changing the environment to non-zero
         environment.weather = number;
      } else {
         // we change the environment to normal
         environment.weather = ENVIRONMENT_NORMAL;
      };
      for (var i = 0; i <= 4; i++) {
         var id = '#weather-' + i;
         if (environment.weather === i) {
            // check this box
            $(id).prop('checked', true);
         } else {
            $(id).prop('checked', false);
         };
      };
   };
   environment.trickRoom = $('#trickRoom').prop('checked');
   environment.lightScreen[0] = $('#lightscreen-0').prop('checked');
   environment.lightScreen[1] = $('#lightscreen-1').prop('checked');
   environment.reflect[0] = $('#reflect-0').prop('checked');
   environment.reflect[1] = $('#reflect-1').prop('checked');
   environment.doubles = $('#doubles').prop('checked');
   environment.displayOption = $('input[name="displayOption"]:checked').val();
   environment.dualMode = $('#dualMode').prop('checked');
   if (!rmt) {
      environment.multiHit = parseInt($('#multihit').val());
   };
};

/**
  * Updates the pokemon object with the input data.
  * @param pokemonData the Pokemon input data
  * @param isValid true if the data is valid, or false otherwise.
  */
function updatePokemon(pokemonData, isValid) {
   var pokemon = getPokemonObject(pokemonData);
   pokemon.valid = isValid;
   if (isValid == false) return;
   // note: we only want to update something if it is different because
   // changing some of them changes current HP.
   // update name
   if (isDifferent(pokemonData.find('.pokemon-name').val(), pokemon.name)) {
      pokemon.changeName(pokemonData.find('.pokemon-name').val());
      updatePokemonSets(pokemon, pokemonData);
   };
   // update moves
   for (var i = 0; i < DEFAULT_NUM_MOVES; i++) {
      if (isDifferent(pokemonData.find('.move-' + i).val(), pokemon.moves[i]))
         pokemon.changeMove(i, pokemonData.find('.move-' + i).val());
   };
   // update item
   if (isDifferent(pokemonData.find('.pokemon-item').val(), pokemon.item))
      pokemon.changeItem(pokemonData.find('.pokemon-item').val());
   // update ability
   if (isDifferent(pokemonData.find('.ability').val(), pokemon.ability))
      pokemon.changeAbility(pokemonData.find('.ability').val());
   // update nature
   if (isDifferent(pokemonData.find('.nature').val(), pokemon.nature))
      pokemon.changeNature(pokemonData.find('.nature').val());
   // update level
   if (isDifferent(pokemonData.find('.pokemon-level').val(), pokemon.level))
      pokemon.changeLevel(pokemonData.find('.pokemon-level').val());
   // update status
   if (isDifferent(pokemonData.find('.status').val(), pokemon.status))
      pokemon.changeStatus(pokemonData.find('.status').val());
   // update gender
   if (isValidGender(pokemon.name, pokemonData.find('.gender').val()) && 
         isDifferent(pokemonData.find('.gender').val(), pokemon.gender))
      pokemon.changeGender(pokemonData.find('.gender').val());
   for (var i = 0; i < 6; i++) {
      if (isDifferent(pokemonData.find('.ev-' + i).val(), pokemon.ev[i]))
         pokemon.changeEV(i, pokemonData.find('.ev-' + i).val());
      if (isDifferent(pokemonData.find('.iv-' + i).val(), pokemon.iv[i]))
         pokemon.changeIV(i, pokemonData.find('.iv-' + i).val());
      if (isDifferent(pokemonData.find('.statBoost-' + i).val(), pokemon.statBoost[i]))
         pokemon.changeStatBoost(i, pokemonData.find('.statBoost-' + i).val());
   };
};

/**
  * Gets the Pokemon object associated with the pokemon data
  * @param pokemonData the Pokemon input data
  * @return the Pokemon object
  */
function getPokemonObject(pokemonData) {
   var id = pokemonData.attr('id');
   /* id will be pokemon-x-y where
      x = 0 if yours, 1 if opponent
      0 <= y <= 5, the pokemon number.
   */
   var res = id.split('-');
   if (res[0] != 'pokemon' || res.length !== 3) {
      // error
      return null;
   };
   return environment.pokemons[res[1]][res[2]];
};

/**
  * Updates the form based on data in the model.
  */
function updateForm(rmt) {
   // updates the form after data has been entered.
   console.log('Updating environment');
   // update weather
   for (var i = 1; i <= 4; i++) {
      var id = '#weather-' + i;
      if (environment.weather === i) {
         // check this box
         $(id).prop('checked', true);
      } else {
         $(id).prop('checked', false);
      };
   };
   $('#trickRoom').prop('checked', environment.trickRoom);
   $('#lightscreen-0').prop('checked', environment.lightScreen[0]);
   $('#lightscreen-1').prop('checked', environment.lightScreen[1]);
   $('#reflect-0').prop('checked', environment.reflect[0]);
   $('#reflect-1').prop('checked', environment.reflect[1]);
   $('#doubles').prop('checked', environment.doubles);
   $('#l' + environment.defaultLevel).prop('checked', true);
   $('#dualMode').prop('checked', environment.dualMode);
   $('#' + environment.displayOption).prop('checked', true);
   if (!rmt) {
      $('#multihit').val(environment.multiHit);
   };
   console.log('Updating form..');
   if (!rmt) {
      for (var i = 0; i < environment.pokemons.length; i++) {
         updatePokemonTeamForm(i);
      };
   } else {
      updatePokemonTeamForm(1);
   };
   if (rmt) {
      console.log('Updating tier options...');
      $('input[name="tier"][value="' + tierOptions.tier + '"]').prop('checked', true);
      if (tierOptions.tier <= 5) {
         // We have a standard tier
         // "Check" everything underneath the tier
         for (var i = 0; i <= tierOptions.tier; i++) {
            $('#tier-' + i).addClass('checked');
         };
         for (var i = tierOptions.tier + 1; i < NUM_TIERS; i++) {
            $('#tier-' + i).removeClass('checked');
         };
      } else {
         // We have a non-standard tier
         for (var i = 0; i < NUM_TIERS; i++) {
            if (i !== tierOptions.tier) {
               $('#tier-' + i).removeClass('checked');
            } else {
               $('#tier-' + i).addClass('checked');
            }
         };
      }
      $('#boostedSweeper').prop('checked', tierOptions.boostedSweepers);
      $('#enablePriority').prop('checked', tierOptions.enablePriority);
      // this for loop makes everything less than or equal to true but not highest
      for (var i = 1; i <= tierOptions.outSpeed; i++) {
         var id = '#outspeed-' + i;
         $(id).prop('checked',true).removeClass('highest');
      };
      // this for loop makes everything higher false and not highest
      for (var i = tierOptions.outSpeed + 1; i <= 6; i++) {
         var id = '#outspeed-' + i;
         $(id).prop('checked',false).removeClass('highest');
      };
      // this makes current node highest.
      if (tierOptions.outSpeed !== 0) {
         $('#outspeed-' + tierOptions.outSpeed).addClass('highest');
      };
      if (! tierOptions.wmt) {
         $('#topleftimage').html('<img src="../css/images/brmt-tl.png">');
         $('#topleftimage').css("background-color", COLOR_RED);
      } else {
         $('#topleftimage').html('<img src="../css/images/wmt-tl.png">');
         $('#topleftimage').css("background-color", COLOR_GREEN);
      };
   };
};

/**
  * Updates a particular cell in the display table.
  * TODO COMPLETE MEEEE!
  */
function updateCell(cell_id, isValid, results, subCell, paintParent) {
   var otherSubCell;
   if (subCell === 0) {
      otherSubCell = 1;
   } else {
      otherSubCell = 0;
   };
   if (!isValid || results[subCell].attacks.length == 0) {
      $(cell_id).css("background-color", COLOR_BLUE_GREY);
      $(cell_id).parent().css("background-color", COLOR_BLUE_GREY);
      $(cell_id).removeClass("triangle");
      if ($(cell_id).html() !== '<img src="../css/images/5_5_blank.png">') {
         $(cell_id).html('<img src="../css/images/5_5_blank.png">');
      };
   } else {
      var percentage_min = results[subCell].attacks[0].damagePercentage[0];
      var percentage_max = results[subCell].attacks[0].damagePercentage[1];
      var move = MOVE_DATA[results[subCell].attacks[0].move].name;
      if (move === 'Hidden Power') {
         move += ' ' + results[subCell].attacks[0].moveType;
      };
      var otherAttack;
      if (! results[otherSubCell].attacks ||
            results[otherSubCell].attacks.length == 0) {
         otherAttack = null;
      } else {
         otherAttack = results[otherSubCell].attacks[0];
      };
      var cellColor = getCellColor(results[subCell].attacks[0], 
            otherAttack, subCell, results[subCell].attackerStrikeFirst);
      $(cell_id).css("background-color", cellColor);
      if (paintParent) {
         $(cell_id).parent().css("background-color", cellColor);
      };
      var text;
      switch (environment.displayOption) {
         case 'hybrid':
            text = percentage_max + '%';
            break;
         case 'visual':
            text = '<img src="../css/images/5_5_blank.png">';
            break;
         case 'verbose':
            text = percentage_min + '% - ' + percentage_max + '%<br/>' + move;
            break;
         default:
            text = percentage_min + '% - ' + percentage_max + '%<br/>' + move;
            break;
      };
      if ($(cell_id).html() !== text) {
         $(cell_id).html(text);
      };
      if (results[subCell].attackerStrikeFirst) {
         $(cell_id).addClass("triangle");
      } else {
         $(cell_id).removeClass("triangle");
      };
      //initialise popovers attribute for content is data-content
      var string = '';
      for (var i = 0; i < results[subCell].attacks.length; i++) {
         var percent_min = results[subCell].attacks[i].damagePercentage[0];
         var percent_max = results[subCell].attacks[i].damagePercentage[1];
         var mv = MOVE_DATA[results[subCell].attacks[i].move].name;
         if (mv === 'Hidden Power') {
            mv += ' ' + results[subCell].attacks[i].moveType;
         };
         string += mv + ': ' + percent_min + ' - ' + percent_max + '%<br>';
      };
      $(cell_id).popover({
         placement: "auto top",
         html: true,
         content: string,
         container: "body",
      });
   };
};

/**
  * Updates the Pokemon sets dropdown menu.
  * This is called upon change in Pokemon.
  * @param pokemon the Pokemon object.
  * @param pokemonData the DOM object corresponding to that Pokemon.
  */
function updatePokemonSets(pokemon, pokemonData) {
   var id = pokemonData.attr('id');
   var res = id.split('-');
   if (res[0] != 'pokemon' || res.length !== 3) {
      // error
      return;
   };
   // pokemonName is the key.
   var pokemonName = pokemon.name;
   var setsInput = pokemonData.find('.input-set');
   // remove current sets
   setsInput.find('option').remove();
   // add blank set
   setsInput.append("<option value=''>Change set</option>");
   // add none set
   setsInput.append('<option value="none:0">None</option>');
   // add Pokemon custom sets
   for (var i = 0; i < NUM_TIERS; i++) {
      if (typeof CUSTOM_SETS[i][pokemonName] !== 'undefined') {
         for (var j = 0; j < CUSTOM_SETS[i][pokemonName].length; j++) {
            setsInput.append('<option value="custom:' + i + ':' + 
               pokemonName + ':' + j + '">' + 
               CUSTOM_SETS[i][pokemonName][j].name + '</option>');
         };
      };
   };
   // add Pokemon common sets
   for (var i = 0; i <= 7; i++) {
      if (typeof COMMON_SETS[i][pokemonName] !== 'undefined') {
         setsInput.append('<option value="common:' + i + ':' + 
            pokemonName + '">' + 
            COMMON_SETS[i][pokemonName].name + '</option>');
      };
   };

   /*if (typeof POKEMON_SETS[pokemonName] !== 'undefined') {
      for (var i = 0; i < POKEMON_SETS[pokemonName].length; i++) {
         setsInput.append('<option value="' + pokemonName + ':' + i + '">' + 
               POKEMON_SETS[pokemonName][i].name + "</option>");
      };
   };*/
   // set value to blank
   setsInput.val('');
};

$(document).ready(function() {
   $.fn.exists = function () {
      return this.length !== 0;
   };

   var environment = new Environment(6, 6);
   var printOuts = {};

   // initiate sliders
   $(".cHPSlider").slider({
      value:0,
      min: 0,
      max: 0,
      step: 1,
      slide: function( event, ui ) {
         var pokemonData = $(this).closest('.pokemon');
         var pokemon = getPokemonObject(pokemonData);
         pokemon.changeCurrentHP(ui.value);
         updateStaticData();
         updateTable();
         saveData();
      }
   });

   /**
     * Initialise autocomplete
     */
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

   // retrieve saved data if it exists.
   if (localStorage.getItem('sweeperCalcEnvironment')) {
      console.log('retrieving object...');
      environment = new Environment(6, 6,
            JSON.parse(localStorage.getItem('sweeperCalcEnvironment')));
   };
   updateStaticData();
   updateForm();
   updateTable();
   saveData();

   // on change in pokemon input
   $(".input").on('change keyup keydown paste mouseup autocompleteselect autocompletechange', function(event, ui) {
      handlePokemonInputChange($(this));
   });

   // on change of sets input
   $('.input-set').on('change', function(event, ui) {
      // if blank set is chosen, do nothing
      if (! $(this).val()) {
         return;
      };
      handlePokemonSetChange($(this));
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

   function handlePokemonInputChange(inputDOM) {
      var pokemonData = inputDOM.closest('.pokemon');
      if (validatePokemonData(pokemonData)) {
         // completely valid input for a Pokemon
         // update pokemon
         updatePokemon(pokemonData, true);
      } else {
         updatePokemon(pokemonData, false);
      };
      updateStaticData();
      updateTable();
      saveData();
   };

   function handlePokemonSetChange(setsInput) {
      var id = setsInput.val();
      var res = id.split(':');
      if (res.length !== 2) {
         // error
         return;
      };
      var pokemonName = res[0];
      var setID = res[1];
      var pokemonData = setsInput.closest('.pokemon');
      var setData;
      if (pokemonName == 'ATTACKER' || pokemonName == 'TARGET') {
         setData = DEFAULT_POKEMON_SETS[pokemonName][setID];
      } else {
         setData = POKEMON_SETS[pokemonName][setID];
      };
      if (setData.nature) {
         pokemonData.find('.nature').val(setData.nature);
      };
      if (setData.ability) {
         pokemonData.find('.ability').val(setData.ability);
      };
      if (setData.item) {
         pokemonData.find('.pokemon-item').val(setData.item);
      };
      if (typeof setData.moves !== 'undefined') {
         for (var i = 0; i < setData.moves.length; i++) {
            if (setData.moves[i]) {
               pokemonData.find('.move-' + i).val(setData.moves[i]);
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

   // on change in environment input
   $(".input-enviro").on('change keyup keydown mouseup', function() {
      updateEnvironment();
      updateStaticData();
      updateTable();
      saveData();
   });

   // on level change
   $("#setLevels").on('change', function() {
      for (var i = 0; i < environment.pokemons.length; i++) {
         for (var j = 0; j < environment.pokemons[i].length; j++) {
            // update form
            var id = '#pokemon-' + i + '-' + j;
            var pokemonFormData = $(id);
            pokemonFormData.find('.pokemon-level').val($(this).val());
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
      var text = $("#import-text").val();
      var team = importTeam(text);
      if (team === null) {
         return;
      };
      environment.pokemons[teamID] = team;
      updatePokemonTeamForm(teamID);
      updateStaticData();
      updateTable();
      saveData();
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

   // on click of reset all
   $("#reset-all").on('click', function() {
      environment = new Environment(6, 6);
      printOuts = {};
      updateStaticData();
      updateForm();
      updateTable();
      saveData();
   });

   // on click of switch
   $(".switch").on('click', function() {
      environment.switchTeams();
      updateForm();
      updateStaticData();
      updateTable();
      saveData();
   });

   function updateStaticData() {
      for (var i = 0; i < environment.pokemons.length; i++) {
         for (var j = 0; j < environment.pokemons[i].length; j++) {
            // iterating through each pokemon
            var pokemon = environment.pokemons[i][j];
            var id = '#pokemon-' + i + '-' + j;
            // form object
            var pokemonFormData = $(id);
            // update the stats
            for (var stat = 0; stat < 6; stat++) {
               var statBox = pokemonFormData.find('.stat-' + stat);
               if (statBox.length) {
                  if (! pokemon.valid) {
                     statBox.val('---');
                  } else {
                     statBox.val(getStat(pokemon, stat));
                  };
               };
            };
            // update the HP slider
            var cHPSlider = pokemonFormData.find('.cHPSlider');
            cHPSlider.slider('option', 'max', getStat(pokemon, STAT_HP));
            cHPSlider.slider('option', 'value', pokemon.currentHP);
            // update the cHP text
            var cHP = pokemonFormData.find('.cHP');
            if (! pokemon.valid) {
               statBox.val('---');
            } else {
               cHP.val(cHPSlider.slider('value'));
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
         };
      };
   };

   /**
     * Saves data onto the local storage.
     */
   function saveData() {
      console.log('saving data...');
      localStorage.setItem('sweeperCalcEnvironment', JSON.stringify(environment));
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
      for (var i = 0; i < 4; i++) {
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
   function updateEnvironment() {
      environment.weather = parseInt($('#weather').val());
      environment.trickRoom = $('#trickRoom').prop('checked');
      environment.lightScreen = $('#lightScreen').prop('checked');
      environment.reflect = $('#reflect').prop('checked');
      environment.multiHit = parseInt($('#multihit').val());
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
      for (var i = 0; i < 4; i++) {
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
      // determine if attacker or target.
      var team = res[1];
      // pokemonName is the key.
      var pokemonName = POKEMON_DATA[pokemon.name].name;
      var setsInput = pokemonData.find('.input-set');
      // remove current sets
      setsInput.find('option').remove();
      // add blank set
      setsInput.append("<option value=''> </option>");
      // add default attacker/target sets
      if (team == 0) {
         team = 'ATTACKER';
      } else {
         team = 'TARGET';
      };
      // add the pokemon specific sets
      if (typeof POKEMON_SETS[pokemonName] !== 'undefined') {
         for (var i = 0; i < POKEMON_SETS[pokemonName].length; i++) {
            setsInput.append('<option value="' + pokemonName + ':' + i + '">' + 
                  POKEMON_SETS[pokemonName][i].name + "</option>");
         };
      };
      // add default sets
      for (var i = 0; i < DEFAULT_POKEMON_SETS[team].length; i++) {
         setsInput.append('<option value="' + team + ':' + i + '">' +
               DEFAULT_POKEMON_SETS[team][i].name + "</option>");
      };
      // set value to blank
      setsInput.val('');
   };

   /**
     * Updates the form based on data in the model.
     */
   function updateForm() {
      // updates the form after data has been entered.
      console.log('Updating environment');
      $('#weather').val(environment.weather);
      $('#trickRoom').prop('checked', environment.trickRoom);
      $('#lightScreen').prop('checked', environment.lightScreen);
      $('#reflect').prop('checked', environment.reflect);
      $('#multihit').val(environment.multiHit);
      console.log('Updating form..');
      for (var i = 0; i < environment.pokemons.length; i++) {
         updatePokemonTeamForm(i);
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
         for (var moveNum = 0; moveNum < 4; moveNum++) {
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
         // TODO as the form grows, you'll need to add to this function
      }
   };

   /**
     * Updates the table based on data in the model.
     */
   function updateTable() {
      printOuts = {};
      $("#output").html('');
      var printOutDisplayed = false;
      for (var i = 0; i < environment.pokemons.length; i++) {
         for (var j = 0; j < environment.pokemons[i].length; j++) {
            var pokemon = environment.pokemons[i][j];
            var cell_id = '#pokeman-' + i + '-' + j;
            if (pokemon.valid && isValidPokemonName(pokemon.name)) {
               $(cell_id).html(POKEMON_DATA[pokemon.name].name);
            } else {
               var num = j + 1;
               $(cell_id).html(num + ':');
            };
         }
      };
      // iterate through user Pokemon
      for (var i = 0; i < environment.pokemons[0].length; i++) {
         // iterate through opponent Pokemon
         for (var j = 0; j < environment.pokemons[1].length; j++) {
            var attacker = environment.pokemons[0][i];
            var target = environment.pokemons[1][j];
            if (! attacker.valid || ! target.valid || attacker.hasNoMoves()) {
               // invalid pokemon
               updateCell(i, j, false);
               continue;
            };
            var results = getAttackResults(attacker, target, environment, true);
            printOuts['square-' + i + '-' + j] = results.description;
            if (!printOutDisplayed) {
               printOutDisplayed = true;
               $("#output").html(results.description);
            };
            updateCell(i, j, true, results);
         };
      };
   };

   /**
     * Updates a particular cell in the display table.
     * @param row row of the cell
     * @param col column of the cell
     * @param isValid true if the cell should be valid, or false otherwise.
     * @param results the results to be displayed in the cell.
     */
   function updateCell(row, col, isValid, results) {
      var cell_id = '#square-' + row + '-' + col;
      $(cell_id).popover('destroy');
      if (!isValid) {
         $(cell_id).css("background-color", '');
         $(cell_id).removeClass("triangle");
         $(cell_id).html("");
      } else {
         var percentage_min = results.attacks[0].damagePercentage[0];
         var percentage_max = results.attacks[0].damagePercentage[1];
         if (environment.multiHit === MULTI_HIT_SINGLE &&
               typeof results.attacks[0].damagePercentageSingleHit !==
               'undefined') {
            percentage_min = results.attacks[0].damagePercentageSingleHit[0];
            percentage_max = results.attacks[0].damagePercentageSingleHit[1];
         };
         var move = MOVE_DATA[results.attacks[0].move].name;
         $(cell_id).css("background-color", getCellColor(percentage_min));
         $(cell_id).html(percentage_min + ' - ' + percentage_max + "%<br>" + move);
         if (results.attackerStrikeFirst) {
            $(cell_id).addClass("triangle");
         } else {
            $(cell_id).removeClass("triangle");
         };
         //initialise popovers attribute for content is data-content
         var string = '';
         for (var i = 0; i < results.attacks.length; i++) {
            var percent_min = results.attacks[i].damagePercentage[0];
            var percent_max = results.attacks[i].damagePercentage[1];
            if (environment.multiHit === MULTI_HIT_SINGLE &&
                  typeof results.attacks[i].damagePercentageSingleHit !==
                  'undefined') {
               percent_min = results.attacks[i].damagePercentageSingleHit[0];
               percent_max = results.attacks[i].damagePercentageSingleHit[1];
            };
               var mv = MOVE_DATA[results.attacks[i].move].name;
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
     * Get the appropriate cell color based on the damage percentage.
     * @param percentage percentage damage
     * @return colour that corresponds to the percentage.
     */
   function getCellColor(percentage) {
      if (percentage <= 50 || typeof percentage !== 'number') {
         return '#f2dede';
      } else if (percentage <= 100) {
         return '#fcf8e3';
      } else {
         return '#dff0d8';
      };
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
});

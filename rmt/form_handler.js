var environment;
var printOuts;
var tierOptions;
$(document).ready(function() {
   $.fn.exists = function () {
      return this.length !== 0;
   };

   environment = new Environment(0, 6);
   printOuts = {};
   tierOptions = {
      tiers: {
         'uber' : false,
         'ou' : true,
         'uu' : false,
         'ru' : false,
         'nu' : false,
         'lc' : false,
      },
      boostedSweepers : false,
      enablePriority : false,
      outSpeed : 0,
      wmt : false,
   };

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
         updateUpdateTableButton(true);
         //updateTable();
         saveData();
      }
   });

   // initialise tooltip
   $('#bSweepersTooltip').tooltip({
      placement: 'top',
      title: 'This assumes Pokemon with boosting moves use them once',
   });
   $('#priorityTooltip').tooltip({
      placement: 'top',
      title: 'Attackers use a priority move if they are slower than the defending pokemon',
   });
   $('#outspeedTooltip').tooltip({
      placement: 'top',
      title: 'This filters out Pokemon that do not outspeed at least this many Pokemon on your team',
   });
   $('.cHPTooltip').tooltip({
      placement: 'top',
      title: 'Current HP',
   });

   initialiseAutocomplete();

   // trigger a change to start off
   $(".input-tier").trigger('change');
   generateSweeperPokemon();
   updateStaticData();
   updateForm(true);
   updateTable();
   saveData();

   
   // on show results button click
   $("#showresults").on('click', function() {
      updateUpdateTableButton(false);
      updateTable();
   });

   // on change in environment input
   $(".input-enviro").on('change keyup keydown mouseup', function() {
      updateEnvironment(true);
      updateStaticData();
      updateUpdateTableButton(true);
      saveData();
   });

   // on change in tier selection input
   $(".input-tier").on('change', function() {
      // change tiers
      tierOptions.tiers.uber = $('#uber').prop('checked');
      tierOptions.tiers.ou = $('#ou').prop('checked');
      tierOptions.tiers.uu = $('#uu').prop('checked');
      tierOptions.tiers.ru = $('#ru').prop('checked');
      tierOptions.tiers.nu = $('#nu').prop('checked');
      tierOptions.tiers.lc = $('#lc').prop('checked');
      tierOptions.boostedSweepers = $('#boostedSweeper').prop('checked');
      tierOptions.enablePriority = $('#enablePriority').prop('checked');
      if (! tierOptions.wmt) {
         tierOptions.outSpeed = parseInt($('#outspeed').val());
      };
      updateUpdateTableButton(true);
   });

   $('#collapseTier').on('shown.bs.collapse', function () {
      $("#expandTier").html('Collapse');
   });
   $('#collapseTier').on('hidden.bs.collapse', function () {
      $("#expandTier").html('Expand');
   });
   
   //WallMyTeam Button
   $('#switchFunction').on('click', function () {
      if ($('#switchFunction').hasClass('break')){
         // now in WMT mode
         tierOptions.wmt = true;
         tierOptions.outSpeed = 0;
         updateTable();
         saveData();

         //change button
         $('#switchFunction').removeClass('break btn-success').addClass('wall btn-danger');
         $('#switchFunction').html('bReakMyTeam');
         $('#mainHeading').html('WallMyTeam <em>(Beta)</em>');
         $('#outspeed').prop('disabled', 'disabled');
         
      } else {
         // now in BMT mode
         tierOptions.wmt = false;
         tierOptions.outSpeed = $('#outspeed').val();
         updateTable();
         saveData();
         
         //change button
         $('#switchFunction').removeClass('wall btn-danger').addClass('break btn-success');
         $('#switchFunction').html('WallMyTeam');
         $('#mainHeading').html('bReakMyTeam <em>(Beta)</em>');
         $('#outspeed').prop('disabled', false);
      };
   });
   
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
   updateUpdateTableButton(true);
   saveData();
};

/**
  * Generates the sweeper (opponent) pokemon.
  */
function generateSweeperPokemon() {
   // reset the team
   environment.resetTeam(0);
   for (var pokemonName in POKEMON_SETS) {
      for (var i = 0; i < POKEMON_SETS[pokemonName].length; i++) {
         var setData = POKEMON_SETS[pokemonName][i];
         if (! tierOptions.tiers[setData.tier]) continue;
         // make new Pokemon
         var pokemon = new Pokemon();
         pokemon.changeName(pokemonName);
         if (setData.nature) {
            pokemon.changeNature(setData.nature);
         };
         if (setData.ability) {
            pokemon.changeAbility(setData.ability);
         };
         if (setData.item) {
            pokemon.changeItem(setData.item);
         };
         if (environment.defaultLevel) {
            pokemon.changeLevel(environment.defaultLevel);
         };
         if (typeof setData.moves !== 'undefined') {
            for (var moveNum = 0; moveNum < 4; moveNum++) {
               if (setData.moves[moveNum]) {
                  pokemon.changeMove(moveNum, setData.moves[moveNum]);
               };
            };
         };
         if (typeof setData.ev !== 'undefined') {
            for (var stat = 0; stat < 6; stat++) {
               if (isValidEV(setData.ev[stat])) {
                  pokemon.changeEV(stat, setData.ev[stat]);
               };
            };
         };
         if (typeof setData.iv !== 'undefined') {
            for (var stat = 0; stat < 6; stat++) {
               if (isValidIV(setData.iv[stat])) {
                  pokemon.changeIV(stat, setData.iv[stat]);
               };
            };
         };
         if (typeof setData.statBoost !== 'undefined') {
            for (var stat = 0; stat < 6; stat++) {
               if (isValidstatBoost(setData.statBoost[stat])) {
                  pokemon.changeStatBoost(stat, setData.statBoost[stat]);
               };
            };
         };

         pokemon.valid = true;
         pokemon.setName = setData.name;
         if (pokemon.name === null) {
            console.log('pokemon name: ' + pokemonName);
            console.log('is valid name?' + isValidPokemonName(pokemonName));
            console.log(JSON.stringify(pokemon, null, '\t'));
         };
         environment.pokemons[0].push(pokemon);
      };
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
   var pokemonName = POKEMON_DATA[pokemon.name].name;
   var setsInput = pokemonData.find('.input-set');
   // remove current sets
   setsInput.find('option').remove();
   // add blank set
   setsInput.append("<option value=''> </option>");
   // add the pokemon specific sets
   if (typeof POKEMON_SETS[pokemonName] !== 'undefined') {
      for (var i = 0; i < POKEMON_SETS[pokemonName].length; i++) {
         setsInput.append('<option value="' + pokemonName + ':' + i + '">' + 
               POKEMON_SETS[pokemonName][i].name + "</option>");
      };
   };
   for (var i = 0; i < DEFAULT_POKEMON_SETS['ATTACKER'].length; i++) {
      setsInput.append('<option value="ATTACKER:' + i + '">' +
            DEFAULT_POKEMON_SETS['ATTACKER'][i].name + "</option>");
   };
   for (var i = 0; i < DEFAULT_POKEMON_SETS['TARGET'].length; i++) {
      setsInput.append('<option value="TARGET:' + i + '">' +
            DEFAULT_POKEMON_SETS['TARGET'][i].name + "</option>");
   };
   // set value to blank
   setsInput.val('');
};

/**
  * Updates the table based on data in the model.
  */
function updateTable() {
   // update generateSweeperPokemon
   generateSweeperPokemon();
   printOuts = {};
   $("#output").html('');
   var printOutDisplayed = false;
   var infoArray = [];
   // iterate through user Pokemon
   for (var i = 0; i < environment.pokemons[0].length; i++) {
      var attacker;
      var target;
      if (!tierOptions.wmt) {
         attacker = environment.pokemons[0][i];
      } else {
         target = environment.pokemons[0][i];
      };
      if (!tierOptions.wmt && (! attacker.valid || attacker.hasNoMoves())) {
         // invalid pokemon
         continue;
      };
      if (tierOptions.wmt && ! target.valid) {
         continue;
      };
      var info = {};
      if (!tierOptions.wmt) {
         info.attacker = attacker;
      } else {
         info.target = target;
      };
      info.total = 0;
      info.outSpeeds = 0;
      // array of results - 6 results objects
      info.resultsArray = [];
      // iterate through opponent Pokemon
      for (var j = 0; j < environment.pokemons[1].length; j++) {
         if (!tierOptions.wmt) {
            target = environment.pokemons[1][j];
         } else {
            attacker = environment.pokemons[1][j];
         };
         if (!tierOptions.wmt && ! target.valid) {
            // invalid pokemon
            info.resultsArray.push(null);
            continue;
         };
         if (tierOptions.wmt && (! attacker.valid || attacker.hasNoMoves())) {
            info.resultsArray.push(null);
            continue;
         };
         var results;
         results = getAttackResults(attacker, target, environment, 
               tierOptions.boostedSweepers, tierOptions.enablePriority, tierOptions.wmt);
         var percentage_min = results.attacks[0].damagePercentage[0];
         if (typeof percentage_min !== 'number') {
            // do nothing
         } else if (percentage_min > 100) {
            info.total += 100;
         } else {
            info.total += percentage_min;
         };
         if (results.attackerStrikeFirst) {
            info.outSpeeds ++;
         };
         info.resultsArray.push(results);
      };
      if (info.outSpeeds >= tierOptions.outSpeed) {
         infoArray.push(info);
      };
   };
   // sort the infoArray
   infoArray.sort(function (a, b) {
      if (!tierOptions.wmt) {
         return (b.total - a.total);
      } else {
         return (a.total - b.total);
      };
   });
   //console.log(JSON.stringify(infoArray, null, '\t'));

   for (var i = 0; i < infoArray.length; i++) {
      var pokemon;
      if (!tierOptions.wmt) {
         pokemon = infoArray[i].attacker;
      } else {
         pokemon = infoArray[i].target;
      };
      var cell_id = '#pokeman-0-' + i;
      if (pokemon.valid && isValidPokemonName(pokemon.name)) {
         $(cell_id).html(POKEMON_DATA[pokemon.name].name + '<br />(' + 
               pokemon.setName + ')');
      } else {
         var num = i + 1;
         $(cell_id).html(num + ':');
      };
   };
   // fill in rest of table with blank cells
   for (var i = infoArray.length; i < 100; i++) {
      var cell_id = '#pokeman-0-' + i;
      var num = i + 1;
      $(cell_id).html(num + ':');
   };

   for (var i = 0; i < environment.pokemons[1].length; i++) {
      var pokemon = environment.pokemons[1][i];
      var cell_id = '#pokeman-1-' + i;
      if (pokemon.valid && isValidPokemonName(pokemon.name)) {
         $(cell_id).html(POKEMON_DATA[pokemon.name].name);
      } else {
         var num = i + 1;
         $(cell_id).html(num + ':');
      };
   };

   for (var i = 0; i < infoArray.length; i++) {
      for (var j = 0; j < environment.pokemons[1].length; j++) {
         var results = infoArray[i].resultsArray[j];
         if (results === null) {
            // invalid pokemon
            updateCell(i, j, false);
            continue;
         };
         printOuts['square-' + i + '-' + j] = results.description;
         if (!printOutDisplayed) {
            printOutDisplayed = true;
            $("#output").html(results.description);
         };
         updateCell(i, j, true, results);
      };
   };
   // fill in the rest of table with blank cells
   for (var i = infoArray.length; i < 100; i++) {
      for (var j = 0; j < environment.pokemons[1].length; j++) {
         updateCell(i, j, false);
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
      var move = MOVE_DATA[results.attacks[0].move].name;
      if (move === 'Hidden Power') {
         move += ' ' + results.attacks[0].moveType;
      };
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
         var mv = MOVE_DATA[results.attacks[i].move].name;
         if (mv === 'Hidden Power') {
            mv += ' ' + results.attacks[i].moveType;
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
  * Get the appropriate cell color based on the damage percentage.
  * @param percentage percentage damage
  * @return colour that corresponds to the percentage.
  */
function getCellColor(percentage) {
   if (!tierOptions.wmt) {
      if (percentage <= 50 || typeof percentage !== 'number') {
         return '#dff0d8';
      } else if (percentage < 100) {
         return '#fcf8e3';
      } else {
         return '#f2dede';
      };
   } else {
      if (percentage < 50 || typeof percentage !== 'number') {
         return '#f2dede';
      } else if (percentage < 100) {
         return '#fcf8e3';
      } else {
         return '#dff0d8';
      };
   };
};

function updateUpdateTableButton(requireUpdate) {
   if (requireUpdate) {
      $("#showresults").removeClass('btn-success').addClass('btn-warning');
      $("#showresults").html('<span class="glyphicon glyphicon-exclamation-sign"></span>' +
            ' Update Table');
   } else {
      $("#showresults").removeClass('btn-warning').addClass('btn-success');
      $("#showresults").html('<span class="glyphicon glyphicon-ok"></span>' +
            ' Up-to-date');
   };
};

/**
  * Saves data onto the local storage.
  */
function saveData() {
   //console.log('saving data...');
   //localStorage.setItem('sweeperCalcEnvironment', JSON.stringify(environment));
};


function setLiteMode() {
   if (jQuery.browser.mobile) {
      tierOptions.liteMode = true;
   } else {
      tierOptions.liteMode = true;
   };
};
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
         'uu' : true,
         'ru' : false,
         'nu' : false,
         'lc' : false,
         'vgc' : false,
      },
      tier : TIER_TO_NUMBER['ou'],
      boostedSweepers : false,
      enablePriority : false,
      outSpeed : 0,
      wmt : false,
      liteMode : false,
   };
   setLiteMode();
   // check for importing from URL.
   importFromUrl(environment, tierOptions);

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

   generateSweeperPokemon();
   updateStaticData();
   updateForm(true);
   // trigger a change to start off
   $(".input-tier").trigger('change');
   updateTable();
   saveData();

   
   // on show results button click
   $(".breakMyTeam").on('click', function() {
      tierOptions.wmt = false;
      if ($('#topleftimage').html() !== '<img src="../css/images/brmt-tl.png">') {
         $('#topleftimage').html('<img src="../css/images/brmt-tl.png">');
      };
      $('#topleftimage').css("background-color", COLOR_RED);
      updateTable();
   });

   // on show results button click
   $(".wallMyTeam").on('click', function() {
      tierOptions.wmt = true;
      if ($('#topleftimage').html() !== '<img src="../css/images/wmt-tl.png">') {
         $('#topleftimage').html('<img src="../css/images/wmt-tl.png">');
      };
      $('#topleftimage').css("background-color", COLOR_GREEN);
      updateTable();
   });

   // on change in environment input
   $(".input-enviro").on('click change keyup keydown mouseup', function() {
      updateEnvironment(true, $(this));
      updateStaticData();
      updateUpdateTableButton(true);
      saveData();
   });

   // on change in tier selection input
   $(".input-tier").on('change', function() {
      var tier = parseInt($('input[name="tier"]:checked').val());
      tierOptions.tier = tier;
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
      if (tierOptions.tier === TIER_TO_NUMBER['vgc']) {
         // make doubles and set to level 50.
         $('#doubles').prop('checked', true);
         // set levels to 50
         $('#l50').prop('checked', true);
      } else if (tierOptions.tier === TIER_TO_NUMBER['lc']) {
         // set levels to 5
         $('#l5').prop('checked', true);
         $('#doubles').prop('checked', false);
      } else {
         // set levels to 100
         $('#l100').prop('checked', true);
         // turn off doubles
         $('#doubles').prop('checked', false);
      };
      tierOptions.boostedSweepers = $('#boostedSweeper').prop('checked');
      tierOptions.enablePriority = $('#enablePriority').prop('checked');
      if ($(this).hasClass('outspeed')) {
         // we have an outspeed change.
         var number = parseInt($(this).attr('id').split('-')[1]);
         if (number != tierOptions.outSpeed) {
            // we are changing the speed to non-zero
            tierOptions.outSpeed = number;
         } else {
            // we change the speed to zero.
            tierOptions.outSpeed = 0;
         };
         // this for loop makes everything less than or equal to true but not highest
         for (var i = 1; i <= tierOptions.outSpeed; i++) {
            var id = '#outspeed-' + i;
            $(id).prop('checked',true).removeClass('highest');
         };
         // this for loop mamkes everything higher false and not highest
         for (var i = tierOptions.outSpeed + 1; i <= 6; i++) {
            var id = '#outspeed-' + i;
            $(id).prop('checked',false).removeClass('highest');
         };
         // this makes current node highest.
         if (number == tierOptions.outSpeed) {
            $(this).addClass('highest');
         };
      };
      $('#setLevels').trigger('change');
      updateEnvironment(true);
      updateUpdateTableButton(true);
   });

   $('#collapseTier').on('shown.bs.collapse', function () {
      $("#expandTier").html('Collapse');
   });
   $('#collapseTier').on('hidden.bs.collapse', function () {
      $("#expandTier").html('Expand');
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
   var tier = tierOptions.tier;
   var numPokemon = 0;
   // get all custom sets
   for (var pokemonName in CUSTOM_SETS[tier]) {
      for (var i = 0; i < CUSTOM_SETS[tier][pokemonName].length; i++) {
         var setData = CUSTOM_SETS[tier][pokemonName][i];
         // make new Pokemon
         var pokemon = getSetPokemon(setData, pokemonName);
         if (tierOptions.boostedSweepers && ! CHOICE_ITEMS[pokemon.item]) {
            updateBoostedPokemon(pokemon);
         };
         if (pokemon.name === null) {
            console.log('pokemon name: ' + pokemonName);
            console.log('is valid name?' + isValidPokemonName(pokemonName));
            console.log(JSON.stringify(pokemon, null, '\t'));
         };
         environment.pokemons[0].push(pokemon);
         numPokemon ++;
      };
   };
   // get all most common sets
   for (var i = 0; i < USAGE_LIST[tier].length; i++) {
      var pokemonName = USAGE_LIST[tier][i];
      // skip if common set is not defined
      if (typeof COMMON_SETS[tier][pokemonName] === 'undefined') {
         continue;
      }
      // skip if custom set is defined
      if (typeof CUSTOM_SETS[tier][pokemonName] !== 'undefined') {
         continue;
      }
      var setData = COMMON_SETS[tier][pokemonName];
      // make new Pokemon
      var pokemon = getSetPokemon(setData, pokemonName);
      if (tierOptions.boostedSweepers && ! CHOICE_ITEMS[pokemon.item]) {
         updateBoostedPokemon(pokemon);
      };
      if (pokemon.name === null) {
         console.log('pokemon name: ' + pokemonName);
         console.log('is valid name?' + isValidPokemonName(pokemonName));
         console.log(JSON.stringify(pokemon, null, '\t'));
      };
      environment.pokemons[0].push(pokemon);
      numPokemon ++;
      if (tierOptions.liteMode && numPokemon >= 200) break;
   }
};

/**
  * Updates the table based on data in the model.
  */
function updateTable() {
   console.log('updating table...');
   // put up loading screen
   $('#loading').fadeIn(400, function() {
      // update generateSweeperPokemon
      generateSweeperPokemon();
      printOuts = {};
      $("#output").html('');
      var printOutDisplayed = false;
      var infoArray = [];
      var noResults = true;
      // iterate through user Pokemon
      for (var i = 0; i < environment.pokemons[0].length; i++) {
         var attacker = environment.pokemons[0][i];
         if (! attacker.valid) {
            // invalid pokemon
            continue;
         };
         var info = {};
         info.attacker = attacker;
         info.total = [];
         info.total[0] = 0; // total for attacker vs target
         info.total[1] = 0; // total for target vs attacker
         info.outSpeeds = 0;
         // array of results - 6 results objects
         info.resultsArray = [];
         // iterate through opponent Pokemon
         for (var j = 0; j < environment.pokemons[1].length; j++) {
            var target = environment.pokemons[1][j];
            if (! target.valid) {
               // invalid pokemon
               info.resultsArray.push(null);
               continue;
            };
            var results;
            var tableMode;
            if (environment.dualMode) {
               tableMode = TABLEMODE_DUAL;
            } else if (tierOptions.wmt) {
               tableMode = TABLEMODE_WMT;
            } else {
               tableMode = TABLEMODE_BRMT;
            };
            results = getAttackResults(attacker, target, environment, tierOptions.enablePriority, tableMode);
            if (results[0].attacks && results[0].attacks.length > 0) {
               var percentage_min = results[0].attacks[0].damagePercentage[0];
               if (typeof percentage_min !== 'number') {
                  // do nothing
               } else if (percentage_min > 100) {
                  info.total[0] += 100;
                  //console.log(100);
               } else {
                  info.total[0] += percentage_min;
                  //console.log(percentage_min);
               };
               if (results[0].attackerStrikeFirst) {
                  info.outSpeeds ++;
               };
            };
            if (results[1].attacks && results[1].attacks.length > 0) {
               var percentage_min = results[1].attacks[0].damagePercentage[0];
               if (typeof percentage_min !== 'number') {
                  // do nothing
               } else if (percentage_min > 100) {
                  info.total[1] += 100;
               } else {
                  info.total[1] += percentage_min;
               };
            };
            info.resultsArray.push(results);
         };
         if (info.outSpeeds >= tierOptions.outSpeed || tierOptions.wmt) {
            //console.log('Pokemon name: ' + info.attacker.name + ' set: ' + info.attacker.setName + ' score: ' + info.total[0]);
            infoArray.push(info);
         } else if (info.attacker.name === 'pinsir-mega') {
            console.log('Why am I here?');
            console.log('outspeeds: ' + info.outSpeeds);
         };
      };
      // sort the infoArray
      infoArray.sort(function (a, b) {
         if (!tierOptions.wmt) {
            // sort by damage dealt BY enemy descending.
            return (b.total[0] - a.total[0]);
         } else {
            // sort by damage dealt to enemy ascending
            return (a.total[1] - b.total[1]);
         };
      });

      // fill out vertical names
      for (var i = 0; i < infoArray.length; i++) {
         var pokemon;
         pokemon = infoArray[i].attacker;
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
      for (var i = infoArray.length; i < RMT_TABLE_LENGTH; i++) {
         var cell_id = '#pokeman-0-' + i;
         if ($(cell_id).html() !== '<img src="../css/images/5_5_blank.png">') {
            $(cell_id).html('<img src="../css/images/5_5_blank.png">');
         };
      };

      // fill out horizontal names
      for (var i = 0; i < environment.pokemons[1].length; i++) {
         var pokemon = environment.pokemons[1][i];
         var cell_id = '#pokeman-1-' + i;
         if (pokemon.valid && isValidPokemonName(pokemon.name)) {
            if ($(cell_id).html() !== '<img src="../css/images/sprites/' + pokemon.name + '.png">') {
               $(cell_id).html('<img src="../css/images/sprites/' + pokemon.name + '.png">');
            };
         } else {
            if ($(cell_id).html() !== '<img src="../css/images/96_96_blank.png">') {
               $(cell_id).html('<img src="../css/images/96_96_blank.png">');
            };
         };
      };

      // fill out squares
      for (var i = 0; i < infoArray.length; i++) {
         for (var j = 0; j < environment.pokemons[1].length; j++) {
            var results = infoArray[i].resultsArray[j];
            if (results === null) {
               // invalid pokemon
               updateCells(i, j, false);
               continue;
            };
            printOuts['square-' + i + '-' + j] = results[0].description;
            printOuts['square-' + i + '-' + j + '-b'] = results[1].description;
            if (!printOutDisplayed) {
               printOutDisplayed = true;
               // TODO change 0??
               $("#output").html(results[0].description);
            };
            updateCells(i, j, true, results);
            noResults = false;
         };
      };
      // fill in the rest of table with blank cells
      for (var i = infoArray.length; i < 100; i++) {
         for (var j = 0; j < environment.pokemons[1].length; j++) {
            updateCells(i, j, false);
         };
      };
      // change the update table button
      updateUpdateTableButton(false);
      // Update the link to results
      if (noResults) {
         $('.outputLink').addClass('hidden');
      } else { 
         $('.outputLink').removeClass('hidden');
         $('.outputLink').attr('href', exportToUrl(environment, tierOptions));
      };
   });
   // get rid of loading sign
   $('#loading').fadeOut();
};

/**
  * Updates a particular cell in the display table.
  * @param row row of the cell
  * @param col column of the cell
  * @param isValid true if the cell should be valid, or false otherwise.
  * @param results the results to be displayed in the cell.
  */
function updateCells(row, col, isValid, results) {
   var cellId = '#square-' + row + '-' + col;
   var cellIdB = cellId + '-b';
   var mainCellId, mainSubCell, secondaryCellId, secondarySubCell;
   if (! tierOptions.wmt) {
      mainCellId = cellId;
      secondaryCellId = cellIdB;
      mainSubCell = 0;
      secondarySubCell = 1;
   } else {
      mainCellId = cellIdB;
      secondaryCellId = cellId;
      mainSubCell = 1;
      secondarySubCell = 0;
   };
   $(mainCellId).removeClass('hidden');
   $(mainCellId).popover('destroy');
   updateCell(mainCellId, isValid, results, mainSubCell, true);
   if (environment.dualMode) {
      $(mainCellId).addClass('fifty');
      $(secondaryCellId).addClass('fifty');
      $(secondaryCellId).removeClass('hidden');
      // fill in other subcell
      $(secondaryCellId).popover('destroy');
      if (mainSubCell === 1) {
         updateCell(secondaryCellId, isValid, results, secondarySubCell, false);
      } else {
         updateCell(secondaryCellId, isValid, results, secondarySubCell, true);
      };
   } else {
      $(mainCellId).removeClass('fifty');
      $(secondaryCellId).removeClass('fifty');
      $(secondaryCellId).addClass('hidden');
   };
};

function updateUpdateTableButton(requireUpdate) {
   if (requireUpdate) {
      $(".activate").removeClass('updated');
   } else {
      if (! tierOptions.wmt) {
         $(".breakMyTeam").addClass('updated');
         $(".wallMyTeam").removeClass('updated');
      } else {
         $(".wallMyTeam").addClass('updated');
         $(".breakMyTeam").removeClass('updated');
      };
   };
};

/**
  * Saves data onto the local storage.
  */
function saveData() {
   //console.log('saving data...');
   //localStorage.setItem('sweeperCalcEnvironment', JSON.stringify(environment));
};


/**
  * Gives Pokemon some boosts based on
  * the moves it has.
  */
function updateBoostedPokemon(pokemon) {
   // iterate through moves
   for (var i = 0; i < pokemon.moves.length; i++) {
      var moveName = pokemon.moves[i];
      if (typeof STAT_BOOSTING_MOVES[moveName] !== 'undefined') {
         // we have a stat boosting move
         giveBoostToPokemon(pokemon, moveName);
      };
   };
};

function giveBoostToPokemon(pokemon, moveName) {
   var statBoostArray = STAT_BOOSTING_MOVES[moveName];
   for (var i = 0; i < 6; i++) {
      pokemon.changeStatBoost(i, statBoostArray[i]);
   };
};

/**
  * Get the appropriate cell color based on the damage percentage.
  * @param attack the attack that the cell is representing
  * @param attack the opposing attack
  * @param subCell the top or bottom half of a cell
  * @param attackerStrikeFirst true if the current attacker strikes first or false otherwise.
  * @return colour that corresponds to the percentage.
  */
function getCellColor(attack, otherAttack, subCell, attackerStrikeFirst) {
   if (! tierOptions.wmt) {
      if (subCell === 0) {
         if (attack.maxKONumber === 1) {
            return COLOR_RED;
         } else if (attack.maxKONumber === 2) {
            return COLOR_ORANGE;
         } else {
            return COLOR_GREEN;
         };
      } else {
         if (attackerStrikeFirst) {
            if (attack.minKONumber === 1) {
               return COLOR_GREEN_B;
            } else {
               return COLOR_ORANGE_B;
            };
         } else {
            if (otherAttack.maxKONumber === 1) {
               return COLOR_RED_B;
            } else {
               return COLOR_ORANGE_B;
            }
         }
      };
   } else {
      if (subCell === 0) {
         if (attack.maxKONumber > otherAttack.minKONumber) {
            return COLOR_RED;
         } else {
            return COLOR_ORANGE;
         }
      } else {
         if (attack.minKONumber === 1 || attack.minKONumber === 2) {
            return COLOR_GREEN_B;
         } else if (attack.minKONumber === 3) {
            return COLOR_ORANGE_B;
         } else {
            return COLOR_RED_B;
         };
      }
   }
};


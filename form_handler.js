var environment;
var printOuts;
$(document).ready(function() {
   $.fn.exists = function () {
      return this.length !== 0;
   };

   environment = new Environment(6, 6);
   printOuts = {};

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
   
   //initialise tooltips
   $('.cHPTooltip').tooltip({
      placement: 'top',
      title: 'Current HP',
   });

   initialiseAutocomplete();

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



   // on change in environment input
   $(".input-enviro").on('change keyup keydown mouseup', function() {
      updateEnvironment();
      updateStaticData();
      updateTable();
      saveData();
   });

   // on click of reset all
   $("#pre-reset").on('click', function() {
      $(this).removeClass('in').addClass('collapse');
      $("#reset-all").removeClass('collapse').addClass('in');
   });
   $("#reset-all").on('click', function() {
      environment = new Environment(6, 6);
      printOuts = {};
      updateStaticData();
      updateForm();
      updateTable();
      saveData();
      $(this).removeClass('in').addClass('collapse');
      $("#pre-reset").removeClass('collapse').addClass('in');
   });

   // on click of switch
   $(".switch").on('click', function() {
      environment.switchTeams();
      updateForm();
      updateStaticData();
      updateTable();
      saveData();
   });

   $('#team0').on('shown.bs.collapse', function () {
      if ($("#team0").hasClass('in') || $("#team0").hasClass('collapsing')){
         $("#collapseTeam0").html('Collapse');
         $("#collapseTeam0").removeClass('btn-info').addClass('btn-primary');
      };
   })
   $('#team0').on('hidden.bs.collapse', function () {
      if ($("#team0").hasClass('collapsing') || $("#team0").hasClass('collapse')){
         $("#collapseTeam0").html('Expand');
         $("#collapseTeam0").removeClass('btn-primary').addClass('btn-info');
      };
   })

   
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
   // add none set
   setsInput.append('<option value="NONE_SET:0">None</option>');
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
         var results = getAttackResults(attacker, target, environment, false);
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
         if (environment.multiHit === MULTI_HIT_SINGLE &&
               typeof results.attacks[i].damagePercentageSingleHit !==
               'undefined') {
            percent_min = results.attacks[i].damagePercentageSingleHit[0];
            percent_max = results.attacks[i].damagePercentageSingleHit[1];
         };
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
   if (percentage <= 50 || typeof percentage !== 'number') {
      return '#f2dede';
   } else if (percentage < 100) {
      return '#fcf8e3';
   } else {
      return '#dff0d8';
   };
};

/**
  * Saves data onto the local storage.
  */
function saveData() {
   console.log('saving data...');
   localStorage.setItem('sweeperCalcEnvironment', JSON.stringify(environment));
};


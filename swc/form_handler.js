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
   if (localStorage.getItem('sweeperCalcV2') && 
         localStorage.getItem('sweeperCalcEnvironment')) {
      console.log('retrieving object...');
      environment = new Environment(6, 6,
            JSON.parse(localStorage.getItem('sweeperCalcEnvironment')));
   };
   localStorage.setItem('sweeperCalcV2', 'updated');
   updateStaticData();
   updateForm();
   updateTable();
   saveData();



   // on change in environment input
   $(".input-enviro").on('change keyup keydown mouseup', function() {
      updateEnvironment(false, $(this));
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
            if ($(cell_id).html() !== '<img src="../css/images/sprites/' + pokemon.name + '.png">') {
               $(cell_id).html('<img src="../css/images/sprites/' + pokemon.name + '.png">');
            };
         } else {
            if ($(cell_id).html() !== '<img src="../css/images/96_96_blank.png">') {
               $(cell_id).html('<img src="../css/images/96_96_blank.png">');
            };
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
            updateCells(i, j, false);
            continue;
         };
         var results = getAttackResults(attacker, target, environment, false);
         printOuts['square-' + i + '-' + j] = results[0].description;
         printOuts['square-' + i + '-' + j + '-b'] = results[1].description;
         if (!printOutDisplayed) {
            printOutDisplayed = true;
            $("#output").html(results[0].description);
         };
         updateCells(i, j, true, results);
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
function updateCells(row, col, isValid, results) {
   var cellId = '#square-' + row + '-' + col;
   var cellIdB = cellId + '-b';
   $(cellId).removeClass('hidden');
   $(cellId).popover('destroy');
   updateCell(cellId, isValid, results, 0, true);
   if (environment.dualMode) {
      $(cellId).addClass('fifty');
      $(cellIdB).addClass('fifty');
      $(cellIdB).removeClass('hidden');
      // fill in other subcell
      $(cellIdB).popover('destroy');
      updateCell(cellIdB, isValid, results, 1, true);
   } else {
      $(cellId).removeClass('fifty');
      $(cellIdB).removeClass('fifty');
      $(cellIdB).addClass('hidden');
   };
};
/**
  * Saves data onto the local storage.
  */
function saveData() {
   localStorage.setItem('sweeperCalcEnvironment', JSON.stringify(environment));
};

/**
  * Get the appropriate cell color based on the damage percentage.
  * @param attack the attack that the cell is representing
  * @param attack the opposing attack
  * @param subCell the top or bottom half of a cell
  * @return colour that corresponds to the percentage.
  */
function getCellColor(attack, otherAttack, subCell) {
   if (subCell === 0) {
      if (attack.minKONumber === 1) {
         return COLOR_GREEN;
      } else if (attack.minKONumber === 2) {
         return COLOR_ORANGE;
      } else {
         return COLOR_RED;
      };
   } else {
      if (attack.maxKONumber === 1) {
         return COLOR_RED_B;
      } else if (attack.maxKONumber === 2) {
         return COLOR_ORANGE_B;
      } else {
         return COLOR_GREEN_B;
      };
   };
};

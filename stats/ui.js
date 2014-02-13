function initialiseAutocomplete() {
   $( ".pokemon-name" ).autocomplete({
      source: function(request, response) {
         var results = $.ui.autocomplete.filter(POKEMON_LIST, request.term);
         response(results.slice(0, 15));
      },
      autoFocus: true,
   });

   $(".pokemon-name").each(
      function() {
         $(this).bind('autocompleteselect', function(event, ui) {
            $(this).val(ui.item.value);
            var data = $(this).closest('.pokemon-name');
            validatePokemonData(data.val());
         });
      }
   );
};

function isValidPokemonName(id) {
   if (id === 'Mewtwo-Mega-X') {
      console.log(id);
      console.log(POKEMON_DATA[id.toLowerCase()]);
   };
   if (typeof id === 'undefined' || id == null) {
      return false;
   };
   if (typeof MOVESET_DATA[id] === 'undefined') {
      return false;
   } else {
      return true;
   };
};

function updateMovesetData(pokemonName) {
   var downcased = pokemonName.toLowerCase()
   $("#moveset-png").attr("src", "../css/images/sprites/" + downcased + ".png");
   
   var tables = [ 'abilities', 'items', 'spreads', 'moves', 'teammates', 'checks' ]
   var headernames = {
      'abilities' : 'Ability',
      'items' : 'Item',
      'spreads' : 'Spread',
      'moves' : 'Move',
      'teammates' : 'Teammate',
      'checks' : 'Check or Counter',
   };
   var STUFF = "";
   for (i = 0; i < tables.length; i++) {
      STUFF += "<table>\
                  <tbody>\
                     <tr><th>";
      STUFF +=          headernames[tables[i]];
      STUFF +=      "</th><th class='usage'>Usage</th></tr>";
      for (j = 0; j < MOVESET_DATA[pokemonName][tables[i]].length; j++) {
         STUFF +=   "<tr><td>" + MOVESET_DATA[pokemonName][tables[i]][j][0] + "</td>\
                         <td>" + MOVESET_DATA[pokemonName][tables[i]][j][1] + "</td></tr>"
      }
      
      STUFF += "  </tbody>\
               </table>"
      $("#stats").html(STUFF);
   }

};

function generateRankings() {
   var output = "";
   output += "<table class='table'>\
                  <tbody>\
                     <tr><th>Rank</th><th>Name</th><th>Usage</th></tr>";
   
   for (i = 0; i < RANKINGS.length; i++) {
      output += "    <tr class='ranking-row' id=\"" + RANKINGS[i][1] + "\">\
                        <td>" + RANKINGS[i][0] + "</td>\
                        <td>" + RANKINGS[i][1] + "</td>\
                        <td>" + RANKINGS[i][2] + "</td>\
                     </tr>";
   };
   
   output += "    </tbody>\
               </table>";
   $("#ourankings").html(output);
};

function validatePokemonData(pokemonData) {
   var nameInput = $('.pokemon-name')
   if (!isValidPokemonName(pokemonData)) {
      changeFormErrorState(nameInput, true);
   } else {
      changeFormErrorState(nameInput, false);
      updateMovesetData(pokemonData);
   }
};

function changeFormErrorState(inputObject, isError) {
   if (isError) {
      inputObject.parent().addClass('has-error');
   } else {
      inputObject.parent().removeClass('has-error');
   }
}

$(".pokemon-name").on('change keyup keydown paste mouseup autocompleteselect autocompletechange', function(event, ui) {
      validatePokemonData($(this).val());
});



$(document).ready(function() {

   initialiseAutocomplete();
   generateRankings();
   
   validatePokemonData(RANKINGS[0][1]);
   $(".pokemon-name").val(RANKINGS[0][1]);
   
   $(".ranking-row").on('mouseup', function(event, ui) {
   var pokemon = $(this).attr('id');
   $(".pokemon-name").val(pokemon);
   validatePokemonData(pokemon);
});
   
});


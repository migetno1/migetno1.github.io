function getSetPokemon(setData, pokemonName, pokemon) {
   if (!pokemon) {
      pokemon = new Pokemon(DEFAULT_NUM_MOVES);
   };
   if (pokemonName && isValidPokemonName(pokemonName)) {
      pokemon.changeName(pokemonName);
      pokemon.valid = true;
   } else {
      pokemon.valid = false;
   };
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
      for (var moveNum = 0; moveNum < 6; moveNum++) {
         pokemon.changeMove(moveNum, setData.moves[moveNum]);
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
   pokemon.setName = setData.name;
   return pokemon;
};

/**
  * Converts a string into a Pokemon.
  * the string is in standard showdown format.
  * It currently does not accept nicknames or
  * any strange additions.
  * @param text text to parse
  * @return an array of pokemon
  */
function importTeam(text) {
   var pokemons = [new Pokemon(), new Pokemon(), new Pokemon(), 
            new Pokemon(), new Pokemon(), new Pokemon()];
   var textArray = text.split('\n');
   var i = 0, pokemonNum = 0;
   while (i < textArray.length && pokemonNum < 6) {
      // find the start of the pokemon
      var pattern = /^Ability: (.*)$/;
      while (! pattern.test(textArray[i]) && i < textArray.length) {
         i++;
      };
      if (i >= textArray.length) break; // not found pokemon
      // we have found the start
      if (i - 1 < 0) continue; // we have found ability on line 0 without name
      pokemons[pokemonNum] = importPokemon(textArray, i - 1);
      i++;
      pokemonNum++;
   };
   if (pokemonNum === 0) {
      // no pokemon found...
      return null;
   };
   return pokemons;
};

/**
  * Converts an array of strings into a Pokemon
  * the string is in standard showdown format.
  * @param textArray array of strings
  * @param i the current index
  * @return a Pokemon object
  */
function importPokemon(textArray, i) {
   var debug = true;
   var pokemon = new Pokemon();
   pokemon.valid = true;
   var pokemonName = null;
   var item = null;
   var ability = null;
   var nature = getDefaultNature();
   var ev = [ 0, 0, 0, 0, 0, 0, ];
   var iv = [ 31, 31, 31, 31, 31, 31];
   var moves = [ null, null, null, null ];

   // Line 1: (name) @ (item)
   if (debug) console.log('Line 1: (name) @ (item)');
   if (debug) console.log(textArray[i]);
   var regexPattern = /^([\w-]+)( @ (.*))?$/;
   var match = regexPattern.exec(textArray[i]);
   if (match === null) {
      // error
      console.log('error' + textArray[i]);
      return pokemon;
   };
   pokemonName = match[1];
   if (! isValidPokemonName(pokemonName)) {
      pokemonName = null;
      pokemon.valid = false;
   };
   if (match[3]) {
      item = match[3];
      item = item.replace(/\s+$/,'');
      if (! isValidItem(item)) {
         item = null;
      };
   }
   if (debug) console.log('Pokemon name: ' + pokemonName);
   if (debug) console.log('item: ' + item);
   i++;

   // Line 2: Ability: (ability)
   if (debug) console.log('Line 2: Ability: (ability)');
   if (debug) console.log(textArray[i]);
   regexPattern = /^Ability: (.*)$/;
   match = regexPattern.exec(textArray[i]);
   if (match !== null) {
      // we have an ability.
      ability = match[1];
      ability = ability.replace(/\s+$/,'');
      if (! isValidAbility(ability)) {
         ability = null;
      };
      i++;
   };
   if (debug) console.log('Ability: ' + ability);

   // Line 3: EVs
   if (debug) console.log('Line 3: EVs');
   if (debug) console.log(textArray[i]);
   regexPattern = /^EVs:/;
   match = regexPattern.exec(textArray[i]);
   if (match !== null) {
      // we have some evs
      regexPattern = /(\d+) ([a-zA-Z]+)/g;
      match = regexPattern.exec(textArray[i]);
      while (match !== null) {
         var evNum = match[1];
         var evStat = match[2];
         var stat = convertShowdownStat(evStat);
         ev[stat] = evNum;
         if (ev[stat] === null || typeof ev[stat] === 'undefined' || 
               ! isValidEV(ev[stat])) {
            ev[stat] = 0;
         };
         match = regexPattern.exec(textArray[i]);
      };
      i++;
   };
   if (debug) console.log('EVs ' + JSON.stringify(ev, null, '\t'));

   // Line 4: (nature) Nature
   if (debug) console.log('Line 4: (nature) Nature');
   if (debug) console.log(textArray[i]);
   regexPattern = /^(\w+) Nature$/;
   match = regexPattern.exec(textArray[i]);
   if (match !== null) {
      // we have a nature.
      nature = match[1];
      if (! isValidNature(nature)) {
         nature = getDefaultNature();
      };
      i++;
   };
   if (debug) console.log('Nature: ' + nature);

   // Line 5: IVs
   if (debug) console.log('Line 5: IVs');
   if (debug) console.log(textArray[i]);
   regexPattern = /^IVs:/;
   match = regexPattern.exec(textArray[i]);
   if (match !== null) {
      // we have some ivs
      regexPattern = /(\d+) ([a-zA-Z]+)/g;
      match = regexPattern.exec(textArray[i]);
      while (match !== null) {
         var ivNum = match[1];
         var ivStat = match[2];
         var stat = convertShowdownStat(ivStat);
         iv[stat] = ivNum;
         if (iv[stat] === null || typeof iv[stat] === 'undefined' || 
               ! isValidIV(iv[stat])) {
            iv[stat] = 31;
         };
         match = regexPattern.exec(textArray[i]);
      };
      i++;
   };
   if (debug) console.log('IVs ' + JSON.stringify(iv, null, '\t'));
   
   // Lines 6-9: moves
   if (debug) console.log('Lines 6-9: Moves');
   for (var j = 0; j < 4; j++) {
      if (debug) console.log(textArray[i+j]);
      regexPattern = /^- (.*)$/;
      match = regexPattern.exec(textArray[i+j]);
      if (match === null) continue;
      // we have a move
      moves[j] = match[1];
      moves[j] = moves[j].replace(/\s+$/,'');
      if (! isValidMoveName(moves[j])) {
         moves[j] = null;
      };
   };
   if (debug) console.log('Moves ' + JSON.stringify(moves, null, '\t'));
   // we now have all the information.
   if (pokemonName !== null) {
      pokemon.changeName(pokemonName);
   };
   if (item !== null) {
      pokemon.changeItem(item);
   };
   if (ability !== null) {
      pokemon.changeAbility(ability);
   };
   if (nature !== null) {
      pokemon.changeNature(nature);
   };
   for (var stat = 0; stat < 6; stat++) {
      pokemon.changeEV(stat, ev[stat]);
      pokemon.changeIV(stat, iv[stat]);
   };
   for (var moveNum = 0; moveNum < 4; moveNum++) {
      if (moves[moveNum] !== null) {
         pokemon.changeMove(moveNum, moves[moveNum]);
      };
   };
   return pokemon;
};

function convertShowdownStat(evStat) {
   switch (evStat) {
      case 'HP':
         return STAT_HP;
      case 'Atk':
         return STAT_ATT;
      case 'Def':
         return STAT_DEF;
      case 'SAtk':
         return STAT_SPA;
      case 'SDef':
         return STAT_SPD;
      case 'Spd':
         return STAT_SPE;
   };
};

/*
   Faggot things people do
   Give random nicknames
   Put IVs and EVs in wrong order
   Add gender
*/

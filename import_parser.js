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
      var pattern = /^(Trait|Ability): (.*)$/;
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
   var gender = null;
   var nature = getDefaultNature();
   var ev = [ 0, 0, 0, 0, 0, 0, ];
   var iv = [ 31, 31, 31, 31, 31, 31];
   var moves = [ null, null, null, null ];
   var level = null;

   // Line 1: (name) @ (item)
   if (debug) console.log('Line 1: (name) @ (item)');
   if (debug) console.log(textArray[i]);
   var regexPattern = /^(\w[\w.' -]+)($|( \(([MF])\))?( @ ([\w ']+))?$)/;
   var match = regexPattern.exec(textArray[i]);
   if (match === null) {
      regexPattern = /^.*\((\w[\w.' -]+)\)($|( \(([MF])\))?( @ ([\w ']+))?$)/;
      match = regexPattern.exec(textArray[i]);
      if (match === null) {
         // error
         console.log('error: ' + textArray[i]);
         pokemon.valid = false;
         return pokemon;
      };
   };
   pokemonName = match[1];
   // check for arceus
   if (typeof ARCEUS[pokemonName.toLowerCase()] !== 'undefined') {
      pokemonName = 'Arceus';
      item = ARCEUS[pokemonName.toLowerCase()];
   };
   if (! isValidPokemonName(pokemonName)) {
      pokemonName = null;
      pokemon.valid = false;
      return pokemon;
   };
   if (match[4]) {
      gender = getGender(match[4]);
   };
   if (match[6]) {
      item = match[6];
      item = item.replace(/\s+$/,'');
      if (! isValidItem(item)) {
         item = null;
      };
   }
   // check for mega evo
   if (typeof MEGA_EVOS[pokemonName.toLowerCase()] !== 'undefined' &&
         item &&
         typeof MEGA_EVOS[pokemonName.toLowerCase()][item.toLowerCase()] !== 'undefined') {
      pokemonName = MEGA_EVOS[pokemonName.toLowerCase()][item.toLowerCase()];
   };


   if (debug) console.log('Pokemon name: ' + pokemonName);
   if (debug) console.log('item: ' + item);
   i++;

   // Line 2: Ability: (ability)
   if (debug) console.log('Line 2: Ability: (ability)');
   if (debug) console.log(textArray[i]);
   regexPattern = /^(Trait|Ability): (.*)$/;
   match = regexPattern.exec(textArray[i]);
   if (match !== null) {
      // we have an ability.
      ability = match[2];
      ability = ability.replace(/\s+$/,'');
      if (! isValidAbility(ability)) {
         ability = null;
      };
      i++;
   };
   if (debug) console.log('Ability: ' + ability);


   // Line 3: Level
   if (debug) console.log('Line 3: level');
   if (debug) console.log(textArray[i]);
   regexPattern = /^Level: (\d+)\s*$/;
   match = regexPattern.exec(textArray[i]);
   if (match !== null) {
      // we have a level
      level = parseInt(match[1]);
      if (! isValidLevel(level)) {
         level = null;
      };
      i++;
   };

   // Line 4: Shinyness
   if (debug) console.log('Line 4: shinyness');
   if (debug) console.log(textArray[i]);
   regexPattern = /^Shiny: Yes\s*$/;
   match = regexPattern.exec(textArray[i]);
   if (match !== null) {
      // we do nothing
      i++;
   };

   // Line 5: Happiness
   if (debug) console.log('Line 5: happiness');
   if (debug) console.log(textArray[i]);
   regexPattern = /^Happiness: (\d+)\s*$/;
   match = regexPattern.exec(textArray[i]);
   if (match !== null) {
      // we do nothing
      i++;
   };

   // Line 6: EVs
   if (debug) console.log('Line 6: EVs');
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

   // Line 7: (nature) Nature
   if (debug) console.log('Line 7: (nature) Nature');
   if (debug) console.log(textArray[i]);
   regexPattern = /^(\w+) Nature\s*$/;
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

   // Line 8: IVs
   if (debug) console.log('Line 8: IVs');
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
   
   // Lines 9-12: moves
   if (debug) console.log('Lines 9-12: Moves');
   for (var j = 0; j < 4; j++) {
      if (debug) console.log(textArray[i+j]);
      regexPattern = /^([-*] ?)?([\w' -\[\]]+)$/;
      match = regexPattern.exec(textArray[i+j]);
      if (match === null) continue;
      // we have a move
      moves[j] = match[2];
      moves[j] = moves[j].replace(/\s+$/,'');
      // check for hidden power
      regexPattern = /Hidden Power \[?(\w+)\]?/i;
      match = regexPattern.exec(moves[j]);
      if (match !== null) {
         // we have a hidden power.
         moves[j] = 'Hidden Power';
         if (typeof HIDDEN_POWER[match[1].toLowerCase()] !== 'undefined' && isDefaultIVs(iv)) {
            // we will change the ivs to match the hidden power
            iv = changeIVs(iv, HIDDEN_POWER[match[1].toLowerCase()]);
         };
      };
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
   if (level !== null) {
      pokemon.changeLevel(level);
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
   if (gender !== null) {
      pokemon.changeGender(gender);
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
      case 'SpA':
         return STAT_SPA;
      case 'SDef':
         return STAT_SPD;
      case 'SpD':
         return STAT_SPD;
      case 'Spd':
         return STAT_SPE;
      case 'Spe':
         return STAT_SPE;
   };
};

/** 
  * Converts gender into the gender constant
  * @param gender M or F
  * @return the corresponding constant.
  */
function getGender(gender) {
   if (gender === 'M') {
      return GENDER_MALE;
   } else if (gender === 'F') {
      return GENDER_FEMALE;
   } else {
      return GENDER_GENDERLESS;
   };
};

/**
  * Determines if all IVs are at 31.
  * @param iv an array of 6 ivs
  * @return true if all ivs == 31, or false otherwise.
  */
function isDefaultIVs(iv) {
   for (var i = 0; i < iv.length; i++) {
      if (iv[i] !== 31) {
         return false;
      };
   }; 
   return true;
};

/** 
  * changes the ivs of the first array to match the second.
  * @param iv the original array
  * @param newIV the new IVs.
  * @return the new iv array.
  */
function changeIVs(iv, newIV) {
   for (var i = 0; i < iv.length; i++) {
      iv[i] = newIV[i];
   };
   return iv;
};

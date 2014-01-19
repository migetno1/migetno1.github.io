function importFromUrl(environment, tierOptions) {
   var url = location.href;
   var pattern = /\?(.+)$/;
   var match = pattern.exec(url);
   if (match === null) {
      // no importing.
      return;
   };
   var importText = match[1];
   var pokemonImports = importText.split(';');
   if (pokemonImports.length < 2) return;
   for (var i = 0; i < pokemonImports.length; i++) {
      pokemonImports[i] = pokemonImports[i].split(',');
      // validate correct # of input
      if (i === 0 && pokemonImports[i].length !== 11) {
         console.log('i: ' + i + ' length: ' + pokemonImports[i].length);
         return;
      } else if (i === 1 && pokemonImports[i].length !== 5) {
         console.log('i: ' + i + ' length: ' + pokemonImports[i].length);
         return;
      } else if (i !== 0 && i !== 1 && pokemonImports[i].length !== 23) {
         console.log('i: ' + i + ' length: ' + pokemonImports[i].length);
         return;
      };
   };
   // update environment
   var enviroImport = pokemonImports[0];
   // weather
   if (enviroImport[0] !== '') {
      environment.weather = parseInt(enviroImport[0]);
   };
   // trick room
   if (enviroImport[1] !== '') {
      enviroImport[1] = parseInt(enviroImport[1]);
      environment.trickRoom = !! enviroImport[1];
   };
   // light screen
   if (enviroImport[2] !== '') {
      enviroImport[2] = parseInt(enviroImport[2]);
      environment.lightScreen[0] = !! enviroImport[2];
   };
   // light screen
   if (enviroImport[3] !== '') {
      enviroImport[3] = parseInt(enviroImport[3]);
      environment.lightScreen[1] = !! enviroImport[3];
   };
   // reflect
   if (enviroImport[4] !== '') {
      enviroImport[4] = parseInt(enviroImport[4]);
      environment.reflect[0] = !! enviroImport[4];
   };
   // reflect
   if (enviroImport[5] !== '') {
      enviroImport[5] = parseInt(enviroImport[5]);
      environment.reflect[1] = !! enviroImport[5];
   };
   // multi hit
   if (enviroImport[6] !== '') {
      enviroImport[6] = parseInt(enviroImport[6]);
      environment.multiHit = parseInt(enviroImport[6]);
   };
   // doubles
   if (enviroImport[7] !== '') {
      enviroImport[7] = parseInt(enviroImport[7]);
      environment.doubles = !! enviroImport[7];
   };
   // default level
   if (enviroImport[8] !== '') {
      enviroImport[8] = parseInt(enviroImport[8]);
      environment.defaultLevel = enviroImport[8];
   };
   // display option
   if (enviroImport[9] !== '') {
      enviroImport[9] = parseInt(enviroImport[9]);
      switch(enviroImport[9]) {
         case 0:
            enviroment.displayOption = 'verbose';
            break;
         case 1:
            enviroment.displayOption = 'hybrid';
            break;
         case 2:
            environment.displayOption = 'visual';
            break;
      };
   };
   // dual mode
   if (enviroImport[10] !== '') {
      enviroImport[10] = parseInt(enviroImport[10]);
      environment.dualMode = !! enviroImport[10];
   };
   // update tier options
   var tierImport = pokemonImports[1];
   if (tierImport[0] !== '') {
      tierImport[0] = parseInt(tierImport[0]);
      tierOptions.tier = tierImport[0];
   }
   // boosted sweepers
   if (tierImport[1] !== '') {
      tierImport[1] = parseInt(tierImport[1]);
      tierOptions.boostedSweepers = !! tierImport[1];
   };
   // enable priority
   if (tierImport[2] !== '') {
      tierImport[2] = parseInt(tierImport[2]);
      tierOptions.enablePriority = !! tierImport[2];
   };
   // outspeed
   if (tierImport[3] !== '') {
      tierImport[3] = parseInt(tierImport[3]);
      tierOptions.outSpeed = tierImport[3];
   };
   // wmt
   if (tierImport[4] !== '') {
      tierImport[4] = parseInt(tierImport[4]);
      tierOptions.wmt = !! tierImport[4];
   };

   // importing pokemon
   for (var i = 2; i < pokemonImports.length; i++) {
      var pokemonImport = pokemonImports[i];
      var num = i - 2;
      var pokemon = new Pokemon(DEFAULT_NUM_MOVES);
      // check that the name is correct.
      if (pokemonImport[0] !== '') {
         pokemonImport[0] = parseInt(pokemonImport[0]);
         if (typeof NUMBER_TO_NAME[pokemonImport[0]] !== 'undefined') {
            pokemon.valid = true;
            pokemon.changeName(NUMBER_TO_NAME[pokemonImport[0]]);
         } else {
            // the pokemon is invalid.
            environment.pokemons[1][num] = pokemon;
            continue;
         };
      };
      // update all other attributes
      if (pokemonImport[1] !== '') {
         pokemon.changeNature(NUMBER_TO_NATURE[parseInt(pokemonImport[1])]);
      };
      if (pokemonImport[2] !== '') {
         pokemon.changeItem(NUMBER_TO_ITEM[parseInt(pokemonImport[2])]);
      };
      if (pokemonImport[3] !== '') {
         pokemon.changeAbility(NUMBER_TO_ABILITY[parseInt(pokemonImport[3])]);
      };
      // update the pokemon's level
      if (environment.defaultLevel !== 100) {
         pokemon.changeLevel(environment.defaultLevel);
      };
      if (pokemonImport[4] !== '') {
         pokemon.changeLevel(parseInt(pokemonImport[4]));
      };
      for (var j = 5; j < 11; j++) {
         var numStat = j - 5;
         if (pokemonImport[j] !== '') {
            pokemon.changeIV(numStat, parseInt(pokemonImport[j]));
         };
      };
      for (var j = 11; j < 17; j++) {
         var numStat = j - 11;
         if (pokemonImport[j] !== '') {
            pokemon.changeEV(numStat, parseInt(pokemonImport[j]));
         };
      };
      for (var j = 17; j < 17 + DEFAULT_NUM_MOVES; j++) {
         var numMove = j - 17;
         if (pokemonImport[j] !== '') {
            pokemon.changeMove(numMove, NUMBER_TO_MOVE[parseInt(pokemonImport[j])]);
         };
      };


      // update the Pokemon
         
      environment.pokemons[1][num] = pokemon;
   };
};

function exportToUrl(environment, tierOptions) {
   var exportText = '';
   // exportKey environment
   if (environment.weather !== 0) {
      exportText += environment.weather;
   };
   exportText += ',';
   if (environment.trickRoom !== false) {
      var exportKey = environment.trickRoom ? 1 : 0;
      exportText += exportKey;
   };
   exportText += ',';
   if (environment.lightScreen[0] !== false) {
      var exportKey = environment.lightScreen[0] ? 1 : 0;
      exportText += exportKey;
   };
   exportText += ',';
   if (environment.lightScreen[1] !== false) {
      var exportKey = environment.lightScreen[1] ? 1 : 0;
      exportText += exportKey;
   };
   exportText += ',';
   if (environment.reflect[0] !== false) {
      var exportKey = environment.reflect[0] ? 1 : 0;
      exportText += exportKey;
   };
   exportText += ',';
   if (environment.reflect[1] !== false) {
      var exportKey = environment.reflect[1] ? 1 : 0;
      exportText += exportKey;
   };
   exportText += ',';
   if (environment.multiHit !== MULTI_HIT_FULL) {
      exportText += environment.multiHit;
   };
   exportText += ',';
   if (environment.doubles !== false) {
      var exportKey = environment.doubles ? 1 : 0;
      exportText += exportKey;
   };
   exportText += ',';
   if (environment.defaultLevel !== 100) {
      exportText += environment.defaultLevel;
   };
   exportText += ',';
   if (environment.displayOption !== 'verbose') {
      var exportKey;
      switch(environment.displayOption) {
         case 'verbose':
            exportKey = 0;
            break;
         case 'hybrid':
            exportKey = 1;
            break;
         case 'visual':
            exportKey = 2;
            break;
      };
      exportText += exportKey;
   };
   exportText += ',';
   if (environment.dualMode !== false) {
      var exportKey = environment.dualMode ? 1 : 0;
      exportText += exportKey;
   };
   exportText += ';';
   // export tier options
   if (! tierOptions) {
      return ',,,,';
   } else {
      if (tierOptions.tier !== TIER_TO_NUMBER['ou']) {
         var exportKey = tierOptions.tier;
         exportText += exportKey;
      };
      exportText += ',';
      if (tierOptions.boostedSweepers !== false) {
         var exportKey = tierOptions.boostedSweepers ? 1 : 0;
         exportText += exportKey;
      };
      exportText += ',';
      if (tierOptions.enablePriority !== false) {
         var exportKey = tierOptions.enablePriority ? 1 : 0;
         exportText += exportKey;
      };
      exportText += ',';
      if (tierOptions.outSpeed !== 0) {
         var exportKey = tierOptions.outSpeed;
         exportText += exportKey;
      };
      exportText += ',';
      if (tierOptions.wmt !== false) {
         var exportKey = tierOptions.wmt ? 1 : 0;
         exportText += exportKey;
      };
   };
   exportText += ';';
   // export Pokemon
   for (var i = 0; i < environment.pokemons[1].length; i++) {
      var pokemon = environment.pokemons[1][i];
      if (! pokemon.valid) {
         if (i === environment.pokemons[1].length - 1) {
            exportText += ',,,,,,,,,,,,,,,,,,,,,,';
         } else {
            exportText += ',,,,,,,,,,,,,,,,,,,,,,;';
         };
         continue;
      };
      exportText += NAME_TO_NUMBER[pokemon.name];
      exportText += ',';
      if (pokemon.nature !== getDefaultNature()) {
         exportText += NATURE_TO_NUMBER[pokemon.nature];
      };
      exportText += ',';
      if (pokemon.item !== null) {
         exportText += ITEM_TO_NUMBER[pokemon.item];
      };
      exportText += ',';
      if (pokemon.ability !== null) {
         exportText += ABILITY_TO_NUMBER[pokemon.ability];
      };
      exportText += ',';
      if (pokemon.level !== 100) {
         exportText += pokemon.level;
      };
      exportText += ',';
      for (var stat = 0; stat < 6; stat++) {
         if (pokemon.iv[stat] !== 31) {
            exportText += pokemon.iv[stat];
         };
         exportText += ',';
      };
      for (var stat = 0; stat < 6; stat++) {
         if (pokemon.ev[stat] !== 0) {
            exportText += pokemon.ev[stat];
         };
         exportText += ',';
      };
      for (var moveNum = 0; moveNum < DEFAULT_NUM_MOVES; moveNum++) {
         if (pokemon.moves[moveNum] !== null) {
            exportText +=  MOVE_TO_NUMBER[pokemon.moves[moveNum]];
         };
         if (moveNum !== DEFAULT_NUM_MOVES - 1) {
            exportText += ',';
         };
      };
      if (i !== environment.pokemons[1].length - 1) {
         exportText += ';';
      };
   };
   var url = location.href;
   var pattern = /^([^?]+)(\?(.+))?$/;
   var match = pattern.exec(url);
   if (match == null) return exportText;
   exportText = match[1] + '?' + exportText;
   return exportText;
};

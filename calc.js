var debug = false;
/**
  * Gets the base stat of a Pokemon.
  * @param pokemon Name of the Pokemon
  * @param stat Base stat to be determined
  * @return the base stat of the Pokemon.
*/
function getBaseStat(pokemon, stat) {
   if (pokemon == null) { return 0 };
   return POKEMON_DATA[pokemon].stats[stat];
};

/**
  * Get the nature modification.
  * @param nature nature
  * @param stat Stat to determine if modified
  * @return 9 (- stat), 10 (neutral) or 11 (+ stat)
  */
function getNatureMod(nature, stat) {
   nature = nature.toLowerCase();
   if (! nature) {
      return 10;
   };
   if (NATURES[nature].upStat == stat) {
      return 11;
   } else if (NATURES[nature].downStat == stat) {
      return 9;
   } else {
      return 10;
   };
};

/**
  * Gets the boost numerator of a stat boost level.
  * @param statBoostLevel stat boost level
  * @return the numerator of the boost to multiply.
*/
function getBoostNumerator(statBoostLevel) {
   return (statBoostLevel > 0) ? (2 + statBoostLevel) : 2;
};

/**
  * Gets the boost denominator of a stat boost level.
  * @param statBoostLevel stat boost level
  * @return the denominator of the boost to multiply.
*/
function getBoostDenominator(statBoostLevel) {
   return (statBoostLevel < 0) ? (2 + Math.abs(statBoostLevel)) : 2;
};

/**
  * Determines the resultant modifier after combining multiple modifiers.
  * @param modifiers an array of modifiers
  * @return resultant modifier
*/
function chainMultipleModifiers(modifiers) {
   var newModifier = 0x1000;
   for (var i = 0; i < modifiers.length; i++) {
      newModifier = chainModifiers(newModifier, modifiers[i]);
   }
   return newModifier;
};

/**
  * Determines the resulting modifier after combining 2 modifiers.
  * @param modifier1 the first modifier
  * @param modifier2 the second modifier
  * @return resultant modifier
*/
function chainModifiers(modifier1, modifier2) {
   var newModifier = ((modifier1 * modifier2) + 0x800) >> 12;
   return newModifier;
};

/**
  * Applies a modifier to a value.
  * @param value Value to be modified
  * @param modifier modifier value
  * @return new value
*/
function applyModifier(value, modifier) {
   var newValue = value * modifier / 0x1000;
   var floor = Math.floor(newValue);
   var decimal = newValue - floor;
   if (decimal <= 0.5) {
      return floor;
   } else {
      return (floor + 1);
   }
}

/**
  * Determines if the move is a move that targets
  * the target's defence despite being special
  */
function isSpecialToPhysicalMove(move) {
   return (typeof SPECIAL_TO_PHYSICAL_MOVES[move.name] !== 'undefined');
};


/**
  * Gets the stat of a Pokemon (no modifications)
  * @param pokemon Pokemon object
  * @param stat Stat to calculate (ATK, DEF, etc.)
  * @return the stat of the Pokemon.
*/
function getStat(pokemon, stat) {
   if (!isValidStat(stat)) {
      return;
   };
   var pokeStat;
   var evMod = Math.floor(pokemon.ev[stat] / 4);
   var baseStat = getBaseStat(pokemon.name, stat);
   var iv = pokemon.iv[stat];
   
   var stage1 = Math.floor(2 * baseStat + iv + evMod);
   if (stat === STAT_HP) {
      // Calculate HP stat.
      pokeStat = stage1 * pokemon.level / 100 + pokemon.level + 10;
   } else {
      // Calculate other stat
      // getNatureMod returns either 9, 10 or 11. This prevents division too early.
      var stage2 = Math.floor(stage1 * pokemon.level / 100 + 5);
      pokeStat = stage2 * getNatureMod(pokemon.nature, stat);
      pokeStat = pokeStat / 10;
   };
   pokeStat = Math.floor(pokeStat);
   return pokeStat;
};

/**
  * Gets the base power of an attack.
  * @param attacker Pokemon attacker object
  * @param target Pokemon target object
  * @param move Move object that the attacker is using.
  * @param environment Environment object
  * @return the base power of the attack.
*/
function getBasePower(description, attacker, target, move, environment) {
   var power = move.power;
   if (move.category !== MOVE_PHYSICAL && move.category !== MOVE_SPECIAL) {
      return 0;
   };
   // TODOn payback
   if (move.name === 'Electro Ball') {
      var s = getStat(attacker, STAT_SPE) / getStat(target, STAT_SPE);
      if (s >= 4) {
         power = 150;
      } else if (s >= 3) {
         power = 120;
      } else if (s >= 2) {
         power = 80;
      } else if (s >= 1) {
         power = 60;
      } else {
         power = 50;
      };
      description.moveBP = power;
   // TODOn avalanche
   } else if (move.name === 'Gyro Ball') {
      var tmp_power = Math.floor(25 * getStat(target, STAT_SPE) / 
            getStat(attacker, STAT_SPE));
      if (tmp_power < 150) {
         power = tmp_power;
      } else {
         power = 150;
      };
      description.moveBP = power;
   } else if (move.name === 'Water Spout' || move.name === 'Eruption') {
      power = (150 * attacker.currentHP) / getStat(attacker, STAT_HP);
      description.moveBP = power;
   } else if (move.name === 'Punishment') {
      var statupTotal = 0;
      for (var stat = 0; stat < 6; stat++) {
         if (target.statBoost[stat] > 0) {
            statupTotal += target.statBoost[stat];
         };
      };
      var tmp_power = 60 + 20 * statupTotal;
      if (tmp_power < 120) {
         power = tmp_power;
      } else {
         power = 120;
      };
      description.moveBP = power;
   // TODOn fury cutter
   } else if (move.name === 'Grass Knot' || move.name === 'Low Kick') {
      var weight = getWeight(attacker);
      if (weight >= 200) {
         power = 120;
      } else if (weight >= 100) {
         power = 100;
      } else if (weight >= 50) {
         power = 80;
      } else if (weight >= 25) {
         power = 60;
      } else if (weight >= 10) {
         power = 40;
      } else {
         power = 20;
      };
      description.moveBP = power;
   } else if (move.name === 'Echoed Voice') {
      // TODOn dunno..
      power =  40;
      description.moveBP = power;
   } else if (move.name === 'Hex') {
      if (target.status === STATUS_NORMAL) {
         power = 65;
      } else {
         power = 130;
      };
      description.moveBP = power;
   } else if (move.name === 'Wring Out' || move.name === 'Crush Grip') {
      var targetHPPercentage = (target.currentHP * 0x1000) /
         (getStat(target, STAT_HP) * 0x1000) * 100;
      power = Math.floor(Math.round(120 * targetHPPercentage) / 100);
      description.moveBP = power;
   } else if (move.name === 'Assurance') {
      // TODOn dunno..
      power = 60;
      description.moveBP = power;
   } else if (move.name === 'Heavy Slam' || move.name === 'Heat Crash') {
      var weightRatio = Math.floor(getWeight(attacker) / getWeight(target));
      if (weightRatio >= 5) {
         power = 120;
      } else if (weightRatio >= 4) {
         power = 100;
      } else if (weightRatio >= 3) {
         power = 80;
      } else if (weightRatio >= 2) {
         power = 60;
      } else {
         power = 40;
      };
      description.moveBP = power;
   } else if (move.name === 'Stored Power') {
      var statupTotal = 0;
      for (var stat = 0; stat < 6; stat++) {
         if (attacker.statBoost[stat] > 0) {
            statupTotal += attacker.statBoost[stat];
         };
      };
      power = 20 + 20 * statupTotal;
      description.moveBP = power;
   } else if (move.name === 'Acrobatics') {
      if (! attacker.item ||
            attacker.item.match(/berry|gem/i)) {
         // no item or consumed item
         power = 110;
      } else {
         power = 55;
      };
      description.moveBP = power;
   } else if (move.name === 'Trump Card') {
      power = 40;
      description.moveBP = power;
   } else if (move.name === 'Round') {
      power = 60;
      description.moveBP = power;
   // TODOn triple kick
   } else if (move.name === 'Wake-Up Slap') {
      if (target.status === STATUS_SLEEP) {
         power = 140;
      } else {
         power = 70;
      };
      description.moveBP = power;
   } else if (move.name === 'Smelling Salts') {
      if (target.status === STATUS_PARALYSE) {
         power = 140;
      } else {
         power = 70;
      };
      description.moveBP = power;
   } else if (move.name === 'Weather Ball') {
      if (environment.weather === ENVIRONMENT_NORMAL) {
         power = 50;
      } else {
         description.weather = ENVIRONMENT_ID_TO_NAME[environment.weather];
         power = 100;
      };
      description.moveBP = power;
   } else if (move.name === 'Beat Up') {
      // TODOn check if correct (or if anyone cares)
      power = 0;
      var basePower = Math.floor(getStat(attacker, STAT_ATT) / 10) + 5;
      for (i = 0; i < 6; i++) {
         if (environment.pokemons[0][i].currentHP > 0) {
            power += basePower;
         };
      };
      description.moveBP = power;
   } else if (move.name === 'Spit Up') {
      // TODOn
      power = 0;
      description.moveBP = power;
   } else if (move.name === 'Pursuit') {
      // TODOn
      power = 40;
      description.moveBP = power;
   } else if (move.name === 'Present') {
      // assume min
      power = 40;
      description.moveBP = power;
   } else if (move.name === 'Natural Gift') {
      if (target.ability === 'unnerve') {
         description.defenderAbility = ABILITIES[target.ability].name;
      };
      if (typeof NATURAL_GIFT_BERRIES[attacker.item] === 'undefined' ||
         target.ability === 'unnerve' ||
         attacker.ability === 'klutz') {
         power = 0;
      } else {
         description.attackerItem = ITEMS[attacker.item].name;
         power = NATURAL_GIFT_BERRIES[attacker.item].power;
      };
      description.moveBP = power;
   } else if (move.name === 'Magnitude') {
      // dumb move
      power = 10;
      description.moveBP = power;
   } else if (move.name === 'Rollout') {
      power = 30;
      description.moveBP = power;
   } else if (move.name === 'Fling') {
      // TODO actually can do
      power = 40;
      description.moveBP = power;
   };
   // TODOn water pledge
   power = applyBasePowerModifiers(power, description, attacker, target, move, environment);
   return power;
};

/**
  * Modifies the current base power with modifiers.
  * @param power current base power
  * @param attacker Pokemon attacker object
  * @param target Pokemon target object
  * @param move Move object that the attacker is using.
  * @param environment Environment object
  * @return the new base power.
*/
function applyBasePowerModifiers(power, description, attacker, target, move, environment) {
   var modifiers = [];
   if (attacker.ability === 'technician' && move.power <= 60) {
      description.attackerAbility = ABILITIES[attacker.ability].name;
      modifiers.push(0x1800);
   };
   if (attacker.ability === 'aerilate' && move.type === TYPE_NAME_TO_ID.Normal) {
      description.attackerAbility = ABILITIES[attacker.ability].name;
      modifiers.push(0x14CD);
   }
   if (attacker.ability === 'refrigerate' && move.type === TYPE_NAME_TO_ID.Normal) {
      description.attackerAbility = ABILITIES[attacker.ability].name;
      modifiers.push(0x14CD);
   };
   if (attacker.ability === 'pixilate' && move.type === TYPE_NAME_TO_ID.Normal) {
      description.attackerAbility = ABILITIES[attacker.ability].name;
      modifiers.push(0x14CD);
   };
   if (attacker.ability === 'strong jaw' && 
         typeof STRONG_JAW_MOVES[move.name] !== 'undefined') {
      description.attackerAbility = ABILITIES[attacker.ability].name;
      modifiers.push(0x1800);
   };
   if (attacker.ability === 'mega launcher' &&
         typeof MEGA_LAUNCHER_MOVES[move.name] !== 'undefined') {
      description.attackerAbility = ABILITIES[attacker.ability].name;
      modifiers.push(0x1800);
   };
   if (attacker.ability === 'tough claws' &&
         isContactMove(move)) {
      description.attackerAbility = ABILITIES[attacker.ability].name;
      modifiers.push(0x14CD);
   };
   if (attacker.ability === 'dark aura' &&
         move.type === TYPE_NAME_TO_ID.Dark) {
      description.attackerAbility = ABILITIES[attacker.ability].name;
      if (target.ability === 'aura break') {
         description.defenderAbility = ABILITIES[target.ability].name;
         modifiers.push(0xAAA);
      } else {
         modifiers.push(0x1555);
      };
   };
   if (attacker.ability === 'fairy aura' &&
         move.type === TYPE_NAME_TO_ID.Fairy) {
      description.attackerAbility = ABILITIES[attacker.ability].name;
      if (target.ability === 'aura break') {
         description.defenderAbility = ABILITIES[target.ability].name;
         modifiers.push(0xAAA);
      } else {
         modifiers.push(0x1555);
      };
   };
   if (attacker.ability === 'flare boost' && attacker.status === STATUS_BURN &&
         move.category === MOVE_SPECIAL) {
      description.attackerAbility = ABILITIES[attacker.ability].name;
      modifiers.push(0x1800);
   };
   if (attacker.ability === 'analytic' && move.name !== 'Future Sight'
         && move.name !== 'Doom Desire'
         && ! attackerStrikeFirst(attacker, target, environment)) {
      description.attackerAbility = ABILITIES[attacker.ability].name;
      modifiers.push(0x14CD);
   };
   if (attacker.ability === 'reckless' && 
         typeof RECKLESS_MOVES[move.name] !== 'undefined') {
      description.attackerAbility = ABILITIES[attacker.ability].name;
      modifiers.push(0x1333);
   };
   if (attacker.ability === 'iron fist' && 
         typeof IRON_FIST_MOVES[move.name] !== 'undefined') {
      description.attackerAbility = ABILITIES[attacker.ability].name;
      modifiers.push(0x1333);
   };
   if (attacker.ability === 'toxic boost' && attacker.status === 
         STATUS_POISON && move.category === MOVE_PHYSICAL) {
      description.attackerAbility = ABILITIES[attacker.ability].name;
      modifiers.push(0x1800);
   };
   if (attacker.ability === 'rivalry') {
      if (attacker.gender === GENDER_GENDERLESS ||
            target.gender === GENDER_GENDERLESS) {
         modifiers.push(0x1000);
      } else if (attacker.gender === target.gender) {
         description.attackerAbility = ABILITIES[attacker.ability].name;
         modifiers.push(0x1400);
      } else {
         description.attackerAbility = ABILITIES[attacker.ability].name;
         modifiers.push(0xC00);
      };
   };
   if (attacker.ability === 'sand force' && 
         (move.type === TYPE_NAME_TO_ID.Rock || move.type === TYPE_NAME_TO_ID.Ground ||
          move.type === TYPE_NAME_TO_ID.Steel) && environment.weather === ENVIRONMENT_SAND) {
      description.weather = ENVIRONMENT_ID_TO_NAME[environment.weather];
      description.attackerAbility = ABILITIES[attacker.ability].name;
      modifiers.push(0x14CD);
   };
   if (target.ability === 'heatproof' && move.type === TYPE_NAME_TO_ID.Fire) {
      description.defenderAbility = ABILITIES[target.ability].name;
      modifiers.push(0x800);
   };
   if (target.ability === 'dry skin' && move.type === TYPE_NAME_TO_ID.Fire) {
      description.defenderAbility = ABILITIES[target.ability].name;
      modifiers.push(0x1400);
   };
   if (attacker.ability === 'sheer force' && typeof SHEER_FORCE_MOVES[move.name] !== 'undefined') {
      description.attackerAbility = ABILITIES[attacker.ability].name;
      modifiers.push(0x14CD);
   };
   if (typeof TYPE_BOOSTING_ITEMS[attacker.item] !== 'undefined' && move.type === TYPE_BOOSTING_ITEMS[attacker.item]) {
      // we have a type boosting item.
      description.attackerItem = ITEMS[attacker.item].name;
      modifiers.push(0x1333);
   };
   if (attacker.item === 'muscle band' && move.category === MOVE_PHYSICAL) {
      description.attackerItem = ITEMS[attacker.item].name;
      modifiers.push(0x1199);
   };
   if (attacker.name === 'palkia' && attacker.item === 'lustrous orb' &&
         (move.type === TYPE_NAME_TO_ID.Water || move.type === TYPE_NAME_TO_ID.Dragon)) {
      description.attackerItem = ITEMS[attacker.item].name;
      modifiers.push(0x1333);
   };
   if (attacker.item === 'wise glasses' && move.category === MOVE_SPECIAL) {
      description.attackerItem = ITEMS[attacker.item].name;
      modifiers.push(0x1199);
   };
   if (attacker.name.match(/giratina/i) && attacker.item === 'griseous orb' &&
         (move.type === TYPE_NAME_TO_ID.Ghost || move.type === TYPE_NAME_TO_ID.Dragon)) {
      description.attackerItem = ITEMS[attacker.item].name;
      modifiers.push(0x1333);
   };
   if (attacker.item === 'odd incense' && move.type === TYPE_NAME_TO_ID.Psychic) {
      description.attackerItem = ITEMS[attacker.item].name;
      modifiers.push(0x1333);
   };
   if (attacker.name === 'dialga' && attacker.item === 'adamant orb' &&
         (move.type === TYPE_NAME_TO_ID.Steel || move.type === TYPE_NAME_TO_ID.Dragon)) {
      description.attackerItem = ITEMS[attacker.item].name;
      modifiers.push(0x1333);
   };
   if (typeof GEMS[attacker.item] !== 'undefined' && move.type === GEMS[attacker.item]) {
      // we have a type boosting gem
      description.attackerItem = ITEMS[attacker.item].name;
      modifiers.push(0x1800);
   };
   if (move.name === 'Facade' && (attacker.status === STATUS_PARALYSE ||
            attacker.status === STATUS_POISON ||
            attacker.status === STATUS_BURN)) {
      modifiers.push(0x2000);
   };
   if (move.name === 'Brine' && (target.currentHP * 0x1000 * 100 / (getStat(target, STAT_HP) * 0x1000)) <= 50) {
      modifiers.push(0x2000);
   };
   if (move.name === 'Venoshock' && target.status === STATUS_POISON) {
      modifiers.push(0x2000);
   };
   if (move.name === 'Solar Beam' && environment.weather !== ENVIRONMENT_NORMAL
         && environment.weather !== ENVIRONMENT_SUN) {
      description.weather = ENVIRONMENT_ID_TO_NAME[environment.weather];
      modifiers.push(0x800);
   };
   if (move.name === 'Knock Off' &&
         /*! (target.name === 'arceus' && 
            typeof MULTITYPE_PLATES[target.item] !== 'undefined') &&
         ! (target.name === 'giratina' &&
            target.item === 'griseous orb') && */
         target.item !== null &&
         typeof MEGA_STONES[target.item] === 'undefined') {
      description.defenderItem = ITEMS[target.item].name;
      modifiers.push(0x1800);
   };
   // TODO water sport/mud sport
   var modifier = chainMultipleModifiers(modifiers);
   return applyModifier(power, modifier);
};

/**
  * Gets the attack of an attacker.
  * @param attacker Pokemon attacker object
  * @param target Pokemon target object
  * @param move Move object that the attacker is using.
  * @param environment Environment object
  * @return the attack (power).
*/
function getAttack(description, attacker, target, move, environment) {
   var attack;
   var statPokemon = attacker;
   var stat;
   if (attacker.ability === 'foul play') {
      description.attackerAbility = ABILITIES[attacker.ability].name;
      statPokemon = target;
   };
   if (move.category == MOVE_PHYSICAL) {
      stat = STAT_ATT;
   } else {
      stat = STAT_SPA;
   };

   attack = getStat(statPokemon, stat);

   // for description
   description.attackEVs = statPokemon.ev[stat];
   var natureMod = getNatureMod(statPokemon.nature, stat);
   if (natureMod === 9) {
      description.attackEVs += '-';
   } else if (natureMod === 11) {
      description.attackEVs += '+';
   };
   description.attackEVs += ' ';
   if (stat === STAT_ATT) {
      description.attackEVs += 'Atk';
   } else {
      description.attackEVs += 'SpA';
   };
   
   if (target.ability === 'unaware') {
      description.defenderAbility = ABILITIES[target.ability].name;
   };
   if (target.ability != 'unaware') {
      // apply stat boosts
      var statboost = statPokemon.statBoost[stat];
      description.attackBoost = statboost;
      attack = attack * getBoostNumerator(statboost);
      attack = attack / getBoostDenominator(statboost);
   };

   attack = applyAttackModifiers(attack, description, attacker, target, move, environment);
   return attack;
};

/**
  * Modifies the current attack stat with modifiers.
  * @param attack current attack power
  * @param attacker Pokemon attacker object
  * @param target Pokemon target object
  * @param move Move object that the attacker is using.
  * @param environment Environment object
  * @return the new attack (power).
*/
function applyAttackModifiers(attack, description, attacker, target, move, environment) {
   var modifiers = [];
   if (target.ability === 'thick fat' && 
         (move.type === TYPE_NAME_TO_ID.Fire || move.type === TYPE_NAME_TO_ID.Ice)) {
      description.defenderAbility = ABILITIES[target.ability].name;
      modifiers.push(0x800);
   };
   if (attacker.ability === 'torrent' && 
         attacker.currentHP < getStat(attacker, STAT_HP) / 3 &&
         move.type === TYPE_NAME_TO_ID.Water) {
      description.attackerAbility = ABILITIES[attacker.ability].name;
      modifiers.push(0x1800);
   };
   if (attacker.ability === 'guts' && attacker.status !== STATUS_NORMAL
         && move.category === MOVE_PHYSICAL) {
      description.attackerAbility = ABILITIES[attacker.ability].name;
      modifiers.push(0x1800);
   };
   if (attacker.ability === 'swarm' &&
         attacker.currentHP < getStat(attacker, STAT_HP) / 3 &&
         move.type === TYPE_NAME_TO_ID.Bug) {
      description.attackerAbility = ABILITIES[attacker.ability].name;
      modifiers.push(0x1800);
   };
   if (attacker.ability === 'overgrow' &&
         attacker.currentHP < getStat(attacker, STAT_HP) / 3 &&
         move.type === TYPE_NAME_TO_ID.Grass) {
      description.attackerAbility = ABILITIES[attacker.ability].name;
      modifiers.push(0x1800);
   };
   // TODOn Plus/Minus
   if (attacker.ability === 'blaze' &&
         attacker.currentHP < getStat(attacker, STAT_HP) / 3 &&
         move.type === TYPE_NAME_TO_ID.Fire) {
      description.attackerAbility = ABILITIES[attacker.ability].name;
      modifiers.push(0x1800);
   };
   if (attacker.ability === 'defeatist' &&
         attacker.currentHP < getStat(attacker, STAT_HP) / 2) {
      description.attackerAbility = ABILITIES[attacker.ability].name;
      modifiers.push(0x800);
   };
   if (attacker.ability === 'pure power' || attacker.ability === 'huge power') {
      description.attackerAbility = ABILITIES[attacker.ability].name;
      modifiers.push(0x2000);
   };
   if (attacker.ability === 'solar power' && 
         environment.weather === ENVIRONMENT_SUN &&
         move.category === MOVE_SPECIAL) {
      description.weather = ENVIRONMENT_ID_TO_NAME[environment.weather];
      description.attackerAbility = ABILITIES[attacker.ability].name;
      modifiers.push(0x1800);
   };
   if (attacker.ability === 'hustle' &&
         move.category === MOVE_PHYSICAL) {
      description.attackerAbility = ABILITIES[attacker.ability].name;
      attack = applyModifier(attack, 0x1800);
   };
   // TODOn flash fire...
   if (attacker.ability === 'slow start' &&
         move.category === MOVE_PHYSICAL) {
      // TODOn this actually is inaccurate but whatever
      description.attackerAbility = ABILITIES[attacker.ability].name;
      modifiers.push(0x800);
   };
   if (attacker.ability === 'flower gift' &&
         environment.weather === ENVIRONMENT_SUN &&
         move.category === MOVE_PHYSICAL) {
      description.weather = ENVIRONMENT_ID_TO_NAME[environment.weather];
      description.attackerAbility = ABILITIES[attacker.ability].name;
      modifiers.push(0x1800);
   };
   if ((attacker.name === 'cubone' || attacker.name === 'marowak') &&
         attacker.item === 'thick club' &&
         move.category === MOVE_PHYSICAL) {
      description.attackerItem = ITEMS[attacker.item].name;
      modifiers.push(0x2000);
   };
   if (attacker.name === 'clamperl' &&
         attacker.item === 'deep sea tooth' &&
         move.category === MOVE_SPECIAL) {
      description.attackerItem = ITEMS[attacker.item].name;
      modifiers.push(0x2000);
   };
   if (attacker.name === 'pikachu' &&
         attacker.item === 'light ball') {
      description.attackerItem = ITEMS[attacker.item].name;
      modifiers.push(0x2000);
   };
   if ((attacker.name === 'latios' || attacker.name === 'latias') &&
         attacker.item === 'soul dew' &&
         move.category === MOVE_SPECIAL) {
      description.attackerItem = ITEMS[attacker.item].name;
      modifiers.push(0x1800);
   };
   if (attacker.item === 'choice band' && move.category === MOVE_PHYSICAL) {
      description.attackerItem = ITEMS[attacker.item].name;
      modifiers.push(0x1800);
   };
   if (attacker.item === 'choice specs' && move.category === MOVE_SPECIAL) {
      description.attackerItem = ITEMS[attacker.item].name;
      modifiers.push(0x1800);
   };
   var modifier = chainMultipleModifiers(modifiers);
   return applyModifier(attack, modifier);
}

/**
  * Gets the defence of the target.
  * @param attacker Pokemon attacker object
  * @param target Pokemon target object
  * @param move Move object that the attacker is using.
  * @param environment Environment object
  * @return the defence (power).
*/
function getDefence(description, attacker, target, move, environment) {
   var defence;
   var statPokemon = target;
   var stat;
   if (move.category == MOVE_PHYSICAL) {
      stat = STAT_DEF;
   } else {
      stat = STAT_SPD;
   };

   // exception: moves that are special but use target def
   if (isSpecialToPhysicalMove(move)) {
      stat = STAT_DEF;
   }

   defence = getStat(statPokemon, stat);
   
   // for description
   description.defenseEVs = statPokemon.ev[stat];
   var natureMod = getNatureMod(statPokemon.nature, stat);
   if (natureMod === 9) {
      description.defenseEVs += '-';
   } else if (natureMod === 11) {
      description.defenseEVs += '+';
   };
   description.defenseEVs += ' ';
   if (stat === STAT_DEF) {
      description.defenseEVs += 'Def';
   } else {
      description.defenseEVs += 'SpD';
   };
   if (attacker.ability != 'unaware' && move.name != 'Chip Away') {
      // apply stat boosts
      var statboost = statPokemon.statBoost[stat];
      description.defenseBoost = statboost;
      defence = defence * getBoostNumerator(statboost);
      defence = defence / getBoostDenominator(statboost);
   };
   // for description
   if (attacker.ability === 'unaware') {
      description.attackerAbility = ABILITIES[attacker.ability].name;
   };

   defence = applySandstormModifier(defence, description, attacker, target, move, environment);
   defence = applyDefenceModifiers(defence, description, attacker, target, move, environment);

   return defence;
};

/**
  * Modifies the current defence stat with modifiers.
  * @param defence current defence power
  * @param attacker Pokemon attacker object
  * @param target Pokemon target object
  * @param move Move object that the attacker is using.
  * @param environment Environment object
  * @return the new defence (power).
*/
function applySandstormModifier(defence, description, attacker, target, move, environment) {
   if (environment.weather === ENVIRONMENT_SAND) {
      for (var i = 0; i < POKEMON_DATA[attacker.name].type.length; i++) {
         var type = POKEMON_DATA[attacker.name].type[i];
         if (type === TYPE_NAME_TO_ID.Rock && 
               move.category === MOVE_SPECIAL) {
            description.weather = ENVIRONMENT_ID_TO_NAME[environment.weather];
            defence = applyModifier(defence, 0x1800);
         };
      };
   };
   return defence;
};

/**
  * Modifies the current defence stat with modifiers.
  * @param defence current defence power
  * @param attacker Pokemon attacker object
  * @param target Pokemon target object
  * @param move Move object that the attacker is using.
  * @param environment Environment object
  * @return the new defence (power).
*/
function applyDefenceModifiers(defence, description, attacker, target, move, environment) {
   var modifiers = [];
   if (target.ability === 'marvel scale' &&
         target.status !== STATUS_NORMAL &&
         move.category === MOVE_PHYSICAL) {
      description.defenderAbility = ABILITIES[target.ability].name;
      modifiers.push(0x1800);
   };
   if (target.ability === 'flower gift' &&
         environment.weather === ENVIRONMENT_SUN &&
         move.category === MOVE_SPECIAL) {
      description.weather = ENVIRONMENT_ID_TO_NAME[environment.weather];
      description.defenderAbility = ABILITIES[target.ability].name;
      modifiers.push(0x1800);
   };
   if (target.name === 'clamperl' &&
         target.item === 'deep sea scale' &&
         move.category === MOVE_SPECIAL) {
      description.defenderItem = ITEMS[target.item].name;
      modifiers.push(0x1800);
   };
   if (target.name === 'ditto' &&
         target.item === 'metal powder') {
      description.defenderItem = ITEMS[target.item].name;
      modifiers.push(0x2000);
   };
   if (target.item === 'eviolite' && 
         typeof FULLY_EVOLVED[target.name] === 'undefined') {
      description.defenderItem = ITEMS[target.item].name;
      modifiers.push(0x1800);
   };
   if ((target.name === 'latias' || target.name === 'latios') &&
         target.item === 'soul dew' &&
         move.category === MOVE_SPECIAL) {
      description.defenderItem = ITEMS[target.item].name;
      modifiers.push(0x1800);
   };
   if (target.item === 'assault vest' && 
         move.category === MOVE_SPECIAL) {
      description.defenderItem = ITEMS[target.item].name;
      modifiers.push(0x1800);
   };
   var modifier = chainMultipleModifiers(modifiers);
   return applyModifier(defence, modifier);
};

/**
  * Gets the speed of Pokemon (in battle).
  * @param pokemon Pokemon object
  * @param environment Environment object
  * @return the modified speed.
*/
function getSpeed(pokemon, environment) {
   var speed = getStat(pokemon, STAT_SPE);
   
   // apply stat boosts
   var statboost = pokemon.statBoost[STAT_SPE];
   speed = speed * getBoostNumerator(statboost);
   speed = speed / getBoostDenominator(statboost);

   speed = applySpeedModifiers(speed, pokemon, environment);
   // apply paralysis
   if (pokemon.status === STATUS_PARALYSE) {
      speed = applyModifier(speed, 0x400);
   };
   // apply tailwind
   if (environment.tailwind) {
      speed = applyModifier(speed, 0x2000);
   };
   return speed;
};

/**
  * Modifies the current speed stat with modifiers.
  * @param speed current speed
  * @param pokemon Pokemon object
  * @param environment Environment object
  * @return the new modified speed.
  */
function applySpeedModifiers(speed, pokemon, environment) {
   var modifiers = [];
   var ability = pokemon.ability;
   var item = pokemon.item;
   if (ability === 'chlorophyll' && environment.weather === ENVIRONMENT_SUN) {
      modifiers.push(0x2000);
   };
   if (ability === 'quick feet' && pokemon.status !== STATUS_NORMAL) {
      modifiers.push(0x1800);
   };
   if (ability === 'slow start') {
      // in first 5 turns
      modifiers.push(0x800);
   };
   if (ability === 'swift swim' && environment.weather === ENVIRONMENT_RAIN) {
      modifiers.push(0x2000);
   };
   if (ability === 'unburden' && pokemon.item.match(/berry|gem/i)) {
      modifiers.push(0x2000);
   };
   if (item === 'choice scarf') {
      modifiers.push(0x1800);
   };
   if (item === 'iron ball' ||
         item === 'macho brace' ||
         item === 'power anklet' ||
         item === 'power band' ||
         item === 'power belt' ||
         item === 'power bracer' ||
         item === 'power lens' ||
         item === 'power weight') {
      modifiers.push(0x800);
   };
   if (item === 'quick powder' && pokemon.name === 'ditto') {
      modifiers.push(0x2000);
   };
   var modifier = chainMultipleModifiers(modifiers);
   return applyModifier(speed, modifier);
};

/**
  * Apply base modifiers to the damage
  * @param baseDamage Current base damage
  * @param attacker Pokemon attacker object
  * @param target Pokemon target object
  * @param move Move object that the attacker is using.
  * @param environment Environment object
  * @param random RNG seed
  * @return the modified base damage.
*/
function applyBaseModifiers(baseDamage, description, attacker, target, move, environment, random) {
   // Multi target modifier (but this calc is for singles only atm...)
   baseDamage = applyWeatherModifier(baseDamage, description, attacker, target, move, environment);
   // todo??  Critical hits
   baseDamage = applyRandomFactor(baseDamage, random);
   return baseDamage;
};

/**
  * Apply weather modifier to the damage
  * @param baseDamage Current base damage
  * @param attacker Pokemon attacker object
  * @param target Pokemon target object
  * @param move Move object that the attacker is using.
  * @param environment Environment object
  * @return the modified base damage.
*/
function applyWeatherModifier(baseDamage, description, attacker, target, move, environment) {
   if (environment.weather === ENVIRONMENT_SUN) {
      if (move.type === TYPE_NAME_TO_ID.Fire) {
         description.weather = ENVIRONMENT_ID_TO_NAME[environment.weather];
         baseDamage = applyModifier(baseDamage, 0x1800);
      } else if (move.type === TYPE_NAME_TO_ID.Water) {
         description.weather = ENVIRONMENT_ID_TO_NAME[environment.weather];
         baseDamage = applyModifier(baseDamage, 0x800);
      };
   } else if (environment.weather === ENVIRONMENT_RAIN) {
      if (move.type === TYPE_NAME_TO_ID.Water) {
         description.weather = ENVIRONMENT_ID_TO_NAME[environment.weather];
         baseDamage = applyModifier(baseDamage, 0x1800);
      } else if (move.type === TYPE_NAME_TO_ID.Fire) {
         description.weather = ENVIRONMENT_ID_TO_NAME[environment.weather];
         baseDamage = applyModifier(baseDamage, 0x800);
      };
   };
   return baseDamage;
};

/**
  * Applies the random modifier
  * @param baseDamage Current base damage
  * @param random RNG seed
  */
function applyRandomFactor(baseDamage, random) {
   baseDamage = Math.floor((baseDamage * (100 - random)) / 100);
   return baseDamage;
};

/**
  * Apply stab modifier to the damage.
  * @param baseDamage Current base damage
  * @param attacker Pokemon attacker object
  * @param target Pokemon target object
  * @param move Move object that the attacker is using.
  * @return the modified base damage.
*/
function applySTAB(baseDamage, description, attacker, target, move) {
   for (var i = 0; i < POKEMON_DATA[attacker.name].type.length; i++) {
      var _type = POKEMON_DATA[attacker.name].type[i];
      if (move.type === _type) {
         var modifier = 0x1800;
         if (attacker.ability === 'adaptability') {
            description.attackerAbility = ABILITIES[attacker.ability].name;
            modifier = 0x2000;
         }
         return applyModifier(baseDamage, modifier);
      }
   }
   return baseDamage;
}
         
/**
  * Apply stab modifier to the damage.
  * @param baseDamage Current base damage
  * @param attacker Pokemon attacker object
  * @param target Pokemon target object
  * @param move Move object that the attacker is using.
  * @param environment Environment object
  * @return the modified base damage.
*/
function applyTypeEffectiveness(baseDamage, description, attacker, target, move, environment) {
   var effectiveness = getMoveEffectiveness(description, attacker, target, move, environment);
   if (target.ability === 'wonder guard' && effectiveness <= EFFECTIVENESS_NORMAL) {
      description.defenderAbility = ABILITIES[target.ability].name;
      return 0;
   };
   switch(effectiveness) {
      case EFFECTIVENESS_NO_EFFECT:
         return 0;
      case EFFECTIVENESS_NORMAL:
         return baseDamage;
      case EFFECTIVENESS_NOT_VERY:
         return baseDamage >> 1;
      case EFFECTIVENESS_NOT_VERY_2:
         return baseDamage >> 2;
      case EFFECTIVENESS_SUPER:
         return baseDamage << 1;
      case EFFECTIVENESS_SUPER_2:
         return baseDamage << 2;
   }
}

/**
  * Determines the effectiveness of a move
  * @param attacker Pokemon attacker object
  * @param target Pokemon target object
  * @param move Move object that the attacker is using.
  * @param environment Environment object
  * @return a value (based on constants) determining effectiveness.
*/
function getMoveEffectiveness(description, attacker, target, move, environment) {
   // take into account levitate
   // for description
   if (target.item === 'iron ball') {
      description.defenderItem = ITEMS[target.item].name;
   };
   if (move.type === TYPE_NAME_TO_ID.Ground && 
         target.ability === 'levitate' &&
         target.item !== 'iron ball') {
      description.defenderAbility = ABILITIES[target.ability].name;
      return EFFECTIVENESS_NO_EFFECT;
   };
   if (move.type === TYPE_NAME_TO_ID.Ground && 
         target.item === 'air balloon') {
      description.defenderItem = ITEMS[target.item].name;
      return EFFECTIVENESS_NO_EFFECT;
   };
   // take into account volt absorb, water absorb and flash fire
   // and other moves that reduce to no effectiveness
   if (move.type === TYPE_NAME_TO_ID.Electric && target.ability === 'volt absorb') {
      description.defenderAbility = ABILITIES[target.ability].name;
      return EFFECTIVENESS_NO_EFFECT;
   };
   if (move.type === TYPE_NAME_TO_ID.Electric && target.ability === 'motor drive') {
      description.defenderAbility = ABILITIES[target.ability].name;
      return EFFECTIVENESS_NO_EFFECT;
   };
   if (move.type === TYPE_NAME_TO_ID.Electric && target.ability === 'lightning rod') {
      description.defenderAbility = ABILITIES[target.ability].name;
      return EFFECTIVENESS_NO_EFFECT;
   };
   if (move.type === TYPE_NAME_TO_ID.Water && target.ability === 'water absorb') {
      description.defenderAbility = ABILITIES[target.ability].name;
      return EFFECTIVENESS_NO_EFFECT;
   };
   if (move.type === TYPE_NAME_TO_ID.Water && target.ability === 'storm drain') {
      description.defenderAbility = ABILITIES[target.ability].name;
      return EFFECTIVENESS_NO_EFFECT;
   };
   if (move.type === TYPE_NAME_TO_ID.Water && target.ability === 'dry skin') {
      description.defenderAbility = ABILITIES[target.ability].name;
      return EFFECTIVENESS_NO_EFFECT;
   };
   if (move.type === TYPE_NAME_TO_ID.Fire && target.ability === 'flash fire') {
      description.defenderAbility = ABILITIES[target.ability].name;
      return EFFECTIVENESS_NO_EFFECT;
   };
   if (move.type === TYPE_NAME_TO_ID.Grass && target.ability === 'sap sipper') {
      description.defenderAbility = ABILITIES[target.ability].name;
      return EFFECTIVENESS_NO_EFFECT;
   };
   var totalEffectiveness = EFFECTIVENESS_NORMAL;
   for (var i = 0; i < POKEMON_DATA[target.name].type.length; i++) {
      var _type = POKEMON_DATA[target.name].type[i];
      var effectiveness = TYPE_CHART[move.type][_type];
      // take into account freeze dry
      if (move.name === 'Freeze-Dry' && _type === TYPE_NAME_TO_ID.Water) {
         effectiveness = 2;
      };
      // for description
      if (attacker.ability === 'scrappy') {
         description.attackerAbility = ABILITIES[attacker.ability].name;
      };
      if (effectiveness == 0 &&
            // take into account scrappy
            !(attacker.ability === 'scrappy' && _type === TYPE_NAME_TO_ID.Ghost) &&
            // take into account iron ball
            !(target.item === 'iron ball' && move.type === TYPE_NAME_TO_ID.Ground)) {
         return EFFECTIVENESS_NO_EFFECT;
      } else if (effectiveness == -1) {
         totalEffectiveness = totalEffectiveness >> 1;
      } else if (effectiveness == 2) {
         totalEffectiveness = totalEffectiveness << 1;
      };
      // take into account flying press.
      if (move.name === 'Flying Press') {
         effectiveness = TYPE_CHART[TYPE_NAME_TO_ID.Flying][_type];
         if (effectiveness == 0) {
            return EFFECTIVENESS_NO_EFFECT;
         } else if (effectiveness == -1) {
            totalEffectiveness = totalEffectiveness >> 1;
         } else if (effectiveness == 2) {
            totalEffectiveness = totalEffectiveness << 1;
         };
      };
   };
   return totalEffectiveness;
};

/**
  * Apply burn modifier to the damage.
  * @param baseDamage Current base damage
  * @param attacker Pokemon attacker object
  * @param target Pokemon target object
  * @param move Move object that the attacker is using.
  * @return the modified base damage.
*/
function applyBurnEffect(baseDamage, description, attacker, target, move) {
   // for description
   if (attacker.ability === 'guts') {
      description.attackerAbility = ABILITIES[attacker.ability].name;
   };

   if (move.category === MOVE_PHYSICAL
         && attacker.status == STATUS_BURN
         && attacker.ability !== 'guts') {
      description.isBurned = true;
      baseDamage = baseDamage >> 1;
   };
   return baseDamage;
};

/**
  * Apply final modifiers to the damage
  * @param baseDamage Current base damage
  * @param attacker Pokemon attacker object
  * @param target Pokemon target object
  * @param move Move object that the attacker is using.
  * @param environment Environment object
  * @return the modified base damage.
*/
function applyFinalModifiers(baseDamage, description, attacker, target, move, environment) {
   var modifiers = [];
   // for description
   if (attacker.ability === 'infiltrator') {
      description.attackerAbility = ABILITIES[attacker.ability].name;
   };
   if (environment.reflect && move.category === MOVE_PHYSICAL &&
         attacker.ability !== 'infiltrator') {
      // TODO critical mod if we ever implement crit
      // TODO change mod if it is a doubles battle...
      description.isReflect = true;
      modifiers.push(0x800);
   };
   if (environment.lightScreen && move.category === MOVE_SPECIAL &&
         attacker.ability !== 'infiltrator') {
      description.isLightScreen = true;
      modifiers.push(0x800);
   };
   if (target.ability === 'multiscale' 
         && target.currentHP === getStat(target, STAT_HP)) {
      description.defenderAbility = ABILITIES[target.ability].name;
      modifiers.push(0x800);
   };
   if (attacker.ability === 'tinted lens' && 
         getMoveEffectiveness(description, attacker, target, move, environment) 
            < EFFECTIVENESS_NORMAL) {
      description.attackerAbility = ABILITIES[attacker.ability].name;
      modifiers.push(0x2000);
   };
   // TODO friend guard in double battles...
   // TODO sniper ability and crit hits...
   if ((attacker.ability === 'solid rock' || attacker.ability === 'filter')
         && getMoveEffectiveness(description, attacker, target, move, environment) >
            EFFECTIVENESS_NORMAL) {
      description.attackerAbility = ABILITIES[attacker.ability].name;
      modifiers.push(0xC00);
   };
   // TODO metronome ability
   if (attacker.item === 'expert belt' && 
         getMoveEffectiveness(description, attacker, target, move, environment)
            > EFFECTIVENESS_NORMAL) {
      description.attackerItem = ITEMS[attacker.item].name;
      modifiers.push(0x1333);
   };
   if (attacker.item === 'life orb') {
      description.attackerItem = ITEMS[attacker.item].name;
      modifiers.push(0x14CC);
   };
   // for description
   if (attacker.ability === 'unnerve') {
      description.attackerAbility = ABILITIES[attacker.ability].name;
   };
   if (typeof DAMAGE_REDUCING_BERRIES[target.item] !== 'undefined'
         && move.type === DAMAGE_REDUCING_BERRIES[target.item]
         && getMoveEffectiveness(description, attacker, target, move, environment)
         > EFFECTIVENESS_NORMAL
         && attacker.ability !== 'unnerve') {
      description.defenderItem = ITEMS[target.item].name;
      modifiers.push(0x800);
   };
   if (target.ability === 'fur coat' && move.category === MOVE_PHYSICAL) {
      description.defenderAbility = ABILITIES[target.ability].name;
      modifiers.push(0x800);
   };
   // TODO random move modifiers
   var modifier = chainMultipleModifiers(modifiers);
   return applyModifier(baseDamage, modifier);
}

/**
  * Apply special damage changes to the damage
  * @param baseDamage Current base damage
  * @param attacker Pokemon attacker object
  * @param target Pokemon target object
  * @param move Move object that the attacker is using.
  * @param environment Environment object
  * @return the modified base damage.
*/
function applySpecialCases(baseDamage, description, attacker, target, move, environment) {
   var specialCase = false;
   if (move.name === 'Psywave') {
      // not entire accurate, min damage only
      specialCase = true;
      baseDamage = attacker.level >> 1;
   };
   if (move.name === 'Night Shade' || move.name === 'Seismic Toss') {
      specialCase = true;
      baseDamage = attacker.level;
   };
   if (move.name === 'Sonic Boom') {
      specialCase = true;
      baseDamage = 20;
   };
   if (move.name === 'Dragon Rage') {
      specialCase = true;
      baseDamage = 40;
   };
   if (move.name === 'Endeavor') {
      specialCase = true;
      if (target.currentHP > attacker.currentHP) {
         baseDamage = target.currentHP - attacker.currentHP;
      } else {
         baseDamage = 0;
      };
   };
   if (move.name === 'Final Gambit') {
      specialCase = true;
      baseDamage = attacker.currentHP;
   };
   if (move.name === 'Counter' || move.name === 'Mirror Coat') {
      // TODOn not implemented
      specialCase = true;
      baseDamage = 0;
   };
   if (move.name === 'Metal Burst') {
      specialCase = true;
      baseDamage = 0;
   };
   if (move.name === 'Bide') {
      specialCase = true;
      baseDamage = 0;
   };
   if (specialCase && attacker.ability === 'parental bond') {
      description.attackerAbility = ABILITIES[attacker.ability].name;
      baseDamage = baseDamage * 2;
   };
   return baseDamage;
};

/**
  * Gets the damage amount of an attack on an opponent.
  * @param attacker Pokemon attacker object
  * @param target Pokemon target object
  * @param move Move object that the attacker is using.
  * @param environment Environment object
  * @param random RNG seed
  * @return the amount of damage dealt onto the target.
*/
function getDamageAmount(description, attacker, target, move, environment, random) {
   if (debug) {
      console.log('attacker: ' + JSON.stringify(attacker, null, '\t'));
      console.log('target: ' + JSON.stringify(target, null, '\t'));
      console.log('move: ' + JSON.stringify(move, null, '\t'));
   }
   if (move.category !== MOVE_PHYSICAL && move.category !== MOVE_SPECIAL) {
      return 0;
   }

   // store these temporarily in case they change through course of calculation
   var targetAbility = target.ability;
   var moveType = move.type;
   var attackerType = POKEMON_DATA[attacker.name].type.slice(0);
   var attackerItem = attacker.item;
   // klutz
   if (attacker.ability === 'klutz') {
      description.attackerAbility = ABILITIES[attacker.ability].name;
      attacker.item = null;
   };
   // hidden power
   if (move.name === 'Hidden Power') {
      move.type = getHiddenPowerType(attacker);
      description.moveType = move.type;
   };
   // protean
   if (attacker.ability === 'protean') {
      description.attackerAbility = ABILITIES[attacker.ability].name;
      POKEMON_DATA[attacker.name].type = [ move.type ];
   };
   // multitype
   if (attacker.ability === 'multitype' &&
         typeof MULTITYPE_PLATES[attacker.item] !== undefined) {
      description.attackerAbility = ABILITIES[attacker.ability].name;
      description.attackerItem = ITEMS[attacker.item].name;
      POKEMON_DATA[attacker.name].type = [ MULTITYPE_PLATES[attacker.item] ];
   };
   // take into account mold breaker
   var moldbreaker = (attacker.ability === 'mold breaker' ||
         attacker.ability === 'turboblaze' ||
         attacker.ability === 'teravolt');
   if (moldbreaker) { 
      description.attackerAbility = ABILITIES[attacker.ability].name;
      target.ability = null; 
   };
   // take into account natural gift typing
   if (move.name === 'Natural Gift' &&
         typeof NATURAL_GIFT_BERRIES[attacker.item] !== 'undefined' &&
         target.ability !== 'unnerve' &&
         attacker.ability !== 'klutz') {
      description.attackerItem = ITEMS[attacker.item].name;
      move.type = NATURAL_GIFT_BERRIES[attacker.item].type;
      description.moveType = move.type;
   };
   // take into account normalize
   if (attacker.ability === 'normalize') {
      description.attackerAbility = ABILITIES[attacker.ability].name;
      move.type = TYPE_NAME_TO_ID.Normal;
      description.moveType = move.type;
   };
   // take into account drives
   if (attacker.item === 'shock drive' &&
         move.name === 'Techno Blast') {
      description.attackerItem = ITEMS[attacker.item].name;
      move.type = TYPE_NAME_TO_ID.Electric;
      description.moveType = move.type;
   };
   if (attacker.item === 'burn drive' &&
         move.name === 'Techno Blast') {
      description.attackerItem = ITEMS[attacker.item].name;
      move.type = TYPE_NAME_TO_ID.Fire;
      description.moveType = move.type;
   };
   if (attacker.item === 'chill drive' &&
         move.name === 'Techno Blast') {
      description.attackerItem = ITEMS[attacker.item].name;
      move.type = TYPE_NAME_TO_ID.Ice;
      description.moveType = move.type;
   };
   if (attacker.item === 'douse drive' &&
         move.name === 'Techno Blast') {
      description.attackerItem = ITEMS[attacker.item].name;
      move.type = TYPE_NAME_TO_ID.Water;
      description.moveType = move.type;
   };
   // multitype and judgement
   if (attacker.ability === 'multitype' &&
         move.name === 'Judgement' &&
         typeof MULTITYPE_PLATES[attacker.item] !== 'undefined') {
      description.attackerAbility = ABILITIES[attacker.ability].name;
      description.attackerItem = ITEMS[attacker.item].name;
      move.type = MULTITYPE_PLATES[attacker.item];
      description.moveType = move.type;
   };
   // weather ball
   if (move.name === 'Weather Ball') {
      switch(environment.weather) {
         case ENVIRONMENT_NORMAL:
            move.type = TYPE_NAME_TO_ID.Normal;
            break;
         case ENVIRONMENT_SUN:
            description.weather = ENVIRONMENT_ID_TO_NAME[environment.weather];
            move.type = TYPE_NAME_TO_ID.Fire;
            break;
         case ENVIRONMENT_RAIN:
            description.weather = ENVIRONMENT_ID_TO_NAME[environment.weather];
            move.type = TYPE_NAME_TO_ID.Water;
            break;
         case ENVIRONMENT_HAIL:
            description.weather = ENVIRONMENT_ID_TO_NAME[environment.weather];
            move.type = TYPE_NAME_TO_ID.Ice;
            break;
         case ENVIRONMENT_SAND:
            description.weather = ENVIRONMENT_ID_TO_NAME[environment.weather];
            move.type = TYPE_NAME_TO_ID.Rock;
            break;
      };
      description.moveType = move.type;
   };
   var level = attacker.level;
   var basePower = getBasePower(description, attacker, target, move, environment);
   if (attacker.ability === 'aerilate' && 
         move.type === TYPE_NAME_TO_ID.Normal) { 
      description.attackerAbility = ABILITIES[attacker.ability].name;
      move.type = TYPE_NAME_TO_ID.Flying; 
      description.moveType = move.type;
   };
   if (attacker.ability === 'refrigerate' && 
         move.type === TYPE_NAME_TO_ID.Normal) { 
      description.attackerAbility = ABILITIES[attacker.ability].name;
      move.type = TYPE_NAME_TO_ID.Ice; 
      description.moveType = move.type;
   };
   if (attacker.ability === 'pixilate' && 
         move.type === TYPE_NAME_TO_ID.Normal) { 
      description.attackerAbility = ABILITIES[attacker.ability].name;
      move.type = TYPE_NAME_TO_ID.Fairy; 
      description.moveType = move.type;
   };
   var attack = getAttack(description, attacker, target, move, environment);
   var defence = getDefence(description, attacker, target, move, environment);
   if (debug) {
      console.log('level: ' + level);
      console.log('basePower: ' + basePower);
      console.log('attack: ' + attack);
      console.log('defence: ' + defence);
   }

   // base damage
   var baseDamage = 2 * level;
   baseDamage = Math.floor(baseDamage / 5) + 2;
   baseDamage = baseDamage * basePower * attack;
   baseDamage = Math.floor(baseDamage / defence);
   baseDamage = Math.floor(baseDamage / 50);
   baseDamage += 2;
   if (debug) console.log('Base damage.. base: ' + baseDamage);
   baseDamage = applyBaseModifiers(baseDamage, description, attacker, target, move, environment, random);
   if (debug) console.log('Base damage.. after base modifiers: ' + baseDamage);
   baseDamage = applySTAB(baseDamage, description, attacker, target, move);
   if (debug) console.log('Base damage.. after applying STAB: ' + baseDamage);
   baseDamage = applyTypeEffectiveness(baseDamage, description, attacker, target, move, environment);
   if (debug) console.log('Base damage.. after applying type effectiveness: ' + baseDamage);
   baseDamage = applyBurnEffect(baseDamage, description, attacker, target, move);
   if (baseDamage < 1 && getMoveEffectiveness(description, attacker, target, move, environment)
         !== EFFECTIVENESS_NO_EFFECT &&
         ! (getMoveEffectiveness(description, attacker, target, move, environment) <=
            EFFECTIVENESS_NORMAL && target.ability === 'wonder guard')
         && basePower > 0) {
      baseDamage = 1;
   };
   baseDamage = applyFinalModifiers(baseDamage, description, attacker, target, move, environment);

   // bulletproof immunity
   if (target.ability === 'bulletproof' &&
         typeof BULLETPROOF_MOVES[move.name] !== 'undefined') {
      baseDamage = 0;
   };
   // soundproof immunity
   if (target.ability === 'soundproof' &&
         typeof SOUNDPROOF_MOVES[move.name] !== 'undefined') {
      baseDamage = 0;
   };
   // synchronoise immunity
   if (move.name === 'Synchronoise' && !isSameType(attacker, target)) {
      baseDamage = 0;
   };

   var preSturdyDamage = baseDamage;
   // sturdy
   if (target.ability === 'sturdy' &&
         baseDamage >= getStat(target, STAT_HP) &&
         target.currentHP === getStat(target, STAT_HP)) {
      baseDamage = getStat(target, STAT_HP) - 1;
   };

   if (attacker.ability === 'parental bond') {
      description.attackerAbility = ABILITIES[attacker.ability].name;
      baseDamage = baseDamage + (preSturdyDamage >> 1);
   };
   
   // return normal ability after calculation
   target.ability = targetAbility;
   // return normal move type after calculation
   move.type = moveType;
   // return normal pokemon type after calculation
   POKEMON_DATA[attacker.name].type = attackerType.slice(0);
   // return normal item after calculation
   attacker.item = attackerItem;
   // return normal stat boosts
   
   baseDamage = applySpecialCases(baseDamage, description, attacker, target, move, environment);
   if (debug) {
      console.log('Damage dealt: ' + baseDamage);
   }
   return baseDamage;
};

/**
  * Gets the damage percentage of an attack on an opponent.
  * @param attacker Pokemon attacker object
  * @param target Pokemon target object
  * @param move Move object that the attacker is using.
  * @param environment Environment object
  * @param random RNG seed
  * @param multiHit - true if you want to calculate multi hit damage or false if not
  * @return the percentage of damage dealt onto the target.
*/
function getDamagePercentage(description, attacker, target, move, environment, random, multiHit) {
   var damage = getDamageAmount(description, attacker, target, move, environment, random);
   if (typeof TWO_FIVE_STRIKE_MOVES[move.name] !== 'undefined' && multiHit) {
      // 2-5 strike move
      var minHits = 2;
      if (attacker.ability === 'skill link') {
         description.attackerAbility = ABILITIES[attacker.ability].name;
         minHits = 5;
      };
      var maxHits = 5;
      if (random === RANDOM_MIN) {
         damage = damage * minHits;
      } else {
         damage = damage * maxHits;
      };
   } else if (typeof TWO_STRIKE_MOVES[move.name] !== 'undefined' && multiHit) {
      // 2 strike move
      damage = damage * 2;
   } else if (typeof THREE_STRIKE_MOVES[move.name] !== 'undefined' && multiHit) {
      // 3 strike move
      // TODO
      damage = damage * 3;
   };
   // for description
   description.HPEVs = target.ev[STAT_HP];
   description.HPEVs += ' HP';
   var percentage = damage * 100 / getStat(target, STAT_HP);
   if (random === RANDOM_MIN) {
      description.minDamage = damage;
      description.minPercent = Math.floor(percentage * 10) / 10;
   } else if (random === RANDOM_MAX) {
      description.maxDamage = damage;
      description.maxPercent = Math.floor(percentage * 10) / 10;
   };
   return percentage;

};

/**
  * Returns true if the attacker is faster, or false otherwise.
  * Takes into account trick room.
  * @param attacker Pokemon attacker object
  * @param target Pokemon target object
  * @param environment Environment object
  * @return true if the attacker will strike first, or false otherwise.
  */
function attackerStrikeFirst(attacker, target, environment) {
   var attackerSpeed = getSpeed(attacker, environment);
   var targetSpeed = getSpeed(target, environment);
   if (attackerSpeed > targetSpeed) {
      if (environment.trickRoom) {
         return false;
      } else {
         return true;
      };
   } else if (targetSpeed > attackerSpeed) {
      if (environment.trickRoom) {
         return true;
      } else {
         return false;
      };
   } else {
      return false;
   };
};
      
/**
  * Determines the possible outcomes of attacker vs. target
  * @param attacker Attacker Pokemon object
  * @param target Target Pokemon object
  * @return a list of results with percentage damage dealt and move used
  */
function getAttackResults(attacker, target, environment, attackerStatBoosts) {
   if (attacker.hasNoMoves()) {
      return null;
   };
   var attackerOriginalStatBoosts = [];
   if (! attackerStatBoosts) {
      for (var i = 0; i < 6; i++) {
         attackerOriginalStatBoosts.push(attacker.statBoost[i]);
      };
      for (var i = 0; i < 6; i++) {
         attacker.statBoost[i] = 0;
      };
   };
   var results = {};
   results.attacks = [];
   results.attackerStrikeFirst = attackerStrikeFirst(attacker, target,
         environment);
   for (var moveNum = 0; moveNum < attacker.moves.length; moveNum++) {
      var result = {};
      var description = {};
      moveName = attacker.moves[moveNum];
      if (! moveName) continue;
      result.move = moveName;
      var move = MOVE_DATA[moveName];

      /*console.log(attacker.name);
      if (attacker.name === null) {
         console.log(JSON.stringify(attacker, null, '\t'));
      };*/
      description.attackerName = POKEMON_DATA[attacker.name].name;
      description.moveName = move.name;
      description.defenderName = POKEMON_DATA[target.name].name;
      
      if (move.category !== MOVE_PHYSICAL && move.category !== MOVE_SPECIAL) {
         description.noDamage = true;
         result.damagePercentage = ['-', '-'];
      } else {
         result.damagePercentage = [];
         // min
         result.damagePercentage.push(
            Math.floor(getDamagePercentage(description, attacker, target, move, environment, RANDOM_MIN, true) * 10) / 10);
         // max
         result.damagePercentage.push(
            Math.floor(getDamagePercentage(description, attacker, target, move, environment, RANDOM_MAX, true) * 10) / 10);
         // multi-hit
         if (typeof TWO_FIVE_STRIKE_MOVES[move.name] !== 'undefined' ||
               typeof TWO_STRIKE_MOVES[move.name] !== 'undefined' ||
               typeof THREE_STRIKE_MOVES[move.name] !== 'undefined') {
            var description_dummy = {};
            result.damagePercentageSingleHit = [];
            // min single hit
            result.damagePercentageSingleHit.push(
               Math.floor(getDamagePercentage(description_dummy, attacker, target, move, environment, RANDOM_MIN, false) * 10 / 10)
            );
            // max single hit
            result.damagePercentageSingleHit.push(
               Math.floor(getDamagePercentage(description_dummy, attacker, target, move, environment, RANDOM_MAX, false) * 10 / 10)
            );
         };
      };
      result.description = buildDescription(description);
      results.attacks.push(result);
   };
   results.attacks.sort(function(a, b) {
      if (a.damagePercentage[0] === '-') {
         return 1;
      } else if (b.damagePercentage[0] === '-') {
         return -1;
      } else {
         return b.damagePercentage[0] - a.damagePercentage[0];
      }
   });
   results.description = results.attacks[0].description;
   if (! attackerStatBoosts) {
      for (var i = 0; i < 6; i++) {
         attacker.statBoost[i] = attackerOriginalStatBoosts[i];
      };
   };
   if (debug) console.log(JSON.stringify(results, null, '\t'));
   return results;
}

/**
  * Gets the hidden power type for a Pokemon.
  * @param pokemon the Pokemon object
  * @return the id of the type of the Pokemon's hidden power.
  */
function getHiddenPowerType(pokemon) {
   var A = pokemon.iv[STAT_HP] % 2 === 1 ? 1 : 0;
   var B = pokemon.iv[STAT_ATT] % 2 === 1 ? 2 : 0;
   var C = pokemon.iv[STAT_DEF] % 2 === 1 ? 4 : 0;
   var D = pokemon.iv[STAT_SPE] % 2 === 1 ? 8 : 0;
   var E = pokemon.iv[STAT_SPA] % 2 === 1 ? 16 : 0;
   var F = pokemon.iv[STAT_SPD] % 2 === 1 ? 32 : 0;
   var result = Math.floor((A + B + C + D + E + F) * 15 / 63);
   switch(result) {
      case 0:
         return TYPE_NAME_TO_ID.Fighting;
      case 1:
         return TYPE_NAME_TO_ID.Flying;
      case 2:
         return TYPE_NAME_TO_ID.Poison;
      case 3:
         return TYPE_NAME_TO_ID.Ground;
      case 4:
         return TYPE_NAME_TO_ID.Rock;
      case 5:
         return TYPE_NAME_TO_ID.Bug;
      case 6:
         return TYPE_NAME_TO_ID.Ghost;
      case 7:
         return TYPE_NAME_TO_ID.Steel;
      case 8:
         return TYPE_NAME_TO_ID.Fire;
      case 9:
         return TYPE_NAME_TO_ID.Water;
      case 10:
         return TYPE_NAME_TO_ID.Grass;
      case 11:
         return TYPE_NAME_TO_ID.Electric;
      case 12:
         return TYPE_NAME_TO_ID.Psychic;
      case 13:
         return TYPE_NAME_TO_ID.Ice;
      case 14:
         return TYPE_NAME_TO_ID.Dragon;
      case 15:
         return TYPE_NAME_TO_ID.Dark;
   };
};

function getWeight(pokemon) {
   var weight = POKEMON_DATA[pokemon.name].weight;
   // TODOn account for autotomize
   // items
   if (pokemon.item === 'float stone') {
      weight = weight / 2;
   };
   // abilities
   if (pokemon.ability === 'light metal') {
      weight = weight / 2;
   } else if (pokemon.ability === 'heavy metal') {
      weight = weight * 2;
   };
   return weight;
};

/**
  * Determines if two pokemon share a type.
  * @param pokemon1 first Pokemon object
  * @param pokemon2 second Pokemon object
  * @return true if they share a type, or false otherwise.
  */
function isSameType(pokemon1, pokemon2) {
   for (var i = 0; i < POKEMON_DATA[pokemon1.name].type.length; i++) {
      var type1 = POKEMON_DATA[pokemon1.name].type[i];
      for (var j = 0; j < POKEMON_DATA[pokemon2.name].type.length; j++) {
         var type2 = POKEMON_DATA[pokemon2.name].type[j];
         if (type1 === type2) return true;
      };
   };
   return false;
};

/**
  * Determines whether a move has contact or not.
  * @param move the move to be judged
  * @return true if it is a contact move, or false otherwise.
  */
function isContactMove(move) {
   if (move.category === MOVE_PHYSICAL &&
         typeof NON_CONTACT_PHYSICAL_MOVES[move.name] === 'undefined') {
      return true;
   };
   if (move.category === MOVE_SPECIAL && 
         typeof CONTACT_SPECIAL_MOVES[move.name] !== 'undefined') {
      return true;
   };
   return false;
};

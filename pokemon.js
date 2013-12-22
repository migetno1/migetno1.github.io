function getDefaultNature() {
   return 'bashful';
}
/**
  * Initialises a blank Pokemon object.
  * @param pokemon a saved JSON pokemon object
  */
function Pokemon(pokemon) {
   if (typeof(pokemon) === 'undefined') {
      // brand new pokemon
      this.name = null;
      this.iv = [31, 31, 31, 31, 31, 31];
      this.ev = [0, 0, 0, 0, 0, 0];
      this.statBoost = [0, 0, 0, 0, 0, 0];
      this.moves = [null, null, null, null];
      this.nature = getDefaultNature();
      this.level = 100;
      this.status = STATUS_NORMAL;
      this.currentHP = 0;
      this.item = null;
      this.ability = null;
      this.valid = false;
      this.gender = GENDER_GENDERLESS;
   } else {
      this.name = pokemon.name;
      this.iv = pokemon.iv;
      this.ev = pokemon.ev;
      this.statBoost = pokemon.statBoost;
      this.moves = pokemon.moves;
      this.nature = pokemon.nature;
      this.level = pokemon.level;
      this.status = pokemon.status;
      this.currentHP = pokemon.currentHP;
      this.item = pokemon.item;
      this.ability = pokemon.ability;
      this.valid = pokemon.valid;
      this.gender = pokemon.gender;
   }
};

/**
  * Changes the name of the Pokemon
  * @param name ID of the Pokemon
  */
Pokemon.prototype.changeName = function(name) {
   name = name.toLowerCase();
   if (!isValidPokemonName(name)) {
      // error
      return;
   };
   this.name = name;
   // we have changed the pokemon so we must change the gender
   if (! isValidGender(this.name, this.gender)) {
      this.changeGender(getDefaultGender(this.name));
   };
   // we have changed the pokemon so we must change current HP
   this.changeCurrentHP(getStat(this, STAT_HP));
};

/**
  * Changes a move of the Pokemon
  * @param moveNumber move number
  * @param move move name
  */
Pokemon.prototype.changeMove = function(moveNumber, move) {
   if (!move) {
      this.moves[moveNumber] = null;
      return;
   }
   move = move.toLowerCase();
   if (!isValidMoveNumber(moveNumber)) {
      // error
      return;
   };
   if (!isValidMoveName(move)) {
      // error
      return;
   };
   this.moves[moveNumber] = move;
};

/**
  * Changes the item of the Pokemon
  * @param item ID of the item
  */
Pokemon.prototype.changeItem = function(item) {
   if (!item) {
      this.item = null;
      return;
   }
   item = item.toLowerCase();
   if (!isValidItem(item)) {
      return;
   };
   this.item = item;
};

/**
  * Changes the ability of the Pokemon
  * @param ability ID of the ability
  */
Pokemon.prototype.changeAbility = function(ability) {
   if (!ability) {
      this.ability = null;
      return;
   }
   ability = ability.toLowerCase();
   if (!isValidAbility(ability)) {
      return;
   };
   this.ability = ability;
};

/**
  * Changes the ability of the Pokemon
  * @param nature ID of the nature
  */
Pokemon.prototype.changeNature = function(nature) {
   nature = nature.toLowerCase();
   if (!isValidNature(nature)) {
      return;
   };
   this.nature = nature;
};

/**
  * Changes the level of the Pokemon
  * @param level level
  */
Pokemon.prototype.changeLevel = function(level) {
   level = parseInt(level);
   if (!isValidLevel(level)) {
      return;
   };
   this.level = level;
};

/**
  * Changes the status of the Pokemon
  * @param status status
  */
Pokemon.prototype.changeStatus = function(status) {
   status = parseInt(status);
   if (!isValidStatus(status)) {
      return;
   };
   this.status = status;
};

/**
  * Changes the IVs of the Pokemon
  * @param stat stat to be changed
  * @param iv new IV
  */
Pokemon.prototype.changeIV = function(stat, iv) {
   if (!isValidStat(stat)) {
      return;
   };
   iv = parseInt(iv);
   if (iv < 0 || iv > 31) {
      return;
   };
   this.iv[stat] = iv;
   if (stat == STAT_HP) {
      this.changeCurrentHP(getStat(this, STAT_HP));
   }
};

/**
  * Changes the IVs of the Pokemon
  * @param stat stat to be changed
  * @param ev new EV
  */
Pokemon.prototype.changeEV = function(stat, ev) {
   if (!isValidStat(stat)) {
      return;
   };
   ev = parseInt(ev);
   if (ev < 0 || ev > 252) {
      return;
   };
   // TODO validate that total evs do not exceed 510
   this.ev[stat] = ev;
   if (stat == STAT_HP) {
      this.changeCurrentHP(getStat(this, STAT_HP));
   }
};

/**
  * Changes the statBoosts of the Pokemon
  * @param stat stat to be changed
  * @param statboost new statBoost
  */
Pokemon.prototype.changestatBoost = function(stat, statboost) {
   if (!isValidStat(stat)) {
      return;
   };
   statboost = parseInt(statboost);
   if (statboost < -6 || statboost > 6) {
      return;
   };
   this.statBoost[stat] = statboost;
};

/**
  * Changes the current HP of the Pokemon
  * @param hp the new current HP
  */
Pokemon.prototype.changeCurrentHP = function(hp) {
   if (hp < 0 || hp > getStat(this, STAT_HP)) {
      return;
   };
   this.currentHP = hp;
};
   
/**
  * Changes the stat boosts of the Pokemon
  * @param stat stat to be changed
  * @param boost new boost
  */
Pokemon.prototype.changeStatBoost = function(stat, boost) {
   if (!isValidStat(stat)) {
      // TODO throw exception
      return;
   };
   if (boost < -6 || boost > 6) {
      // TODO throw exception
      return;
   };
   this.statBoost[stat] = boost;
};

/**
  * Changes the gender of the Pokemon.
  * @param gender gender to change to
  */
Pokemon.prototype.changeGender = function(gender) {
   if (!isValidGender(this.name, gender)) {
      return;
   };
   this.gender = gender;
};

Pokemon.prototype.hasNoMoves = function() {
   for (var i = 0; i < this.moves.length; i++) {
      if (this.moves[i] !== null) {
         return false;
      };
   };
   return true;
};

Pokemon.prototype.validate = function() {
   var isValid = true;
   if (! isValidPokemonName(this.name)) {
      isValid = false;
   };
   for (var i = 0; i < 4; i++) {
      if (this.moves[i] !== null && ! isValidMoveName(this.moves[i])) {
         isValid = false;
      };
   };
   if (this.item !== null && ! isValidItem(this.item)) {
      isValid = false;
   };
   if (this.ability !== null && ! isValidAbility(this.ability)) {
      isValid = false;
   };
   if (! isValidNature(this.nature)) {
      isValid = false;
   };
   if (! isValidLevel(this.level)) {
      isValid = false;
   };
   for (var i = 0; i < 6; i++) {
      if (! isValidEV(this.ev[i])) {
         isValid = false;
      };
      if (! isValidIV(this.iv[i])) {
         isValid = false;
      };
      if (! isValidstatBoost(this.statBoost[i])) {
         isValid = false;
      };
   };
   this.valid = isValid;
};

/**
  * Gets the default gender of a Pokemon
  * based on its name.
  * @param name name of Pokemon
  * @return its default gender.
  */
function getDefaultGender(name) {
   var defaultGender = POKEMON_DATA[name].gender;
   if (defaultGender === null) {
      return GENDER_MALE;
   } else {
      return defaultGender;
   };
};

   

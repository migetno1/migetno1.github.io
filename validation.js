/**
  * Checks whether a Pokemon name is valid
  * The check is case-insensitive.
  * @param id ID of Pokemon to be checked
  * @return True if the Pokemon is a valid Pokemon, or false otherwise.
  */
function isValidPokemonName(id) {
   if (typeof id === 'undefined' || id == null) {
      return false;
   };
   if (typeof POKEMON_DATA[id.toLowerCase()] === 'undefined') {
      return false;
   } else {
      return true;
   };
};

/**
  * Checks whether a move name is valid
  * The check is case-insensitive.
  * @param id ID of move to be checked
  * @return True if the move is a valid move, or false otherwise.
  */
function isValidMoveName(id) {
   if (typeof id === 'undefined' || id == null) {
      return false;
   };
   if (typeof MOVE_DATA[id.toLowerCase()] === 'undefined') {
      return false;
   } else {
      return true;
   };
};

/**
  * Checks whether a move number is valid.
  * @param moveNumber move number to be checked.
  * @return true if the move number is valid, or false otherwise.
  */
function isValidMoveNumber(moveNumber) {
   return (moveNumber >= 0 && moveNumber <= 3);
};

/**
  * Checks whether an item is valid
  * @param id ID of item to be checked
  * @return True if the item is valid, or false otherwise.
  */
function isValidItem(id) {
   if (typeof id === 'undefined' || id == null) {
      return false;
   };
   if (typeof ITEMS[id.toLowerCase()] === 'undefined') {
      return false;
   } else {
      return true;
   };
};

/**
  * Checks whether an ability is valid
  * @param id ID of ability to be checked
  * @return True if the ability is valid, or false otherwise.
  */
function isValidAbility(id) {
   if (typeof id === 'undefined' || id == null) {
      return false;
   };
   if (typeof ABILITIES[id.toLowerCase()] === 'undefined') {
      return false;
   } else {
      return true;
   };
};

/**
  * Checks whether a nature is valid
  * @param id ID of nature to be checked
  * @return True if the nature is valid, or false otherwise.
  */
function isValidNature(id) {
   if (typeof id === 'undefined' || id == null) {
      return false;
   };
   if (typeof NATURES[id.toLowerCase()] === 'undefined') {
      return false;
   } else {
      return true;
   };
};

/**
  * Checks whether a stat is valid
  * @param stat stat to be checked
  * @return True if the stat is a real stat (HP, ATK, etc.) or false
  * otherwise.
  */
function isValidStat(stat) {
   return (stat >= 0 && stat <= 5);
};

/**
  * Checks whether a level is valid
  * @param level level to be checked
  * @return True if the level is valid, or false otherwise.
  */
function isValidLevel(level) {
   if (level != parseInt(level) || level === null || level === '') return false;
   return (level >= 1 && level <= 100);
};

/**
  * Checks whether a status is valid
  * @param status status to be checked
  * @return true if the status is valid, or false otherwise.
  */
function isValidStatus(status) {
   if (status != parseInt(status) || status === null || status === '') return false;
   return (status >= 0 && status <= 5);
};

/**
  * Checks whether an ev is alid
  * @param ev ev to be checked
  * @return true if the EV is valid, or false otherwise.
  */
function isValidEV(ev) {
   if (ev != parseInt(ev) || ev === null || ev === '') return false;
   return (ev >= 0 && ev <= 252);
};

/**
  * Checks whether an iv is alid
  * @param iv iv to be checked
  * @return true if the IV is valid, or false otherwise.
  */
function isValidIV(iv) {
   if (iv != parseInt(iv) || iv === null || iv === '') return false;
   return (iv >= 0 && iv <= 31);
};

/**
  * Checks whether a statBoost is valid
  * @param statBoost statBoost to be checked
  * @return true if the statboost is valid, or false otherwise.
  */
function isValidstatBoost(statBoost) {
   if (statBoost != parseInt(statBoost) || statBoost === null || statBoost === '') return false;
   return (statBoost >= -6 && statBoost <= 6);
};

function isValidGender(name, gender) {
   gender = parseInt(gender);
   var defaultGender = POKEMON_DATA[name].gender;
   if (defaultGender === null) {
      return (gender == 0 || gender == 1);
   } else {
      return (gender === defaultGender);
   };
};

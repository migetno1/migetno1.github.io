/**
  * Initialises the environment object.
  * @param environment a saved JSON environment object
  */
function Environment(numAttackers, numTargets, environment) {
   if (typeof(environment) === 'undefined') {
      this.numAttackers = numAttackers;
      this.numTargets = numTargets;
      this.pokemons = [];
      this.pokemons[0] = [];
      for (var i = 0; i < numAttackers; i++) {
         this.pokemons[0].push(new Pokemon(DEFAULT_NUM_MOVES));
      };
      this.pokemons[1] = [];
      for (var i = 0; i < numTargets; i++) {
         this.pokemons[1].push(new Pokemon(DEFAULT_NUM_MOVES));
      };
      this.weather = 0;
      this.trickRoom = 0;
      this.lightScreen = 0;
      this.reflect = 0;
      this.multiHit = MULTI_HIT_FULL;
      this.doubles = false;
      this.defaultLevel = 100;
   } else {
      this.numAttackers = environment.numAttackers;
      this.numTargets = environment.numTargets;
      this.pokemons = environment.pokemons;
      this.weather = environment.weather;
      this.trickRoom = environment.trickRoom;
      this.lightScreen = environment.lightScreen;
      this.reflect = environment.reflect;
      this.multiHit = environment.multiHit;
      this.doubles = environment.doubles;
      this.defaultLevel = environment.defaultLevel;
      for (var i = 0; i < environment.pokemons.length; i++) {
         for (var j = 0; j < environment.pokemons[i].length; j++) {
            // retrieve the pokemon
            environment.pokemons[i][j] = new Pokemon(DEFAULT_NUM_MOVES, environment.pokemons[i][j]);
            // validate the pokemon
            environment.pokemons[i][j].validate();
         };
      };
   };
};

/**
  * Resets an entire Pokemon team to nothing.
  * @param teamNum the team number (0 = yours, 1 = target)
  */
Environment.prototype.resetTeam = function(teamNum) {
   this.pokemons[teamNum] = [];
   var numPokemon;
   if (teamNum == 0) {
      numPokemon = this.numAttackers;
   } else {
      numPokemon = this.numTargets;
   };
   for (var i = 0; i < numPokemon; i++) {
      var pokemon = new Pokemon(DEFAULT_NUM_MOVES);
      pokemon.changeLevel(this.defaultLevel);
      this.pokemons[teamNum].push(pokemon);
   };
};

/**
  * Switches the two teams around.
  */
Environment.prototype.switchTeams = function () {
   var tmp = this.pokemons[0];
   this.pokemons[0] = this.pokemons[1];
   this.pokemons[1] = tmp;
   var tmp2 = this.numAttackers;
   this.numAttackers = this.numTargets;
   this.numTargets = tmp2;
};

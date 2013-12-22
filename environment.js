/**
  * Initialises the environment object.
  * @param environment a saved JSON environment object
  */
function Environment(environment) {
   if (typeof(environment) === 'undefined') {
      this.pokemons = [
         [new Pokemon(), new Pokemon(), new Pokemon(), 
            new Pokemon(), new Pokemon(), new Pokemon()],
         [new Pokemon(), new Pokemon(), new Pokemon(), 
            new Pokemon(), new Pokemon(), new Pokemon()],
      ];
      this.weather = 0;
      this.trickRoom = 0;
      this.lightScreen = 0;
      this.reflect = 0;
   } else {
      this.pokemons = environment.pokemons;
      this.weather = environment.weather;
      this.trickRoom = environment.trickRoom;
      this.lightScreen = environment.lightScreen;
      this.reflect = environment.reflect;
      for (var i = 0; i < environment.pokemons.length; i++) {
         for (var j = 0; j < environment.pokemons[i].length; j++) {
            // retrieve the pokemon
            environment.pokemons[i][j] = new Pokemon(environment.pokemons[i][j]);
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
   this.pokemons[teamNum] = 
         [new Pokemon(), new Pokemon(), new Pokemon(), 
            new Pokemon(), new Pokemon(), new Pokemon()];
};

/**
  * Switches the two teams around.
  */
Environment.prototype.switchTeams = function () {
   var tmp = this.pokemons[0];
   this.pokemons[0] = this.pokemons[1];
   this.pokemons[1] = tmp;
};

/* notes: name, ability, moves, natures and items must be spelt exactly
   the same way that Pokemon spells it - i.e. Bulbasaur not buLbaSaur
   and Swords Dance not swords dance or Swords dance.

   commmas at the end of arrays/objects are irrelevant - I just put
   them in for consistency but you can leave them out
   e.g. [31, 31, 31, 31, 31, 31, ] is the same as
   [31, 31, 31, 31, 31, 31]

   Arrays must have the exact number of elements - i.e.
   there must be 6 ivs, 6 evs and 4 moves. if a Pokemon only
   uses 3 moves, then it should be [ 'move1', 'move2', 'move3', null ]

   BEWARE OF QUOTES INSIDE QUOTES. Always escape quotes inside quotes like:
   'Farfetch\'d'

   HIDDEN POWER: You can't just say 'Hidden Power (Fire)'. The move
   should be 'Hidden Power' and the IVs should be listed such that
   the HP will be Fire type.
*/
var POKEMON_SETS = {
   'Aegislash' : [
      {
         'name' : 'Double Dance',
         'iv' : [ 31, 31, 31, 31, 31, 31, ],
         'ev' : [ 88, 252, 0, 0, 0, 168, ],
         'moves' : [ 'Swords Dance', 'Autotomize', 'Shadow Claw', 'Sacred Sword' ],
         'ability' : 'Stance Change',
         'item' : 'Leftovers';
         'nature' : 'Adamant';
      },
      {
         'name' : 'Mixed Attacker',
         'iv' : [ 31, 31, 31, 31, 31, 31, ],
         'ev' : [ 4, 252, 0, 252, 0, 0, ],
         'moves' : [ 'Shadow Ball', 'Shadow Sneak', 'Iron Head', 'Sacred Sword' ],
         'ability' : 'Stance Change',
         'item' : 'Life Orb';
         'nature' : 'Quiet';
      },
   ],
   'Greninja' : [
      {
         'name' : 'All-Out Attacker',
         'iv' : [ 31, 31, 31, 31, 31, 31, ],
         'ev' : [ 0, 4, 0, 252, 0, 252, ],
         'moves' : [ 'Surf', 'Ice Beam', 'Dark Pulse', 'U-turn' ],
         'ability' : 'Protean',
         'item' : 'Life Orb';
         'nature' : 'Hasty';
      },
      {
         'name' : 'Spikes',
         'iv' : [ 31, 31, 31, 31, 31, 31, ],
         'ev' : [ 0, 0, 4, 252, 0, 252, ],
         'moves' : [ 'Spikes', 'Surf', 'Ice Beam', 'Hidden Power' ],
         'ability' : 'Protean',
         'item' : 'Life Orb';
         'nature' : 'Timid';
      },
   ],
};




      




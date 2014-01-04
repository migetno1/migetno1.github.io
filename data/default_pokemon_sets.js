var NONE_SET = {
   name : 'None',
   nature : 'Hardy',
   item: '',
   ev : [ 0, 0, 0, 0, 0, 0 ],
};
      
var DEFAULT_POKEMON_SETS = {
   'ATTACKER' : [
      {
         name : 'Physical Sweeper (generic)',
         nature : 'Hasty',
         item : 'Life Orb',
         ev : [ 0, 252, 0, 4, 0, 252 ],
      },
      {
         name : 'Special Sweeper (generic)',
         nature : 'Hasty',
         item : 'Life Orb',
         ev : [ 0, 4, 0, 252, 0, 252 ],
      },
      {
         name : 'Choice Band (generic)',
         nature : 'Adamant',
         item : 'Choice Band',
         ev : [ 4, 252, 0, 0, 0, 252 ],
      },
      {
         name : 'Choice Specs (generic)',
         nature : 'Modest',
         item : 'Choice Specs',
         ev : [ 4, 0, 0, 252, 0, 252 ],
      },
   ],
   'TARGET' : [
      {
         name : 'Physically Defensive (generic)',
         nature : 'Bold',
         ev : [ 252, 0, 252, 0, 4, 0 ],
      },
      {
         name : 'Specially Defensive (generic)',
         nature : 'Calm',
         ev : [ 252, 0, 4, 0, 252, 0 ],
      },
      {
         name : 'Bulky (generic)',
         nature : 'Hardy',
         ev : [ 252, 0, 0, 0, 0, 0 ],
      },
   ],
};


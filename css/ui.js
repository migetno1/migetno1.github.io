//Expand and collapse buttons
$(".panel-collapse").on('shown.bs.collapse', function() {
   var id = $(this).attr('id').split('-');
   var team = id[1];
   var pokemon = id[2];
   
   if ( id[0] == 'pokemon' ){ var type = "triangle"; }
   else if ( id[0] == 'stats' ) { var type = "spread"; }
   else if ( id[0] == 'adv' ) {var type = "advchevron"; }
   else if ( id[0] == 'options' ) {var type = "ochev"; }

   if ($(this).hasClass('in') || $(this).hasClass('collapsing')){
      pointTriangleDown(type, team, pokemon);
   };
 });
$(".panel-collapse").on('hidden.bs.collapse', function() {
   var id = $(this).attr('id').split('-');
   var team = id[1];
   var pokemon = id[2];
   
   if ( id[0] == 'pokemon' ){ var type = "triangle"; }
   else if ( id[0] == 'stats' ) { var type = "spread"; }
   else if ( id[0] == 'adv' ) {var type = "advchevron"; }
   else if ( id[0] == 'options' ) {var type = "ochev"; }
   
   if ($(this).hasClass('collapsing') || $(this).hasClass('collapse')){
      pointTriangleLeft(type, team, pokemon);
   };
 });
 
function pointTriangleDown(type, team, pokemon) {
   var tID = "#" + type + "-" + team + "-" + pokemon;
   $(tID).removeClass('fui-chevron-left').addClass('fui-chevron-down');
};
function pointTriangleLeft(type, team, pokemon) {
   var tID = "#" + type + "-" + team + "-" + pokemon;
   $(tID).removeClass('fui-chevron-down').addClass('fui-chevron-left');
};

//autocomplete TEMPORARY
$(".pokemon-name").autocomplete({
   position: {my: "left top", at: "left bottom+5",},
});
$(".pokemon-item").autocomplete({
   position: {my: "left top", at: "left bottom+5",},
});
$(".ability").autocomplete({
   position: {my: "left top", at: "left bottom+5",},
});
$(".move-0").autocomplete({
   position: {my: "left top", at: "left bottom+5",},
});
$(".move-1").autocomplete({
   position: {my: "left top", at: "left bottom+5",},
});
$(".move-2").autocomplete({
   position: {my: "left top", at: "left bottom+5",},
});
$(".move-3").autocomplete({
   position: {my: "left top", at: "left bottom+5",},
});

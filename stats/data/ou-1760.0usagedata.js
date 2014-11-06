var RANKINGS = [
   [ "1", "Landorus-Therian", "35.45468%" ],
   [ "2", "Latios", "23.69643%" ],
   [ "3", "Scizor", "21.79075%" ],
   [ "4", "Azumarill", "21.28990%" ],
   [ "5", "Heatran", "21.07547%" ],
   [ "6", "Bisharp", "20.32800%" ],
   [ "7", "Keldeo", "18.16997%" ],
   [ "8", "Garchomp", "16.86394%" ],
   [ "9", "Ferrothorn", "15.70521%" ],
   [ "10", "Tyranitar", "15.06516%" ],
   [ "11", "Greninja", "14.47147%" ],
   [ "12", "Latias", "13.08599%" ],
   [ "13", "Clefable", "12.19344%" ],
   [ "14", "Rotom-Wash", "11.84027%" ],
   [ "15", "Excadrill", "11.54836%" ],
   [ "16", "Charizard", "11.34120%" ],
   [ "17", "Venusaur", "11.26623%" ],
   [ "18", "Chansey", "11.12056%" ],
   [ "19", "Mew", "10.75409%" ],
   [ "20", "Pinsir", "10.67903%" ],
   [ "21", "Talonflame", "10.51762%" ],
   [ "22", "Skarmory", "9.99286%" ],
   [ "23", "Gengar", "9.79166%" ],
   [ "24", "Manectric", "9.36929%" ],
   [ "25", "Slowbro", "9.35478%" ],
   [ "26", "Thundurus", "9.02594%" ],
   [ "27", "Landorus", "8.74417%" ],
   [ "28", "Gardevoir", "8.22604%" ],
   [ "29", "Magnezone", "7.90132%" ],
   [ "30", "Gliscor", "7.75745%" ],
   [ "31", "Terrakion", "7.57919%" ],
   [ "32", "Heracross", "6.54036%" ],
   [ "33", "Zapdos", "6.09017%" ],
   [ "34", "Dragonite", "5.68192%" ],
   [ "35", "Gyarados", "5.65439%" ],
   [ "36", "Raikou", "5.63233%" ],
   [ "37", "Azelf", "5.32638%" ],
   [ "38", "Gothitelle", "5.26600%" ],
   [ "39", "Breloom", "5.08281%" ],
   [ "40", "Conkeldurr", "4.91727%" ],
   [ "41", "Medicham", "4.80761%" ],
   [ "42", "Kyurem-Black", "4.61453%" ],
   [ "43", "Diggersby", "4.50505%" ],
   [ "44", "Crawdaunt", "4.08426%" ],
   [ "45", "Jirachi", "3.93807%" ],
   [ "46", "Suicune", "3.16193%" ],
   [ "47", "Espeon", "3.07671%" ],
   [ "48", "Mamoswine", "3.02940%" ],
   [ "49", "Politoed", "2.99379%" ],
   [ "50", "Starmie", "2.98125%" ],
   [ "51", "Amoonguss", "2.94023%" ],
   [ "52", "Alomomola", "2.86062%" ],
   [ "53", "Kingdra", "2.63702%" ],
   [ "54", "Aerodactyl", "2.53695%" ],
   [ "55", "Smeargle", "2.46739%" ],
   [ "56", "Whimsicott", "2.45607%" ],
   [ "57", "Cresselia", "2.41889%" ],
   [ "58", "Quagsire", "2.37596%" ],
   [ "59", "Manaphy", "2.13276%" ],
   [ "60", "Victini", "2.04509%" ],
   [ "61", "Sylveon", "2.04126%" ],
   [ "62", "Mandibuzz", "1.97173%" ],
   [ "63", "Tornadus-Therian", "1.93178%" ],
   [ "64", "Kabutops", "1.89424%" ],
   [ "65", "Celebi", "1.88098%" ],
   [ "66", "Empoleon", "1.79339%" ],
   [ "67", "Cottonee", "1.71902%" ],
   [ "68", "Blastoise", "1.68358%" ],
   [ "69", "Alakazam", "1.61379%" ],
   [ "70", "Hawlucha", "1.59356%" ],
   [ "71", "Hippowdon", "1.59031%" ],
   [ "72", "Infernape", "1.54402%" ],
   [ "73", "Meloetta", "1.36129%" ],
   [ "74", "Blissey", "1.27133%" ],
   [ "75", "Weavile", "1.25180%" ],
   [ "76", "Doublade", "1.20772%" ],
   [ "77", "Ditto", "1.06461%" ],
   [ "78", "Chesnaught", "1.03714%" ],
   [ "79", "Togekiss", "0.96489%" ],
   [ "80", "Scolipede", "0.93567%" ],
   [ "81", "Hydreigon", "0.92333%" ],
   [ "82", "Sableye", "0.89824%" ],
   [ "83", "Donphan", "0.88778%" ],
   [ "84", "Staraptor", "0.86155%" ],
   [ "85", "Metagross", "0.80439%" ],
   [ "86", "Zygarde", "0.77909%" ],
   [ "87", "Wobbuffet", "0.76059%" ],
   [ "88", "Lucario", "0.74762%" ],
   [ "89", "Shuckle", "0.71188%" ],
   [ "90", "Seismitoad", "0.69949%" ],
   [ "91", "Klefki", "0.69821%" ],
   [ "92", "Volcarona", "0.61911%" ],
   [ "93", "Tentacruel", "0.61002%" ],
   [ "94", "Dugtrio", "0.60667%" ],
   [ "95", "Thundurus-Therian", "0.59638%" ],
   [ "96", "Ampharos", "0.56858%" ],
   [ "97", "Omastar", "0.56245%" ],
   [ "98", "Umbreon", "0.51393%" ],
   [ "99", "Forretress", "0.46885%" ],
   [ "100", "Cloyster", "0.45665%" ],
   [ "101", "Aggron", "0.43476%" ],
   [ "102", "Registeel", "0.43290%" ],
   [ "103", "Froslass", "0.42943%" ],
   [ "104", "Slowking", "0.42779%" ],
   [ "105", "Absol", "0.42282%" ],
   [ "106", "Cofagrigus", "0.41988%" ],
   [ "107", "Salamence", "0.40856%" ],
   [ "108", "Reuniclus", "0.37661%" ],
   [ "109", "Cobalion", "0.37301%" ],
   [ "110", "Entei", "0.36346%" ],
   [ "111", "Rhyperior", "0.35167%" ],
   [ "112", "Archeops", "0.34446%" ],
   [ "113", "Porygon2", "0.33632%" ],
   [ "114", "Gastrodon", "0.32124%" ],
   [ "115", "Diancie", "0.31477%" ],
   [ "116", "Mienshao", "0.31425%" ],
   [ "117", "Bronzong", "0.30296%" ],
   [ "118", "Goodra", "0.29524%" ],
   [ "119", "Abomasnow", "0.28812%" ],
   [ "120", "Magneton", "0.28330%" ],
   [ "121", "Swampert", "0.28324%" ],
   [ "122", "Rotom-Heat", "0.28229%" ],
   [ "123", "Milotic", "0.27622%" ],
   [ "124", "Toxicroak", "0.26103%" ],
   [ "125", "Arcanine", "0.25883%" ],
   [ "126", "Chandelure", "0.25083%" ],
   [ "127", "Tangrowth", "0.24896%" ],
   [ "128", "Vaporeon", "0.23738%" ],
   [ "129", "Snorlax", "0.22059%" ],
   [ "130", "Galvantula", "0.22057%" ],
   [ "131", "Gorebyss", "0.21291%" ],
   [ "132", "Haxorus", "0.20888%" ],
   [ "133", "Poliwrath", "0.20707%" ],
   [ "134", "Trevenant", "0.19959%" ],
   [ "135", "Kyurem", "0.19239%" ],
   [ "136", "Krookodile", "0.19154%" ],
   [ "137", "Florges", "0.17845%" ],
   [ "138", "Lanturn", "0.17477%" ],
   [ "139", "Banette", "0.16907%" ],
   [ "140", "Houndoom", "0.16784%" ],
   [ "141", "Jolteon", "0.16327%" ],
   [ "142", "Darmanitan", "0.16271%" ],
   [ "143", "Roserade", "0.16218%" ],
   [ "144", "Xatu", "0.15806%" ],
   [ "145", "Serperior", "0.15528%" ],
   [ "146", "Tornadus", "0.15241%" ],
   [ "147", "Machamp", "0.14221%" ],
   [ "148", "Mantine", "0.14015%" ],
   [ "149", "Noivern", "0.13724%" ],
   [ "150", "Jellicent", "0.13102%" ],
   [ "151", "Ninetales", "0.12832%" ],
   [ "152", "Slaking", "0.12728%" ],
   [ "153", "Sharpedo", "0.12041%" ],
   [ "154", "Nidoking", "0.11914%" ],
   [ "155", "Crobat", "0.11884%" ],
   [ "156", "Uxie", "0.10951%" ],
   [ "157", "Porygon-Z", "0.10787%" ],
   [ "158", "Honchkrow", "0.10653%" ],
   [ "159", "Zoroark", "0.10510%" ],
   [ "160", "Shaymin", "0.10372%" ],
   [ "161", "Avalugg", "0.09075%" ],
   [ "162", "Scrafty", "0.09060%" ],
   [ "163", "Audino", "0.08230%" ],
   [ "164", "Eelektross", "0.07601%" ],
   [ "165", "Stoutland", "0.07514%" ],
   [ "166", "Ambipom", "0.07248%" ],
   [ "167", "Qwilfish", "0.07116%" ],
   [ "168", "Dusclops", "0.06542%" ],
   [ "169", "Virizion", "0.06512%" ],
   [ "170", "Gourgeist-Super", "0.06445%" ],
   [ "171", "Rotom", "0.05970%" ],
   [ "172", "Ludicolo", "0.05532%" ],
   [ "173", "Mr. Mime", "0.05352%" ],
   [ "174", "Solosis", "0.05263%" ],
   [ "175", "Huntail", "0.05135%" ],
   [ "176", "Venomoth", "0.05102%" ],
   [ "177", "Escavalier", "0.04810%" ],
   [ "178", "Drapion", "0.04281%" ],
   [ "179", "Heliolisk", "0.04242%" ],
   [ "180", "Sawk", "0.04213%" ],
   [ "181", "Weezing", "0.04148%" ],
   [ "182", "Gallade", "0.04060%" ],
   [ "183", "Dusknoir", "0.04019%" ],
   [ "184", "Victreebel", "0.03908%" ],
   [ "185", "Hitmontop", "0.03817%" ],
   [ "186", "Linoone", "0.03725%" ],
   [ "187", "Clefairy", "0.03676%" ],
   [ "188", "Miltank", "0.03675%" ],
   [ "189", "Flygon", "0.03386%" ],
   [ "190", "Moltres", "0.03353%" ],
   [ "191", "Sigilyph", "0.03338%" ],
   [ "192", "Electivire", "0.03012%" ],
   [ "193", "Tyrantrum", "0.02966%" ],
   [ "194", "Golem", "0.02953%" ],
   [ "195", "Hitmonlee", "0.02784%" ],
   [ "196", "Exeggutor", "0.02553%" ],
   [ "197", "Slurpuff", "0.02534%" ],
   [ "198", "Vivillon", "0.02520%" ],
   [ "199", "Exploud", "0.02508%" ],
   [ "200", "Shedinja", "0.02477%" ],
];

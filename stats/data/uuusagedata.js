var RANKINGS = [
   [ "1", "Blastoise", "18.26032%" ],
   [ "2", "Florges", "14.55371%" ],
   [ "3", "Hydreigon", "14.00942%" ],
   [ "4", "Crobat", "13.68240%" ],
   [ "5", "Infernape", "13.44471%" ],
   [ "6", "Darmanitan", "13.19214%" ],
   [ "7", "Jirachi", "12.47682%" ],
   [ "8", "Galvantula", "12.23464%" ],
   [ "9", "Mienshao", "11.57109%" ],
   [ "10", "Alakazam", "11.14041%" ],
   [ "11", "Arcanine", "10.89150%" ],
   [ "12", "Aerodactyl", "10.67526%" ],
   [ "13", "Donphan", "10.57165%" ],
   [ "14", "Absol", "10.18705%" ],
   [ "15", "Chandelure", "10.02376%" ],
   [ "16", "Suicune", "9.27320%" ],
   [ "17", "Metagross", "9.26914%" ],
   [ "18", "Nidoking", "9.21956%" ],
   [ "19", "Aggron", "9.16388%" ],
   [ "20", "Honchkrow", "9.15112%" ],
   [ "21", "Lucario", "9.06211%" ],
   [ "22", "Porygon-Z", "9.04288%" ],
   [ "23", "Swampert", "9.00121%" ],
   [ "24", "Forretress", "8.94925%" ],
   [ "25", "Krookodile", "8.44902%" ],
   [ "26", "Ampharos", "8.22721%" ],
   [ "27", "Umbreon", "7.97545%" ],
   [ "28", "Haxorus", "7.95133%" ],
   [ "29", "Goodra", "7.92906%" ],
   [ "30", "Flygon", "7.76578%" ],
   [ "31", "Blissey", "7.73501%" ],
   [ "32", "Roserade", "7.71892%" ],
   [ "33", "Scrafty", "7.42323%" ],
   [ "34", "Cloyster", "7.31233%" ],
   [ "35", "Raikou", "7.21255%" ],
   [ "36", "Sableye", "7.05660%" ],
   [ "37", "Machamp", "7.00377%" ],
   [ "38", "Empoleon", "6.81852%" ],
   [ "39", "Shaymin", "6.66355%" ],
   [ "40", "Azelf", "6.64100%" ],
   [ "41", "Toxicroak", "6.41060%" ],
   [ "42", "Rotom-Heat", "6.33475%" ],
   [ "43", "Trevenant", "6.28145%" ],
   [ "44", "Chesnaught", "6.16491%" ],
   [ "45", "Noivern", "6.06855%" ],
   [ "46", "Espeon", "6.03450%" ],
   [ "47", "Entei", "5.90778%" ],
   [ "48", "Vaporeon", "5.63090%" ],
   [ "49", "Starmie", "5.41566%" ],
   [ "50", "Milotic", "5.39253%" ],
   [ "51", "Tentacruel", "5.31797%" ],
   [ "52", "Snorlax", "5.15732%" ],
   [ "53", "Celebi", "5.15050%" ],
   [ "54", "Porygon2", "5.06743%" ],
   [ "55", "Nidoqueen", "4.52858%" ],
   [ "56", "Houndoom", "4.22705%" ],
   [ "57", "Hippowdon", "4.19622%" ],
   [ "58", "Kingdra", "4.03091%" ],
   [ "59", "Diancie", "3.20709%" ],
   [ "60", "Quagsire", "3.03608%" ],
   [ "61", "Togekiss", "3.01085%" ],
   [ "62", "Yanmega", "2.75330%" ],
   [ "63", "Amoonguss", "2.43696%" ],
   [ "64", "Gligar", "2.38130%" ],
   [ "65", "Froslass", "2.17686%" ],
   [ "66", "Shuckle", "2.14856%" ],
   [ "67", "Ambipom", "2.00934%" ],
   [ "68", "Whimsicott", "1.99595%" ],
   [ "69", "Jolteon", "1.92232%" ],
   [ "70", "Slowking", "1.75880%" ],
   [ "71", "Alomomola", "1.75529%" ],
   [ "72", "Kyurem", "1.66477%" ],
   [ "73", "Zoroark", "1.63425%" ],
   [ "74", "Doublade", "1.56986%" ],
   [ "75", "Dugtrio", "1.55416%" ],
   [ "76", "Banette", "1.46312%" ],
   [ "77", "Gallade", "1.43188%" ],
   [ "78", "Weezing", "1.37475%" ],
   [ "79", "Cofagrigus", "1.34115%" ],
   [ "80", "Tornadus", "1.33457%" ],
   [ "81", "Sharpedo", "1.33452%" ],
   [ "82", "Cobalion", "1.32795%" ],
   [ "83", "Golbat", "1.30059%" ],
   [ "84", "Abomasnow", "1.29285%" ],
   [ "85", "Rhyperior", "1.27509%" ],
   [ "86", "Cresselia", "1.26709%" ],
   [ "87", "Hitmonlee", "1.26418%" ],
   [ "88", "Bronzong", "1.22893%" ],
   [ "89", "Cinccino", "1.19754%" ],
   [ "90", "Jellicent", "1.11446%" ],
   [ "91", "Reuniclus", "1.09564%" ],
   [ "92", "Meloetta", "1.08126%" ],
   [ "93", "Rotom-Mow", "1.04445%" ],
   [ "94", "Tangrowth", "1.04042%" ],
   [ "95", "Victini", "1.03855%" ],
   [ "96", "Aromatisse", "1.00763%" ],
   [ "97", "Hitmontop", "0.93569%" ],
   [ "98", "Virizion", "0.93233%" ],
   [ "99", "Uxie", "0.93055%" ],
   [ "100", "Exploud", "0.92354%" ],
   [ "101", "Gastrodon", "0.90255%" ],
   [ "102", "Drapion", "0.82249%" ],
   [ "103", "Eelektross", "0.81195%" ],
   [ "104", "Sceptile", "0.78489%" ],
   [ "105", "Granbull", "0.75765%" ],
   [ "106", "Escavalier", "0.71491%" ],
   [ "107", "Heliolisk", "0.71125%" ],
   [ "108", "Dusclops", "0.67650%" ],
   [ "109", "Clawitzer", "0.64636%" ],
   [ "110", "Slurpuff", "0.63455%" ],
   [ "111", "Ninjask", "0.63426%" ],
   [ "112", "Xatu", "0.63100%" ],
   [ "113", "Electivire", "0.61001%" ],
   [ "114", "Malamar", "0.60597%" ],
   [ "115", "Braviary", "0.60228%" ],
   [ "116", "Magneton", "0.58656%" ],
   [ "117", "Mismagius", "0.58610%" ],
   [ "118", "Delphox", "0.58532%" ],
   [ "119", "Swellow", "0.55217%" ],
   [ "120", "Feraligatr", "0.52519%" ],
   [ "121", "Tyrantrum", "0.51571%" ],
   [ "122", "Vivillon", "0.51484%" ],
   [ "123", "Durant", "0.51185%" ],
   [ "124", "Scyther", "0.50274%" ],
   [ "125", "Spiritomb", "0.50148%" ],
   [ "126", "Hitmonchan", "0.47803%" ],
   [ "127", "Sigilyph", "0.47102%" ],
   [ "128", "Kabutops", "0.45221%" ],
   [ "129", "Typhlosion", "0.45177%" ],
   [ "130", "Registeel", "0.45153%" ],
   [ "131", "Fletchinder", "0.45126%" ],
   [ "132", "Ditto", "0.44922%" ],
   [ "133", "Claydol", "0.44582%" ],
   [ "134", "Shedinja", "0.42298%" ],
   [ "135", "Muk", "0.42125%" ],
   [ "136", "Steelix", "0.41463%" ],
   [ "137", "Cacturne", "0.41402%" ],
   [ "138", "Miltank", "0.41125%" ],
   [ "139", "Druddigon", "0.40706%" ],
   [ "140", "Leafeon", "0.40439%" ],
   [ "141", "Cradily", "0.38019%" ],
   [ "142", "Ludicolo", "0.37689%" ],
   [ "143", "Lanturn", "0.37093%" ],
   [ "144", "Flareon", "0.36894%" ],
   [ "145", "Stoutland", "0.35049%" ],
   [ "146", "Moltres", "0.34291%" ],
   [ "147", "Togetic", "0.34076%" ],
   [ "148", "Golurk", "0.33937%" ],
   [ "149", "Gourgeist-Super", "0.33784%" ],
   [ "150", "Zangoose", "0.33510%" ],
   [ "151", "Slaking", "0.32820%" ],
   [ "152", "Omastar", "0.32352%" ],
   [ "153", "Archeops", "0.31542%" ],
   [ "154", "Gorebyss", "0.29956%" ],
   [ "155", "Seismitoad", "0.28987%" ],
   [ "156", "Shiftry", "0.28591%" ],
   [ "157", "Zygarde", "0.27753%" ],
   [ "158", "Hariyama", "0.27376%" ],
   [ "159", "Regirock", "0.27174%" ],
   [ "160", "Drifblim", "0.26840%" ],
   [ "161", "Mr. Mime", "0.26616%" ],
   [ "162", "Avalugg", "0.26515%" ],
   [ "163", "Torterra", "0.24944%" ],
   [ "164", "Accelgor", "0.24610%" ],
   [ "165", "Skuntank", "0.24302%" ],
   [ "166", "Dusknoir", "0.24272%" ],
   [ "167", "Torkoal", "0.23756%" ],
   [ "168", "Lilligant", "0.23306%" ],
   [ "169", "Liepard", "0.22673%" ],
   [ "170", "Pyroar", "0.22289%" ],
   [ "171", "Meowstic", "0.21997%" ],
   [ "172", "Exeggutor", "0.21864%" ],
   [ "173", "Magmortar", "0.21759%" ],
   [ "174", "Tauros", "0.21538%" ],
   [ "175", "Vileplume", "0.20504%" ],
   [ "176", "Combusken", "0.19859%" ],
   [ "177", "Armaldo", "0.19726%" ],
   [ "178", "Dragalge", "0.19723%" ],
   [ "179", "Lapras", "0.19629%" ],
   [ "180", "Marowak", "0.19330%" ],
   [ "181", "Golem", "0.19089%" ],
   [ "182", "Emboar", "0.18969%" ],
   [ "183", "Luxray", "0.18545%" ],
   [ "184", "Glaceon", "0.18142%" ],
   [ "185", "Sandslash", "0.18045%" ],
   [ "186", "Kecleon", "0.17778%" ],
   [ "187", "Pikachu", "0.17667%" ],
   [ "188", "Rampardos", "0.17573%" ],
   [ "189", "Leavanny", "0.17526%" ],
   [ "190", "Rhydon", "0.17296%" ],
   [ "191", "Chatot", "0.16320%" ],
   [ "192", "Swalot", "0.16079%" ],
   [ "193", "Barbaracle", "0.15940%" ],
   [ "194", "Raichu", "0.15897%" ],
   [ "195", "Ursaring", "0.15884%" ],
   [ "196", "Klinklang", "0.15845%" ],
   [ "197", "Primeape", "0.15636%" ],
   [ "198", "Cryogonal", "0.15546%" ],
   [ "199", "Volbeat", "0.15025%" ],
   [ "200", "Poliwrath", "0.14862%" ],
];

// Sheet Names
const QUEST_SHEET = "Quest Sim";
const HERO_1_SHEET = "Hero 1";
const HERO_2_SHEET = "Hero 2";
const HERO_3_SHEET = "Hero 3";
const HERO_4_SHEET = "Hero 4";
const HERO_SHEETS = new Set(
  [HERO_1_SHEET, HERO_2_SHEET, HERO_3_SHEET, HERO_4_SHEET]
);

// Champion Names
const ARGON = "Argon";
const DONOVAN = "Donovan";
const LILU = "Lilu";
const POLONIA = "Polonia";
const RUDO = "Rudo";
const SIA = "Sia";
const YAMI = "Yami";
const CHAMPIONS = new Set([ARGON, DONOVAN, LILU, POLONIA, RUDO, SIA, YAMI]);

// Red Types
const BERSERKER = "Berserker";
const JARL = "Jarl";
const SAMURAI = "Samurai";
const DAIMYO = "Daimyo";
const RED_TYPE = "Red/Fighter Type";
const FIGHTERS = new Set([BERSERKER, JARL, SAMURAI, DAIMYO, RED_TYPE]);

// Green Types
const DANCER = "Dancer";
const ACROBAT = "Acrobat";
const NINJA = "Ninja";
const SENSEI = "Sensei";
const GREEN_TYPE = "Green/Rogue Type";
const ROGUES = new Set([DANCER, ACROBAT, NINJA, SENSEI, GREEN_TYPE]);

// Blue Types
const BISHOP = "Bishop";
const CLERIC = "Cleric";
const BLUE_TYPE = "Blue/Spellcaster Type";
const SPELLCASTERS = new Set([DONOVAN, BISHOP, CLERIC, BLUE_TYPE]);

// Mob Keywords
const AGILE_MOB  = "Agile";
const DIRE_MOB   = "Dire";
const HUGE_MOB   = "Huge";
const LEGEND_MOB = "Legendary";

// Quests
const BARRENS_HARD = "Barren Boss Hard";
const BOOST_NORMAL = "Normal";
const BOOST_SUPER = "Super";
const BOOST_MEGA = "Mega";

// Misc
const NO = "No";
const NONE = "None";
const SIM_COUNT = 50000;

// Mundra
const MUNDRAS_SPIRIT = "Mundra's Spirit (+20%ATK +20%DEF against Bosses)";
const MUNDRAS_AMULET = "Mundra's Amulet - T3";
const MUNDRAS_BOW = "Mundra's Hornbow - T4";
const MUNDRAS_ARMOR = "Mundra's Tabard - T5";
const MUNDRAS_STAFF = "Mundra's Scepter - T7";
const MUNDRAS_MACE = "Mundra's Masher - T10";
const MUNDRAS_ITEMS = new Set(
  [MUNDRAS_AMULET, MUNDRAS_BOW, MUNDRAS_AMULET, MUNDRAS_STAFF, MUNDRAS_MACE]
);

// Import / Export
const IMPORT_CELL_ORDER = new Array([
  "B2", "B3", "C3", "B6", "B7", "B8", "B9", "B10", "B11", "C6",
  "C7", "C8", "C9", "C10", "C11", "D6", "D7", "D8", "D9", "D10",
  "D11", "E6", "E7", "E8", "E9", "E10", "E11", "F6", "F7", "F8",
  "F9", "F10", "F11", "A14", "B14", "C14", "D14", "B16", "B24",
  "B25", "B26",
]);
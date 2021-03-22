/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Champion Names
enum CHAMPIONS {
  ARGON = "Argon",
  DONOVAN = "Donovan",
  LILU = "Lilu",
  HEMMA = "HEMMA",
  POLONIA = "Polonia",
  RUDO = "Rudo",
  SIA = "Sia",
  YAMI = "Yami",
}

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
const AGILE_MOB = "Agile";
const DIRE_MOB = "Dire";
const HUGE_MOB = "Huge";
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
const MUNDRAS_ITEMS = new Set([
  MUNDRAS_AMULET,
  MUNDRAS_BOW,
  MUNDRAS_ARMOR,
  MUNDRAS_STAFF,
  MUNDRAS_MACE,
]);


export {
  CHAMPIONS, ARGON, DONOVAN, LILU, POLONIA, RUDO, SIA, YAMI,

  FIGHTERS, BERSERKER, JARL, SAMURAI, DAIMYO, RED_TYPE,
  ROGUES, DANCER, ACROBAT, NINJA, SENSEI, GREEN_TYPE,
  SPELLCASTERS, BISHOP, CLERIC, BLUE_TYPE,
  AGILE_MOB, DIRE_MOB, HUGE_MOB, LEGEND_MOB,
  BARRENS_HARD, BOOST_NORMAL, BOOST_SUPER, BOOST_MEGA,
  NO, NONE, SIM_COUNT,
  MUNDRAS_SPIRIT,
  MUNDRAS_ITEMS,
  MUNDRAS_AMULET,
  MUNDRAS_ARMOR,
  MUNDRAS_BOW,
  MUNDRAS_STAFF,
  MUNDRAS_MACE,
}

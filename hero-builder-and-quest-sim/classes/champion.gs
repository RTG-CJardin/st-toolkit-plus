/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

class Champion {
  constructor(hero, heroes, quest) {
    this.name = hero.name;
    this.tier = hero.tier;
    this.quest = quest;
    this.atkMod = 0;
    this.defMod = 0;
    this.liluHeal = 0;

    this.countClasses(heroes);
    switch (this.name) {
      case ARGON:
        this.atkMod = 0.1 * this.tier;
        this.defMod = 0.1 * this.tier;
        break;

      case DONOVAN:
        if (this.tier == 4) {
          this.atkMod = 0.12 * this.spellCount;
        } else {
          this.atkMod = (0.02 + 0.02 * this.tier) * this.spellCount;
        }
        for (var i = 0; i < heroes.length; i++) {
          heroes[i].hpMax *= 1.0 + (0.03 + 0.01 * this.tier) * this.fightCount;
          heroes[i].critChance += (0.01 + 0.01 * this.tier) * this.rogueCount;
          heroes[i].evasion += (0.01 + 0.01 * this.tier) * this.rogueCount;
        }
        break;

      case LILU:
        for (var i = 0; i < heroes.length; i++) {
          heroes[i].hpMax *= 1.05 + 0.05 * this.tier;
        }
        if (this.tier == 1) {
          this.liluHeal = 3;
        } else if (this.tier == 2) {
          this.liluHeal = 5;
        } else if (this.tier == 3) {
          this.liluHeal = 10;
        } else if (this.tier == 4) {
          this.liluHeal = 20;
        }
        break;

      case POLONIA:
        this.defMod = 0.05 + 0.05 * this.tier;
        for (var i = 0; i < heroes.length; i++) {
          heroes[i].evasion += this.tier < 3 ? 0.05 : 0.1;
        }
        break;

      case SIA:
        this.atkMod = 0.05 + 0.05 * this.tier;
        break;

      case YAMI:
        for (var i = 0; i < heroes.length; i++) {
          heroes[i].critChance += 0.05 * this.tier;
          heroes[i].evasion += 0.05 * this.tier;
        }
        break;
    }
  }

  get isRudo() {
    return this.name == RUDO;
  }

  get rudoMod() {
    if (
      !this.isRudo ||
      (this.quest.round > 1 && this.tier < 3) ||
      (this.quest.round > 2 && this.tier < 4) ||
      this.quest.round > 3
    ) {
      return 0;
    } else if (this.tier == 1) {
      return 0.3;
    } else if (this.tier < 4) {
      return 0.4;
    } else {
      return 0.5;
    }
  }

  countClasses(heroes) {
    var hero;
    this.fightCount = 0;
    this.rogueCount = 0;
    this.spellCount = 0;

    for (var i = 0; i < heroes.length; i++) {
      hero = heroes[i];
      if (hero.isFighter) {
        this.fightCount++;
      } else if (hero.isRogue) {
        this.rogueCount++;
      } else if (hero.isSpellcaster) {
        this.spellCount++;
      }
    }
  }
}

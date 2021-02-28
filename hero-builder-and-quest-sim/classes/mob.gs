/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

class Mob {
  constructor(
    zone,
    hpMax,
    dmg,
    defCap,
    aoeDmgBase,
    aoeChance,
    isBoss,
    miniBoss,
    quest
  ) {
    this.aoeDmgBase = aoeDmgBase;
    this.aoeChance = aoeChance;
    this.defCap = defCap;
    this.critChance = 0.1;
    this.critChanceMod = 1.0;
    this.dmg = dmg;
    this.dmgMod = 1.0;
    this.eva = -1.0;
    this.hpMax = hpMax;
    this.hpMod = 1.0;
    this._isBoss = isBoss;
    this.miniBoss = miniBoss;
    this.zone = zone;
    this.quest = quest;

    this.aoeDmg = this.aoeDmgBase / this.dmg;
    this.aoeChance = this.aoeChance / 100.0;

    switch (this.miniBoss) {
      case AGILE_MOB:
        this.eva = 0.4;
        break;
      case DIRE_MOB:
        this.hpMod = 1.5;
        this.critChanceMod = 3.0;
        break;
      case HUGE_MOB:
        this.hpMod = 2.0;
        break;
      case LEGEND_MOB:
        this.hpMod = 1.5;
        this.dmgMod = 1.25;
        this.critChanceMod = 1.5;
        this.eva = 0.1;
    }

    this.hpMax = Math.round(this.hpMax * this.hpMod);
    this.dmg = Math.round(this.dmg * this.dmgMod);

    this.atkTarget = 0;
  }

  get isBoss() {
    return this._isBoss != NO;
  }

  evasionCheck() {
    return Math.random() < this.eva;
  }

  reset() {
    this.hp = this.hpMax;
  }

  barrensCheck(heroes) {
    if (this.zone == BARRENS_HARD) {
      while (heroes.length > 3) {
        heroes.pop();
      }
    }
  }
}

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */


class Hero {
  constructor(
    heroClass,
    tier,
    hpMax,
    atk,
    def,
    threat,
    critChance,
    critMult,
    eva,
    armadillo,
    lizard,
    shark,
    dinosaur,
    mundra,
    atkMod,
    defMod,
    quest,
  ) {
    // Primary Characteristics
    this.heroClass = heroClass;
    this.tier = this.isChampion ? tier : Math.min(tier, 3);
    this.quest = quest;

    // Hero Stats
    this._hp    = hpMax;
    this.hpMax = hpMax;

    this.atkMod = 1.0 + atkMod / 100.0;
    this.atk    = atk / this.atkMod;
    this.defMod = 1.0 + defMod / 100.0;
    this.def    = def / this.defMod;
    this.eva    = eva / 100.0;

    this.critChance = critChance / 100.0;
    this.critMult   = critMult;

    this.threat = threat;

    // Spirits
    this.armadillo = armadillo;
    this.dinosaur  = dinosaur;
    this.lizard    = lizard;
    this.shark     = shark;
    this.mundra   = mundra;

    // Flags
    this.guaranteedCrit = false;
    this.takenDamage    = false;

    // Quest Stats
    this.surviveChance = 0.0;
    this.targetChance  = 0.0;

    this.totalSimDmg = 0.0;
    this.dmgDealtAvg = 0.0;
    this.dmgDealtMax = 0.0;
    this.dmgDealtMin = Infinity;

    this.hpRemainAvg = 0.0;
    this.hpRemainMax = 0.0;
    this.hpRemainMin = Infinity;
  }

  // Health
  set hp(num) {
    // Keep hp within 0 to hpMax bounds
    this._hp = Math.min(Math.max(num, 0), this.hpMax);
  }
  get hp() {
    return this._hp;
  }
  get isAlive() {
    return this.hp > 0;
  }
  get isDamaged() {
    return this.hp < this.hpMax;
  }
  get isDead() {
    return !this.isAlive;
  }

  // Damage Taken
  get dmgTaken() {
    var mob = this.quest.mob;
    if (this.def <= mob.defCap / 6.0) {
      return Math.round(
        1.5 * mob.dmg + (this.def / (mob.defCap / 6.0))
        * (0.5 * mob.dmg - 1.5 * mob.dmg)
      );
    } else if (this.def <= mob.defCap / 3.0) {
      return Math.round(
        0.5 * mob.dmg + ((this.def - mob.defCap / 6.0)
        / (mob.defCap / 3.0 - mob.defCap / 6.0))
        * (0.3 * mob.dmg - 0.5 * mob.dmg)
      );
    } else {
      return Math.round(
        0.3 * mob.dmg + ((this.def - mob.defCap / 3.0)
        / (mob.defCap - mob.defCap / 3.0))
        * (0.25 * mob.dmg - 0.3 * mob.dmg)
      );
    }
  }
  get critTaken() {
    return Math.round(Math.max(this.dmgTaken, this.quest.mob.dmg) * 1.5);
  }

  // Evasion
  get evasionChance() {
    var rawEvasion = this.eva + (this.berserkerStage * 0.1) + this.ninjaEva;
    return Math.min(rawEvasion, 0.75);
  }

  // Mundra
  updateMundraDef() {
    if (!this.quest.mob.isBoss) {
      this.mundra = 0;
    }
    this.def *= (this.defMod + 0.2 + this.mundra);
  }

  // Hero Classes
  get isBerserker() {
    return this.heroClass == BERSERKER || this.heroClass == JARL;
  }
  get isCleric() {
    return this.heroClass == CLERIC || this.heroClass == BISHOP;
  }
  get isDancer() {
    return this.heroClass == DANCER || this.heroClass == ACROBAT;
  }
  get isNinja() {
    return this.heroClass == NINJA || this.heroClass == SENSEI;
  }
  get isSamurai() {
    return this.heroClass == SAMURAI || this.heroClass == DAIMYO;
  }

  // Class Aggregation
  get isChampion() {
    return CHAMPIONS.has(this.heroClass);
  }
  get isFighter() {
    return FIGHTERS.has(this.heroClass);
  }
  get isRogue() {
    return ROGUES.has(this.heroClass);
  }
  get isSpellcaster() {
    return SPELLCASTERS.has(this.heroClass);
  }

  // Class attributes
  get berserkerLevel() {
    return 1 + this.tier;
  }
  get berserkerStage() {
    if (!this.isBerserker || this.hp >= 0.75 * this.hpMax) {
      return 0;
    }
    else if (this.hp >= 0.5 * this.hpMax) {
      return 1;
    }
    else if (this.hp >= 0.25 * this.hpMax) {
      return 2;
    }
    else if (this.isAlive) {
      return 3;
    }
  }
  get ninjaEva() {
    if (this.isNinja || !this.takenDamage) {
      return (this.tier >= 3) ? 0.2 : 0.15;
    } else {
      return 0;
    }
  }
  get ninjaMod() {
    if (this.isNinja || !this.takenDamage) {
      return 0.1 + this.tier * 0.1;
    } else {
      return 0;
    }
  }

  criticalHitCheck() {
    var totalCritChance = this.critChance + this.ninjaMod + this.quest.champion.rudoMod;
    return (this.guaranteedCrit || (Math.random() < totalCritChance));
  }

  attack(target) {
    var damage;
    if (!target.evasionCheck()) {
      // Mob doesn't evade the attack
      damage = this.atk * (
        this.atkMod
        + (0.2 * this.mundra)
        + (this.quest.sharkActive * 0.2 * this.shark)
        + (this.quest.dinosaurActive * this.dinosaur * 0.25)
        + (0.1 * this.berserkerLevel * this.berserkerStage)
      );
      if (this.criticalHitCheck()) {
        damage *= this.critMult;
      }
      target.hp -= damage;
      this.totalSimDmg += damage;
    }
    this.guaranteedCrit = false;
  }

  updateHpStats() {
    this.hpRemainMin = Math.min(this.hpRemainMin, this.hp);
    this.hpRemainMax = Math.max(this.hpRemainMax, this.hp);
    this.hpRemainAvg += this.hp;
  }

  updateDmgStats() {
    this.dmgDealtMin = Math.min(this.dmgDealtMin, this.totalSimDmg);
    this.dmgDealtMax = Math.max(this.dmgDealtMax, this.totalSimDmg);
    this.dmgDealtAvg += this.totalSimDmg;
  }

  reset() {
    this.hp = this.hpMax;
    this.totalSimDmg = 0;
    this.takenDamage = false;
    this.guaranteedCrit = false;
    this.surviveChance = this.isCleric ? 1.2 : this.armadillo * 15 / 100.0;

    if (this.isSamurai) {
      this.guaranteedCrit = true;
    }
  }
}

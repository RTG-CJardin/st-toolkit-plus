/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */


import Quest from './quest';
import Mob from './mob';
import {
  ACROBAT, BERSERKER, BISHOP, CHAMPIONS, CLERIC, DAIMYO, DANCER,
  FIGHTERS, JARL, NINJA, ROGUES, SAMURAI, SENSEI, SPELLCASTERS
} from './defines';


class Hero {

  // Primary Characteristics
  heroClass: string;
  tier: number;

  // Stats
  hpMax: number;
  atk: number;
  atkMod: number;
  def: number;
  defMod: number;
  eva: number;
  threat: number;
  critChance: number;
  critMult: number;

  // Spirits
  armadillo: number;
  lizard: number;
  shark: number;
  dinosaur: number;
  mundra: number;

  // Flags
  guaranteedCrit: boolean = false;
  guaranteedEva: boolean = false;
  takenDamage: boolean = false;

  // Quest Statistics
  surviveChance: number = 0.0;
  targetChance: number = 0.0;

  totalSimDmg: number = 0.0;
  dmgDealtAvg: number = 0.0;
  dmgDealtMax: number = 0.0;
  dmgDealtMin: number = Infinity;

  hpRemainAvg: number = 0.0;
  hpRemainMax: number = 0.0;
  hpRemainMin: number = Infinity;

  #quest: Quest;
  #hp: number;

  constructor(
    heroClass: string,
    tier: number,
    hpMax: number,
    atk: number,
    def: number,
    threat: number,
    critChance: number,
    critMult: number,
    eva: number,
    armadillo: number,
    lizard: number,
    shark: number,
    dinosaur: number,
    mundra: number,
    atkMod: number,
    defMod: number,
    quest: Quest,
  ) {
    // Primary Characteristics
    this.heroClass = heroClass;
    this.tier = this.isChampion ? tier : Math.min(tier, 3);
    this.#quest = quest;

    // Hero Stats
    this.#hp = hpMax;
    this.hpMax = hpMax;

    this.atkMod = 1.0 + atkMod / 100.0;
    this.atk = atk / this.atkMod;
    this.defMod = 1.0 + defMod / 100.0;
    this.def = def / this.defMod;
    this.eva = eva / 100.0;

    this.critChance = critChance / 100.0;
    this.critMult = critMult;

    this.threat = threat;

    // Spirits
    this.armadillo = armadillo;
    this.dinosaur = dinosaur;
    this.lizard = lizard;
    this.shark = shark;
    this.mundra = mundra;
  }

  // Health
  set hp(value: number) {
    // Keep hp within 0 to hpMax bounds
    this.#hp = Math.min(Math.max(value, 0), this.hpMax);
  }
  get hp(): number {
    return this.#hp;
  }
  get isAlive(): boolean {
    return this.hp > 0;
  }
  get isDamaged(): boolean {
    return this.hp < this.hpMax;
  }
  get isDead(): boolean {
    return !this.isAlive;
  }

  // Damage Taken
  get dmgTaken(): number {
    var mob = this.#quest.mob;
    if (this.def <= mob.defCap / 6.0) {
      return Math.round(
        1.5 * mob.dmg +
          (this.def / (mob.defCap / 6.0)) * (0.5 * mob.dmg - 1.5 * mob.dmg)
      );
    } else if (this.def <= mob.defCap / 3.0) {
      return Math.round(
        0.5 * mob.dmg +
          ((this.def - mob.defCap / 6.0) /
            (mob.defCap / 3.0 - mob.defCap / 6.0)) *
            (0.3 * mob.dmg - 0.5 * mob.dmg)
      );
    } else {
      return Math.round(
        0.3 * mob.dmg +
          ((this.def - mob.defCap / 3.0) / (mob.defCap - mob.defCap / 3.0)) *
            (0.25 * mob.dmg - 0.3 * mob.dmg)
      );
    }
  }
  get critTaken(): number {
    return Math.round(Math.max(this.dmgTaken, this.#quest.mob.dmg) * 1.5);
  }

  // Evasion
  get evasionChance(): number {
    var rawEvasion = this.eva + this.berserkerStage * 0.1 + this.ninjaEva;
    return Math.min(rawEvasion, 0.75);
  }

  // Mundra
  updateMundraDef(): void {
    if (!this.#quest.mob.isBoss) {
      this.mundra = 0;
    }
    this.def *= this.defMod + 0.2 + this.mundra;
  }

  // Hero Classes
  get isBerserker(): boolean {
    return this.heroClass == BERSERKER || this.heroClass == JARL;
  }
  get isCleric(): boolean {
    return this.heroClass == CLERIC || this.heroClass == BISHOP;
  }
  get isDancer(): boolean {
    return this.heroClass == DANCER || this.heroClass == ACROBAT;
  }
  get isNinja(): boolean {
    return this.heroClass == NINJA || this.heroClass == SENSEI;
  }
  get isSamurai(): boolean {
    return this.heroClass == SAMURAI || this.heroClass == DAIMYO;
  }

  // Class Aggregation
  get isChampion(): boolean {
    return CHAMPIONS.has(this.heroClass);
  }
  get isFighter(): boolean {
    return FIGHTERS.has(this.heroClass);
  }
  get isRogue(): boolean {
    return ROGUES.has(this.heroClass);
  }
  get isSpellcaster(): boolean {
    return SPELLCASTERS.has(this.heroClass);
  }

  // Class attributes
  get berserkerLevel(): number {
    return 1 + this.tier;
  }
  get berserkerStage(): number {
    if (this.isBerserker) {
      if (this.hp < 0.25 * this.hpMax) {
        return 3;
      } else if (this.hp < 0.5 * this.hpMax) {
        return 2;
      } else if (this.hp < 0.75 * this.hpMax) {
        return 1;
      }
    }
    return 0;
  }
  get ninjaEva(): number {
    if (this.isNinja || !this.takenDamage) {
      return this.tier >= 3 ? 0.2 : 0.15;
    } else {
      return 0;
    }
  }
  get ninjaMod(): number {
    if (this.isNinja || !this.takenDamage) {
      return 0.1 + this.tier * 0.1;
    } else {
      return 0;
    }
  }

  criticalHitCheck(): boolean {
    var totalCritChance =
      this.critChance + this.ninjaMod + this.#quest.champion.rudoMod;
    return this.guaranteedCrit || Math.random() < totalCritChance;
  }

  attack(target: Mob): void {
    var damage;
    if (!target.evasionCheck()) {
      // Mob doesn't evade the attack
      damage =
        this.atk *
        (this.atkMod +
          0.2 * this.mundra +
          this.#quest.sharkActive * 0.2 * this.shark +
          this.#quest.dinosaurActive * this.dinosaur * 0.25 +
          0.1 * this.berserkerLevel * this.berserkerStage);
      if (this.criticalHitCheck()) {
        damage *= this.critMult;
      }
      target.hp -= damage;
      this.totalSimDmg += damage;
    }
    this.guaranteedCrit = false;
  }

  updateHpStats(): void {
    this.hpRemainMin = Math.min(this.hpRemainMin, this.hp);
    this.hpRemainMax = Math.max(this.hpRemainMax, this.hp);
    this.hpRemainAvg += this.hp;
  }

  updateDmgStats(): void {
    this.dmgDealtMin = Math.min(this.dmgDealtMin, this.totalSimDmg);
    this.dmgDealtMax = Math.max(this.dmgDealtMax, this.totalSimDmg);
    this.dmgDealtAvg += this.totalSimDmg;
  }

  reset(): void {
    this.hp = this.hpMax;
    this.totalSimDmg = 0;
    this.takenDamage = false;
    this.guaranteedCrit = false;
    this.surviveChance = this.isCleric ? 1.2 : (this.armadillo * 15) / 100.0;

    if (this.isSamurai) {
      this.guaranteedCrit = true;
    }
  }
}

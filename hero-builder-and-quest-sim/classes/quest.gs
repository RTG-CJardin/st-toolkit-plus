/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */


class Quest {
  constructor() {
    this.initHeroes();
    this.initMob();
    this.initChampion();
    this.setBoosterBonuses();

    this.round = 0;
    this.targetRoll = 0.0;
    this.updateTarget = true;
    this.continueFight = true;

    this.winCount  = 0;
    this.roundsAvg = 0;
    this.roundsMax = 0;
    this.roundsMin = Infinity;

    this.runSimulation();
    this.populateSimStats();
  }

  get heroesAlive() {
    var aliveCount = 0;
    for (var i = 0; i < this.heroes.length; i ++) {
      if (this.heroes[i].isAlive) {
        aliveCount ++;
      }
    }
    return aliveCount;
  }

  initHeroes() {
    var classRange      = SpreadsheetApp.getActiveSheet().getRange("B3:B7");
    var tierRange       = SpreadsheetApp.getActiveSheet().getRange("C3:C7");
    var hpMaxRange      = SpreadsheetApp.getActiveSheet().getRange("D3:D7");
    var threatRange     = SpreadsheetApp.getActiveSheet().getRange("G3:G7");
    var atkRange        = SpreadsheetApp.getActiveSheet().getRange("E3:E7");
    var atkModRange     = SpreadsheetApp.getActiveSheet().getRange("P3:P7");
    var defRange        = SpreadsheetApp.getActiveSheet().getRange("F3:F7");
    var defModRange     = SpreadsheetApp.getActiveSheet().getRange("Q3:Q7");
    var evaRange        = SpreadsheetApp.getActiveSheet().getRange("J3:J7");
    var critChanceRange = SpreadsheetApp.getActiveSheet().getRange("H3:H7");
    var critMultRange   = SpreadsheetApp.getActiveSheet().getRange("I3:I7");
    var armadilloRange  = SpreadsheetApp.getActiveSheet().getRange("K3:K7");
    var dinosaurRange   = SpreadsheetApp.getActiveSheet().getRange("N3:N7");
    var lizardRange     = SpreadsheetApp.getActiveSheet().getRange("L3:L7");
    var mundraRange     = SpreadsheetApp.getActiveSheet().getRange("O3:O7");
    var sharkRange      = SpreadsheetApp.getActiveSheet().getRange("M3:M7");
    this.heroes = new Array();
    for (var heroNum = 1; heroNum <= 5; heroNum ++) {
      this.heroes.push(
        new Hero(
          classRange.getCell(heroNum, 1).getValue(),
          tierRange.getCell(heroNum, 1).getValue(),
          hpMaxRange.getCell(heroNum, 1).getValue(),
          atkRange.getCell(heroNum, 1).getValue(),
          defRange.getCell(heroNum, 1).getValue(),
          threatRange.getCell(heroNum, 1).getValue(),
          critChanceRange.getCell(heroNum, 1).getValue(),
          critMultRange.getCell(heroNum, 1).getValue(),
          evaRange.getCell(heroNum, 1).getValue(),
          armadilloRange.getCell(heroNum, 1).getValue(),
          lizardRange.getCell(heroNum, 1).getValue(),
          sharkRange.getCell(heroNum, 1).getValue(),
          dinosaurRange.getCell(heroNum, 1).getValue(),
          mundraRange.getCell(heroNum, 1).getValue(),
          atkModRange.getCell(heroNum, 1).getValue(),
          defModRange.getCell(heroNum, 1).getValue(),
          this,
        )
      );
    }
    this.isLCoG = SpreadsheetApp.getActiveSheet().getRange(11, 7).getValue();
    if (this.isLCoG == NO) {
      while (this.heroes.length > 4) {
        this.heroes.pop();
      }
    }
  }

  initMob() {
    var mobZone       = SpreadsheetApp.getActiveSheet().getRange(11, 1).getValue();
    var mobHPMax      = SpreadsheetApp.getActiveSheet().getRange(11, 2).getValue();
    var mobDmg        = SpreadsheetApp.getActiveSheet().getRange(11, 3).getValue();
    var mobCap        = SpreadsheetApp.getActiveSheet().getRange(11, 4).getValue();
    var mobAoeDmgBase = SpreadsheetApp.getActiveSheet().getRange(11, 5).getValue();
    var mobAoeChance  = SpreadsheetApp.getActiveSheet().getRange(11, 6).getValue();
    var mobIsBoss     = SpreadsheetApp.getActiveSheet().getRange(11, 8).getValue();
    var mobMiniBoss   = SpreadsheetApp.getActiveSheet().getRange(9, 2).getValue();
    this.mob = new Mob(
      mobZone,
      mobHPMax,
      mobDmg,
      mobCap,
      mobAoeDmgBase,
      mobAoeChance,
      mobIsBoss,
      mobMiniBoss,
      this,
    );
    this.mob.barrensCheck(this.heroes);
    for (var i = 0; i < this.heroes.length; i ++) {
      this.heroes[i].setMundra(this.mob.isBoss);
    }
  }

  initChampion() {
    for (var i = 0; i < this.heroes.length; i ++) {
      if (this.heroes[i].isChampion){
        this.champion = new Champion(this.heroes[i], this.heroes, this);
        break;
      }
    }
  }

  setBoosterBonuses() {
    this.booster = SpreadsheetApp.getActiveSheet().getRange(8, 2).getValue();
    switch (this.booster) {
      case BOOST_NORMAL:
        this.boosterAtkMod = 0.2;
        this.boosterDefMod = 0.2;
        break;

      case BOOST_SUPER:
        this.boosterAtkMod = 0.4;
        this.boosterDefMod = 0.4;
        for (var i = 0; i < this.heroes.length; i ++) {
          this.heroes[i].critChance += 0.1;
        }
        break;

      case BOOST_MEGA:
        this.boosterAtkMod = 0.8;
        this.boosterDefMod = 0.8;
        for (var i = 0; i < this.heroes.length; i ++) {
          this.heroes[i].critChance += 0.25;
          this.heroes[i].critMult   += 0.5;
        }

      default:
        this.boosterAtkMod = 0.0;
        this.boosterDefMod = 0.0;
    }

    for (var i = 0; i < this.heroes.length; i ++) {
      this.heroes[i].atk *= (1.0 + this.champion.atkMod + this.boosterAtkMod);
      this.heroes[i].def *= (1.0 + this.champion.defMod + this.boosterDefMod);
    }
  }

  runSimulation() {
    var hero;
    this.mob.reset();
    this.determineDamageTaken();

    for (var simNumber = 0; simNumber < SIM_COUNT; simNumber ++) {
      this.resetHeroes();
      this.mob.reset();

      this.continueFight = true;
      this.updateTarget = true;
      this.round = 0;
      this.sharkActive = 0;
      this.dinosaurActive = 1;

      // Start Quest
      while (this.continueFight) {
        this.round ++;

        this.setTargetingChances();
        this.targetedHeroes = this.determineTargets();

        this.mobAttack(this.targetedHeroes);
        this.heroesAttack();

        this.dinosaurActive = 0;

        if (this.mob.hp <= 0)  {
          this.continueFight = false;
          this.winCount ++;

          for (var i = 0; i < this.heroes.length; i ++) {
          hero = this.heroes[i];
            if (hero.isAlive) {
              hero.survivedCount ++;
            }
            hero.updateHpStats();
          }

          this.roundsAvg += this.round;
          this.roundsMax = Math.max(this.roundsMax, this.round);
          this.roundsMin = Math.min(this.roundsMin, this.round);
        }
        if (this.heroesAlive < 1) {
          this.continueFight = false;
        }

        if (!this.continueFight) {
          // End the fight,
          for (var i = 0; i < this.heroes.length; i ++) {
            this.heroes[i].updateDmgStats();
          }
        } else {
          for (var i = 0; i < this.heroes.length; i ++) {
          hero = this.heroes[i];
            if (hero.isAlive) {
              hero.hp = Math.min(hero.hp + hero.lizard * 3, hero.hpMax);
              if (hero.heroClass == CLERIC) {
                hero.hp = Math.min(hero.hp + hero.tier * 5 - 5, hero.hpMax);
              }
              else if (hero.heroClass == BISHOP) {
                hero.hp = Math.min(hero.hp + 5 * Math.pow(2, hero.tier - 1), hero.hpMax);
              }
              if (this.champion.name == LILU) {
                hero.hp += this.champion.liluHeal;
              }
              hero.berserkerHit();
            }
          }
        }
      }
    }
  }

  setTargetingChances() {
    var hero;
    if (this.updateTarget) {
      // Update the targeting chances after any of the heroes die
      var totalTargetingChance = 0.0;
      for (var i = 0; i < this.heroes.length; i ++) {
        // Clear all targeting chances
        hero.targetChance = 0;
      }
      // Compute hero chance to get targeted
      for (var i = 0; i < this.heroes.length; i ++) {
        if (hero.isAlive) {
          for (var j = i; j < this.heroes.length; j ++) {
            this.heroes[j].targetChance += hero.threat;
          }
          totalTargetingChance += hero.threat;
        }
      }
      for (var i = 0; i < this.heroes.length; i ++) {
        hero.targetChance = hero.targetChance / totalTargetingChance;
      }
      this.updateTarget = false;
    }
  }

  determineTargets() {
    if (Math.random() < this.mob.aoeChance && this.heroesAlive > 1) {
      // AoE Attack
      this.mob.atkTargets = this.heroes;
    }
    else {
      // Individual Attack
      this.targetRoll = Math.random();
      this.mob.atkTargets = [this.heroes[0]];
      for (var i = this.heroes.length - 1; i <= 0; i --) {
        if (
          this.heroes[i].isAlive
          && this.targetRoll < this.heroes[i].targetChance
        ) {
          this.mob.atkTargets = [this.heroes[i]];
        }
      }
    }
  }

  mobAttack(targetedHeroes) {
    var roundDmg, hero;

    for (var i = 0; i < targetedHeroes.length; i ++) {
      hero = targetedHeroes[i];
      if (hero.isDead) {
        continue;
      }

      if (targetedHeroes.length > 1) {
        // AoE Attack
        roundDmg = Math.ceil(hero.dmgTaken * this.mob.aoeDmg)
      } else if (Math.random() < this.mob.critChance * this.mob.critChanceMod) {
        // Individual Attack
        roundDmg = hero.dmgTaken;
      } else {
        // Individual Crit Attack
        roundDmg = hero.critTaken;
      }

      if (Math.random() > hero.evasionChance) {
        // Failed evasion
        hero.hp -= roundDmg;
        hero.takenDamage = true;
        if (hero.isDead) {
          if (Math.random() < hero.surviveChance) {
            // Surviving Fatal Blow activated
            hero.surviveChance -= 1.0;
            hero.hp = 1;
          } else {
            // Surviving Fatal Blow did not activate
            this.updateTarget = true;
          }
        }
      } else if (hero.isDancer) {
        // Dancers who successfully evade gain a guaranteed crit next round
        hero.guaranteedCrit = true;
      }
    }
  }

  heroesAttack() {
    var hero;
    for (var i = 0; i < this.heroes.length; i ++) {
      hero = this.heroes[i];

      if (hero.isAlive) {
        if (Math.random() > this.mob.eva) {
          this.damage = hero.atk * (
            hero.atkMod
            + (0.2 * hero.mundra)
            + (this.sharkActive * 0.2 * hero.shark)
            + (this.dinosaurActive * hero.dinosaur * 0.25)
            + (0.1 * hero.berserkerLevel * hero.berserkerStage)
          );
          if (hero.guaranteedCrit
              || Math.random() < (hero.critChance + hero.ninjaMod + hero.rudoMod)
          ) {
            this.damage *= hero.critMult;
          }
          this.mob.hp -= this.damage;
          hero.dmgThisFight += this.damage;
        }
      }

      if (this.mob.hp < this.mob.hpMax / 2) {
        this.sharkActive = 1;
      }

      hero.guaranteedCrit = false;
    }
  }

  resetHeroes() {
    for (var i = 0; i < this.heroes.length; i ++) {
      this.heroes[i].reset();
    }
  }

  populateSimStats() {
    var hero;
    SpreadsheetApp.getActiveSheet().getRange(25, 1).setValue(this.winCount * 100 / SIM_COUNT);
    SpreadsheetApp.getActiveSheet().getRange(25, 2).setValue(this.roundsMin);
    SpreadsheetApp.getActiveSheet().getRange(25, 3).setValue(this.roundsAvg / SIM_COUNT);
    SpreadsheetApp.getActiveSheet().getRange(25, 4).setValue(this.roundsMax);

    var col = 2;
    for (var i = 0; i < this.heroes.length; i ++) {
      hero = this.heroes[i];
      SpreadsheetApp.getActiveSheet().getRange(27, col).setValue(hero.survivedCount * 100 / SIM_COUNT);
      SpreadsheetApp.getActiveSheet().getRange(28, col).setValue(hero.hpRemainAvg / SIM_COUNT);
      SpreadsheetApp.getActiveSheet().getRange(29, col).setValue(hero.hpRemainMax);
      SpreadsheetApp.getActiveSheet().getRange(30, col).setValue(hero.dmgDealtMax);
      SpreadsheetApp.getActiveSheet().getRange(31, col).setValue(hero.dmgDealtAvg / SIM_COUNT);
      SpreadsheetApp.getActiveSheet().getRange(32, col).setValue(hero.dmgDealtMin);
      col ++;
    }
  }
}
import { controls } from '../../constants/controls';
import { showWinnerModal } from './modal/winner';

import { fighterService } from '../services/fightersService';

function checkFightIsOver(attacker, defender) {
  if (defender.health <= 0) return new Promise((resolve) => {
    fighterService.getFighterDetails(defender._id).then(data => defender.health = data.health);
    resolve(showWinnerModal(attacker));
  });
}

function designBar(fighter, maxHealth, position) {
  const indicator = Math.floor(fighter.health*100/maxHealth);
  document.querySelector(`#${position}-fighter-indicator`).style.width = indicator >= 0 ? `${indicator}%` : '0%';
}

export async function fight(firstFighter, secondFighter) {
  const firstFightersMaxHealth = firstFighter.health;
  const secondFightersMaxHealth = secondFighter.health;

  let isFirstFighterInBlock = false;
  let isSecondFighterInBlock = false;

  window.addEventListener('keypress', event => {
    if (event.key === 'a' && !isFirstFighterInBlock && !isSecondFighterInBlock) {
      secondFighter.health -= getDamage(firstFighter, secondFighter);

      designBar(secondFighter, firstFightersMaxHealth, 'right');

      checkFightIsOver(firstFighter, secondFighter);
    }
  });
  window.addEventListener('keypress', event => {
    if (event.key === 'd') {
      isFirstFighterInBlock = !isFirstFighterInBlock;
    }
  });

  window.addEventListener('keypress', event => {
    if (event.key === 'j' && !isSecondFighterInBlock && !isFirstFighterInBlock) {
      firstFighter.health -= getDamage(secondFighter, firstFighter);

      designBar(firstFighter, firstFightersMaxHealth, 'left');

      checkFightIsOver(secondFighter, firstFighter);
    }
  });
  window.addEventListener('keypress', event => {
    if (event.key === 'l') {
      isSecondFighterInBlock = !isSecondFighterInBlock;
    }
  });

  var map1 = {}; let criticalStrike1 = true;
  var map2 = {}; let criticalStrike2 = true;
  onkeydown = onkeyup = (event) => {
    const key = event.key;
    if (key === 'q' || key === 'w' || key === 'e')
      map1[key] = event.type === 'keydown';
    else if (key === 'u' || key === 'i' || key === 'o')
      map2[key] = event.type === 'keydown';

    if (map1['q'] && map1['w'] && map1['e'] && criticalStrike1) {
      secondFighter.health -= 2*firstFighter.attack;

      designBar(secondFighter, secondFightersMaxHealth, 'right');

      checkFightIsOver(firstFighter, secondFighter);

      criticalStrike1 = false;
      setTimeout(_ => { criticalStrike1 = true }, 10000);
    }
    if (map2['u'] && map2['i'] && map2['o'] && criticalStrike2) {
      firstFighter.health -= 2*secondFighter.attack;

      designBar(firstFighter, firstFightersMaxHealth, 'left');

      checkFightIsOver(secondFighter, firstFighter);

      criticalStrike2 = false;
      setTimeout(_ => { criticalStrike2 = true }, 10000);
    }
  }

  window.addEventListener('keydown', onkeydown);
  window.addEventListener('keyup', onkeyup);

  // return new Promise((resolve) => {
  //   // resolve the promise with the winner when fight is over
  // });
}

export function getDamage(attacker, defender) {
  const hit = getHitPower(attacker);
  const block = getBlockPower(defender);
  return !(block > hit) ? hit - block : 0;
  // return damage
}

export function getHitPower(fighter) {
  const attack = fighter.attack;
  const criticalHitChance = Math.random() + 1;
  const power = attack*criticalHitChance;
  return power;
  // return hit power
}

export function getBlockPower(fighter) {
  const defense = fighter.defense;
  const dodgeChance = Math.random() + 1;
  const power = defense*dodgeChance;
  return power;
  // return block power
}

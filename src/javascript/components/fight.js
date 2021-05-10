import { controls } from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    // resolve the promise with the winner when fight is over
    let firstFighterHealth = firstFighter.health;
    let secondFighterHealth = secondFighter.health;

    const firstFighterDefenderId = 'right-fighter-indicator';
    const secondFighterDefenderId = 'left-fighter-indicator'

    let firstFighterLastCriticalHitTime;
    let secondFighterLastCriticalHitTime;

    const pressedKeyCodes = new Map();

    const criticalHitTime = 10000;

    document.addEventListener('keydown', (event) => {
      const { code: keyCode } = event;

      pressedKeyCodes.set(keyCode, true);

      if (keyCode === controls.PlayerOneAttack &&
        !isAttackBlocked(pressedKeyCodes, controls.PlayerTwoBlock)) {
        const demage = getDamage(firstFighter, secondFighter);

        secondFighterHealth -= demage;

        changeHealthIndicator(firstFighterDefenderId, secondFighter, secondFighterHealth);
      }

      if (keyCode === controls.PlayerTwoAttack &&
        !isAttackBlocked(pressedKeyCodes, controls.PlayerOneBlock)) {
        const demage = getDamage(secondFighter, firstFighter);

        firstFighterHealth -= demage;

        changeHealthIndicator(secondFighterDefenderId, firstFighter, firstFighterHealth);
      }

      if (controls.PlayerOneCriticalHitCombination.every(key => pressedKeyCodes.has(key))) {
        firstFighterLastCriticalHitTime = firstFighterLastCriticalHitTime ? firstFighterLastCriticalHitTime : Date.now();
        const currentTime = Date.now();

        if (currentTime - firstFighterLastCriticalHitTime > criticalHitTime ||
          currentTime - firstFighterLastCriticalHitTime === 0) {
          secondFighterHealth -= getCriticalHitPower(firstFighter);

          changeHealthIndicator(firstFighterDefenderId, secondFighter, secondFighterHealth);

          firstFighterLastCriticalHitTime = currentTime;
        }
      }

      if (controls.PlayerTwoCriticalHitCombination.every(key => pressedKeyCodes.has(key))) {
        secondFighterLastCriticalHitTime = secondFighterLastCriticalHitTime ? secondFighterLastCriticalHitTime : Date.now();
        const currentTime = Date.now();

        if (currentTime - secondFighterLastCriticalHitTime > criticalHitTime ||
          currentTime - secondFighterLastCriticalHitTime === 0) {
          firstFighterHealth -= getCriticalHitPower(secondFighter);

          changeHealthIndicator(secondFighterDefenderId, firstFighter, firstFighterHealth);

          secondFighterLastCriticalHitTime = currentTime;
        }
      }

      if (firstFighterHealth <= 0) {
        resolve(secondFighter);
      }

      if (secondFighterHealth <= 0) {
        resolve(firstFighter);
      }

    });

    document.addEventListener('keyup', (e) => {
      pressedKeyCodes.delete(e.code);
    });
  });
}

export function getDamage(attacker, defender) {
  return Math.max(getHitPower(attacker) - getBlockPower(defender), 0);
}

export function getHitPower(fighter) {
  const { attack } = fighter;
  const criticalHitChance = Math.random() + 1;
  return attack * criticalHitChance;

}

export function getBlockPower(fighter) {
  const { defense } = fighter;
  const dodgeChance = Math.random() + 1;
  return defense * dodgeChance
}

function isAttackBlocked(pressedKeyCodes, playerBlockKey) {
  return pressedKeyCodes.has(playerBlockKey);
}

function changeHealthIndicator(id, defender, currentDefenderHealth) {
  const { health } = defender;

  const updatedHealthIndicatorWidth = currentDefenderHealth/health * 100;

  document.getElementById(id).style.width = `${updatedHealthIndicatorWidth > 0 ? updatedHealthIndicatorWidth : 0}%`;

  if (updatedHealthIndicatorWidth <= 20 ) {
    document.getElementById(id).style.backgroundColor = 'red';
  }
}

function getCriticalHitPower(fighter) {
  const { attack } = fighter;

  return attack * 2;
}
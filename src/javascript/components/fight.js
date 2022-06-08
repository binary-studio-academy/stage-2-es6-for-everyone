import {controls} from '../../constants/controls';

export async function fight (firstFighter, secondFighter) {
  return new Promise (resolve => {
    // resolve the promise with the winner when fight is over
    let firstFighterHealth = firstFighter.health;
    let secondFighterHealth = secondFighter.health;

    function reduceHealth (victim, reducer) {
      if (victim === firstFighter) {
        firstFighterHealth = reducer < firstFighterHealth
          ? firstFighterHealth - reducer
          : resolve (secondFighter);
      } else {
        secondFighterHealth = reducer < secondFighterHealth
          ? secondFighterHealth - reducer
          : resolve (firstFighter);
      }
    }

    function reduceHealthBar (position, healthLeft) {
      const healthBar = document.getElementById (
        `${position}-fighter-indicator`
      );
      if (healthLeft > 0) {
        healthBar.style.width = `${healthLeft}%`;
      } else {
        healthBar.style.width = `0%`;
      }
    }

    const firstFighterPressedKeys = [];
    const secondFighterPressedKeys = [];

    const firstPlayerKeysPreset = [
      controls.PlayerOneAttack,
      controls.PlayerOneBlock,
      ...controls.PlayerOneCriticalHitCombination,
    ];

    const secondPlayerKeysPreset = [
      controls.PlayerTwoAttack,
      controls.PlayerTwoBlock,
      ...controls.PlayerTwoCriticalHitCombination,
    ];

    const isCriticalCombination = (a, b) => {
      if (a.length !== b.length) return false;
      const uniqueValues = new Set ([...a, ...b]);
      for (const v of uniqueValues) {
        const aCount = a.filter (e => e === v).length;
        const bCount = b.filter (e => e === v).length;
        if (aCount !== bCount) return false;
      }
      return true;
    };

    let isFirstFighterCriticalAllowed;
    let isSecondFighterCriticalAllowed;

    let firstFighterCriticalTimer = setInterval (
      setFirstFighterCriticalTimer,
      10000
    );

    function setFirstFighterCriticalTimer () {
      isFirstFighterCriticalAllowed = true;
    }

    function resetFirstFighterCriticalTimer () {
      clearInterval (firstFighterCriticalTimer);
      isFirstFighterCriticalAllowed = false;
      firstFighterCriticalTimer = setInterval (() => {
        isFirstFighterCriticalAllowed = true;
      }, 10000);
    }

    let secondFighterCriticalTimer = setInterval (
      setSecondFighterCriticalTimer,
      10000
    );

    function setSecondFighterCriticalTimer () {
      isSecondFighterCriticalAllowed = true;
    }

    function resetSecondFighterCriticalTimer () {
      clearInterval (secondFighterCriticalTimer);
      isSecondFighterCriticalAllowed = false;
      secondFighterCriticalTimer = setInterval (() => {
        isSecondFighterCriticalAllowed = true;
      }, 10000);
    }

    function onKeyDown (key) {
      let lastPressedKey;
      if (firstPlayerKeysPreset.includes (key.code)) {
        lastPressedKey =
          firstFighterPressedKeys[firstFighterPressedKeys.length - 1];
        if (lastPressedKey === controls.PlayerOneBlock) {
          return;
        } else if (lastPressedKey !== key.code) {
          firstFighterPressedKeys.push (key.code);
        } else {
          return;
        }
      } else if (secondPlayerKeysPreset.includes (key.code)) {
        lastPressedKey =
          secondFighterPressedKeys[secondFighterPressedKeys.length - 1];
        if (lastPressedKey === controls.PlayerTwoBlock) {
          return;
        } else if (lastPressedKey !== key.code) {
          secondFighterPressedKeys.push (key.code);
        } else {
          return;
        }
      }
    }

    function onKeyUp (key) {
      let firstFighterLastPressedKey =
        firstFighterPressedKeys[firstFighterPressedKeys.length - 1];
      let secondFighterLastPressedKey =
        secondFighterPressedKeys[secondFighterPressedKeys.length - 1];

      let firstFighterLastCombo =
        firstFighterPressedKeys.length > 3 &&
        firstFighterPressedKeys.slice (-3);
      let secondFighterLastCombo =
        secondFighterPressedKeys.length > 3 &&
        secondFighterPressedKeys.slice (-3);

      if (firstFighterLastPressedKey === key.code) {
        if (key.code === controls.PlayerOneBlock) {
          firstFighterPressedKeys.pop ();
        }
        if (
          firstFighterLastCombo &&
          isCriticalCombination (
            firstFighterLastCombo,
            controls.PlayerOneCriticalHitCombination
          ) &&
          isFirstFighterCriticalAllowed
        ) {
          reduceHealth (secondFighter, firstFighter.attack * 2);
          const healthLeft = Math.round (
            secondFighterHealth / secondFighter.health * 100,
            1
          );
          reduceHealthBar ('right', healthLeft);
          resetFirstFighterCriticalTimer ();
        }
        if (
          key.code === controls.PlayerOneAttack &&
          secondFighterLastPressedKey !== controls.PlayerTwoBlock
        ) {
          reduceHealth (secondFighter, getDamage (firstFighter, secondFighter));
          const healthLeft = Math.round (
            secondFighterHealth / secondFighter.health * 100,
            1
          );
          reduceHealthBar ('right', healthLeft);
        }
      } else if (secondFighterLastPressedKey === key.code) {
        if (key.code === controls.PlayerTwoBlock) {
          secondFighterPressedKeys.pop ();
        }
        if (
          secondFighterLastCombo &&
          isCriticalCombination (
            secondFighterLastCombo,
            controls.PlayerTwoCriticalHitCombination
          ) &&
          isSecondFighterCriticalAllowed
        ) {
          reduceHealth (firstFighter, secondFighter.attack * 2);
          const healthLeft = Math.round (
            firstFighterHealth / firstFighter.health * 100,
            1
          );
          reduceHealthBar ('left', healthLeft);
          resetSecondFighterCriticalTimer ();
        }
        if (
          key.code === controls.PlayerTwoAttack &&
          firstFighterLastPressedKey !== controls.PlayerOneBlock
        ) {
          reduceHealth (firstFighter, getDamage (secondFighter, firstFighter));
          const healthLeft = Math.round (
            firstFighterHealth / firstFighter.health * 100,
            1
          );
          reduceHealthBar ('left', healthLeft);
        }
      }
    }

    document.body.addEventListener ('keydown', onKeyDown);
    document.body.addEventListener ('keyup', onKeyUp);
  });
}

export function getDamage (attacker, defender) {
  // return damage
  let hit = getHitPower (attacker);
  let block = getBlockPower (defender);
  if (hit > block) {
    return hit - block;
  } else {
    return 0;
  }
}

export function getHitPower (fighter) {
  // return hit power
  const criticalHitChance = Math.random () + 1;
  const hitPower = fighter.attack * criticalHitChance;
  return hitPower;
}

export function getBlockPower (fighter) {
  // return block power
  const dodgeChance = Math.random () + 1;
  const blockPower = fighter.defense * dodgeChance;
  return blockPower;
}

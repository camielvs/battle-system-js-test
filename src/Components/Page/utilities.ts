import { ACTIONS, SKIPTURN } from "./constants";
import type { Combatant, Event } from "./constants";

const randomWords = require("random-words");

export function computeTurnOrder(combatant1: Combatant, combatant2: Combatant) {
  const c1spd = computeSpeedArray(combatant1);
  const c2spd = computeSpeedArray(combatant2);
  return c1spd.concat(c2spd).sort((a, b) => b.speed - a.speed);
}

function computeSpeedArray(combatant: Combatant) {
  const spd = new Array(combatant.stats.stamina.max);
  spd.fill(combatant.stats.speed.max);
  return spd.map((v, i) => ({
    combatant: combatant.id,
    speed: v * (1 - i / spd.length),
    color: combatant.color,
    name: combatant.name,
  }));
}

export function generateEnemyActions(enemy: Combatant) {
  const chosenActions: string[] = [];
  const actions = Object.entries(ACTIONS);

  while (chosenActions.length < enemy.stats.stamina.max) {
    // First, filter out any actions that will exceed the remaining stamina
    const filteredActions = actions.filter(
      (v) => v[1].cost <= enemy.stats.stamina.max - chosenActions.length
    );
    // Then calculate relative weights for RNG
    const weights = filteredActions.map((v) => v[1].weight);
    const cumulativeWeights = [weights[0]];
    weights.forEach((v, i) => {
      if (!i) return;
      cumulativeWeights.push(v + cumulativeWeights[i - 1]);
    });
    const totalWeight = weights.reduce((a, b) => a + b);

    const randInt = Math.floor(Math.random() * totalWeight + 1);
    const action = getAction(randInt, filteredActions, cumulativeWeights);

    // Add new action & turn skips (extra stamina cost) to array
    const newAction = new Array(action.cost).fill(SKIPTURN);
    newAction[0] = action.name;
    newAction.forEach((v) => chosenActions.push(v));
  }

  return chosenActions;
}

function getAction(int: number, actions: any[], weightThreshold: number[]) {
  return actions[weightThreshold.filter((v) => v < int).length][1];
}

export function resolveTurns(
  turnOrder: any[],
  actions: string[][],
  combatants: Combatant[],
  updateCombatant: (c: Combatant) => void,
  updateRoundLog: (l: Event) => void
) {
  turnOrder.forEach((turn, i) => {
    const turnNumber =
      turn.combatant === "1"
        ? turnOrder.slice(0, i).filter((v) => v.combatant === "1").length
        : turnOrder.slice(0, i).filter((v) => v.combatant === "2").length;

    const actionArray = turn.combatant === "1" ? actions[0] : actions[1];
    const action = actionArray[turnNumber];

    executeAction(turn, action, combatants, updateCombatant, updateRoundLog);
  });
}

function executeAction(
  turn: any,
  action: string,
  combatants: Combatant[],
  updateCombatant: (c: Combatant) => void,
  updateRoundLog: (l: Event) => void
) {
  if (action === SKIPTURN) return;

  const actor = turn.combatant === "1" ? combatants[0] : combatants[1];
  const recipient = actor.id === "1" ? combatants[1] : combatants[0];

  if (actor.stats.hp.current <= 0 || recipient.stats.hp.current <= 0) return;

  actor.stats.defence.current = actor.stats.defence.max;
  updateCombatant(actor);

  const newRecipient = recipient;
  const dodgeThreshold = Math.max(
    recipient.stats.evasion.current - actor.stats.accuracy.current,
    0
  );

  const damage =
    actor.stats.attack.current -
    recipient.stats.defence.current -
    Math.floor(dodgeThreshold / 2);

  updateRoundLog({
    message: `${actor.name} used ${action}!`,
    color: actor.color,
  });

  switch (action?.toLowerCase()) {
    case "attack":
      if (damage <= 0) {
        updateRoundLog({
          message: `> It was blocked and did no damage.`,
          color: undefined,
        });
      } else if (actor.stats.attack.current <= dodgeThreshold) {
        updateRoundLog({
          message: `> It was dodged and did no damage.`,
          color: undefined,
        });
      } else {
        newRecipient.stats.hp.current = Math.max(
          newRecipient.stats.hp.current - damage,
          0
        );
        updateRoundLog({
          message: `> It did ${damage} damage.`,
          color: undefined,
        });
      }

      updateCombatant(newRecipient);
      break;

    case "defend":
      actor.stats.defence.current += 5;
      updateCombatant(actor);
      updateRoundLog({
        message: `> Defence was increased by +5 until next action.`,
        color: undefined,
      });
      break;

    case "study":
      actor.stats.accuracy.current += 5;
      actor.stats.evasion.current += 5;
      updateCombatant(actor);
      updateRoundLog({
        message: `> Accuracy and evasion were both increased by +5 for the remainder of the round.`,
        color: undefined,
      });
      break;

    case "special attack":
      const specialAttackDamage = Math.floor(actor.stats.attack.current * 1.5);

      if (specialAttackDamage > dodgeThreshold) {
        newRecipient.stats.hp.current = Math.max(
          newRecipient.stats.hp.current - specialAttackDamage,
          0
        );
        updateRoundLog({
          message: `> It did ${specialAttackDamage} damage.`,
          color: undefined,
        });
      } else {
        updateRoundLog({
          message: `> It was dodged and did no damage.`,
          color: undefined,
        });
      }

      updateCombatant(newRecipient);
      break;
  }
}

export function generateRandomCombatant(base: Combatant, victories: number) {
  const difficultyFactor = 1 + (victories - 1) / 10;
  const name = randomWords({ exactly: 2, join: " " });
  const hp = Math.floor(Math.random() * 40 * difficultyFactor) + 80;
  const attack = Math.floor(Math.random() * 5 * difficultyFactor) + 2;
  const defence = Math.floor(Math.random() * 8 * difficultyFactor) + 0;
  const speed = Math.floor(Math.random() * 100 * difficultyFactor) + 50;
  const stamina = Math.floor(Math.random() * 4 * difficultyFactor) + 2;
  const accuracy = Math.floor(Math.random() * 5 * difficultyFactor) + 1;
  const evasion = Math.floor(Math.random() * 5 * difficultyFactor) + 1;

  return {
    ...base,
    name: name.charAt(0).toUpperCase() + name.slice(1),
    stats: {
      hp: {
        current: hp,
        max: hp,
      },
      attack: {
        current: attack,
        max: attack,
      },
      defence: {
        current: defence,
        max: defence,
      },
      speed: {
        current: speed,
        max: speed,
      },
      stamina: {
        current: stamina,
        max: stamina,
      },
      accuracy: {
        current: accuracy,
        max: accuracy,
      },
      evasion: {
        current: evasion,
        max: evasion,
      },
    },
  };
}

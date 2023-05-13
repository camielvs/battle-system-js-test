import { ACTIONS, SKIPTURN } from "./constants";
import type { Combatant, Event } from "./constants";

export function computeSpeedArray(combatant: Combatant) {
  const spd = new Array(combatant.stats.stamina.max);
  spd.fill(combatant.stats.speed.max);
  return spd.map((v, i) => ({
    combatant: combatant.id,
    speed: v * (1 - i / spd.length),
    color: combatant.color,
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

  actor.stats.defence.current = actor.stats.defence.max;
  updateCombatant(actor);

  const newRecipient = recipient;
  const damage = actor.stats.attack.current - recipient.stats.defence.current;
  const dodgeThreshold = Math.max(
    recipient.stats.evasion.current - actor.stats.accuracy.current,
    0
  );

  updateRoundLog({
    message: `Player ${turn.combatant} used ${action}!`,
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
      const specialAttackDamage = Math.round(actor.stats.attack.current * 1.5);

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

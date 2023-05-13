import { Pane } from "evergreen-ui";
import { ActionPanel, CombatantUI, EventLog, TurnOrder } from "./Components";
import { ACTIONS, combatant1Base, combatant2Base, SKIPTURN } from "./constants";
import type { Combatant, Event, TurnOrderData } from "./constants";
import { useMemo, useState } from "react";

export function Page() {
  const [combatant1, setCombatant1] = useState(combatant1Base);
  const [combatant2, setCombatant2] = useState(combatant2Base);
  const [turnOrder, setTurnOrder] = useState([] as TurnOrderData[]);
  const [forceRefresh, setForceRefresh] = useState(false); //because I'm lazy
  const [eventLog, setEventLog] = useState([] as Event[]);
  const [roundLog, setRoundLog] = useState([] as Event[]);
  const [round, setRound] = useState(1);

  useMemo(() => {
    const c1spd = computeSpeedArray(combatant1);
    const c2spd = computeSpeedArray(combatant2);

    const turnOrder = c1spd.concat(c2spd).sort((a, b) => b.speed - a.speed);
    setTurnOrder(turnOrder);
  }, [setTurnOrder]);

  function endRound(actions: string[]) {
    updateRoundLog({ message: `+--ROUND ${round}--+`, color: "neutral" });

    const enemyActions = generateEnemyActions(combatant2);

    turnOrder.forEach((turn, i) => {
      const turnNumber =
        turn.combatant === "1"
          ? turnOrder.slice(0, i).filter((v) => v.combatant === "1").length
          : turnOrder.slice(0, i).filter((v) => v.combatant === "2").length;

      const actionArray = turn.combatant === "1" ? actions : enemyActions;

      const action = actionArray[turnNumber];

      executeAction(turn, action);
      setForceRefresh(!forceRefresh);
    });

    updateRoundLog({ message: "\n", color: undefined });
    prependRoundLogToEventLog();
    setRoundLog([]);
    setRound(round + 1);
    resetTempStats(combatant1);
    resetTempStats(combatant2);
    setForceRefresh(!forceRefresh);
  }

  function updateRoundLog(event: Event) {
    const tempLog = roundLog;
    tempLog.push(event);
    setRoundLog(tempLog);
  }

  function prependRoundLogToEventLog() {
    const tempLog = roundLog.concat(eventLog);
    setEventLog(tempLog);
  }

  function resetTempStats(combatant: Combatant) {
    combatant.stats.attack.current = combatant.stats.attack.max;
    combatant.stats.defence.current = combatant.stats.defence.max;
    combatant.stats.speed.current = combatant.stats.speed.max;
    combatant.stats.accuracy.current = combatant.stats.accuracy.max;
    combatant.stats.evasion.current = combatant.stats.evasion.max;
    updateCombatant(combatant);
  }

  function updateCombatant(combatantData: Combatant) {
    combatantData.id === "1"
      ? setCombatant1(combatantData)
      : setCombatant2(combatantData);
  }

  function executeAction(turn: any, action: string) {
    if (action === SKIPTURN) return;

    const actor = turn.combatant === "1" ? combatant1 : combatant2;
    const recipient = actor.id === "1" ? combatant2 : combatant1;

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
        const specialAttackDamage = Math.round(
          actor.stats.attack.current * 1.5
        );

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

  return (
    <Pane
      height="100vh"
      display="flex"
      alignItems="stretch"
      justifyContent="center"
      backgroundImage="url(https://www.metmuseum.org/-/media/images/blogs/now-at-the-met/2010/2010_09/natm_lod_lod-1.jpg)"
      backgroundSize="fill"
      backgroundPosition="center"
      backgroundRepeat="repeat-xy"
    >
      <Pane display="flex" flexDirection="column" alignItems="center">
        <Pane display="flex">
          <CombatantUI combatant={combatant1} />
          <Pane padding={128} />
          <CombatantUI combatant={combatant2} />
        </Pane>
        <Pane padding={8} />
        <TurnOrder turnOrder={turnOrder} />
        <Pane padding={8} />
        <ActionPanel combatant1={combatant1} onConfirm={endRound} />
        <Pane padding={8} />
        <EventLog log={eventLog} />
        <Pane padding={8} />
      </Pane>
    </Pane>
  );
}

function computeSpeedArray(combatant: Combatant) {
  const spd = new Array(combatant.stats.stamina.max);
  spd.fill(combatant.stats.speed.max);
  return spd.map((v, i) => ({
    combatant: combatant.id,
    speed: v * (1 - i / spd.length),
    color: combatant.color,
  }));
}

function generateEnemyActions(enemy: Combatant) {
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

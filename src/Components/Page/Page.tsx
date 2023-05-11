import { Pane } from "evergreen-ui";
import { ActionPanel, CombatantUI, TurnOrder } from "./Components";
import { ACTIONS, combatant1Base, combatant2Base, SKIPTURN } from "./constants";
import type { Combatant } from "./constants";
import { useMemo, useState } from "react";

export function Page() {
  const [combatant1, setCombatant1] = useState(combatant1Base);
  const [combatant2, setCombatant2] = useState(combatant2Base);
  const [turnOrder, setTurnOrder] = useState([] as any[]);

  useMemo(() => {
    const c1spd = computeSpeedArray(combatant1);
    const c2spd = computeSpeedArray(combatant2);

    const turnOrder = c1spd.concat(c2spd).sort((a, b) => b.speed - a.speed);
    setTurnOrder(turnOrder);
  }, [setTurnOrder]);

  function computeSpeedArray(combatant: Combatant) {
    const spd = new Array(combatant.stats.stamina.max);
    spd.fill(combatant.stats.speed.max);
    return spd.map((v, i) => ({
      combatant: combatant.id,
      speed: v * (1 - i / spd.length),
      color: combatant.color,
    }));
  }

  function endRound(actions: string[]) {
    const enemyActions = generateEnemyActions(combatant2);
    console.log(actions, turnOrder);
    console.log(enemyActions);
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
      </Pane>
    </Pane>
  );
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

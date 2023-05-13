import { Pane } from "evergreen-ui";
import { ActionPanel, CombatantUI, EventLog, TurnOrder } from "./Components";
import { combatant1Base, combatant2Base } from "./constants";
import type { Combatant, Event, TurnOrderData } from "./constants";
import { useMemo, useState } from "react";
import {
  computeSpeedArray,
  generateEnemyActions,
  resolveTurns,
} from "./utilities";

export function Page() {
  const [combatant1, setCombatant1] = useState(combatant1Base);
  const [combatant2, setCombatant2] = useState(combatant2Base);
  const [turnOrder, setTurnOrder] = useState([] as TurnOrderData[]);
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
    resolveTurns(
      turnOrder,
      [actions, enemyActions],
      [combatant1, combatant2],
      updateCombatant,
      updateRoundLog
    );

    updateRoundLog({ message: "\n", color: undefined });
    prependRoundLogToEventLog();
    setRoundLog([]);
    setRound(round + 1);
    resetTempStats(combatant1);
    resetTempStats(combatant2);
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

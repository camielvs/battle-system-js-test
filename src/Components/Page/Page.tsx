import { Pane } from "evergreen-ui";
import { ActionPanel, CombatantUI, EventLog, TurnOrder } from "./Components";
import { combatant1Base, combatant2Base } from "./constants";
import type { Combatant, Event, TurnOrderData } from "./constants";
import { useMemo, useState } from "react";
import {
  computeTurnOrder,
  generateEnemyActions,
  generateRandomCombatant,
  resolveTurns,
} from "./utilities";

export function Page() {
  const [combatant1, setCombatant1] = useState(combatant1Base);
  const [combatant2, setCombatant2] = useState(
    generateRandomCombatant(combatant2Base, combatant1.victories || 0)
  );
  const [turnOrder, setTurnOrder] = useState([] as TurnOrderData[]);
  const [eventLog, setEventLog] = useState([] as Event[]);
  const [roundLog, setRoundLog] = useState([] as Event[]);
  const [round, setRound] = useState(1);
  const [forceRefresh, setForceRefresh] = useState(false);

  useMemo(() => {
    setTurnOrder(computeTurnOrder(combatant1, combatant2));
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

    if (combatant1.stats.hp.current <= 0) {
      updateRoundLog({
        message: `${combatant1.name} was defeated`,
        color: "yellow",
      });
    }
    if (combatant2.stats.hp.current <= 0) {
      updateRoundLog({
        message: `${combatant2.name} was defeated`,
        color: "yellow",
      });
      const tempCombatant = combatant1;
      if (tempCombatant.victories !== undefined) {
        tempCombatant.victories += 1;
        updateCombatant(tempCombatant);
      }
    }

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

  function onRestart() {
    const newEnemy = generateRandomCombatant(
      combatant2Base,
      combatant1.victories || 0
    );
    setCombatant2(newEnemy);
    setTurnOrder(computeTurnOrder(combatant1, newEnemy));
    setEventLog([]);
    setRoundLog([]);
    setRound(1);
    forcePageRefresh();
  }

  function respawnPlayer() {
    setCombatant1(combatant1Base);
    onRestart();
  }

  function forcePageRefresh() {
    setForceRefresh(!forceRefresh);
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
          <CombatantUI combatant={combatant1} onRestart={respawnPlayer} />
          <Pane padding={128} />
          <CombatantUI combatant={combatant2} onRestart={onRestart} />
        </Pane>
        <Pane padding={8} />
        <TurnOrder turnOrder={turnOrder} />
        <Pane padding={8} />
        <ActionPanel
          combatant1={combatant1}
          isFightOver={
            combatant1.stats.hp.current <= 0 || combatant2.stats.hp.current <= 0
          }
          onConfirm={endRound}
        />
        <Pane padding={8} />
        <EventLog log={eventLog} />
        <Pane padding={8} />
      </Pane>
    </Pane>
  );
}

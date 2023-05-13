import {
  Avatar,
  Button,
  Card,
  Heading,
  Pane,
  Strong,
  Text,
} from "evergreen-ui";
import type { Combatant } from "../../constants";
import { HealthBar } from "./Components";
import { useState } from "react";

interface Props {
  combatant: Combatant;
  onRestart: () => void;
}
export function CombatantUI({ combatant, onRestart }: Props) {
  console.log(combatant);
  const isP1 = combatant.id === "1";
  const { hp, attack, defence, speed, stamina, accuracy, evasion } =
    combatant.stats;
  const nameTag =
    hp.current <= 0 ? (
      <del>
        <Heading>{combatant.name}</Heading>
      </del>
    ) : (
      <Heading>{combatant.name}</Heading>
    );
  const victoriesUI = (
    <Pane>
      <Pane marginY={4} border="muted" />
      <Text>{`Victories: ${combatant.victories}`}</Text>
    </Pane>
  );
  const restartButton = (
    <Pane>
      <Pane marginY={4} border="muted" />
      <Pane display="flex" justifyContent="center">
        <Button appearance="primary" intent="success" onClick={onRestart}>
          {isP1 ? `Restart` : "Next Fight"}
        </Button>
      </Pane>
    </Pane>
  );
  return (
    <Pane display="flex" flexDirection="column" alignItems="center" margin={16}>
      <Avatar name={combatant.name} size={210} color={combatant.color} />
      <Card
        display="flex"
        padding={8}
        margin={8}
        background="tint2"
        elevation={1}
        justifyContent="center"
      >
        {nameTag}
      </Card>
      <Card
        display="flex"
        flexDirection="column"
        padding={8}
        margin={8}
        background="tint2"
        justifyContent="center"
      >
        <HealthBar currentHealth={hp.current} maxHealth={hp.max} />
        <Pane marginY={4} border="muted" />
        <Strong>Stats</Strong>
        <Text>{`Attack: ${attack.current}`}</Text>
        <Text>{`Defence: ${defence.current}`}</Text>
        <Text>{`Speed: ${speed.current}`}</Text>
        <Text>{`Stamina: ${stamina.current}`}</Text>
        <Text>{`Accuracy: ${accuracy.current}`}</Text>
        <Text>{`Evasion: ${evasion.current}`}</Text>
        {isP1 ? victoriesUI : null}
        {combatant.stats.hp.current <= 0 ? restartButton : null}
      </Card>
    </Pane>
  );
}

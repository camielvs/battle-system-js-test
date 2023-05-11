import { Badge, Card, Heading, Pane, Text } from "evergreen-ui";
import type { Combatant } from "../../constants";

interface Props {
  combatant1: Combatant;
  combatant2: Combatant;
}

export function TurnOrder({ combatant1, combatant2 }: Props) {
  const c1spd = computeSpeedArray(combatant1);
  const c2spd = computeSpeedArray(combatant2);

  const turnOrder = c1spd.concat(c2spd).sort((a, b) => b.speed - a.speed);

  const turnOrderMarkup = turnOrder.map((spd, i) => (
    <Badge color={spd.color} margin={8} key={`${i}-P${spd.combatant}`}>
      <Text>{`P${spd.combatant}`}</Text>
    </Badge>
  ));

  function computeSpeedArray(combatant: Combatant) {
    const spd = new Array(combatant.stats.stamina.max);
    spd.fill(combatant.stats.speed.max);
    return spd.map((v, i) => ({
      combatant: combatant.id,
      speed: v * (1 - i / spd.length),
      color: combatant.color,
    }));
  }

  return (
    <Card
      display="flex"
      flexDirection="column"
      background="tint2"
      alignItems="center"
      padding={8}
    >
      <Heading>Turn order</Heading>
      <Pane display="flex">{turnOrderMarkup}</Pane>
    </Card>
  );
}

import { Badge, Card, Heading, Pane, Text } from "evergreen-ui";
import type { Combatant } from "../../constants";
import { useEffect, useMemo, useState } from "react";

interface Props {
  turnOrder: any[];
}

export function TurnOrder({ turnOrder }: Props) {
  const turnOrderMarkup = turnOrder.map((spd, i) => (
    <Badge color={spd.color} margin={8} key={`${i}-P${spd.combatant}`}>
      <Text>{`P${spd.combatant}`}</Text>
    </Badge>
  ));

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

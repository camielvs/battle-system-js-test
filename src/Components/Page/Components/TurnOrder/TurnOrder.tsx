import { Badge, Card, Heading, Pane, Text } from "evergreen-ui";
import { TurnOrderData } from "../../constants";

interface Props {
  turnOrder: TurnOrderData[];
}

export function TurnOrder({ turnOrder }: Props) {
  const turnOrderMarkup = turnOrder.map((spd, i) => {
    const name = spd.name.toUpperCase().split(" ");
    const tag = name.length === 1 ? name[0][0] : name[0][0] + name[1][0];

    return (
      <Badge color={spd.color} margin={8} key={`${i}-${tag}`}>
        <Text>{tag}</Text>
      </Badge>
    );
  });

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

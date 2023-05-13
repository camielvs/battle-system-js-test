import { Card, Heading, Pane, Text } from "evergreen-ui";

interface Props {
  log: string[];
}
export function EventLog({ log }: Props) {
  //background color with player color?
  const logMarkup = log.map((s, i) => (
    <Pane key={i}>
      <Text>{s}</Text>
    </Pane>
  ));
  return (
    <Card background="tint2" padding={8} elevation={3} width={384}>
      <Heading margin={8}>Event Log</Heading>
      {logMarkup}
    </Card>
  );
}

import { Card, Heading, Pane, Text } from "evergreen-ui";
import type { Event } from "../../constants";

interface Props {
  log: Event[];
}
export function EventLog({ log }: Props) {
  const logMarkup = log.map((e, i) =>
    e.message === "\n" ? (
      <br />
    ) : (
      <Card
        key={i}
        background={e.color ? `${e.color}100` : undefined}
        padding={4}
        margin={4}
      >
        <Text>{e.message}</Text>
      </Card>
    )
  );
  return (
    <Card background="tint2" padding={8} elevation={3} width={384}>
      <Heading margin={8}>Event Log</Heading>
      {logMarkup}
    </Card>
  );
}

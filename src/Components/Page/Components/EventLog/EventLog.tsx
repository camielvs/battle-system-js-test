import { Card, Heading, Strong, Text } from "evergreen-ui";
import type { Event } from "../../constants";

interface Props {
  log: Event[];
}
export function EventLog({ log }: Props) {
  const logMarkup = log.map((e, i) =>
    e.message === "\n" ? (
      <br key={i} />
    ) : (
      <Card
        key={i}
        background={e.color ? `${e.color}100` : undefined}
        padding={4}
        margin={4}
      >
        {e.message.startsWith("+--") ? (
          <Strong>{e.message}</Strong>
        ) : (
          <Text>{e.message}</Text>
        )}
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

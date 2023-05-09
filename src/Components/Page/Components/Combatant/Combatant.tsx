import { Avatar, Card, Heading, Pane, Strong, Text } from "evergreen-ui";
import type {Combatant} from '../../constants'
import { HealthBar } from "./Components";

interface Props {
  combatant: Combatant;
}
export function Combatant({combatant}: Props) {
  const {hp, attack, defence, speed, stamina, accuracy, evasion} = combatant.stats;
  return (
    <Pane display="flex" flexDirection="column" alignItems="center" margin={16}>
      <Avatar name={combatant.name} size={420} />
      <Pane marginY={4}></Pane>
      <Card display="flex" padding={8} background="tint2" elevation={1} justifyContent="center">
        <Heading>{combatant.name}</Heading>
      </Card>
      <Pane marginY={8}></Pane>
      <Card display="flex" flexDirection="column" padding={8} background="tint2" justifyContent="center">
        <HealthBar currentHealth={hp.current} maxHealth={hp.max} />
        <Strong>{`Health: ${hp.current}/${hp.max}`}</Strong>
        <Text>{`Attack: ${attack.current}`}</Text>
        <Text>{`Defence: ${defence.current}`}</Text>
        <Text>{`Speed: ${speed.current}`}</Text>
        <Text>{`Stamina: ${stamina.current}`}</Text>
        <Text>{`Accuracy: ${accuracy.current}`}</Text>
        <Text>{`Evasion: ${evasion.current}`}</Text>
      </Card>
    </Pane>
  )
}

import { Button, Card, Heading, Pane, StatusIndicator, Tooltip } from 'evergreen-ui'
import { Combatant } from '../../constants'

interface Props {
  combatant1: Combatant,
}
export function ActionButtons({combatant1}: Props) {

  const stamina = new Array(combatant1.stats.stamina.max).fill('yellow100');
  const staminaMarkup = stamina.map((v) => (
    <Pane width={32} height={32} borderRadius={16} margin={8} border='default' borderWidth='thin' background={v} />
  ));

  return (
    <Card display="flex" flexDirection="column" background='tint2' padding={16} alignItems="center">
      <Pane display="flex" justifyContent="center">
        {staminaMarkup}
      </Pane>
      <Heading padding={8}>Choose your actions for this round</Heading>
      <Pane justifyContent="center">
        <Tooltip content="Deal Damage">
          <Button margin={8}>
            <StatusIndicator color="warning">Attack</StatusIndicator>
          </Button>
        </Tooltip>
        <Tooltip content="+5 Defence">
        <Button margin={8}>
          <StatusIndicator color="warning">Defend</StatusIndicator>
        </Button>
        </Tooltip>
        <Tooltip content="+5 Accuracy, +5 Evasion">
          <Button margin={8}>
            <StatusIndicator color="warning">Study</StatusIndicator>
          </Button>
        </Tooltip>
        <Tooltip content="+50% Attack, Ignore Defence">
          <Button margin={8}>
            <StatusIndicator color="warning" />
            <StatusIndicator color="warning">Special Attack</StatusIndicator>
          </Button>
        </Tooltip>
      </Pane>
      <Pane margin={8} />
      <Button appearance='primary'>Confirm</Button>
    </Card>
  )
}

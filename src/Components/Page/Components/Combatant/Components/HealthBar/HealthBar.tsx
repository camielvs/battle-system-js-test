import { Pane, Small, Strong } from 'evergreen-ui'

interface Props {
  currentHealth: number,
  maxHealth: number
}

export function HealthBar({currentHealth, maxHealth}: Props) {
  const healthPercent = currentHealth/maxHealth * 100;
  const healthBarColor = getHealthBarColor(healthPercent);
  
  function getHealthBarColor(healthPercent: number) {
    if (healthPercent > 70) return 'green600';
    if (healthPercent > 40) return 'orange700';
    if (healthPercent > 10) return 'red600';
    return 'gray900';
  }
  return (
    <Pane display="flex" padding={4} alignItems="center">
      <Pane width={100} height={10} border='default' marginRight={4}>
        <Pane width={Math.ceil(healthPercent)} height={10} background={healthBarColor} />
      </Pane>
      <Strong><Small>{`${currentHealth}/${maxHealth}`}</Small></Strong>
    </Pane>
  )
}

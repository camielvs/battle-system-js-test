import { Pane } from 'evergreen-ui'

interface Props {
  currentHealth: number,
  maxHealth: number
}

export function HealthBar({currentHealth,maxHealth}: Props) {
  const healthPercent = currentHealth/maxHealth * 100;
  const healthBarColor = getHealthBarColor(healthPercent);
  
  function getHealthBarColor(healthPercent: number) {
    if (healthPercent > 70) return 'green600';
    if (healthPercent > 40) return 'orange700';
    if (healthPercent > 10) return 'red600';
    return 'gray900';
  }
  return (
    <Pane padding={4}>
      <Pane width={100} height={10} border='default'>
        <Pane width={Math.ceil(healthPercent)} height={10} background={healthBarColor} />
      </Pane>
    </Pane>
  )
}
